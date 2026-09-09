import { resolveCname, resolve4 } from 'node:dns/promises'

/**
 * Real DNS verification for custom domains pointed at GitHub Pages. This
 * performs actual DNS lookups against public resolvers — it never
 * fabricates a "connected" status. A domain only becomes `connected` once
 * its DNS records genuinely point at GitHub Pages.
 */

export type DomainCheckResult = {
  status: 'connected' | 'pending' | 'needs_configuration'
  recordType: 'CNAME' | 'A'
  expectedTarget: string
  foundRecords: string[]
  message: string
}

// GitHub Pages' current documented apex IPs (docs.github.com).
const GITHUB_PAGES_IPS = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153']

const isApexDomain = (hostname: string) => hostname.split('.').length === 2

/**
 * GitHub Pages requires A records at its four IPs for an apex/root domain
 * (DNS forbids a CNAME at the zone apex), or a CNAME to `<owner>.github.io`
 * for a subdomain.
 */
export const buildDnsInstructions = (hostname: string, targetSubdomain: string) => {
  if (isApexDomain(hostname)) {
    return {
      recordType: 'A' as const,
      name: '@',
      value: GITHUB_PAGES_IPS.join(', '),
      note: 'Apex/root domains cannot use a CNAME. Add all four A records at your registrar, one per GitHub Pages IP address.',
    }
  }

  return {
    recordType: 'CNAME' as const,
    name: hostname.split('.')[0],
    value: targetSubdomain,
    note: 'Add a CNAME record pointing this subdomain at your published GitHub Pages site.',
  }
}

export async function checkDomain(
  hostname: string,
  expectedTarget: string,
): Promise<DomainCheckResult> {
  const apex = isApexDomain(hostname)

  try {
    if (apex) {
      const addresses = await resolve4(hostname)
      const connected = addresses.some((address) => GITHUB_PAGES_IPS.includes(address))
      return {
        status: connected ? 'connected' : 'pending',
        recordType: 'A',
        expectedTarget: GITHUB_PAGES_IPS.join(', '),
        foundRecords: addresses,
        message: connected
          ? 'DNS is pointed at GitHub Pages. HTTPS provisioning follows automatically.'
          : 'DNS was resolved but does not yet point at GitHub Pages.',
      }
    }

    const records = await resolveCname(hostname)
    const connected = records.some((record) =>
      record.toLowerCase().includes(expectedTarget.toLowerCase()),
    )
    return {
      status: connected ? 'connected' : 'pending',
      recordType: 'CNAME',
      expectedTarget,
      foundRecords: records,
      message: connected
        ? 'DNS is pointed at GitHub Pages. HTTPS provisioning follows automatically.'
        : 'A CNAME was found but does not point at the expected target yet.',
    }
  } catch {
    return {
      status: 'needs_configuration',
      recordType: apex ? 'A' : 'CNAME',
      expectedTarget: apex ? GITHUB_PAGES_IPS.join(', ') : expectedTarget,
      foundRecords: [],
      message: 'No matching DNS record was found yet. Add the record shown below at your registrar.',
    }
  }
}
