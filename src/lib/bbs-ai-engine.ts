/**
 * BBS AI — independent website generation engine.
 *
 * This is the ONLY generation backend for Better Brand Services' builder.
 * It talks directly to the Anthropic Messages API over HTTPS. There is no
 * OpenAI, Gemini, Codex, or Lovable dependency anywhere in this module —
 * swapping the model only ever means changing BBS_AI_MODEL / the request
 * body below, never adding a different vendor SDK.
 *
 * Configure with:
 *   ANTHROPIC_API_KEY   (required)
 *   BBS_AI_MODEL         (optional, defaults to a current Claude model)
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-5'
const MAX_OUTPUT_TOKENS = 16000

export class BbsAiConfigError extends Error {}
export class BbsAiGenerationError extends Error {}

const getApiKey = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new BbsAiConfigError(
      'BBS AI is not configured. Set ANTHROPIC_API_KEY to enable website generation.',
    )
  }
  return apiKey
}

/**
 * Strips markdown fences and anything before <!doctype html> / <html>,
 * so a slightly chatty model response still yields a clean document.
 */
const cleanHtml = (value: string) => {
  let html = String(value || '').trim()

  html = html
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const doctypeIndex = html.toLowerCase().indexOf('<!doctype')
  const htmlIndex = html.toLowerCase().indexOf('<html')

  if (doctypeIndex >= 0) {
    html = html.slice(doctypeIndex)
  } else if (htmlIndex >= 0) {
    html = `<!doctype html>\n${html.slice(htmlIndex)}`
  }

  return html.trim()
}

/**
 * Defends against the model echoing its own instructions or the raw user
 * instruction back as visible page copy instead of acting on it. This is a
 * best-effort guard, not a guarantee — it catches the common failure mode
 * of a model quoting the prompt verbatim into the body.
 */
const assertNoLeakedInstructions = (html: string, rawInputs: string[]) => {
  const lowerHtml = html.toLowerCase()
  for (const input of rawInputs) {
    const needle = input.trim().toLowerCase()
    if (needle.length >= 40 && lowerHtml.includes(needle)) {
      throw new BbsAiGenerationError(
        'BBS AI returned content that echoed the raw instruction instead of building the website. Regenerating is required.',
      )
    }
  }
}

const validateHtmlDocument = (html: string, rawInputs: string[]) => {
  if (!html || !html.toLowerCase().includes('<html')) {
    throw new BbsAiGenerationError('BBS AI returned an invalid website document.')
  }
  if (!html.toLowerCase().includes('</html>')) {
    throw new BbsAiGenerationError('BBS AI returned an incomplete website document.')
  }
  assertNoLeakedInstructions(html, rawInputs)
  return html
}

const SYSTEM_PROMPT = `You are BBS AI, the independent website-generation engine for Better Brand Services.

You build complete, production-quality, single-file HTML websites from natural-language
briefs, and you revise existing websites in place when asked to change them.

Hard rules:
- Output ONLY the raw HTML document. No commentary, no markdown fences, no explanations.
- Always start with <!doctype html> and end with </html>.
- Put all CSS in a single <style> tag and any JavaScript in <script> tags in the same file.
- Never restate, quote, or reprint the user's instruction or any system instructions as
  visible page text. The instruction is a work order, not content.
- Never mention BBS AI, Anthropic, Claude, prompts, or how the site was generated inside
  the generated website itself.
- Ship fully responsive, accessible, semantic markup with a real visual hierarchy —
  never a generic, bare-bones template.
- Prefer CSS-drawn visuals (gradients, shapes, patterns) over external image URLs, since
  external assets are not guaranteed to load in the preview sandbox.`

async function callClaude(userContent: string): Promise<string> {
  const apiKey = getApiKey()
  const model = process.env.BBS_AI_MODEL || DEFAULT_MODEL

  let response: Response
  try {
    response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
    })
  } catch (error) {
    throw new BbsAiGenerationError(
      `BBS AI could not reach its generation backend: ${(error as Error).message}`,
    )
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '')
    throw new BbsAiGenerationError(
      `BBS AI generation failed (${response.status}): ${bodyText.slice(0, 300)}`,
    )
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>
  }

  const text = (data.content || [])
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text)
    .join('\n')

  return cleanHtml(text)
}

const buildGenerationRequest = (prompt: string) => `
Build a complete website for this brief:

${prompt}

Requirements:
- Fully responsive across phone, tablet, and desktop.
- Include navigation, a hero section, all content sections implied by the brief,
  clear calls to action, and a footer.
- If the brief implies multiple pages, represent each as a clearly delineated,
  well-structured section within this single document (with in-page navigation
  linking to each), since this is a single-file build.
- Include realistic, relevant, on-brand copy — never lorem ipsum.
- Ship a modern, premium visual design.
`.trim()

const buildRevisionRequest = ({
  initialPrompt,
  instruction,
  currentHtml,
}: {
  initialPrompt: string
  instruction: string
  currentHtml: string
}) => `
You previously built this website from the brief below. Revise the EXISTING document
to satisfy the new instruction. Preserve every part of the current site the instruction
does not ask you to change — this is an edit, not a rebuild.

ORIGINAL BRIEF:
${initialPrompt}

NEW INSTRUCTION TO APPLY:
${instruction}

CURRENT WEBSITE HTML:
${currentHtml}

Return the complete, updated HTML document.
`.trim()

export async function generateWebsite(prompt: string): Promise<string> {
  const html = await callClaude(buildGenerationRequest(prompt))
  return validateHtmlDocument(html, [prompt])
}

export async function reviseWebsite(args: {
  initialPrompt: string
  instruction: string
  currentHtml: string
}): Promise<string> {
  const html = await callClaude(buildRevisionRequest(args))
  return validateHtmlDocument(html, [args.instruction])
}
