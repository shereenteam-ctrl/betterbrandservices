import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { h as handleAuthCallback, g as getUser, l as logout } from "../_libs/netlify__identity.mjs";
import "./router-CIkB19GM.mjs";
import { S as Sparkles, A as ArrowLeft, a as ShieldCheck, D as Database, C as Cloud, L as LoaderCircle, b as ArrowRight, c as LayoutDashboard, W as WandSparkles, E as Earth, R as Rocket, d as Settings, X, M as Menu, Z as Zap, e as LogOut, f as CircleAlert, g as CircleCheck, P as Plus, F as FolderGit2, h as Activity, i as Ellipsis, I as Import, j as Monitor, k as ChevronRight, l as RefreshCw, m as ExternalLink, B as Bot, n as CircleDollarSign, o as CreditCard, p as CodeXml, q as Send, r as Copy, s as Download, t as FileCodeCorner, u as Check } from "../_libs/lucide-react.mjs";
import "../_libs/gotrue-js.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const emptyWorkspace = {
  projects: [],
  domains: [],
  deployments: [],
  messages: []
};
const navItems = [{
  id: "projects",
  label: "Projects",
  icon: LayoutDashboard
}, {
  id: "builder",
  label: "AI Builder",
  icon: WandSparkles
}, {
  id: "domains",
  label: "Domains",
  icon: Earth
}, {
  id: "deployments",
  label: "Deployments",
  icon: Rocket
}, {
  id: "settings",
  label: "Settings",
  icon: Settings
}];
const providers = [{
  id: "bbs-ai",
  name: "BBS AI",
  description: "Flagship BBS workflow for brand-led website creation.",
  badge: "Default"
}, {
  id: "codex",
  name: "Codex",
  description: "External provider integration prepared for its supported API."
}, {
  id: "gemini",
  name: "Gemini",
  description: "External provider integration prepared for its supported API."
}, {
  id: "lovable",
  name: "Lovable",
  description: "External provider integration prepared for supported workflows."
}];
function BuilderPage() {
  const [authState, setAuthState] = reactExports.useState("checking");
  const [user, setUser] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const restoreSession = async () => {
      try {
        const callback = await handleAuthCallback();
        if (callback?.user) {
          setUser(callback.user);
          setAuthState("authenticated");
          return;
        }
      } catch {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      const currentUser = await getUser();
      setUser(currentUser);
      setAuthState(currentUser ? "authenticated" : "email");
    };
    void restoreSession();
  }, []);
  if (authState === "checking") return /* @__PURE__ */ jsxRuntimeExports.jsx(BuilderLoading, {});
  if (!user || authState !== "authenticated") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthPortal, { authState, onStateChange: setAuthState, onAuthenticated: setUser });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Platform, { user, onLogout: () => setUser(null) });
}
function BuilderLoading() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "builder-loading", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "builder-loading-mark", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "BBS AI Builder" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Securing your workspace" })
  ] });
}
function AuthPortal({
  authState,
  onStateChange,
  onAuthenticated
}) {
  const [email, setEmail] = reactExports.useState(() => sessionStorage.getItem("bbs-auth-email") ?? "");
  const [code, setCode] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState("");
  const [notice, setNotice] = reactExports.useState("");
  const authRequest = async (body) => {
    const response = await fetch("/api/builder-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "The email verification request failed.");
    return result;
  };
  const sendCode = async (resending = false) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setStatus(resending ? "resending" : "sending");
    setError("");
    setNotice("");
    try {
      const result = await authRequest({
        action: "request-code",
        email: normalizedEmail
      });
      sessionStorage.setItem("bbs-auth-email", normalizedEmail);
      onStateChange("code");
      setNotice(resending ? "A fresh four-digit code was sent. Only the newest code works." : result.message ?? "Check your inbox for your four-digit code.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The verification email could not be sent. Try again.");
    } finally {
      setStatus("idle");
    }
  };
  const verifyCode = async (event) => {
    event.preventDefault();
    const token = code.trim();
    if (!/^\d{4}$/.test(token)) {
      setError("Enter the four-digit code from your email.");
      return;
    }
    setStatus("verifying");
    setError("");
    setNotice("");
    try {
      const result = await authRequest({
        action: "verify-code",
        email: email.trim().toLowerCase(),
        code: token
      });
      if (!result.user) throw new Error("The code was verified, but the session could not be opened.");
      sessionStorage.removeItem("bbs-auth-email");
      onAuthenticated(result.user);
      onStateChange("authenticated");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The code could not be verified. Try again.");
    } finally {
      setStatus("idle");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "auth-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "auth-story", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "auth-back", href: "/", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
        " Better Brand Services"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-story-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "auth-kicker", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 }),
          " BBS AI Builder"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
          "Ideas become",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "live systems." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Plan, build, manage, and prepare your next website for deployment from one focused workspace." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-proof-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18 }),
            " Secure email-code access"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 18 }),
            " Persistent project drafts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 18 }),
            " Deployment-ready architecture"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-orbit", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "auth-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-logo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "BBS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "BBS AI Builder" })
      ] }),
      authState === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (event) => {
        event.preventDefault();
        void sendCode();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "auth-step", children: "Secure access · Step 1 of 2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Enter your email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "New users are registered automatically. Existing users receive a secure login code." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "builder-email", children: "Email address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "builder-email", type: "email", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "you@company.com", autoComplete: "email", autoFocus: true, required: true }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNotice, { kind: "error", message: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "auth-submit", type: "submit", disabled: status === "sending", children: status === "sending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin", size: 18 }),
          " Sending code"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Continue with Email ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "auth-privacy", children: "No password required. Access is verified by email." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: verifyCode, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "auth-step", children: "Secure access · Step 2 of 2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Enter your code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "We sent a four-digit verification code to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: email }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "builder-code", children: "4-digit verification code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "builder-code", className: "auth-code-input", value: code, onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4)), placeholder: "0000", inputMode: "numeric", pattern: "[0-9]{4}", maxLength: 4, autoComplete: "one-time-code", autoFocus: true, required: true }),
        notice && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNotice, { kind: "success", message: notice }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNotice, { kind: "error", message: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "auth-submit", type: "submit", disabled: status === "verifying", children: status === "verifying" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin", size: 18 }),
          " Verifying"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Verify & Open Builder ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-code-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void sendCode(true), disabled: status === "resending", children: status === "resending" ? "Sending…" : "Resend Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            onStateChange("email");
            setCode("");
            setError("");
            setNotice("");
          }, children: "Change Email" })
        ] })
      ] })
    ] }) })
  ] });
}
function InlineNotice({
  kind,
  message
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `inline-notice ${kind}`, role: kind === "error" ? "alert" : "status", children: [
    kind === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 17 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 17 }),
    message
  ] });
}
function Platform({
  user,
  onLogout
}) {
  const [activeTab, setActiveTab] = reactExports.useState("projects");
  const [builderStage, setBuilderStage] = reactExports.useState("landing");
  const [workspace, setWorkspace] = reactExports.useState(emptyWorkspace);
  const [activeProjectId, setActiveProjectId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [workspaceError, setWorkspaceError] = reactExports.useState("");
  const [mobileNavOpen, setMobileNavOpen] = reactExports.useState(false);
  const activeProject = workspace.projects.find((project) => project.id === activeProjectId) ?? null;
  const credits = typeof user.userMetadata?.ai_credits === "number" ? user.userMetadata.ai_credits : 0;
  const loadWorkspace = async () => {
    setLoading(true);
    setWorkspaceError("");
    try {
      const response = await fetch("/api/builder-workspace");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Workspace data is unavailable.");
      setWorkspace({
        projects: data.projects ?? [],
        domains: data.domains ?? [],
        deployments: data.deployments ?? [],
        messages: data.messages ?? []
      });
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : "Workspace data is unavailable.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadWorkspace();
  }, []);
  const selectTab = (tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    if (tab === "builder" && builderStage === "workspace" && !activeProject) setBuilderStage("landing");
  };
  const openProject = (project) => {
    setActiveProjectId(project.id);
    setActiveTab("builder");
    setBuilderStage("workspace");
  };
  const addWebsite = () => {
    setActiveTab("builder");
    setBuilderStage("create");
  };
  const handleLogout = async () => {
    await logout();
    onLogout();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "platform-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `platform-sidebar ${mobileNavOpen ? "open" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "BBS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "BBS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "AI Builder" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { "aria-label": "Builder navigation", children: navItems.map(({
        id,
        label,
        icon: Icon
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: activeTab === id ? "active" : "", onClick: () => selectTab(id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }),
        label,
        id === "deployments" && workspace.deployments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: workspace.deployments.length })
      ] }, id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-system", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
          " Platform status"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Workspace online" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "BBS AI is active. Deployment requires connection." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "sidebar-back", href: "/", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
        " Back to BBS"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "platform-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "platform-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mobile-platform-menu", onClick: () => setMobileNavOpen((open) => !open), "aria-label": "Toggle dashboard navigation", children: mobileNavOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: navItems.find((item) => item.id === activeTab)?.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-header-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credit-balance", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: credits.toLocaleString() }),
              " Credits"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "user-menu", title: user.email, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (user.email?.[0] ?? "B").toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "user-menu-copy", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.name || "BBS Creator" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-button", onClick: () => void handleLogout(), title: "Log out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-content", children: [
        workspaceError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-alert", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Workspace connection needs attention" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: workspaceError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void loadWorkspace(), children: "Retry" })
        ] }),
        activeTab === "projects" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectsView, { projects: workspace.projects, loading, onAdd: addWebsite, onOpen: openProject, onSettings: () => selectTab("settings") }),
        activeTab === "builder" && /* @__PURE__ */ jsxRuntimeExports.jsx(BuilderView, { stage: builderStage, setStage: setBuilderStage, projects: workspace.projects, activeProject, messages: workspace.messages.filter((message) => message.project_id === activeProjectId), onProjectCreated: (project) => {
          setWorkspace((current) => ({
            ...current,
            projects: [project.project, ...current.projects],
            messages: [...current.messages, project.userMessage, project.generatedMessage]
          }));
          setActiveProjectId(project.project.id);
          setBuilderStage("workspace");
        }, onMessagesAdded: (messages) => setWorkspace((current) => ({
          ...current,
          messages: [...current.messages, ...messages]
        })), onOpenProject: openProject }),
        activeTab === "domains" && /* @__PURE__ */ jsxRuntimeExports.jsx(DomainsView, { domains: workspace.domains, projects: workspace.projects, onDomainAdded: (domain) => setWorkspace((current) => ({
          ...current,
          domains: [domain, ...current.domains]
        })) }),
        activeTab === "deployments" && /* @__PURE__ */ jsxRuntimeExports.jsx(DeploymentsView, { deployments: workspace.deployments }),
        activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, { user })
      ] })
    ] })
  ] });
}
function PageIntro({
  eyebrow,
  title,
  description,
  action
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-intro", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description })
    ] }),
    action
  ] });
}
function ProjectsView({
  projects,
  loading,
  onAdd,
  onOpen,
  onSettings
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageIntro, { eyebrow: "Project command center", title: "My Websites", description: "Create, organize, and reopen every BBS website workspace.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-action", onClick: onAdd, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
      " Add New Website"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-strip", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: FolderGit2, value: String(projects.length), label: "Websites" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Activity, value: String(projects.filter((project) => project.status === "published").length), label: "Published" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Earth, value: String(projects.filter((project) => project.custom_domain).length), label: "Custom domains" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Zap, value: "0", label: "Active builds" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectSkeletons, {}) : projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-projects", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-project-visual", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 28 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-tag", children: "Your first build starts here" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "No websites yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Start from an idea or prepare an existing project for the BBS deployment workflow." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-action", onClick: onAdd, children: [
        "Add New Website ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-grid", children: [
      projects.map((project, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "project-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "project-preview", onClick: () => onOpen(project), "aria-label": `Edit ${project.name}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `preview-art preview-art-${index % 3 + 1}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "preview-nav" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: project.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "preview-copy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "preview-button" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `project-status ${project.status}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            " ",
            project.status === "published" ? "Published" : "Draft"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-card-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: project.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: project.custom_domain || project.published_url || "No published domain" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "more-button", "aria-label": "Project menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Updated ",
              formatDate(project.updated_at)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: providerName(project.provider) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onOpen(project), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 15 }),
              " Edit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, title: "Connect a deployment provider to publish", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 15 }),
              " Deploy"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSettings, "aria-label": "Project settings", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 15 }) })
          ] })
        ] })
      ] }, project.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "add-project-card", onClick: onAdd, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Add New Website" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Import or build with AI" })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  value,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "platform-stat", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 17 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
    ] })
  ] });
}
function ProjectSkeletons() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-grid", "aria-label": "Loading projects", children: [1, 2, 3].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-skeleton", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
  ] }, item)) });
}
function BuilderView({
  stage,
  setStage,
  projects,
  activeProject,
  messages,
  onProjectCreated,
  onMessagesAdded,
  onOpenProject
}) {
  if (stage === "workspace" && activeProject) return /* @__PURE__ */ jsxRuntimeExports.jsx(BuilderWorkspace, { project: activeProject, messages, onMessagesAdded });
  if (stage === "create") return /* @__PURE__ */ jsxRuntimeExports.jsx(CreateWebsite, { onBack: () => setStage("landing"), onCreated: onProjectCreated });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageIntro, { eyebrow: "Creation engine", title: "AI Builder", description: "Start a new website or continue refining an existing project.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-action", onClick: () => setStage("create"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
      " Add New Website"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "builder-launch-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "launch-card flagship", onClick: () => setStage("create"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "launch-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Flagship workflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Build with BBS AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Turn a clear business brief into a structured website project and continue iterating in one workspace." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "launch-link", children: [
          "Start a build ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "launch-card", onClick: () => setStage("create"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "launch-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Import, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Bring your code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Import a project" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Prepare a repository or project package for future build and deployment integrations." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "launch-link", children: [
          "Open importer ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] })
      ] })
    ] }),
    projects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-projects", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subsection-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Continue building" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          projects.length,
          " projects"
        ] })
      ] }),
      projects.slice(0, 4).map((project) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onOpenProject(project), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-project-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: project.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            formatDate(project.updated_at),
            " · ",
            providerName(project.provider)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 })
      ] }, project.id))
    ] })
  ] });
}
function CreateWebsite({
  onBack,
  onCreated
}) {
  const [method, setMethod] = reactExports.useState("ai");
  const [prompt, setPrompt] = reactExports.useState("");
  const [provider, setProvider] = reactExports.useState("bbs-ai");
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState("");
  const [importName, setImportName] = reactExports.useState("");
  const buildWebsite = async () => {
    if (prompt.trim().length < 12) {
      setError("Describe the website in at least 12 characters.");
      return;
    }
    setStatus("saving");
    setError("");
    const name = inferProjectName(prompt);
    try {
      const response = await fetch("/api/builder-workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "create-project",
          prompt,
          provider,
          name
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The project could not be created.");
      onCreated({
        project: data.project,
        userMessage: data.userMessage,
        generatedMessage: data.generatedMessage
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The project could not be created.");
    } finally {
      setStatus("idle");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "create-flow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-back", onClick: onBack, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
      " Back to AI Builder"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "create-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-tag", children: "New website" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "How do you want to start?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Build from a business idea or prepare an existing codebase for import." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "method-tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: method === "ai" ? "active" : "", onClick: () => setMethod("ai"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18 }),
        " Build with AI"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: method === "import" ? "active" : "", onClick: () => setMethod("import"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Import, { size: 18 }),
        " Import existing project"
      ] })
    ] }),
    method === "ai" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-studio", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subsection-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Project brief" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "What do you want to build?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            prompt.length,
            " / 4,000"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: prompt, onChange: (event) => setPrompt(event.target.value.slice(0, 4e3)), placeholder: "Describe your website or business idea...", "aria-label": "Describe your website or business idea" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-example", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Try:" }),
          " “Build a modern website for my plumbing company with Home, Services, About, Reviews, and Contact pages.”"
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNotice, { kind: "error", message: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "build-button", onClick: () => void buildWebsite(), disabled: status === "saving", children: status === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin" }),
          " Generating website"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Build Website ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "integration-honesty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 15 }),
          " BBS AI generates a complete responsive website and saves the code in your workspace."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderPicker, { selected: provider, onSelect: setProvider })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "import-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "import-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderGit2, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Import an existing project" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a project archive to stage it for a future repository and deployment connection." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "file-picker", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".zip,.tar,.gz", onChange: (event) => setImportName(event.target.files?.[0]?.name ?? "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Import, { size: 18 }),
        " Choose project archive"
      ] }),
      importName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "selected-file", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 17 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: importName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Selected locally · upload backend not connected" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "connection-note", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Import service required" }),
          "The file remains on this device. Connect secure object storage and repository processing before imports can be uploaded."
        ] })
      ] })
    ] })
  ] });
}
function ProviderPicker({
  selected,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "provider-picker", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-tag", children: "Choose Your AI Builder" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Build engine" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "BBS AI is connected through Netlify AI Gateway." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: providers.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: selected === provider.id ? "selected" : "", onClick: () => onSelect(provider.id), disabled: provider.id !== "bbs-ai", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "provider-radio", children: selected === provider.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
          provider.name,
          provider.id === "bbs-ai" && " ⭐"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: provider.id === "bbs-ai" ? "Generates and revises a complete responsive HTML website." : "Coming soon." })
      ] }),
      provider.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: provider.badge })
    ] }, provider.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "provider-disclaimer", children: "Additional provider integrations remain unavailable until their supported workflows are connected." })
  ] });
}
function BuilderWorkspace({
  project,
  messages,
  onMessagesAdded
}) {
  const [instruction, setInstruction] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState("");
  const [rightTab, setRightTab] = reactExports.useState("files");
  const [viewMode, setViewMode] = reactExports.useState("preview");
  const [copied, setCopied] = reactExports.useState(false);
  const [previewKey, setPreviewKey] = reactExports.useState(0);
  const generatedCode = messages.filter((message) => message.role === "assistant" && message.status === "complete").at(-1)?.content ?? "";
  const copyCode = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const downloadCode = () => {
    if (!generatedCode) return;
    const url = URL.createObjectURL(new Blob([generatedCode], {
      type: "text/html"
    }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "website"}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const sendInstruction = async (event) => {
    event.preventDefault();
    if (instruction.trim().length < 2) return;
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/builder-workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "add-message",
          projectId: project.id,
          content: instruction
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The website could not be updated.");
      onMessagesAdded([data.userMessage, data.generatedMessage]);
      setInstruction("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The website could not be updated.");
    } finally {
      setStatus("idle");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "workspace-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "workspace-breadcrumb", children: [
          "AI Builder ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 }),
          " ",
          project.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: project.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        " Code generated"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "preview-device active", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 17 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "toolbar-deploy", disabled: true, title: "Connect a deployment backend first", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 16 }),
        " Deploy"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "ai-chat-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ai-avatar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 17 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: providerName(project.provider) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Instruction workspace" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chat-scroll", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "assistant-message", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 15 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your website is generated. Ask for a change, then preview, copy, or download the updated HTML." })
          ] }),
          messages.map((message) => message.role === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "user-message", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: message.status })
          ] }, message.id) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "assistant-message generated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 15 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Website code generated successfully." })
          ] }, message.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "suggestion-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Suggested next instructions" }),
            ["Add a pricing section.", "Change the colors.", "Make it mobile responsive.", "Add a contact page."].map((suggestion) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setInstruction(suggestion), children: [
              suggestion,
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 })
            ] }, suggestion))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "chat-composer", onSubmit: sendInstruction, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: instruction, onChange: (event) => setInstruction(event.target.value), placeholder: "Tell BBS AI what to change..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13 }),
              " ",
              status === "saving" ? "Generating your update…" : "Changes regenerate the saved website"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: status === "saving", "aria-label": "Generate update", children: status === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin", size: 17 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 17 }) })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "composer-error", children: error })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "live-preview-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-browser", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-bar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "browser-dots", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-mode-tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: viewMode === "preview" ? "active" : "", onClick: () => setViewMode("preview"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 13 }),
              " Preview"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: viewMode === "code" ? "active" : "", onClick: () => setViewMode("code"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 13 }),
              " Code"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "code-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void copyCode(), disabled: !generatedCode, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }),
              " ",
              copied ? "Copied" : "Copy"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: downloadCode, disabled: !generatedCode, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
              " Download"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreviewKey((key) => key + 1), disabled: viewMode !== "preview", "aria-label": "Refresh preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }) })
          ] })
        ] }),
        generatedCode ? viewMode === "preview" ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { className: "generated-preview", title: `${project.name} preview`, srcDoc: generatedCode, sandbox: "allow-forms allow-modals" }, previewKey) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "generated-code", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileCodeCorner, { size: 15 }),
            " index.html ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              generatedCode.length.toLocaleString(),
              " characters"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: generatedCode }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "awaiting-preview", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin", size: 25 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "GENERATING" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Creating your website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The completed preview and source code appear here." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "project-inspector", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inspector-tabs", children: ["files", "pages", "settings"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: rightTab === tab ? "active" : "", onClick: () => setRightTab(tab), children: tab }, tab)) }),
        rightTab === "files" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "file-tree", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tree-root", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderGit2, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: project.name.toLowerCase().replace(/\s+/g, "-") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setViewMode("code"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileCodeCorner, { size: 15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Website source" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/index.html" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The complete generated website is saved as one portable HTML file." })
          ] })
        ] }),
        rightTab === "pages" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "selected", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 15 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Ask the builder to add pages such as About, Services, or Contact." })
          ] })
        ] }),
        rightTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-settings", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Project name",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: project.name, readOnly: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "AI provider",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: providerName(project.provider), readOnly: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Build status",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: generatedCode ? "Generated" : "Waiting", readOnly: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Project configuration and generated code are saved with the workspace." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function DomainsView({
  domains,
  projects,
  onDomainAdded
}) {
  const [hostname, setHostname] = reactExports.useState("");
  const [projectId, setProjectId] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState("");
  const addDomain = async (event) => {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/builder-workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "add-domain",
          hostname,
          projectId: projectId || null
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The domain could not be added.");
      onDomainAdded(data.domain);
      setHostname("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The domain could not be added.");
    } finally {
      setStatus("idle");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageIntro, { eyebrow: "Domain control", title: "Domains", description: "Stage custom domains, review status, and prepare DNS configuration without claiming unverified connections." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "domain-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "domain-add-card", onSubmit: addDomain, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "domain-card-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-tag", children: "Add Custom Domain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Connect your address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Add a domain to create a configuration record. Verification begins only after the domain backend is connected." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Domain name",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "https://" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: hostname, onChange: (event) => setHostname(event.target.value), placeholder: "yourdomain.com", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Assign to project",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: projectId, onChange: (event) => setProjectId(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Assign later" }),
            projects.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: project.id, children: project.name }, project.id))
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNotice, { kind: "error", message: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-action", disabled: status === "saving", children: [
          status === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {}),
          " Add Domain"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dns-guide", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-tag", children: "DNS setup architecture" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "What happens next" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "01" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Add your domain" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The workspace records the requested hostname with a truthful Needs Configuration status." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "02" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Connect verification backend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A future domain service checks ownership and provides exact DNS targets." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "03" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Update DNS records" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Use the verified values from your registrar. Never use placeholder DNS records." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "04" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Publish securely" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Status changes to Connected only after automated verification succeeds." })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "domain-list-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subsection-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Your domains" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          domains.length,
          " total"
        ] })
      ] }),
      domains.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { size: 25 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "No custom domains" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add a domain above when you are ready to configure it." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "domain-table", children: domains.map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "domain-favicon", children: domain.hostname[0].toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: domain.hostname }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            "Added ",
            formatDate(domain.created_at)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: domain.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dns-warning", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Needs Configuration" }),
            "DNS targets appear after the domain verification service is connected."
          ] })
        ] })
      ] }, domain.id)) })
    ] })
  ] });
}
function DeploymentsView({
  deployments
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageIntro, { eyebrow: "Release operations", title: "Deployments", description: "Track real build and publishing events once a deployment provider is connected.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "secondary-action", disabled: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 17 }),
      " Deploy Website"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deployment-overview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Production environment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deployments.some((item) => item.status === "published") ? "Published" : "Not configured" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
          " Deployment backend connection required"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Latest deployment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deployments[0] ? formatDate(deployments[0].created_at) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "No fabricated release history" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Published URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deployments.find((item) => item.published_url)?.published_url || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Created by the deployment provider" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deployment-table-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subsection-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Deployment history" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Latest first" })
      ] }),
      deployments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deploy-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "deploy-empty-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "No deployments yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Create a project, then connect supported build and hosting infrastructure to publish it." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
          " The dashboard never marks an undeployed site as published."
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deployment-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deployment-row heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Published URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Actions" })
        ] }),
        deployments.map((deployment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deployment-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deployment.project_name }),
            deployment.is_latest && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Latest deployment" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: deployment.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: deployment.published_url || "Not published" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(deployment.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "deployment-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, title: "Redeploy backend not connected", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
              " Redeploy"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !deployment.published_url, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 15 }),
              " View website"
            ] })
          ] })
        ] }, deployment.id))
      ] })
    ] })
  ] });
}
function SettingsView({
  user
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageIntro, { eyebrow: "Workspace controls", title: "Settings", description: "Review account, provider, billing, and infrastructure connection states." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Authenticated through Netlify Identity email verification." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Email address",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: user.email ?? "", readOnly: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Authentication method",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: "4-digit email verification code", readOnly: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
          " Passwordless access active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "AI Providers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "BBS AI generation runs through Netlify AI Gateway." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "integration-list", children: providers.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "integration-logo", children: provider.name[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: provider.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: provider.id === "bbs-ai" ? "Website generation active" : "Independent external provider" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: provider.id === "bbs-ai" ? "connected" : "not_connected" })
        ] }, provider.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Deployment Provider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Required for builds, published URLs, and redeploys." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "large-connection-state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 27 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Not connected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Connect supported deployment infrastructure before enabling publish actions." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, children: "Configure deployment" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Credits & Billing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Credit balances come from verified billing metadata." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credit-settings", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: typeof user.userMetadata?.ai_credits === "number" ? user.userMetadata.ai_credits.toLocaleString() : "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI credits available" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "billing-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Billing provider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Stripe connection required for purchases" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "not_connected" })
        ] })
      ] })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  const label = status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `status-badge ${status}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
    label
  ] });
}
function formatDate(value) {
  if (!value) return "recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}
function inferProjectName(prompt) {
  const match = prompt.match(/(?:for|called|named)\s+(?:my\s+)?([^,.]+?)(?:\s+(?:with|that|website)|[,.]|$)/i);
  const candidate = match?.[1]?.trim() || prompt.trim().split(/\s+/).slice(0, 5).join(" ");
  return candidate.replace(/^(a|an|the)\s+/i, "").replace(/\b\w/g, (letter) => letter.toUpperCase()).slice(0, 80);
}
function providerName(provider) {
  return providers.find((item) => item.id === provider)?.name ?? "BBS AI";
}
export {
  BuilderPage as component
};
