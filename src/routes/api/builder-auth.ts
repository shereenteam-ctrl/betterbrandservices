import { createHash, randomInt, randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { createFileRoute } from '@tanstack/react-router'

type AuthAction = 'request-code' | 'verify-code'

type BbsUser = {
  id: string
  email: string
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status })

const normalizeEmail = (value: unknown) =>
  String(value ?? '').trim().toLowerCase()

const validEmail = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) && value.length <= 254

const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex')

const sql = neon(process.env.DATABASE_URL!)

const resend = new Resend(process.env.RESEND_API_KEY)

const ensureTables = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS bbs_auth_codes (
      email TEXT PRIMARY KEY,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_sent_at TIMESTAMPTZ NOT NULL
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `
}

const sendCodeEmail = async (email: string, code: string) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.')
  }

  const result = await resend.emails.send({
    from: 'Better Brand Services <info@betterbrandservices.com>',
    to: email,
    subject: 'Your BBS AI Builder verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>BBS AI Builder</h2>
        <p>Use this four-digit code to sign in:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;margin:24px 0">
          ${code}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }
}

const requestCode = async (email: string) => {
  await ensureTables()

  const [recentCode] = await sql`
    SELECT last_sent_at
    FROM bbs_auth_codes
    WHERE email = ${email}
      AND last_sent_at > NOW() - INTERVAL '45 seconds'
  `

  if (recentCode) {
    return json(
      { error: 'Wait 45 seconds before requesting another code.' },
      429,
    )
  }

  const code = String(randomInt(1000, 10000))

  await sql`
    INSERT INTO bbs_auth_codes
      (email, code_hash, expires_at, attempts, last_sent_at)
    VALUES
      (
        ${email},
        ${hash(`${email}:${code}`)},
        NOW() + INTERVAL '10 minutes',
        0,
        NOW()
      )
    ON CONFLICT (email) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      attempts = 0,
      last_sent_at = NOW()
  `

  try {
    await sendCodeEmail(email, code)
  } catch (error) {
    await sql`
      DELETE FROM bbs_auth_codes
      WHERE email = ${email}
    `
    throw error
  }

  return json({
    message: 'A four-digit code was sent to your email.',
  })
}

const verifyCode = async (email: string, code: string) => {
  if (!/^\d{4}$/.test(code)) {
    return json(
      { error: 'Enter the four-digit code from your email.' },
      422,
    )
  }

  await ensureTables()

  const [verifiedCode] = await sql`
    DELETE FROM bbs_auth_codes
    WHERE email = ${email}
      AND code_hash = ${hash(`${email}:${code}`)}
      AND expires_at > NOW()
      AND attempts < 5
    RETURNING email
  `

  if (!verifiedCode) {
    const [failedCode] = await sql`
      UPDATE bbs_auth_codes
      SET attempts = attempts + 1
      WHERE email = ${email}
        AND expires_at > NOW()
        AND attempts < 5
      RETURNING attempts
    `

    if (!failedCode) {
      return json(
        { error: 'This code expired. Request a new four-digit code.' },
        401,
      )
    }

    return json(
      { error: 'That four-digit code is incorrect.' },
      401,
    )
  }

  const [existingUser] = await sql`
    SELECT id, email
    FROM bbs_users
    WHERE email = ${email}
  `

  const user: BbsUser = existingUser ?? {
    id: randomBytes(16).toString('hex'),
    email,
  }

  if (!existingUser) {
    await sql`
      INSERT INTO bbs_users (id, email)
      VALUES (${user.id}, ${user.email})
    `
  }

  const sessionToken = randomBytes(32).toString('base64url')
  const tokenHash = hash(sessionToken)

  await sql`
    INSERT INTO bbs_sessions
      (token_hash, user_id, expires_at)
    VALUES
      (${tokenHash}, ${user.id}, NOW() + INTERVAL '30 days')
  `

  return new Response(
    JSON.stringify({ user }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': [
          `bbs_session=${sessionToken}`,
          'Path=/',
          'HttpOnly',
          'SameSite=Lax',
          'Max-Age=2592000',
        ].join('; '),
      },
    },
  )
}

export const Route = createFileRoute('/api/builder-auth')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json() as {
            action?: AuthAction
            email?: string
            code?: string
          }

          const email = normalizeEmail(body.email)

          if (!validEmail(email)) {
            return json(
              { error: 'Enter a valid email address.' },
              422,
            )
          }

          if (body.action === 'request-code') {
            return await requestCode(email)
          }

          if (body.action === 'verify-code') {
            return await verifyCode(
              email,
              String(body.code ?? '').trim(),
            )
          }

          return json(
            { error: 'Unknown authentication action.' },
            400,
          )
        } catch (error) {
          console.error('BBS AUTH ERROR:', error)

          return json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : 'Authentication failed.',
            },
            500,
          )
        }
      },
    },
  },
})
