import { createHash, randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import OpenAI from 'openai'
import { createFileRoute } from '@tanstack/react-router'

type BbsUser = {
  id: string
  email: string
}

type ProviderId = 'bbs-ai'

type Action =
  | 'create-project'
  | 'add-message'
  | 'add-domain'

const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex')

const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing.')
  }

  return neon(databaseUrl)
}

const getAuthenticatedUser = async (
  request: Request,
): Promise<BbsUser> => {
  const sessionToken = request.headers
    .get('cookie')
    ?.match(/(?:^|;\s*)bbs_session=([^;]+)/)?.[1]

  if (!sessionToken) {
    throw new Error('UNAUTHORIZED')
  }

  const sql = getDatabase()

  const [user] = await sql`
    SELECT
      u.id,
      u.email
    FROM bbs_sessions s
    JOIN bbs_users u
      ON u.id = s.user_id
    WHERE s.token_hash = ${hash(sessionToken)}
      AND s.expires_at > NOW()
  `

  if (!user) {
    throw new Error('UNAUTHORIZED')
  }

  return user as BbsUser
}

const json = (body: unknown, status = 200) => {
  return Response.json(body, { status })
}

function cleanHtml(value: string) {
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
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      initial_prompt TEXT NOT NULL DEFAULT '',
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
      user_id TEXT NOT NULL,
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
      user_id TEXT NOT NULL,
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
      user_id TEXT NOT NULL,
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
You are BBS AI, the official website-generation engine for Better Brand Services.

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

const getWorkspace = async (user: BbsUser) => {
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
      WHERE user_id = ${user.id}
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
      WHERE user_id = ${user.id}
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
      WHERE user_id = ${user.id}
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
      WHERE user_id = ${user.id}
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
  user,
  prompt,
  name,
}: {
  user: BbsUser
  prompt: string
  name: string
}) => {
  const sql = getDatabase()

  const projectId = randomBytes(16).toString('hex')
  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_projects (
      id,
      user_id,
      name,
      initial_prompt,
      provider,
      status
    )
    VALUES (
      ${projectId},
      ${user.id},
      ${name},
      ${prompt},
      'bbs-ai',
      'building'
    )
  `

  await sql`
    INSERT INTO bbs_builder_messages (
      id,
      user_id,
      project_id,
      role,
      content,
      status
    )
    VALUES (
      ${userMessageId},
      ${user.id},
      ${projectId},
      'user',
      ${prompt},
      'complete'
    )
  `

  try {
    const html = await generateWithBbsAI(prompt)

    if (!html || !html.toLowerCase().includes('<html')) {
      throw new Error('BBS AI returned an invalid website document.')
    }

    await sql`
      INSERT INTO bbs_builder_messages (
        id,
        user_id,
        project_id,
        role,
        content,
        status
      )
      VALUES (
        ${generatedMessageId},
        ${user.id},
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
    `

    throw error
  }
}

const addMessage = async ({
  user,
  projectId,
  content,
}: {
  user: BbsUser
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
      AND user_id = ${user.id}
  `

  if (!project) {
    throw new Error('Project not found.')
  }

  const [latestGenerated] = await sql`
    SELECT content
    FROM bbs_builder_messages
    WHERE project_id = ${projectId}
      AND user_id = ${user.id}
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
      user_id,
      project_id,
      role,
      content,
      status
    )
    VALUES (
      ${userMessageId},
      ${user.id},
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
    const html = await generateWithBbsAI(regenerationPrompt)

    if (!html || !html.toLowerCase().includes('<html')) {
      throw new Error(
        'BBS AI returned an invalid website document.',
      )
    }

    await sql`
      INSERT INTO bbs_builder_messages (
        id,
        user_id,
        project_id,
        role,
        content,
        status
      )
      VALUES (
        ${generatedMessageId},
        ${user.id},
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
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
        AND user_id = ${user.id}
    `

    throw error
  }
}

const addDomain = async ({
  user,
  hostname,
  projectId,
}: {
  user: BbsUser
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

  if (projectId) {
    const [project] = await sql`
      SELECT id
      FROM bbs_projects
      WHERE id = ${projectId}
        AND user_id = ${user.id}
    `

    if (!project) {
      throw new Error('Project not found.')
    }
  }

  const id = randomBytes(16).toString('hex')

  await sql`
    INSERT INTO bbs_domains (
      id,
      user_id,
      project_id,
      hostname,
      status
    )
    VALUES (
      ${id},
      ${user.id},
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
      AND user_id = ${user.id}
  `

  return domain
}

export const Route = createFileRoute(
  '/api/builder-workspace',
)({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getAuthenticatedUser(request)

          await ensureTables()

          const workspace = await getWorkspace(user)

          return json(workspace)
        } catch (error: any) {
          console.error(
            'BBS WORKSPACE GET ERROR:',
            error,
          )

          if (error?.message === 'UNAUTHORIZED') {
            return json(
              { error: 'You must be signed in.' },
              401,
            )
          }

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
          const user = await getAuthenticatedUser(request)

          await ensureTables()

          const body = await request.json()
          const action = body.action as Action

          if (action === 'create-project') {
            const prompt = String(
              body.prompt || '',
            ).trim()

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

            const result = await createProject({
              user,
              prompt,
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
                  error: 'Project ID is required.',
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

            const result = await addMessage({
              user,
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

            const domain = await addDomain({
              user,
              hostname,
              projectId,
            })

            return json({ domain })
          }

          return json(
            {
              error: 'Unknown workspace action.',
            },
            400,
          )
        } catch (error: any) {
          console.error(
            'BBS WORKSPACE POST ERROR:',
            error,
          )

          if (error?.message === 'UNAUTHORIZED') {
            return json(
              { error: 'You must be signed in.' },
              401,
            )
          }

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
