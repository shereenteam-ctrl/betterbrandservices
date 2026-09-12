import { Resend } from 'resend'
import { createFileRoute } from '@tanstack/react-router'

const resend = new Resend(process.env.RESEND_API_KEY)

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!process.env.RESEND_API_KEY) {
            return Response.json(
              { error: 'RESEND_API_KEY is missing.' },
              { status: 500 },
            )
          }

          const formData = await request.formData()

          const name = String(formData.get('name') ?? '').trim()
          const email = String(formData.get('email') ?? '').trim()
          const phone = String(formData.get('phone') ?? '').trim()
          const service = String(formData.get('service') ?? '').trim()
          const message = String(formData.get('message') ?? '').trim()

          if (!name || !email || !service || !message) {
            return Response.json(
              { error: 'Please complete all required fields.' },
              { status: 422 },
            )
          }

          const result = await resend.emails.send({
            from: 'Better Brand Services <info@betterbrandservices.com>',
            to: 'info@betterbrandservices.com',
            replyTo: email,
            subject: `New BBS inquiry — ${service}`,
            html: `
              <h2>New Better Brand Services Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Service:</strong> ${service}</p>
              <h3>Message</h3>
              <p style="white-space:pre-wrap">${message}</p>
            `,
          })

          if (result.error) {
            throw new Error(result.error.message)
          }

          return Response.json({
            success: true,
            message: 'Your inquiry was sent successfully.',
          })
        } catch (error) {
          console.error('Contact form error:', error)

          return Response.json(
            { error: 'Unable to send your inquiry.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
