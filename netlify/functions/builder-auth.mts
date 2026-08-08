import { createHash, randomBytes, randomInt } from 'node:crypto'

import { getDatabase } from '@netlify/database'
import {
  admin,
  AuthError,
  login,
  requestPasswordRecovery,
  signup,
  verifyRequestOrigin,
  type User,
} from '@netlify/identity'
import type { Config } from '@netlify/functions'

type AuthAction = 'request-code' | 'verify-code'

const json = (body: unknown, status = 200) => Response.json(body, { status })
const normalizeEmail = (value: unknown) => String(value ?? '').trim().toLowerCase()
const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value) && value.length <= 254
const codeHash = (email: string, code: string) => createHash('sha256').update(`${email}:${code}`).digest('hex')
const privatePassword = () => `${randomBytes(30).toString('base64url')}Aa9!`

const findIdentityUser = async (email: string) => {
  const pageSize = 100
  for (let page = 1; page <= 20; page += 1) {
    const users = await admin.listUsers({ page, perPage: pageSize })
    const user = users.find((candidate) => candidate.email?.toLowerCase() === email)
    if (user) return user
    if (users.length < pageSize) return null
  }
  return null
}

const withEmailCode = (user: User, code: string) => ({
  ...(user.userMetadata ?? {}),
  bbs_auth_code: code,
})

const withoutEmailCode = (user: User) => {
  const metadata = { ...(user.userMetadata ?? {}) }
  delete metadata.bbs_auth_code
  return metadata
}

const sendIdentityEmail = async (email: string, code: string) => {
  let user = await findIdentityUser(email)
  let createdUser = false

  if (!user) {
    try {
      user = await signup(email, privatePassword(), { bbs_auth_code: code })
      createdUser = true
    } catch (error) {
      if (!(error instanceof AuthError) || ![400, 422].includes(error.status ?? 0)) throw error
      user = await findIdentityUser(email)
      if (!user) throw error
    }
  }

  if (!user.confirmedAt) {
    if (createdUser) {
      await admin.updateUser(user.id, { user_metadata: withoutEmailCode(user) })
      return
    }
    await admin.updateUser(user.id, { user_metadata: withEmailCode(user, code) })
    try {
      await signup(email, privatePassword(), { bbs_auth_code: code })
    } finally {
      await admin.updateUser(user.id, { user_metadata: withoutEmailCode(user) })
    }
    return
  }

  await admin.updateUser(user.id, { user_metadata: withEmailCode(user, code) })
  try {
    await requestPasswordRecovery(email)
  } finally {
    await admin.updateUser(user.id, { user_metadata: withoutEmailCode(user) })
  }
}

const requestCode = async (email: string) => {
  const database = getDatabase()
  const [recentCode] = await database.sql`
    SELECT last_sent_at
    FROM bbs_auth_codes
    WHERE email = ${email} AND last_sent_at > NOW() - INTERVAL '45 seconds'
  `
  if (recentCode) return json({ error: 'Wait 45 seconds before requesting another code.' }, 429)

  const code = String(randomInt(1000, 10000))
  await database.sql`
    INSERT INTO bbs_auth_codes (email, code_hash, expires_at, attempts, last_sent_at)
    VALUES (${email}, ${codeHash(email, code)}, NOW() + INTERVAL '10 minutes', 0, NOW())
    ON CONFLICT (email) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      attempts = 0,
      last_sent_at = NOW()
  `

  try {
    await sendIdentityEmail(email, code)
  } catch (error) {
    await database.sql`DELETE FROM bbs_auth_codes WHERE email = ${email}`
    throw error
  }

  return json({ message: 'A four-digit code was sent to your email.' })
}

const verifyCode = async (email: string, code: string) => {
  if (!/^\d{4}$/.test(code)) return json({ error: 'Enter the four-digit code from your email.' }, 422)

  const database = getDatabase()
  const [verifiedCode] = await database.sql`
    DELETE FROM bbs_auth_codes
    WHERE email = ${email}
      AND code_hash = ${codeHash(email, code)}
      AND expires_at > NOW()
      AND attempts < 5
    RETURNING email
  `

  if (!verifiedCode) {
    const [failedCode] = await database.sql`
      UPDATE bbs_auth_codes
      SET attempts = attempts + 1
      WHERE email = ${email} AND expires_at > NOW() AND attempts < 5
      RETURNING attempts
    `
    if (!failedCode) return json({ error: 'This code expired. Request a new four-digit code.' }, 401)
    return json({ error: 'That four-digit code is incorrect.' }, 401)
  }

  const user = await findIdentityUser(email)
  if (!user) return json({ error: 'No account was found for this email. Request a new code.' }, 404)

  const password = privatePassword()
  await admin.updateUser(user.id, {
    password,
    confirm: true,
    user_metadata: withoutEmailCode(user),
  })
  const authenticatedUser = await login(email, password)
  return json({ user: authenticatedUser })
}

export default async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  try {
    verifyRequestOrigin(request)
    const body = (await request.json()) as Record<string, unknown>
    const action = body.action as AuthAction
    const email = normalizeEmail(body.email)
    if (!validEmail(email)) return json({ error: 'Enter a valid email address.' }, 422)

    if (action === 'request-code') return await requestCode(email)
    if (action === 'verify-code') return await verifyCode(email, String(body.code ?? '').trim())
    return json({ error: 'Unknown authentication action.' }, 400)
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.status === 429) return json({ error: 'Too many attempts. Wait a moment and try again.' }, 429)
      if (error.status === 403) return json({ error: 'Email sign-in is not available for this deployment.' }, 503)
    }
    return json({ error: 'The verification email could not be processed. Try again.' }, 500)
  }
}

export const config: Config = {
  path: '/api/builder-auth',
}
