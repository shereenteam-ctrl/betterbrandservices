import { createFileRoute } from '@tanstack/react-router'
import { Resend } from 'resend'

/**
 * Contact form submission handler.
 *
 * Customer fills form -> this route -> Resend API -> info@betterbrandservices.com
 *
 * RESEND_API_KEY is read from the server environment only and is never
 * sent to the browser.
 */

const RECIPIENT = 'info@betterbrandservices.com'
const FROM = 'Better Brand Services <info@betterbrandservices.com>'

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

const json = (body: unknown, status = 200) => Response.json(body, { status })

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          // Honeypot: real visitors never fill this hidden field in.
          if (String(formData.get('bot-field') || '').trim()) {
            // Report success to the bot without sending an email.
            return json({ success: true })
          }

          const name = String(formData.get('name') || '').trim()
          const email = String(formData.get('email') || '').trim()
          const phone = String(formData.get('phone') || '').trim()
          const service = String(formData.get('service') || '').trim()
          const message = String(formData.get('message') || '').trim()

          if (!name || !email || !service || !message) {
            return json({ error: 'Name, email, service, and message are required.' }, 422)
          }
          if (!isValidEmail(email)) {
            return json({ error: 'Enter a valid email address.' }, 422)
          }

          await getResend().emails.send({
            from: FROM,
            to: RECIPIENT,
            replyTo: email,
            subject: `New inquiry from ${name} — ${service}`,
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>New project inquiry</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : 'Not provided'}</p>
                <p><strong>Service:</strong> ${escapeHtml(service)}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
              </div>
            `,
          })

          return json({ success: true })
        } catch (error) {
          console.error('[CONTACT FORM ERROR]', error)
          return json({ error: 'The inquiry could not be sent. Please try again.' }, 502)
        }
      },
    },
  },
})
