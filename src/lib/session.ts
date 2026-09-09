import { createHash } from 'node:crypto'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

/**
 * Shared session resolution for BBS AI Builder server routes.
 *
 * The app authenticates with its own email-code flow (see
 * src/routes/api/builder-auth.ts), which sets an httpOnly `bbs_session`
 * cookie backed by the `bbs_sessions` / `bbs_users` tables. This helper is
 * the single place that turns that cookie into a trusted user id, so every
 * server route scopes data by user instead of trusting client-supplied ids.
 */

export type SessionUser = {
  id: string
  email: string
}

let _sql: NeonQueryFunction<false, false> | null = null
export const getDb = () => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing.')
  }
  if (!_sql) {
    _sql = neon(databaseUrl)
  }
  return _sql
}

const hash = (value: string) => createHash('sha256').update(value).digest('hex')

const readCookie = (request: Request, name: string) => {
  const header = request.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

/**
 * Resolves the authenticated BBS user from the request's session cookie.
 * Returns null when there is no valid, unexpired session — callers MUST
 * treat that as "not authenticated" and reject the request.
 */
export const getSessionUser = async (
  request: Request,
): Promise<SessionUser | null> => {
  const token = readCookie(request, 'bbs_session')
  if (!token) return null

  const sql = getDb()
  const tokenHash = hash(token)

  const [row] = await sql`
    SELECT bbs_users.id, bbs_users.email
    FROM bbs_sessions
    JOIN bbs_users ON bbs_users.id = bbs_sessions.user_id
    WHERE bbs_sessions.token_hash = ${tokenHash}
      AND bbs_sessions.expires_at > NOW()
  `

  if (!row) return null
  return { id: row.id as string, email: row.email as string }
}

export const requireSessionUser = async (request: Request) => {
  const user = await getSessionUser(request)
  if (!user) {
    throw Object.assign(new Error('Sign in to access your builder workspace.'), {
      status: 401,
    })
  }
  return user
}
