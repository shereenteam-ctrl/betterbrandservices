import { Resend } from 'resend'

/**
 * Domain status notifications. Reuses the same Resend account already
 * configured for sign-in codes (RESEND_API_KEY) — no new service, no new
 * env var. Sends are best-effort: a failed notification never blocks the
 * domain-verification response itself.
 */

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'Better Brand Services <info@betterbrandservices.com>'

export async function notifyDomainConnected(params: { to: string; hostname: string }) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: params.to,
      subject: `${params.hostname} is connected`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Your domain is live</h2>
          <p><strong>${params.hostname}</strong> is now connected and pointing at your published website.</p>
          <p>HTTPS provisioning happens automatically and can take up to an hour to finish.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('[DOMAIN NOTIFY] connected email failed:', error)
  }
}

export async function notifyDomainNeedsAttention(params: {
  to: string
  hostname: string
  reason: string
}) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: params.to,
      subject: `${params.hostname} needs attention`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Domain verification didn't pass yet</h2>
          <p><strong>${params.hostname}</strong> is not resolving correctly yet.</p>
          <p>${params.reason}</p>
          <p>Double-check the DNS record at your registrar, then verify again from the Domains tab.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('[DOMAIN NOTIFY] needs-attention email failed:', error)
  }
}
