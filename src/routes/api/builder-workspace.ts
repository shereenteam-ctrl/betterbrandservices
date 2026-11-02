import { randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { generateWebsite, reviseWebsite } from '../../lib/bbs-ai-engine'
import { createFileRoute } from '@tanstack/react-router'
import { getAuthenticatedUser } from './builder-auth'

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

    await sql`
    ALTER TABLE bbs_projects
    ADD COLUMN IF NOT EXISTS user_id TEXT
  `

  await sql`
    ALTER TABLE bbs_domains
    ADD COLUMN IF NOT EXISTS user_id TEXT
  `
  await sql`
    ALTER TABLE bbs_deployments
    ADD COLUMN IF NOT EXISTS user_id TEXT
  `
}

const ensureWorkspaceOwnership = async (userId: string) => {
  const sql = getDatabase()

  await sql`
    UPDATE bbs_projects
    SET user_id = ${userId}
    WHERE user_id IS NULL
  `

  await sql`
    UPDATE bbs_domains
    SET user_id = ${userId}
    WHERE user_id IS NULL
  `

  await sql`
    UPDATE bbs_deployments
    SET user_id = ${userId}
    WHERE user_id IS NULL
      AND EXISTS (
        SELECT 1
        FROM bbs_projects p
        WHERE p.id = bbs_deployments.project_id
          AND p.user_id = ${userId}
      )
  `
}

/**
 * The single BBS AI generation call. BBS AI runs on one engine only.
 */

const getWorkspace = async (userId: string) => {
  const sql = getDatabase()

  const [projects, domains, deployments, messages] = await Promise.all([
    sql`
      SELECT id, name, initial_prompt, provider, status,
             published_url, custom_domain, created_at, updated_at
      FROM bbs_projects
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `,
    sql`
      SELECT id, project_id, hostname, status, created_at, updated_at
      FROM bbs_domains
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `,
    sql`
      SELECT id, project_id, project_name, status, published_url,
             is_latest, created_at
      FROM bbs_deployments
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `,
    sql`
      SELECT m.id, m.project_id, m.role, m.content, m.status, m.created_at
      FROM bbs_builder_messages m
      JOIN bbs_projects p ON p.id = m.project_id
      WHERE p.user_id = ${userId}
      ORDER BY m.created_at ASC
    `,
  ])

  return { projects, domains, deployments, messages }
}


const createProject = async ({
  prompt,
  name,
  userId,
}: {
  prompt: string
  name: string
  userId: string
}) => {
  const sql = getDatabase()

  const projectId = randomBytes(16).toString('hex')
  const userMessageId = randomBytes(16).toString('hex')
  const generatedMessageId = randomBytes(16).toString('hex')

await sql`
  INSERT INTO bbs_projects (id, name, initial_prompt, provider, status, user_id)
  VALUES (${projectId}, ${name}, ${prompt}, 'bbs-ai', 'building', ${userId})
`

  await sql`
    INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
    VALUES (${userMessageId}, ${projectId}, 'user', ${prompt}, 'complete')
  `

  try {
    const html = await generateWebsite(prompt)

    if (!html || !html.toLowerCase().includes('<html')) {
      throw new Error('BBS AI returned an invalid website document.')
    }

    await sql`
      INSERT INTO bbs_builder_messages (id, project_id, role, content, status)
      VALUES (${generatedMessageId}, ${projectId}, 'assistant', ${html}, 'complete')
    `

   await sql`
  UPDATE bbs_projects
  SET status = 'draft', updated_at = NOW()
  WHERE id = ${projectId} AND user_id = ${userId}
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
     UPDATE bbs_projects
SET status = 'failed', updated_at = NOW()
WHERE id = ${projectId} AND user_id = ${userId}
    `
    throw error
  }
}

const addMessage = async ({
  projectId,
  content,
  userId,
}: {
  projectId: string
  content: string
  userId: string
}) => {
  const sql = getDatabase()

  const [project] = await sql`
    SELECT id, name, initial_prompt, provider, status,
           published_url, custom_domain, created_at, updated_at
    FROM bbs_projects
    WHERE id = ${projectId} AND user_id = ${userId} 
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
    const html = await reviseWebsite({
      initialPrompt: project.initial_prompt,
      instruction: content,
      currentHtml: latestGenerated?.content || '',
    })
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
  userId,
}: {
  hostname: string
  projectId: string | null
  userId: string
}) => {
  const sql = getDatabase()
  if (projectId) {
  const [project] = await sql`
    SELECT id
    FROM bbs_projects
    WHERE id = ${projectId}
      AND user_id = ${userId}
  `

  if (!project) {
    throw new Error('Project not found.')
  }
}

  const cleanHostname = hostname
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')

  if (!cleanHostname) {
    throw new Error('Enter a domain name.')
  }

  const id = randomBytes(16).toString('hex')

 await sql`
  INSERT INTO bbs_domains (id, project_id, hostname, status, user_id)
  VALUES (${id}, ${projectId}, ${cleanHostname}, 'needs_configuration', ${userId})
`

  const [domain] = await sql`
  SELECT id, project_id, hostname, status, created_at, updated_at
  FROM bbs_domains
  WHERE id = ${id} AND user_id = ${userId}
`

  return domain
}

/**
 * TanStack Start server route: /api/builder-workspace
 */
export const Route = createFileRoute('/api/builder-workspace')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getAuthenticatedUser(request)

          if (!user) {
            return json({ error: 'Please sign in to access BBS AI.' }, 401)
          }

          await ensureTables()
          await ensureWorkspaceOwnership(user.id)
          const workspace = await getWorkspace(user.id)
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
          const user = await getAuthenticatedUser(request)

          if (!user) {
            return json({ error: 'Please sign in to access BBS AI.' }, 401)
          }
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

            const result = await createProject({
  prompt,
  name,
  userId: user.id,
             })
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

            const result = await addMessage({
  projectId,
  content,
  userId: user.id,
})
            return json(result)
          }

          if (action === 'add-domain') {
            const hostname = String(body.hostname || '').trim()
            const projectId = body.projectId ? String(body.projectId) : null
           const domain = await addDomain({
  hostname,
  projectId,
  userId: user.id,
})
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
