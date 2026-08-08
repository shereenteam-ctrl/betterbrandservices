import { getDatabase } from '@netlify/database'
import { getUser, verifyRequestOrigin } from '@netlify/identity'
import type { Config } from '@netlify/functions'
import OpenAI from 'openai'

type WorkspaceAction = 'create-project' | 'add-domain' | 'update-project' | 'add-message'

const json = (body: unknown, status = 200) => Response.json(body, { status })

const cleanHostname = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]

const validHostname = (value: string) =>
  /^(?=.{4,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(value)

const generationInstructions = `You are the website generation engine for Better Brand Services.
Return one complete, production-quality HTML document that runs without a build step.
Use semantic HTML, embedded CSS, and only minimal embedded JavaScript when interaction requires it.
Make the design distinctive, responsive, accessible, and faithful to the user's business brief.
Do not use external images, fonts, libraries, or placeholder URLs. Create visual interest with CSS.
Include realistic copy based on the brief and a working contact section.
Keep the document under 24,000 characters.
Return raw HTML only, beginning with <!doctype html>. Do not use markdown fences or explanations.`

const cleanGeneratedHtml = (value: string) => {
  const html = value
    .trim()
    .replace(/^```html\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
  if (!/^<!doctype html>/i.test(html)) throw new Error('The generator did not return a complete HTML document.')
  return html
}

const generateWebsite = async (prompt: string, currentHtml?: string) => {
  const openai = new OpenAI()
  const input = currentHtml
    ? `${generationInstructions}\n\nRevise the current website using this instruction:\n${prompt}\n\nCurrent HTML:\n${currentHtml}`
    : `${generationInstructions}\n\nBusiness brief:\n${prompt}`
  const response = await openai.responses.create({ model: 'gpt-5.2', input })
  return cleanGeneratedHtml(response.output_text)
}

export default async (request: Request) => {
  const user = await getUser()
  if (!user) return json({ error: 'Sign in to access your builder workspace.' }, 401)

  const database = getDatabase()

  if (request.method === 'GET') {
    const [projects, domains, deployments, messages] = await Promise.all([
      database.sql`
        SELECT id, name, initial_prompt, provider, status, published_url, custom_domain, created_at, updated_at
        FROM bbs_projects
        WHERE user_id = ${user.id}
        ORDER BY updated_at DESC
      `,
      database.sql`
        SELECT id, project_id, hostname, status, created_at, updated_at
        FROM bbs_domains
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
      `,
      database.sql`
        SELECT deployments.id, deployments.project_id, deployments.status, deployments.published_url,
               deployments.is_latest, deployments.created_at, projects.name AS project_name
        FROM bbs_deployments AS deployments
        JOIN bbs_projects AS projects ON projects.id = deployments.project_id
        WHERE deployments.user_id = ${user.id}
        ORDER BY deployments.created_at DESC
      `,
      database.sql`
        SELECT id, project_id, role, content, status, created_at
        FROM bbs_builder_messages
        WHERE user_id = ${user.id}
        ORDER BY created_at ASC
      `,
    ])

    return json({ projects, domains, deployments, messages })
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  verifyRequestOrigin(request)

  const body = (await request.json()) as Record<string, unknown>
  const action = body.action as WorkspaceAction

  if (action === 'create-project') {
    const prompt = String(body.prompt ?? '').trim()
    const provider = String(body.provider ?? 'bbs-ai').trim()
    if (prompt.length < 12 || prompt.length > 4000) {
      return json({ error: 'Describe the website in at least 12 characters.' }, 422)
    }

    const projectName = String(body.name ?? '')
      .trim()
      .slice(0, 80) || 'Untitled website'
    const projectId = crypto.randomUUID()
    let generatedHtml: string
    try {
      generatedHtml = await generateWebsite(prompt)
    } catch {
      return json({ error: 'Website generation is temporarily unavailable. Please try again.' }, 502)
    }
    const client = await database.pool.connect()
    let project
    let userMessage
    let generatedMessage
    try {
      await client.query('BEGIN')
      const projectResult = await client.query(
        `INSERT INTO bbs_projects (id, user_id, name, initial_prompt, provider, status)
         VALUES ($1, $2, $3, $4, $5, 'generated')
         RETURNING id, name, initial_prompt, provider, status, published_url, custom_domain, created_at, updated_at`,
        [projectId, user.id, projectName, prompt, provider],
      )
      project = projectResult.rows[0]
      const userResult = await client.query(
        `INSERT INTO bbs_builder_messages (id, user_id, project_id, role, content, status)
         VALUES ($1, $2, $3, 'user', $4, 'complete')
         RETURNING id, project_id, role, content, status, created_at`,
        [crypto.randomUUID(), user.id, projectId, prompt],
      )
      userMessage = userResult.rows[0]
      const generatedResult = await client.query(
        `INSERT INTO bbs_builder_messages (id, user_id, project_id, role, content, status)
         VALUES ($1, $2, $3, 'assistant', $4, 'complete')
         RETURNING id, project_id, role, content, status, created_at`,
        [crypto.randomUUID(), user.id, projectId, generatedHtml],
      )
      generatedMessage = generatedResult.rows[0]
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

    return json({ project, userMessage, generatedMessage }, 201)
  }

  if (action === 'add-domain') {
    const hostname = cleanHostname(String(body.hostname ?? ''))
    const projectId = body.projectId ? String(body.projectId) : null
    if (!validHostname(hostname)) return json({ error: 'Enter a valid domain such as yourdomain.com.' }, 422)

    if (projectId) {
      const [ownedProject] = await database.sql`
        SELECT id FROM bbs_projects WHERE id = ${projectId} AND user_id = ${user.id}
      `
      if (!ownedProject) return json({ error: 'Project not found.' }, 404)
    }

    try {
      const domainId = crypto.randomUUID()
      const [domain] = await database.sql`
        INSERT INTO bbs_domains (id, user_id, project_id, hostname)
        VALUES (${domainId}, ${user.id}, ${projectId}, ${hostname})
        RETURNING id, project_id, hostname, status, created_at, updated_at
      `
      return json({ domain }, 201)
    } catch (error) {
      if (error instanceof Error && error.message.includes('unique')) {
        return json({ error: 'This domain is already in your workspace.' }, 409)
      }
      throw error
    }
  }

  if (action === 'update-project') {
    const projectId = String(body.projectId ?? '')
    const name = String(body.name ?? '').trim().slice(0, 80)
    if (!projectId || !name) return json({ error: 'Project name is required.' }, 422)

    const [project] = await database.sql`
      UPDATE bbs_projects
      SET name = ${name}, updated_at = NOW()
      WHERE id = ${projectId} AND user_id = ${user.id}
      RETURNING id, name, initial_prompt, provider, status, published_url, custom_domain, created_at, updated_at
    `
    if (!project) return json({ error: 'Project not found.' }, 404)
    return json({ project })
  }

  if (action === 'add-message') {
    const projectId = String(body.projectId ?? '')
    const content = String(body.content ?? '').trim()
    if (!projectId || content.length < 2 || content.length > 4000) {
      return json({ error: 'Enter an instruction between 2 and 4,000 characters.' }, 422)
    }

    const [ownedProject] = await database.sql`
      SELECT id, initial_prompt FROM bbs_projects WHERE id = ${projectId} AND user_id = ${user.id}
    `
    if (!ownedProject) return json({ error: 'Project not found.' }, 404)

    const [latestGeneration] = await database.sql`
      SELECT content FROM bbs_builder_messages
      WHERE project_id = ${projectId} AND user_id = ${user.id} AND role = 'assistant' AND status = 'complete'
      ORDER BY created_at DESC
      LIMIT 1
    `

    let generatedHtml: string
    try {
      const revisionPrompt = latestGeneration?.content
        ? content
        : `${String(ownedProject.initial_prompt)}\n\nAdditional instruction: ${content}`
      generatedHtml = await generateWebsite(revisionPrompt, latestGeneration?.content as string | undefined)
    } catch {
      return json({ error: 'The website could not be updated right now. Please try again.' }, 502)
    }

    const client = await database.pool.connect()
    let userMessage
    let generatedMessage
    try {
      await client.query('BEGIN')
      const userResult = await client.query(
        `INSERT INTO bbs_builder_messages (id, user_id, project_id, role, content, status)
         VALUES ($1, $2, $3, 'user', $4, 'complete')
         RETURNING id, project_id, role, content, status, created_at`,
        [crypto.randomUUID(), user.id, projectId, content],
      )
      userMessage = userResult.rows[0]
      const generatedResult = await client.query(
        `INSERT INTO bbs_builder_messages (id, user_id, project_id, role, content, status)
         VALUES ($1, $2, $3, 'assistant', $4, 'complete')
         RETURNING id, project_id, role, content, status, created_at`,
        [crypto.randomUUID(), user.id, projectId, generatedHtml],
      )
      generatedMessage = generatedResult.rows[0]
      await client.query(
        'UPDATE bbs_projects SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3',
        ['generated', projectId, user.id],
      )
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

    return json({ userMessage, generatedMessage }, 201)
  }

  return json({ error: 'Unknown workspace action.' }, 400)
}

export const config: Config = {
  path: '/api/builder-workspace',
}
