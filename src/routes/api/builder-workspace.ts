import { randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'
import { createFileRoute } from '@tanstack/react-router'

/**
 * BBS AI is the ONLY generation engine for the workspace.
 * There is intentionally no provider selection, model dropdown,
 * or third-party engine (Codex / Gemini / Lovable) anywhere in
 * this backend. Every project is built and revised by BBS AI.
 */

type Action = 'create-project' | 'add-message' | 'add-domain'

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

const buildPrompt = (prompt: string) => `
You are BBS AI, the autonomous website-building engine for Better Brand Services (BBS).

You independently understand the request, plan the pages and sections, and build a
complete, polished, production-quality SINGLE-FILE HTML website.

USER REQUEST:
${prompt}

Requirements:
- Return ONLY raw HTML. No commentary, no markdown fences.
- Start the document with <!doctype html>.
- Put all CSS inside a <style> tag and any JavaScript inside <script> tags.
- Make the website fully responsive across phone, tablet, and desktop.
- Use accessible, semantic HTML with a clear visual hierarchy.
- Include realistic, relevant content based on the user's request.
- Include navigation, a hero section, all relevant content sections, clear CTAs, and a footer.
- If the request implies multiple pages, represent each page as a well-structured section in the single file.
- Ship a modern, premium design — never a generic template.
`

const revisePrompt = ({
  initialPrompt,
  instruction,
  currentHtml,
}: {
  initialPrompt: string
  instruction: string
  currentHtml: string
}) => `
You are BBS AI. You are revising an EXISTING website that you previously built.
Modify the current project instead of rebuilding it from scratch. Preserve everything
the user did not ask to change and apply the requested change carefully and completely.

ORIGINAL WEBSITE BRIEF:
${initialPrompt}

USER'S NEW INSTRUCTION:
${instruction}

CURRENT WEBSITE HTML:
${currentHtml}

Return ONLY the complete, updated raw HTML document beginning with <!doctype html>.
No commentary, no markdown fences.
`

/**
 * The single BBS AI generation call. BBS AI runs on one engine only.
 */
async function generateWithBbsAI(input: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'BBS AI is not configured. The generation engine key is missing.',
    )
  }

  const client = new OpenAI({ apiKey })

  const model = process.env.BBS_AI_MODEL || 'gpt-4o'

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are BBS AI, an autonomous senior web engineer that outputs complete, production-quality single-file HTML websites and nothing else.',
      },
      { role: 'user', content: input },
    ],
  })

  return cleanHtml(response.choices[0]?.message?.content || '')
}

const getWorkspace = async () => {
  const sql = getDatabase()

  const [projects, domains, deployments, messages] = await Promise.all([
    sql`
      SELECT id, name, initial_prompt, provider, status,
             published_url, custom_domain, created_at, updated_at
      FROM bbs_projects
      ORDER BY updated_at DESC
    `,
    sql`
      SELECT id, project_id, hostname, status, created_at, updated_at
      FROM bbs_domains
      ORDER BY created_at DESC
    `,
    sql`
      SELECT id, project_id, project_name, status, published_url, is_latest, created_at
      FROM bbs_deployments
      ORDER BY created_at DESC
    `,
    sql`
      SELECT id, project_id, role, content, status, created_at
      FROM bbs_builder_messages
      ORDER BY created_at ASC
    `,
  ])

  return { projects, domains, deployments, messages }
}

const createProject = async ({
  prompt,
  name,
}: {
  prompt: string
  name: string
}) => {
  const sql = getDatabase()

  const projectId = randomBytes(16).toString('hex')
  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_projects (id, name, initial_prompt, provider, status)
    VALUES (${projectId}, ${name}, ${prompt}, 'bbs-ai', 'building')
  `

  await sql`
    INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
    VALUES (${userMessageId}, ${projectId}, 'user', ${prompt}, 'complete')
  `

  try {
    const html = await generateWithBbsAI(buildPrompt(prompt))

    if (!html || !html.toLowerCase().includes('<html')) {
      throw new Error('BBS AI returned an invalid website document.')
    }

    await sql`
      INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
      VALUES (${generatedMessageId}, ${projectId}, 'assistant', ${html}, 'complete')
    `

    await sql`
      UPDATE bbs_projects SET status = 'draft', updated_at = NOW() WHERE id = ${projectId}
    `

    const [project] = await sql`
      SELECT id, name, initial_prompt, provider, status,
             published_url, custom_domain, created_at, updated_at
      FROM bbs_projects WHERE id = ${projectId}
    `
    const [userMessage] = await sql`
      SELECT id, project_id, role, content, status, created_at
      FROM bbs_builder_messages WHERE id = ${userMessageId}
    `
    const [generatedMessage] = await sql`
      SELECT id, project_id, role, content, status, created_at
      FROM bbs_builder_messages WHERE id = ${generatedMessageId}
    `

    return { project, userMessage, generatedMessage }
  } catch (error) {
    await sql`
      UPDATE bbs_projects SET status = 'failed', updated_at = NOW() WHERE id = ${projectId}
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
    SELECT id, name, initial_prompt, provider, status,
           published_url, custom_domain, created_at, updated_at
    FROM bbs_projects WHERE id = ${projectId}
  `

  if (!project) {
    throw new Error('Project not found.')
  }

  const [latestGenerated] = await sql`
    SELECT content FROM bbs_builder_messages
    WHERE project_id = ${projectId} AND role = 'assistant' AND status = 'complete'
    ORDER BY created_at DESC LIMIT 1
  `

  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
    VALUES (${userMessageId}, ${projectId}, 'user', ${content}, 'complete')
  `

  try {
    const html = await generateWithBbsAI(
      revisePrompt({
        initialPrompt: project.initial_prompt,
        instruction: content,
        currentHtml: latestGenerated?.content || '',
      }),
    )

    if (!html || !html.toLowerCase().includes('<html')) {
      throw new Error('BBS AI returned an invalid website document.')
    }

    await sql`
      INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
      VALUES (${generatedMessageId}, ${projectId}, 'assistant', ${html}, 'complete')
    `

    await sql`
      UPDATE bbs_projects SET status = 'draft', updated_at = NOW() WHERE id = ${projectId}
    `

    const [userMessage] = await sql`
      SELECT id, project_id, role, content, status, created_at
      FROM bbs_builder_messages WHERE id = ${userMessageId}
    `
    const [generatedMessage] = await sql`
      SELECT id, project_id, role, content, status, created_at
      FROM bbs_builder_messages WHERE id = ${generatedMessageId}
    `

    return { userMessage, generatedMessage }
  } catch (error) {
    await sql`
      UPDATE bbs_builder_messages SET status = 'failed' WHERE id = ${userMessageId}
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
    INSERT INTO bbs_domains (id, project_id, hostname, status)
    VALUES (${id}, ${projectId}, ${cleanHostname}, 'needs_configuration')
  `

  const [domain] = await sql`
    SELECT id, project_id, hostname, status, created_at, updated_at
    FROM bbs_domains WHERE id = ${id}
  `

  return domain
}

/**
 * TanStack Start server route: /api/builder-workspace
 */
export const Route = createFileRoute('/api/builder-workspace')({
  server: {
    handlers: {
      GET: async () => {
        try {
          await ensureTables()
          const workspace = await getWorkspace()
          return json(workspace)
        } catch (error: any) {
          console.error('[v0] BBS WORKSPACE GET ERROR:', error)
          return json(
            { error: error?.message || 'The BBS workspace request failed.' },
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
            const prompt = String(body.prompt || '').trim()
            const name = String(body.name || 'BBS Website').trim()

            if (prompt.length < 12) {
              return json(
                { error: 'Describe the website in at least 12 characters.' },
                422,
              )
            }

            const result = await createProject({ prompt, name })
            return json(result)
          }

          if (action === 'add-message') {
            const projectId = String(body.projectId || '').trim()
            const content = String(body.content || '').trim()

            if (!projectId) {
              return json({ error: 'Project ID is required.' }, 422)
            }
            if (content.length < 2) {
              return json(
                { error: 'Enter an instruction for the website.' },
                422,
              )
            }

            const result = await addMessage({ projectId, content })
            return json(result)
          }

          if (action === 'add-domain') {
            const hostname = String(body.hostname || '').trim()
            const projectId = body.projectId ? String(body.projectId) : null
            const domain = await addDomain({ hostname, projectId })
            return json({ domain })
          }

          return json({ error: 'Unknown workspace action.' }, 400)
        } catch (error: any) {
          console.error('[v0] BBS WORKSPACE POST ERROR:', error)
          return json(
            { error: error?.message || 'The BBS workspace request failed.' },
            500,
          )
        }
      },
    },
  },
})
