import { randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import { createFileRoute } from '@tanstack/react-router'

type ProviderId = 'bbs-ai' | 'codex' | 'gemini' | 'lovable'

type Action =
  | 'create-project'
  | 'add-message'
  | 'add-domain'

const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing.')
  }

  return neon(databaseUrl)
}

const json = (body: unknown, status = 200) => {
  return Response.json(body, { status })
}

const cleanHtml = (value: string) => {
  let html = String(value || '').trim()

  html = html
    .replace(/^```html\s*/i, '')
    .replace(/^```HTML\s*/i, '')
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

const ensureTables = async () => {
  const sql = getDatabase()

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      initial_prompt TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'bbs-ai',
      status TEXT NOT NULL DEFAULT 'draft',
      published_url TEXT,
      custom_domain TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_builder_messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'complete',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_domains (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      hostname TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'needs_configuration',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_deployments (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      project_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'building',
      published_url TEXT,
      is_latest BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

const websitePrompt = (prompt: string) => `
You are the website-generation engine for Better Brand Services (BBS).

Create a complete, polished, production-quality SINGLE-FILE HTML website.

USER REQUEST:
${prompt}

Requirements:
- Return ONLY raw HTML.
- Start with <!doctype html>.
- Include all CSS inside <style>.
- Include JavaScript inside <script> when useful.
- Do not use markdown fences.
- Make the website responsive on phones, tablets, and desktops.
- Create a professional visual hierarchy.
- Use accessible semantic HTML.
- Include realistic content based on the user's request.
- Include navigation, hero section, relevant sections, CTA buttons, and footer.
- If the request asks for multiple pages, represent the requested pages/sections within the single HTML file.
- Do not explain the code.
`

async function generateWithBbsAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing.')
  }

  const openai = new OpenAI({
    apiKey,
  })

  const response = await openai.responses.create({
    model: process.env.BBS_AI_MODEL || 'gpt-5.6',
    input: websitePrompt(prompt),
  })

  return cleanHtml(response.output_text)
}

async function generateWithCodex(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing.')
  }

  const openai = new OpenAI({
    apiKey,
  })

  const response = await openai.responses.create({
    model: process.env.CODEX_MODEL || 'gpt-5.3-codex',
    reasoning: {
      effort: 'medium',
    },
    input: websitePrompt(prompt),
  })

  return cleanHtml(response.output_text)
}

async function generateWithGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing.')
  }

  const ai = new GoogleGenAI({
    apiKey,
  })

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: websitePrompt(prompt),
  })

  return cleanHtml(response.text || '')
}

async function generateWithLovable(prompt: string) {
  const apiKey = process.env.LOVABLE_API_KEY

  if (!apiKey) {
    throw new Error(
      'LOVABLE_API_KEY is not configured. Lovable integration requires a supported Lovable API/integration.',
    )
  }

  /*
   * IMPORTANT:
   * Do not pretend that LOVABLE_API_KEY is an OpenAI-compatible
   * API key. The actual Lovable integration should be added here
   * once you have the supported Lovable API endpoint/SDK.
   *
   * For now we return a clear server-side error instead of
   * silently generating with another provider.
   */

  void prompt

  throw new Error(
    'Lovable is selected, but its supported API integration has not been configured yet.',
  )
}

async function generateWebsite(
  provider: ProviderId,
  prompt: string,
) {
  switch (provider) {
    case 'bbs-ai':
      return generateWithBbsAI(prompt)

    case 'codex':
      return generateWithCodex(prompt)

    case 'gemini':
      return generateWithGemini(prompt)

    case 'lovable':
      return generateWithLovable(prompt)

    default:
      throw new Error('Unsupported AI provider.')
  }
}

const getWorkspace = async () => {
  const sql = getDatabase()

  const [
    projects,
    domains,
    deployments,
    messages,
  ] = await Promise.all([
    sql`
      SELECT
        id,
        name,
        initial_prompt,
        provider,
        status,
        published_url,
        custom_domain,
        created_at,
        updated_at
      FROM bbs_projects
      ORDER BY updated_at DESC
    `,

    sql`
      SELECT
        id,
        project_id,
        hostname,
        status,
        created_at,
        updated_at
      FROM bbs_domains
      ORDER BY created_at DESC
    `,

    sql`
      SELECT
        id,
        project_id,
        project_name,
        status,
        published_url,
        is_latest,
        created_at
      FROM bbs_deployments
      ORDER BY created_at DESC
    `,

    sql`
      SELECT
        id,
        project_id,
        role,
        content,
        status,
        created_at
      FROM bbs_builder_messages
      ORDER BY created_at ASC
    `,
  ])

  return {
    projects,
    domains,
    deployments,
    messages,
  }
}

const createProject = async ({
  prompt,
  provider,
  name,
}: {
  prompt: string
  provider: ProviderId
  name: string
}) => {
  const sql = getDatabase()

  const projectId = randomBytes(16).toString('hex')
  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_projects (
      id,
      name,
      initial_prompt,
      provider,
      status
    )
    VALUES (
      ${projectId},
      ${name},
      ${prompt},
      ${provider},
      'building'
    )
  `

  await sql`
    INSERT INTO bbs_builder_messages (
      id,
      project_id,
      role,
      content,
      status
    )
    VALUES (
      ${userMessageId},
      ${projectId},
      'user',
      ${prompt},
      'complete'
    )
  `

  try {
    const html = await generateWebsite(
      provider,
      prompt,
    )

    if (
      !html ||
      !html.toLowerCase().includes('<html')
    ) {
      throw new Error(
        `${provider} returned an invalid website document.`,
      )
    }

    await sql`
      INSERT INTO bbs_builder_messages (
        id,
        project_id,
        role,
        content,
        status
      )
      VALUES (
        ${generatedMessageId},
        ${projectId},
        'assistant',
        ${html},
        'complete'
      )
    `

    await sql`
      UPDATE bbs_projects
      SET
        status = 'draft',
        updated_at = NOW()
      WHERE id = ${projectId}
    `

    const [project] = await sql`
      SELECT
        id,
        name,
        initial_prompt,
        provider,
        status,
        published_url,
        custom_domain,
        created_at,
        updated_at
      FROM bbs_projects
      WHERE id = ${projectId}
    `

    const [userMessage] = await sql`
      SELECT
        id,
        project_id,
        role,
        content,
        status,
        created_at
      FROM bbs_builder_messages
      WHERE id = ${userMessageId}
    `

    const [generatedMessage] = await sql`
      SELECT
        id,
        project_id,
        role,
        content,
        status,
        created_at
      FROM bbs_builder_messages
      WHERE id = ${generatedMessageId}
    `

    return {
      project,
      userMessage,
      generatedMessage,
    }
  } catch (error) {
    await sql`
      UPDATE bbs_projects
      SET
        status = 'failed',
        updated_at = NOW()
      WHERE id = ${projectId}
    `

    throw error
  }
}

const addMessage = async ({
  projectId,
  content,
}: {
  projectId: string
  content: string
}) => {
  const sql = getDatabase()

  const [project] = await sql`
    SELECT
      id,
      name,
      initial_prompt,
      provider,
      status,
      published_url,
      custom_domain,
      created_at,
      updated_at
    FROM bbs_projects
    WHERE id = ${projectId}
  `

  if (!project) {
    throw new Error('Project not found.')
  }

  const [latestGenerated] = await sql`
    SELECT content
    FROM bbs_builder_messages
    WHERE project_id = ${projectId}
      AND role = 'assistant'
      AND status = 'complete'
    ORDER BY created_at DESC
    LIMIT 1
  `

  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_builder_messages (
      id,
      project_id,
      role,
      content,
      status
    )
    VALUES (
      ${userMessageId},
      ${projectId},
      'user',
      ${content},
      'complete'
    )
  `

  const regenerationPrompt = `
Create an updated version of this website.

ORIGINAL WEBSITE REQUEST:
${project.initial_prompt}

USER'S NEW INSTRUCTION:
${content}

CURRENT WEBSITE:
${latestGenerated?.content || ''}

Keep everything that the user did not ask to change.

Apply the requested change carefully.

Return ONLY the complete raw HTML document beginning with <!doctype html>.
`

  try {
    const html = await generateWebsite(
      project.provider as ProviderId,
      regenerationPrompt,
    )

    if (
      !html ||
      !html.toLowerCase().includes('<html')
    ) {
      throw new Error(
        'The AI returned an invalid website document.',
      )
    }

    await sql`
      INSERT INTO bbs_builder_messages (
        id,
        project_id,
        role,
        content,
        status
      )
      VALUES (
        ${generatedMessageId},
        ${projectId},
        'assistant',
        ${html},
        'complete'
      )
    `

    await sql`
      UPDATE bbs_projects
      SET
        status = 'draft',
        updated_at = NOW()
      WHERE id = ${projectId}
    `

    const [userMessage] = await sql`
      SELECT
        id,
        project_id,
        role,
        content,
        status,
        created_at
      FROM bbs_builder_messages
      WHERE id = ${userMessageId}
    `

    const [generatedMessage] = await sql`
      SELECT
        id,
        project_id,
        role,
        content,
        status,
        created_at
      FROM bbs_builder_messages
      WHERE id = ${generatedMessageId}
    `

    return {
      userMessage,
      generatedMessage,
    }
  } catch (error) {
    await sql`
      UPDATE bbs_builder_messages
      SET status = 'failed'
      WHERE id = ${userMessageId}
    `

    throw error
  }
}

const addDomain = async ({
  hostname,
  projectId,
}: {
  hostname: string
  projectId: string | null
}) => {
  const sql = getDatabase()

  const cleanHostname = hostname
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')

  if (!cleanHostname) {
    throw new Error('Enter a domain name.')
  }

  const id = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_domains (
      id,
      project_id,
      hostname,
      status
    )
    VALUES (
      ${id},
      ${projectId},
      ${cleanHostname},
      'needs_configuration'
    )
  `

  const [domain] = await sql`
    SELECT
      id,
      project_id,
      hostname,
      status,
      created_at,
      updated_at
    FROM bbs_domains
    WHERE id = ${id}
  `

  return domain
}

/*
 * TanStack Start server route.
 *
 * File:
 * src/routes/api/builder-workspace.ts
 *
 * Endpoint:
 * /api/builder-workspace
 */
export const Route = createFileRoute(
  '/api/builder-workspace',
)({
  server: {
    handlers: {
      GET: async () => {
        try {
          await ensureTables()

          const workspace = await getWorkspace()

          return json(workspace)
        } catch (error: any) {
          console.error(
            'BBS WORKSPACE GET ERROR:',
            error,
          )

          return json(
            {
              error:
                error?.message ||
                'The BBS workspace request failed.',
            },
            500,
          )
        }
      },

      POST: async ({ request }) => {
        try {
          await ensureTables()

          const body = await request.json()
          const action = body.action as Action

          if (action === 'create-project') {
            const prompt = String(
              body.prompt || '',
            ).trim()

            const provider = String(
              body.provider || 'bbs-ai',
            ) as ProviderId

            const name = String(
              body.name || 'BBS Website',
            ).trim()

            if (prompt.length < 12) {
              return json(
                {
                  error:
                    'Describe the website in at least 12 characters.',
                },
                422,
              )
            }

            if (
              ![
                'bbs-ai',
                'codex',
                'gemini',
                'lovable',
              ].includes(provider)
            ) {
              return json(
                {
                  error:
                    'Unsupported AI provider.',
                },
                422,
              )
            }

            const result =
              await createProject({
                prompt,
                provider,
                name,
              })

            return json(result)
          }

          if (action === 'add-message') {
            const projectId = String(
              body.projectId || '',
            ).trim()

            const content = String(
              body.content || '',
            ).trim()

            if (!projectId) {
              return json(
                {
                  error:
                    'Project ID is required.',
                },
                422,
              )
            }

            if (content.length < 2) {
              return json(
                {
                  error:
                    'Enter an instruction for the website.',
                },
                422,
              )
            }

            const result =
              await addMessage({
                projectId,
                content,
              })

            return json(result)
          }

          if (action === 'add-domain') {
            const hostname = String(
              body.hostname || '',
            ).trim()

            const projectId = body.projectId
              ? String(body.projectId)
              : null

            const domain =
              await addDomain({
                hostname,
                projectId,
              })

            return json({ domain })
          }

          return json(
            {
              error:
                'Unknown workspace action.',
            },
            400,
          )
        } catch (error: any) {
          console.error(
            'BBS WORKSPACE POST ERROR:',
            error,
          )

          return json(
            {
              error:
                error?.message ||
                'The BBS workspace request failed.',
            },
            500,
          )
        }
      },
    },
  },
})