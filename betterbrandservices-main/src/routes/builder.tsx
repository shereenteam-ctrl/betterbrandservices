import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Code2,
  Copy,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  FileCode2,
  FolderGit2,
  Globe2,
  Import,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Monitor,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Rocket,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  getUser,
  handleAuthCallback,
  logout,
  type User,
} from '@netlify/identity'
import { useEffect, useState, type FormEvent } from 'react'

import '../builder.css'

export const Route = createFileRoute('/builder')({
  head: () => ({
    meta: [
      { title: 'BBS AI Builder | Better Brand Services' },
      {
        name: 'description',
        content: 'Build, manage, and prepare websites for deployment in the BBS AI Builder workspace.',
      },
    ],
  }),
  component: BuilderPage,
})

type AuthState = 'checking' | 'email' | 'code' | 'authenticated'
type PlatformTab = 'projects' | 'builder' | 'domains' | 'deployments' | 'settings'
type BuilderStage = 'landing' | 'create' | 'workspace'
type ProviderId = 'bbs-ai'

type Project = {
  id: string
  name: string
  initial_prompt: string
  provider: ProviderId
  status: string
  published_url: string | null
  custom_domain: string | null
  created_at: string
  updated_at: string
}

type Domain = {
  id: string
  project_id: string | null
  hostname: string
  status: 'pending_setup' | 'connected' | 'needs_configuration'
  created_at: string
  updated_at: string
}

type Deployment = {
  id: string
  project_id: string
  project_name: string
  status: 'building' | 'deploying' | 'published' | 'failed'
  published_url: string | null
  is_latest: boolean
  created_at: string
}

type BuilderMessage = {
  id: string
  project_id: string
  role: 'user' | 'assistant'
  content: string
  status: 'queued' | 'processing' | 'complete' | 'failed'
  created_at: string
}

type WorkspaceData = {
  projects: Project[]
  domains: Domain[]
  deployments: Deployment[]
  messages: BuilderMessage[]
}

const emptyWorkspace: WorkspaceData = { projects: [], domains: [], deployments: [], messages: [] }

const navItems: Array<{ id: PlatformTab; label: string; icon: LucideIcon }> = [
  { id: 'projects', label: 'Projects', icon: LayoutDashboard },
  { id: 'builder', label: 'AI Builder', icon: WandSparkles },
  { id: 'domains', label: 'Domains', icon: Globe2 },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const providers: Array<{ id: ProviderId; name: string; description: string; badge?: string }> = [
  { id: 'bbs-ai', name: 'BBS AI', description: 'The autonomous BBS engine that plans, builds, and revises your entire website.', badge: 'BBS Engine' },
]

function BuilderPage() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const callback = await handleAuthCallback()
        if (callback?.user) {
          setUser(callback.user)
          setAuthState('authenticated')
          return
        }
      } catch {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }

      const currentUser = await getUser()
      setUser(currentUser)
      setAuthState(currentUser ? 'authenticated' : 'email')
    }

    void restoreSession()
  }, [])

  if (authState === 'checking') return <BuilderLoading />
  if (!user || authState !== 'authenticated') {
    return <AuthPortal authState={authState} onStateChange={setAuthState} onAuthenticated={setUser} />
  }

  return <Platform user={user} onLogout={() => setUser(null)} />
}

function BuilderLoading() {
  return (
    <main className="builder-loading">
      <div className="builder-loading-mark"><Sparkles size={24} /></div>
      <strong>BBS AI Builder</strong>
      <span>Securing your workspace</span>
    </main>
  )
}

function AuthPortal({
  authState,
  onStateChange,
  onAuthenticated,
}: {
  authState: AuthState
  onStateChange: (state: AuthState) => void
  onAuthenticated: (user: User) => void
}) {
  const [email, setEmail] = useState(() => sessionStorage.getItem('bbs-auth-email') ?? '')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'resending'>('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const authRequest = async (body: Record<string, string>) => {
    const response = await fetch('/api/builder-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await response.json() as { error?: string; message?: string; user?: User }
    if (!response.ok) throw new Error(result.error ?? 'The email verification request failed.')
    return result
  }

  const sendCode = async (resending = false) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setStatus(resending ? 'resending' : 'sending')
    setError('')
    setNotice('')

    try {
      const result = await authRequest({ action: 'request-code', email: normalizedEmail })
      sessionStorage.setItem('bbs-auth-email', normalizedEmail)
      onStateChange('code')
      setNotice(resending ? 'A fresh four-digit code was sent. Only the newest code works.' : result.message ?? 'Check your inbox for your four-digit code.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The verification email could not be sent. Try again.')
    } finally {
      setStatus('idle')
    }
  }

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault()
    const token = code.trim()
    if (!/^\d{4}$/.test(token)) {
      setError('Enter the four-digit code from your email.')
      return
    }

    setStatus('verifying')
    setError('')
    setNotice('')

    try {
      const result = await authRequest({ action: 'verify-code', email: email.trim().toLowerCase(), code: token })
      if (!result.user) throw new Error('The code was verified, but the session could not be opened.')

      sessionStorage.removeItem('bbs-auth-email')
      onAuthenticated(result.user)
      onStateChange('authenticated')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The code could not be verified. Try again.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="auth-back" href="/"><ArrowLeft size={16} /> Better Brand Services</a>
        <div className="auth-story-copy">
          <span className="auth-kicker"><Sparkles size={14} /> BBS AI Builder</span>
          <h1>Ideas become<br /><em>live systems.</em></h1>
          <p>Plan, build, manage, and prepare your next website for deployment from one focused workspace.</p>
          <div className="auth-proof-grid">
            <span><ShieldCheck size={18} /> Secure email-code access</span>
            <span><Database size={18} /> Persistent project drafts</span>
            <span><Cloud size={18} /> Deployment-ready architecture</span>
          </div>
        </div>
        <div className="auth-orbit" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo"><img src="/compact-logo.png" alt="BBS" /><span>BBS AI Builder</span></div>
          {authState === 'email' ? (
            <form onSubmit={(event) => { event.preventDefault(); void sendCode() }}>
              <span className="auth-step">Secure access · Step 1 of 2</span>
              <h2>Enter your email</h2>
              <p>New users are registered automatically. Existing users receive a secure login code.</p>
              <label htmlFor="builder-email">Email address</label>
              <input
                id="builder-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
                required
              />
              {error && <InlineNotice kind="error" message={error} />}
              <button className="auth-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? <><LoaderCircle className="spin" size={18} /> Sending code</> : <>Continue with Email <ArrowRight size={18} /></>}
              </button>
              <small className="auth-privacy">No password required. Access is verified by email.</small>
            </form>
          ) : (
            <form onSubmit={verifyCode}>
              <span className="auth-step">Secure access · Step 2 of 2</span>
              <h2>Enter your code</h2>
              <p>We sent a four-digit verification code to <strong>{email}</strong>.</p>
              <label htmlFor="builder-code">4-digit verification code</label>
              <input
                id="builder-code"
                className="auth-code-input"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                autoComplete="one-time-code"
                autoFocus
                required
              />
              {notice && <InlineNotice kind="success" message={notice} />}
              {error && <InlineNotice kind="error" message={error} />}
              <button className="auth-submit" type="submit" disabled={status === 'verifying'}>
                {status === 'verifying' ? <><LoaderCircle className="spin" size={18} /> Verifying</> : <>Verify & Open Builder <ArrowRight size={18} /></>}
              </button>
              <div className="auth-code-actions">
                <button type="button" onClick={() => void sendCode(true)} disabled={status === 'resending'}>
                  {status === 'resending' ? 'Sending…' : 'Resend Code'}
                </button>
                <button type="button" onClick={() => { onStateChange('email'); setCode(''); setError(''); setNotice('') }}>Change Email</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

function InlineNotice({ kind, message }: { kind: 'error' | 'success'; message: string }) {
  return <div className={`inline-notice ${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{kind === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}{message}</div>
}

function Platform({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<PlatformTab>('projects')
  const [builderStage, setBuilderStage] = useState<BuilderStage>('landing')
  const [workspace, setWorkspace] = useState<WorkspaceData>(emptyWorkspace)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [workspaceError, setWorkspaceError] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const activeProject = workspace.projects.find((project) => project.id === activeProjectId) ?? null
  const credits = typeof user.userMetadata?.ai_credits === 'number' ? user.userMetadata.ai_credits : 0

  const loadWorkspace = async () => {
    setLoading(true)
    setWorkspaceError('')
    try {
      const response = await fetch('/api/builder-workspace')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Workspace data is unavailable.')
      setWorkspace({
        projects: data.projects ?? [],
        domains: data.domains ?? [],
        deployments: data.deployments ?? [],
        messages: data.messages ?? [],
      })
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : 'Workspace data is unavailable.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadWorkspace() }, [])

  const selectTab = (tab: PlatformTab) => {
    setActiveTab(tab)
    setMobileNavOpen(false)
    if (tab === 'builder' && builderStage === 'workspace' && !activeProject) setBuilderStage('landing')
  }

  const openProject = (project: Project) => {
    setActiveProjectId(project.id)
    setActiveTab('builder')
    setBuilderStage('workspace')
  }

  const addWebsite = () => {
    setActiveTab('builder')
    setBuilderStage('create')
  }

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  return (
    <main className="platform-shell">
      <aside className={`platform-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="platform-brand"><img src="/compact-logo.png" alt="BBS" /><span><strong>BBS</strong><small>AI Builder</small></span></div>
        <nav aria-label="Builder navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => selectTab(id)}><Icon size={18} />{label}{id === 'deployments' && workspace.deployments.length > 0 && <b>{workspace.deployments.length}</b>}</button>
          ))}
        </nav>
        <div className="sidebar-system">
          <span><i /> Platform status</span>
          <strong>Workspace online</strong>
          <small>BBS AI is active. Deployment requires connection.</small>
        </div>
        <a className="sidebar-back" href="/"><ArrowLeft size={16} /> Back to BBS</a>
      </aside>

      <section className="platform-main">
        <header className="platform-header">
          <button className="mobile-platform-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle dashboard navigation">{mobileNavOpen ? <X /> : <Menu />}</button>
          <div className="platform-heading"><span>Workspace</span><strong>{navItems.find((item) => item.id === activeTab)?.label}</strong></div>
          <div className="platform-header-actions">
            <div className="credit-balance"><Zap size={15} fill="currentColor" /><span><strong>{credits.toLocaleString()}</strong> Credits</span></div>
            <button className="user-menu" title={user.email}><span>{(user.email?.[0] ?? 'B').toUpperCase()}</span><span className="user-menu-copy"><strong>{user.name || 'BBS Creator'}</strong><small>{user.email}</small></span></button>
            <button className="icon-button" onClick={() => void handleLogout()} title="Log out"><LogOut size={18} /></button>
          </div>
        </header>

        <div className="platform-content">
          {workspaceError && <div className="platform-alert"><AlertCircle size={18} /><div><strong>Workspace connection needs attention</strong><span>{workspaceError}</span></div><button onClick={() => void loadWorkspace()}>Retry</button></div>}
          {activeTab === 'projects' && <ProjectsView projects={workspace.projects} loading={loading} onAdd={addWebsite} onOpen={openProject} onSettings={() => selectTab('settings')} />}
          {activeTab === 'builder' && (
            <BuilderView
              stage={builderStage}
              setStage={setBuilderStage}
              projects={workspace.projects}
              activeProject={activeProject}
              messages={workspace.messages.filter((message) => message.project_id === activeProjectId)}
              onProjectCreated={(project) => {
                setWorkspace((current) => ({ ...current, projects: [project.project, ...current.projects], messages: [...current.messages, project.userMessage, project.generatedMessage] }))
                setActiveProjectId(project.project.id)
                setBuilderStage('workspace')
              }}
              onMessagesAdded={(messages) => setWorkspace((current) => ({ ...current, messages: [...current.messages, ...messages] }))}
              onOpenProject={openProject}
            />
          )}
          {activeTab === 'domains' && <DomainsView domains={workspace.domains} projects={workspace.projects} onDomainAdded={(domain) => setWorkspace((current) => ({ ...current, domains: [domain, ...current.domains] }))} />}
          {activeTab === 'deployments' && <DeploymentsView deployments={workspace.deployments} />}
          {activeTab === 'settings' && <SettingsView user={user} />}
        </div>
      </section>
    </main>
  )
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function ProjectsView({ projects, loading, onAdd, onOpen, onSettings }: { projects: Project[]; loading: boolean; onAdd: () => void; onOpen: (project: Project) => void; onSettings: () => void }) {
  return (
    <section>
      <PageIntro eyebrow="Project command center" title="My Websites" description="Create, organize, and reopen every BBS website workspace." action={<button className="primary-action" onClick={onAdd}><Plus size={18} /> Add New Website</button>} />
      <div className="stat-strip">
        <Stat icon={FolderGit2} value={String(projects.length)} label="Websites" />
        <Stat icon={Activity} value={String(projects.filter((project) => project.status === 'published').length)} label="Published" />
        <Stat icon={Globe2} value={String(projects.filter((project) => project.custom_domain).length)} label="Custom domains" />
        <Stat icon={Zap} value="0" label="Active builds" />
      </div>
      {loading ? <ProjectSkeletons /> : projects.length === 0 ? (
        <div className="empty-projects">
          <div className="empty-project-visual"><span /><span /><span /><Sparkles size={28} /></div>
          <span className="section-tag">Your first build starts here</span>
          <h2>No websites yet</h2>
          <p>Start from an idea or prepare an existing project for the BBS deployment workflow.</p>
          <button className="primary-action" onClick={onAdd}>Add New Website <ArrowRight size={18} /></button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.id}>
              <button className="project-preview" onClick={() => onOpen(project)} aria-label={`Edit ${project.name}`}>
                <div className={`preview-art preview-art-${(index % 3) + 1}`}><span className="preview-nav" /><strong>{project.name}</strong><span className="preview-copy" /><span className="preview-button" /></div>
                <span className={`project-status ${project.status}`}><i /> {project.status === 'published' ? 'Published' : 'Draft'}</span>
              </button>
              <div className="project-card-body">
                <div><h2>{project.name}</h2><p>{project.custom_domain || project.published_url || 'No published domain'}</p></div>
                <button className="more-button" aria-label="Project menu"><MoreHorizontal /></button>
                <div className="project-meta"><span>Updated {formatDate(project.updated_at)}</span><span>{providerName(project.provider)}</span></div>
                <div className="project-actions"><button onClick={() => onOpen(project)}><WandSparkles size={15} /> Edit</button><button disabled title="Connect a deployment provider to publish"><Rocket size={15} /> Deploy</button><button onClick={onSettings} aria-label="Project settings"><Settings size={15} /></button></div>
              </div>
            </article>
          ))}
          <button className="add-project-card" onClick={onAdd}><Plus size={22} /><strong>Add New Website</strong><span>Import or build with AI</span></button>
        </div>
      )}
    </section>
  )
}

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return <div className="platform-stat"><Icon size={17} /><div><strong>{value}</strong><span>{label}</span></div></div>
}

function ProjectSkeletons() {
  return <div className="project-grid" aria-label="Loading projects">{[1, 2, 3].map((item) => <div className="project-skeleton" key={item}><span /><i /><i /></div>)}</div>
}

function BuilderView({
  stage,
  setStage,
  projects,
  activeProject,
  messages,
  onProjectCreated,
  onMessagesAdded,
  onOpenProject,
}: {
  stage: BuilderStage
  setStage: (stage: BuilderStage) => void
  projects: Project[]
  activeProject: Project | null
  messages: BuilderMessage[]
  onProjectCreated: (result: { project: Project; userMessage: BuilderMessage; generatedMessage: BuilderMessage }) => void
  onMessagesAdded: (messages: BuilderMessage[]) => void
  onOpenProject: (project: Project) => void
}) {
  if (stage === 'workspace' && activeProject) return <BuilderWorkspace project={activeProject} messages={messages} onMessagesAdded={onMessagesAdded} />
  if (stage === 'create') return <CreateWebsite onBack={() => setStage('landing')} onCreated={onProjectCreated} />

  return (
    <section>
      <PageIntro eyebrow="Creation engine" title="AI Builder" description="Start a new website or continue refining an existing project." action={<button className="primary-action" onClick={() => setStage('create')}><Plus size={18} /> Add New Website</button>} />
      <div className="builder-launch-grid">
        <button className="launch-card flagship" onClick={() => setStage('create')}><span className="launch-icon"><Sparkles /></span><small>Flagship workflow</small><h2>Build with BBS AI</h2><p>Turn a clear business brief into a structured website project and continue iterating in one workspace.</p><span className="launch-link">Start a build <ArrowRight size={17} /></span></button>
        <button className="launch-card" onClick={() => setStage('create')}><span className="launch-icon"><Import /></span><small>Bring your code</small><h2>Import a project</h2><p>Prepare a repository or project package for future build and deployment integrations.</p><span className="launch-link">Open importer <ArrowRight size={17} /></span></button>
      </div>
      {projects.length > 0 && <div className="recent-projects"><div className="subsection-heading"><h2>Continue building</h2><span>{projects.length} projects</span></div>{projects.slice(0, 4).map((project) => <button key={project.id} onClick={() => onOpenProject(project)}><span className="recent-project-icon"><Monitor size={18} /></span><span><strong>{project.name}</strong><small>{formatDate(project.updated_at)} · {providerName(project.provider)}</small></span><ChevronRight size={18} /></button>)}</div>}
    </section>
  )
}

function CreateWebsite({ onBack, onCreated }: { onBack: () => void; onCreated: (result: { project: Project; userMessage: BuilderMessage; generatedMessage: BuilderMessage }) => void }) {
  const [method, setMethod] = useState<'ai' | 'import'>('ai')
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')
  const [error, setError] = useState('')
  const [importName, setImportName] = useState('')

  const buildWebsite = async () => {
    if (prompt.trim().length < 12) { setError('Describe the website in at least 12 characters.'); return }
    setStatus('saving')
    setError('')
    const name = inferProjectName(prompt)
    try {
      const response = await fetch('/api/builder-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-project', prompt, provider: 'bbs-ai', name }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The project could not be created.')
      onCreated({ project: data.project, userMessage: data.userMessage, generatedMessage: data.generatedMessage })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The project could not be created.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <section className="create-flow">
      <button className="text-back" onClick={onBack}><ArrowLeft size={16} /> Back to AI Builder</button>
      <div className="create-heading"><span className="section-tag">New website</span><h1>How do you want to start?</h1><p>Build from a business idea or prepare an existing codebase for import.</p></div>
      <div className="method-tabs"><button className={method === 'ai' ? 'active' : ''} onClick={() => setMethod('ai')}><Sparkles size={18} /> Build with AI</button><button className={method === 'import' ? 'active' : ''} onClick={() => setMethod('import')}><Import size={18} /> Import existing project</button></div>
      {method === 'ai' ? (
        <div className="prompt-studio">
          <div className="prompt-main">
            <div className="subsection-heading"><div><span>Project brief</span><h2>What do you want to build?</h2></div><span>{prompt.length} / 4,000</span></div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value.slice(0, 4000))} placeholder="Describe your website or business idea..." aria-label="Describe your website or business idea" />
            <div className="prompt-example"><Sparkles size={16} /><span>Try:</span> “Build a modern website for my plumbing company with Home, Services, About, Reviews, and Contact pages.”</div>
            {error && <InlineNotice kind="error" message={error} />}
            {status === 'saving' && <BuildProgress />}
            <button className="build-button" onClick={() => void buildWebsite()} disabled={status === 'saving'}>{status === 'saving' ? <><LoaderCircle className="spin" /> BBS AI is building</> : <>Build with BBS AI <ArrowRight /></>}</button>
            <p className="integration-honesty"><ShieldCheck size={15} /> BBS AI plans, writes, and saves a complete responsive website in your workspace.</p>
          </div>
          <EnginePanel />
        </div>
      ) : (
        <div className="import-panel">
          <span className="import-icon"><FolderGit2 /></span><h2>Import an existing project</h2><p>Select a project archive to stage it for a future repository and deployment connection.</p>
          <label className="file-picker"><input type="file" accept=".zip,.tar,.gz" onChange={(event) => setImportName(event.target.files?.[0]?.name ?? '')} /><Import size={18} /> Choose project archive</label>
          {importName && <div className="selected-file"><CheckCircle2 size={17} /><span><strong>{importName}</strong><small>Selected locally · upload backend not connected</small></span></div>}
          <div className="connection-note"><AlertCircle size={18} /><span><strong>Import service required</strong>The file remains on this device. Connect secure object storage and repository processing before imports can be uploaded.</span></div>
        </div>
      )}
    </section>
  )
}

const buildStages = ['Understanding request', 'Planning website', 'Creating pages', 'Building components', 'Applying design', 'Connecting functionality', 'Testing project', 'Ready'] as const

function BuildProgress() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, buildStages.length - 2)), 1400)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <div className="build-progress" role="status" aria-live="polite">
      <span className="section-tag"><Sparkles size={13} /> BBS AI is working</span>
      <ul>
        {buildStages.slice(0, buildStages.length - 1).map((stage, index) => (
          <li key={stage} className={index < step ? 'done' : index === step ? 'active' : ''}>
            {index < step ? <Check size={14} /> : index === step ? <LoaderCircle className="spin" size={14} /> : <span className="dot" />}
            {stage}
          </li>
        ))}
      </ul>
    </div>
  )
}

function EnginePanel() {
  const engine = providers[0]
  return (
    <aside className="provider-picker">
      <span className="section-tag"><Sparkles size={13} /> Build engine</span>
      <h2>BBS AI</h2>
      <p>BBS AI is the only engine. It independently understands your idea, plans the build, writes the code, and keeps your project in context for every follow-up.</p>
      <div className="engine-card selected">
        <span className="engine-mark"><Sparkles size={16} /></span>
        <span><strong>{engine.name}</strong><small>{engine.description}</small></span>
        {engine.badge && <b>{engine.badge}</b>}
      </div>
      <ul className="engine-capabilities">
        <li><Check size={14} /> Plans pages &amp; components</li>
        <li><Check size={14} /> Writes responsive code</li>
        <li><Check size={14} /> Edits your project in place</li>
        <li><Check size={14} /> Remembers full project context</li>
      </ul>
    </aside>
  )
}

function BuilderWorkspace({ project, messages, onMessagesAdded }: { project: Project; messages: BuilderMessage[]; onMessagesAdded: (messages: BuilderMessage[]) => void }) {
  const [instruction, setInstruction] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')
  const [error, setError] = useState('')
  const [rightTab, setRightTab] = useState<'files' | 'pages' | 'settings'>('files')
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const generatedCode = messages.filter((message) => message.role === 'assistant' && message.status === 'complete').at(-1)?.content ?? ''

  const copyCode = async () => {
    if (!generatedCode) return
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const downloadCode = () => {
    if (!generatedCode) return
    const url = URL.createObjectURL(new Blob([generatedCode], { type: 'text/html' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'website'}.html`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const sendInstruction = async (event: FormEvent) => {
    event.preventDefault()
    if (instruction.trim().length < 2) return
    setStatus('saving')
    setError('')
    try {
      const response = await fetch('/api/builder-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-message', projectId: project.id, content: instruction }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The website could not be updated.')
      onMessagesAdded([data.userMessage, data.generatedMessage])
      setInstruction('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The website could not be updated.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <section className="workspace-page">
      <div className="workspace-toolbar"><div><span className="workspace-breadcrumb">AI Builder <ChevronRight size={13} /> {project.name}</span><strong>{project.name}</strong></div><div className="workspace-status"><i /> Code generated</div><button className="preview-device active"><Monitor size={17} /></button><button className="toolbar-deploy" disabled title="Connect a deployment backend first"><Rocket size={16} /> Deploy</button></div>
      <div className="workspace-grid">
        <aside className="ai-chat-panel">
          <div className="panel-heading"><span className="ai-avatar"><Sparkles size={17} /></span><div><strong>{providerName(project.provider)}</strong><small>Instruction workspace</small></div><button><MoreHorizontal size={18} /></button></div>
          <div className="chat-scroll">
            <div className="assistant-message"><span><Bot size={15} /></span><p>Your website is generated. Ask for a change, then preview, copy, or download the updated HTML.</p></div>
            {messages.map((message) => message.role === 'user' ? <div className="user-message" key={message.id}><p>{message.content}</p><small>{message.status}</small></div> : <div className="assistant-message generated" key={message.id}><span><Code2 size={15} /></span><p>Website code generated successfully.</p></div>)}
            <div className="suggestion-list"><span>Suggested next instructions</span>{['Add a pricing section.', 'Change the colors.', 'Make it mobile responsive.', 'Add a contact page.'].map((suggestion) => <button key={suggestion} onClick={() => setInstruction(suggestion)}>{suggestion}<Plus size={13} /></button>)}</div>
          </div>
          <form className="chat-composer" onSubmit={sendInstruction}><textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Tell BBS AI what to change..." /><div><span><Zap size={13} /> {status === 'saving' ? 'Generating your update…' : 'Changes regenerate the saved website'}</span><button disabled={status === 'saving'} aria-label="Generate update">{status === 'saving' ? <LoaderCircle className="spin" size={17} /> : <Send size={17} />}</button></div>{error && <small className="composer-error">{error}</small>}</form>
        </aside>

        <section className="live-preview-panel">
          <div className="preview-browser"><div className="browser-bar"><span className="browser-dots"><i /><i /><i /></span><div className="preview-mode-tabs"><button className={viewMode === 'preview' ? 'active' : ''} onClick={() => setViewMode('preview')}><Monitor size={13} /> Preview</button><button className={viewMode === 'code' ? 'active' : ''} onClick={() => setViewMode('code')}><Code2 size={13} /> Code</button></div><div className="code-actions"><button onClick={() => void copyCode()} disabled={!generatedCode}><Copy size={14} /> {copied ? 'Copied' : 'Copy'}</button><button onClick={downloadCode} disabled={!generatedCode}><Download size={14} /> Download</button><button onClick={() => setPreviewKey((key) => key + 1)} disabled={viewMode !== 'preview'} aria-label="Refresh preview"><RefreshCw size={14} /></button></div></div>{generatedCode ? viewMode === 'preview' ? <iframe key={previewKey} className="generated-preview" title={`${project.name} preview`} srcDoc={generatedCode} sandbox="allow-forms allow-modals" /> : <div className="generated-code"><div><FileCode2 size={15} /> index.html <span>{generatedCode.length.toLocaleString()} characters</span></div><pre><code>{generatedCode}</code></pre></div> : <div className="awaiting-preview"><LoaderCircle className="spin" size={25} /><small>GENERATING</small><h2>Creating your website</h2><p>The completed preview and source code appear here.</p></div>}</div>
        </section>

        <aside className="project-inspector">
          <div className="inspector-tabs">{(['files', 'pages', 'settings'] as const).map((tab) => <button key={tab} className={rightTab === tab ? 'active' : ''} onClick={() => setRightTab(tab)}>{tab}</button>)}</div>
          {rightTab === 'files' && <div className="file-tree"><div className="tree-root"><ChevronRight size={14} /><FolderGit2 size={16} /><strong>{project.name.toLowerCase().replace(/\s+/g, '-')}</strong></div><button onClick={() => setViewMode('code')}><FileCode2 size={15} /><span><strong>Website source</strong><small>/index.html</small></span></button><div className="inspector-empty"><Code2 size={20} /><p>The complete generated website is saved as one portable HTML file.</p></div></div>}
          {rightTab === 'pages' && <div className="inspector-list"><button className="selected"><Monitor size={16} /><span><strong>Home</strong><small>/</small></span><Check size={15} /></button><div className="inspector-empty"><Plus size={20} /><p>Ask the builder to add pages such as About, Services, or Contact.</p></div></div>}
          {rightTab === 'settings' && <div className="inspector-settings"><label>Project name<input value={project.name} readOnly /></label><label>AI provider<input value={providerName(project.provider)} readOnly /></label><label>Build status<input value={generatedCode ? 'Generated' : 'Waiting'} readOnly /></label><div className="inspector-empty"><Settings size={20} /><p>Project configuration and generated code are saved with the workspace.</p></div></div>}
        </aside>
      </div>
    </section>
  )
}

function DomainsView({ domains, projects, onDomainAdded }: { domains: Domain[]; projects: Project[]; onDomainAdded: (domain: Domain) => void }) {
  const [hostname, setHostname] = useState('')
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')
  const [error, setError] = useState('')

  const addDomain = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('saving')
    setError('')
    try {
      const response = await fetch('/api/builder-workspace', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add-domain', hostname, projectId: projectId || null }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The domain could not be added.')
      onDomainAdded(data.domain)
      setHostname('')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The domain could not be added.') } finally { setStatus('idle') }
  }

  return (
    <section>
      <PageIntro eyebrow="Domain control" title="Domains" description="Stage custom domains, review status, and prepare DNS configuration without claiming unverified connections." />
      <div className="domain-layout">
        <form className="domain-add-card" onSubmit={addDomain}><span className="domain-card-icon"><Globe2 /></span><span className="section-tag">Add Custom Domain</span><h2>Connect your address</h2><p>Add a domain to create a configuration record. Verification begins only after the domain backend is connected.</p><label>Domain name<div><span>https://</span><input value={hostname} onChange={(event) => setHostname(event.target.value)} placeholder="yourdomain.com" required /></div></label><label>Assign to project<select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">Assign later</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>{error && <InlineNotice kind="error" message={error} />}<button className="primary-action" disabled={status === 'saving'}>{status === 'saving' ? <LoaderCircle className="spin" /> : <Plus />} Add Domain</button></form>
        <div className="dns-guide"><span className="section-tag">DNS setup architecture</span><h2>What happens next</h2><ol><li><span>01</span><div><strong>Add your domain</strong><p>The workspace records the requested hostname with a truthful Needs Configuration status.</p></div></li><li><span>02</span><div><strong>Connect verification backend</strong><p>A future domain service checks ownership and provides exact DNS targets.</p></div></li><li><span>03</span><div><strong>Update DNS records</strong><p>Use the verified values from your registrar. Never use placeholder DNS records.</p></div></li><li><span>04</span><div><strong>Publish securely</strong><p>Status changes to Connected only after automated verification succeeds.</p></div></li></ol></div>
      </div>
      <div className="domain-list-section"><div className="subsection-heading"><h2>Your domains</h2><span>{domains.length} total</span></div>{domains.length === 0 ? <div className="table-empty"><Globe2 size={25} /><strong>No custom domains</strong><span>Add a domain above when you are ready to configure it.</span></div> : <div className="domain-table">{domains.map((domain) => <article key={domain.id}><span className="domain-favicon">{domain.hostname[0].toUpperCase()}</span><div><strong>{domain.hostname}</strong><small>Added {formatDate(domain.created_at)}</small></div><StatusBadge status={domain.status} /><button><MoreHorizontal /></button><div className="dns-warning"><AlertCircle size={16} /><span><strong>Needs Configuration</strong>DNS targets appear after the domain verification service is connected.</span></div></article>)}</div>}</div>
    </section>
  )
}

function DeploymentsView({ deployments }: { deployments: Deployment[] }) {
  return (
    <section>
      <PageIntro eyebrow="Release operations" title="Deployments" description="Track real build and publishing events once a deployment provider is connected." action={<button className="secondary-action" disabled><Rocket size={17} /> Deploy Website</button>} />
      <div className="deployment-overview"><div><span>Production environment</span><strong>{deployments.some((item) => item.status === 'published') ? 'Published' : 'Not configured'}</strong><small><i /> Deployment backend connection required</small></div><div><span>Latest deployment</span><strong>{deployments[0] ? formatDate(deployments[0].created_at) : '—'}</strong><small>No fabricated release history</small></div><div><span>Published URL</span><strong>{deployments.find((item) => item.published_url)?.published_url || '—'}</strong><small>Created by the deployment provider</small></div></div>
      <div className="deployment-table-wrap"><div className="subsection-heading"><h2>Deployment history</h2><span>Latest first</span></div>{deployments.length === 0 ? <div className="deploy-empty"><span className="deploy-empty-icon"><Cloud /></span><h2>No deployments yet</h2><p>Create a project, then connect supported build and hosting infrastructure to publish it.</p><div><CheckCircle2 size={16} /> The dashboard never marks an undeployed site as published.</div></div> : <div className="deployment-table"><div className="deployment-row heading"><span>Website</span><span>Status</span><span>Published URL</span><span>Date</span><span>Actions</span></div>{deployments.map((deployment) => <div className="deployment-row" key={deployment.id}><span><strong>{deployment.project_name}</strong>{deployment.is_latest && <small>Latest deployment</small>}</span><StatusBadge status={deployment.status} /><span>{deployment.published_url || 'Not published'}</span><span>{formatDate(deployment.created_at)}</span><span className="deployment-actions"><button disabled title="Redeploy backend not connected"><RefreshCw size={15} /> Redeploy</button><button disabled={!deployment.published_url}><ExternalLink size={15} /> View website</button></span></div>)}</div>}</div>
    </section>
  )
}

function SettingsView({ user }: { user: User }) {
  return (
    <section>
      <PageIntro eyebrow="Workspace controls" title="Settings" description="Review account, provider, billing, and infrastructure connection states." />
      <div className="settings-grid">
        <article className="settings-card"><div className="settings-card-heading"><span><ShieldCheck /></span><div><h2>Account</h2><p>Authenticated through Netlify Identity email verification.</p></div></div><label>Email address<input value={user.email ?? ''} readOnly /></label><label>Authentication method<input value="4-digit email verification code" readOnly /></label><div className="settings-success"><CheckCircle2 size={16} /> Passwordless access active</div></article>
        <article className="settings-card"><div className="settings-card-heading"><span><Bot /></span><div><h2>BBS AI Engine</h2><p>BBS AI is the single autonomous engine that builds and revises every project.</p></div></div><div className="integration-list"><div><span className="integration-logo">B</span><span><strong>BBS AI</strong><small>Autonomous website generation active</small></span><StatusBadge status="connected" /></div></div></article>
        <article className="settings-card"><div className="settings-card-heading"><span><Rocket /></span><div><h2>Deployment Provider</h2><p>Required for builds, published URLs, and redeploys.</p></div></div><div className="large-connection-state"><Cloud size={27} /><strong>Not connected</strong><p>Connect supported deployment infrastructure before enabling publish actions.</p><button disabled>Configure deployment</button></div></article>
        <article className="settings-card"><div className="settings-card-heading"><span><CircleDollarSign /></span><div><h2>Credits & Billing</h2><p>Credit balances come from verified billing metadata.</p></div></div><div className="credit-settings"><strong>{typeof user.userMetadata?.ai_credits === 'number' ? user.userMetadata.ai_credits.toLocaleString() : '0'}</strong><span>AI credits available</span></div><div className="billing-row"><CreditCard size={18} /><span><strong>Billing provider</strong><small>Stripe connection required for purchases</small></span><StatusBadge status="not_connected" /></div></article>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  return <span className={`status-badge ${status}`}><i />{label}</span>
}

function formatDate(value: string) {
  if (!value) return 'recently'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function inferProjectName(prompt: string) {
  const match = prompt.match(/(?:for|called|named)\s+(?:my\s+)?([^,.]+?)(?:\s+(?:with|that|website)|[,.]|$)/i)
  const candidate = match?.[1]?.trim() || prompt.trim().split(/\s+/).slice(0, 5).join(' ')
  return candidate.replace(/^(a|an|the)\s+/i, '').replace(/\b\w/g, (letter) => letter.toUpperCase()).slice(0, 80)
}

function providerName(provider: ProviderId) {
  return providers.find((item) => item.id === provider)?.name ?? 'BBS AI'
}
