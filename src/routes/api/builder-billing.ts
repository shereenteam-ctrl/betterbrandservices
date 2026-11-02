
import { neon } from '@neondatabase/serverless'
import { createFileRoute } from '@tanstack/react-router'
import { getAuthenticatedUser } from './builder-auth'

const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing.')
  }

  return neon(databaseUrl)
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status })

const plans = {
  starter: {
    name: 'Starter',
    price: 19,
    monthlyCredits: 2000,
  },
  pro: {
    name: 'Pro',
    price: 39,
    monthlyCredits: 5000,
  },
  business: {
    name: 'Business',
    price: 79,
    monthlyCredits: 10000,
  },
} as const

const ensureBillingTable = async () => {
  const sql = getDatabase()

  await sql`
    CREATE TABLE IF NOT EXISTS bbs_subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_provider TEXT,
      provider_subscription_id TEXT UNIQUE,
      current_period_start TIMESTAMPTZ,
      current_period_end TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export const Route = createFileRoute('/api/builder-billing')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getAuthenticatedUser(request)

          if (!user) {
            return json({ error: 'Please sign in to access billing.' }, 401)
          }

          await ensureBillingTable()

          const sql = getDatabase()

          const [subscription] = await sql`
            SELECT plan, status, payment_provider,
                   current_period_start, current_period_end
            FROM bbs_subscriptions
            WHERE user_id = ${user.id}
            LIMIT 1
          `

          return json({
            plans,
            subscription: subscription || null,
          })
        } catch (error: any) {
          console.error('[BBS BILLING GET ERROR]:', error)

          return json(
            { error: error?.message || 'Could not load billing information.' },
            500,
          )
        }
      },
    },
  },
})
