/**
 * Publishing backend — GitHub Pages.
 *
 * Every generated website publishes as its own public GitHub repository
 * with GitHub Pages enabled on it. No Netlify account, API, or dependency
 * is involved anywhere in this path.
 *
 * Configure with:
 *   GITHUB_TOKEN    (required — a GitHub personal access token with the
 *                    "repo" scope, so it can create repos and write files)
 *   GITHUB_OWNER     (required — the GitHub username or org repos are
 *                    created under)
 *
 * Nothing here is simulated: if either variable is missing, publish calls
 * fail loudly with a clear configuration error instead of pretending to
 * succeed.
 */

const GITHUB_API = 'https://api.github.com'

export class PublishConfigError extends Error {}
export class PublishError extends Error {}

const getConfig = () => {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  if (!token || !owner) {
    throw new PublishConfigError(
      'Publishing is not configured. Set GITHUB_TOKEN (a GitHub personal access token with the "repo" scope) and GITHUB_OWNER (your GitHub username or org) to enable deployments.',
    )
  }
  return { token, owner }
}

const githubFetch = async (path: string, init: RequestInit = {}) => {
  const { token } = getConfig()
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return response
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'bbs-site'

const toBase64 = (value: string) => Buffer.from(value, 'utf-8').toString('base64')

/**
 * Creates a dedicated public repo for a project the first time it is
 * published. Reuses the same repo (passed in as `existingRepo`) on every
 * later publish so the URL stays stable.
 */
async function ensureRepo(params: {
  projectId: string
  projectName: string
  existingRepo: string | null
}): Promise<{ repo: string; defaultBranch: string }> {
  const { owner } = getConfig()

  if (params.existingRepo) {
    const response = await githubFetch(`/repos/${owner}/${params.existingRepo}`)
    if (response.ok) {
      const site = (await response.json()) as { name: string; default_branch: string }
      return { repo: site.name, defaultBranch: site.default_branch }
    }
    // Fall through and create a fresh repo if the stored one is gone.
  }

  const name = `${slugify(params.projectName)}-${params.projectId.slice(0, 8)}`
  const response = await githubFetch('/user/repos', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name,
      description: `Published by Better Brand Services — ${params.projectName}`,
      private: false,
      auto_init: true,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new PublishError(`GitHub could not create the repository (${response.status}): ${body.slice(0, 300)}`)
  }

  const repo = (await response.json()) as { name: string; default_branch: string }
  return { repo: repo.name, defaultBranch: repo.default_branch }
}

/**
 * Writes index.html to the repo's default branch via the Contents API,
 * creating or updating it as needed.
 */
async function writeIndexHtml(params: { owner: string; repo: string; branch: string; html: string }) {
  const existing = await githubFetch(
    `/repos/${params.owner}/${params.repo}/contents/index.html?ref=${params.branch}`,
  )
  const existingSha = existing.ok ? ((await existing.json()) as { sha: string }).sha : undefined

  const response = await githubFetch(`/repos/${params.owner}/${params.repo}/contents/index.html`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: existingSha ? 'Update site via BBS AI' : 'Publish site via BBS AI',
      content: toBase64(params.html),
      branch: params.branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new PublishError(`GitHub could not write index.html (${response.status}): ${body.slice(0, 300)}`)
  }
}

/**
 * Enables GitHub Pages for the repo (idempotent — a 409 means it's already
 * enabled, which is fine) and returns the resulting Pages URL.
 */
async function enablePages(params: { owner: string; repo: string; branch: string }): Promise<string> {
  const response = await githubFetch(`/repos/${params.owner}/${params.repo}/pages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ source: { branch: params.branch, path: '/' } }),
  })

  if (!response.ok && response.status !== 409) {
    const body = await response.text().catch(() => '')
    throw new PublishError(`GitHub could not enable Pages (${response.status}): ${body.slice(0, 300)}`)
  }

  return `https://${params.owner.toLowerCase()}.github.io/${params.repo}/`
}

export async function publishProject(params: {
  projectId: string
  projectName: string
  existingSiteId: string | null
  html: string
}) {
  const { owner } = getConfig()
  const { repo, defaultBranch } = await ensureRepo({
    projectId: params.projectId,
    projectName: params.projectName,
    existingRepo: params.existingSiteId,
  })

  await writeIndexHtml({ owner, repo, branch: defaultBranch, html: params.html })
  const publishedUrl = await enablePages({ owner, repo, branch: defaultBranch })

  return {
    siteId: repo,
    publishedUrl,
    deployId: repo,
    status: 'published',
    defaultDomain: `${owner.toLowerCase()}.github.io`,
  }
}

/**
 * Registers a custom domain on the repo's GitHub Pages site. DNS pointing
 * correctly is a prerequisite for this, not a substitute — GitHub will not
 * provision HTTPS for a domain whose DNS doesn't actually resolve to it yet.
 */
export async function attachDomain(params: {
  siteId: string
  hostname: string
}): Promise<{ attached: boolean; message: string }> {
  const { owner } = getConfig()

  const response = await githubFetch(`/repos/${owner}/${params.siteId}/pages`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cname: params.hostname }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new PublishError(
      `GitHub could not attach ${params.hostname} (${response.status}): ${body.slice(0, 300)}`,
    )
  }

  return {
    attached: true,
    message: 'Domain attached. GitHub provisions HTTPS automatically once it confirms DNS — this can take up to an hour.',
  }
}
