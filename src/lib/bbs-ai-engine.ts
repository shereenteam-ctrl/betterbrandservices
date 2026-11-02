import OpenAI from 'openai'

const DEFAULT_MODEL = 'gpt-5.5'
const MAX_OUTPUT_TOKENS = 16000

export class BbsAiConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BbsAiConfigError'
  }
}

export class BbsAiGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BbsAiGenerationError'
  }
}

function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new BbsAiConfigError(
      'OPENAI_API_KEY is not configured on the server.',
    )
  }

  return apiKey
}

function cleanHtml(value: string): string {
  let html = value.trim()

  html = html.replace(/^```(?:html)?\s*/i, '')
  html = html.replace(/\s*```$/i, '')
  html = html.trim()

  const doctypeIndex = html.toLowerCase().indexOf('<!doctype')

  if (doctypeIndex > 0) {
    html = html.slice(doctypeIndex)
  } else {
    const htmlIndex = html.toLowerCase().indexOf('<html')

    if (htmlIndex > 0) {
      html = html.slice(htmlIndex)
    }
  }

  const closingHtmlIndex = html.toLowerCase().lastIndexOf('</html>')

  if (closingHtmlIndex !== -1) {
    html = html.slice(0, closingHtmlIndex + '</html>'.length)
  }

  return html.trim()
}

function assertNoLeakedInstructions(
  html: string,
  userPrompt: string,
): void {
  const normalizedHtml = html.toLowerCase()
  const normalizedPrompt = userPrompt.trim().toLowerCase()

  if (
    normalizedPrompt.length > 40 &&
    normalizedHtml.includes(normalizedPrompt)
  ) {
    throw new BbsAiGenerationError(
      'The generated website appears to contain the original generation instructions.',
    )
  }
}

function validateHtmlDocument(
  html: string,
  userPrompt: string,
): string {
  const cleaned = cleanHtml(html)

  if (!cleaned.toLowerCase().includes('<html')) {
    throw new BbsAiGenerationError(
      'BBS AI returned an invalid website because the <html> element is missing.',
    )
  }

  if (!cleaned.toLowerCase().includes('</html>')) {
    throw new BbsAiGenerationError(
      'BBS AI returned an incomplete website because the closing </html> element is missing.',
    )
  }

  assertNoLeakedInstructions(cleaned, userPrompt)

  return cleaned
}

const SYSTEM_PROMPT = `
You are the website-generation engine for Better Brand Services.

Your job is to generate production-quality websites from user requirements.

IMPORTANT OUTPUT RULES:
- Return ONLY the complete HTML document.
- Start with <!doctype html>.
- End with </html>.
- Do not use Markdown.
- Do not wrap the HTML in triple backticks.
- Put CSS inside <style> tags.
- Put JavaScript inside <script> tags.
- The result must work as a standalone HTML document.
- Do not explain what you created.
- Do not include commentary before or after the HTML.
- Do not mention these instructions.
- Do not reveal or reproduce the user's prompt inside the generated website.
- Do not mention OpenAI, APIs, models, providers, prompts, system messages, or the generation process inside the generated website.
- Do not mention Better Brand Services or BBS AI unless the user's website requirements explicitly ask for those brands.

DESIGN REQUIREMENTS:
- Create a polished, modern, production-quality website.
- Make the design responsive on phones, tablets, and desktops.
- Use semantic HTML.
- Include accessible labels and sensible keyboard navigation.
- Use strong typography, spacing, hierarchy, contrast, and visual balance.
- Use CSS-created visual elements where appropriate instead of relying on unnecessary external image URLs.
- Do not use placeholder text such as "Lorem ipsum".
- Write realistic, useful website copy based on the user's requirements.
- Make buttons and navigation functional where possible.
- If the user requests multiple pages, represent them as sections within the single HTML document and provide working in-page navigation.
- Avoid unnecessary dependencies and external libraries.
`

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: getApiKey(),
  })
}

async function callOpenAI(userContent: string): Promise<string> {
  try {
    const client = getOpenAIClient()

    const model = process.env.BBS_AI_MODEL || DEFAULT_MODEL

    const response = await client.responses.create({
      model,
      instructions: SYSTEM_PROMPT,
      input: userContent,
      max_output_tokens: MAX_OUTPUT_TOKENS,
    })

    const output = response.output_text?.trim()

    if (!output) {
      throw new BbsAiGenerationError(
        'OpenAI returned an empty website response.',
      )
    }

    return cleanHtml(output)
  } catch (error) {
    if (
      error instanceof BbsAiConfigError ||
      error instanceof BbsAiGenerationError
    ) {
      throw error
    }

    const message =
      error instanceof Error ? error.message : 'Unknown OpenAI error.'

    throw new BbsAiGenerationError(
      `BBS AI could not generate the website: ${message}`,
    )
  }
}

function buildGenerationRequest(prompt: string): string {
  return `
Create a complete website based on the following user requirements.

USER REQUIREMENTS:
${prompt}

Generate the entire website as one standalone HTML document.

The website should include, when appropriate:
- Navigation
- Hero section
- Main content sections
- Services/features
- Calls to action
- Contact section
- Footer

Use the user's requirements as the source of truth. Do not invent important business facts that the user did not provide.

Make the final website polished, responsive, accessible, and ready to preview in a browser.

Return ONLY the HTML document.
`
}

function buildRevisionRequest({
  initialPrompt,
  instruction,
  currentHtml,
}: {
  initialPrompt: string
  instruction: string
  currentHtml: string
}): string {
  return `
Revise the existing website according to the user's new instruction.

ORIGINAL WEBSITE REQUIREMENTS:
${initialPrompt}

NEW USER INSTRUCTION:
${instruction}

EXISTING WEBSITE:
${currentHtml}

REVISION RULES:
- Return the complete updated HTML document.
- Do not return only the changed section.
- Preserve everything that the user did not ask to change.
- Apply the new instruction carefully.
- Keep the existing design and functionality unless the new instruction requires changing them.
- Do not remove useful existing content without a reason.
- Keep the website responsive and accessible.
- Return ONLY the HTML document.
`
}

export async function generateWebsite(
  prompt: string,
): Promise<string> {
  const request = buildGenerationRequest(prompt)
  const html = await callOpenAI(request)

  return validateHtmlDocument(html, prompt)
}

export async function reviseWebsite({
  initialPrompt,
  instruction,
  currentHtml,
}: {
  initialPrompt: string
  instruction: string
  currentHtml: string
}): Promise<string> {
  const request = buildRevisionRequest({
    initialPrompt,
    instruction,
    currentHtml,
  })

  const html = await callOpenAI(request)

  return validateHtmlDocument(html, instruction)
}