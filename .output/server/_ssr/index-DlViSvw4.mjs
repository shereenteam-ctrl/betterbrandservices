import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Sparkles, A as ArrowRight, X, M as Menu, C as ChevronDown, a as Star, B as BadgeCheck, P as Palette, L as Layers, W as WandSparkles, I as Images, b as CreditCard, F as FileText, V as Video, c as Play, d as Smartphone, e as Clapperboard, f as MonitorSmartphone, g as BriefcaseBusiness, h as Building2, i as CodeXml, j as Sheet, k as Search, l as Clock3, m as Check, n as Image, E as Earth, R as Rocket, o as ShieldCheck, Z as Zap, p as MessageCircle, Q as Quote, q as Phone, r as Mail, s as Send, t as ArrowUp } from "../_libs/lucide-react.mjs";
const services = [{
  icon: Palette,
  title: "Logo Design",
  price: "$30",
  description: "Professional custom logos designed to make your business recognizable, credible, and memorable.",
  timeline: "2–3 days",
  features: ["Custom concepts", "Revision rounds", "High-resolution files", "Web and print formats"]
}, {
  icon: Layers,
  title: "Brand Identity Design",
  price: "$149",
  description: "A cohesive visual identity that gives your business a clear, consistent, and professional presence.",
  timeline: "5–7 days",
  features: ["Logo system", "Color palette", "Typography direction", "Brand guidelines"]
}, {
  icon: WandSparkles,
  title: "AI Generated Images",
  price: "$20 per image",
  description: "Custom AI-assisted imagery created for campaigns, products, concepts, and branded digital content.",
  timeline: "12–24 hours",
  features: ["Custom art direction", "Prompt development", "High-resolution output", "Commercial-ready files"]
}, {
  icon: Images,
  title: "Social Media Designs",
  price: "$15 per design",
  description: "Platform-ready social graphics designed to keep your content polished, consistent, and easy to recognize.",
  timeline: "12–24 hours",
  features: ["Feed posts", "Story graphics", "Campaign creatives", "Platform-ready sizing"]
}, {
  icon: CreditCard,
  title: "Business Cards",
  price: "$35",
  description: "Professional business card layouts that carry your brand confidently into every introduction.",
  timeline: "1–2 days",
  features: ["Front and back design", "Print-ready files", "Brand alignment", "Digital preview"]
}, {
  icon: FileText,
  title: "Flyers",
  price: "$40",
  description: "Clear, compelling flyer designs for promotions, events, launches, and local marketing campaigns.",
  timeline: "1–2 days",
  features: ["Custom layout", "Print-ready files", "Digital version", "Focused call to action"]
}, {
  icon: Video,
  title: "Video Editing",
  price: "$50 per video",
  description: "Polished video edits with clean pacing, refined audio, and visuals built to keep viewers engaged.",
  timeline: "2–4 days",
  features: ["Professional editing", "Color and audio polish", "Captions and motion", "Platform-ready exports"]
}, {
  icon: Play,
  title: "YouTube Shorts Editing",
  price: "$20 per short",
  description: "Fast-paced vertical edits optimized for YouTube Shorts, retention, clarity, and repeat viewing.",
  timeline: "24 hours",
  features: ["Vertical formatting", "Paced cuts", "On-screen captions", "Platform-ready export"]
}, {
  icon: Smartphone,
  title: "Instagram Reels Editing",
  price: "$20 per reel",
  description: "Engaging reel edits that combine pacing, captions, and visual polish for mobile-first audiences.",
  timeline: "24 hours",
  features: ["Vertical formatting", "Captions", "Music synchronization", "Instagram-ready export"]
}, {
  icon: Clapperboard,
  title: "Advertisement Videos",
  price: "$99",
  description: "Focused advertisement videos designed to communicate your offer quickly and inspire action.",
  timeline: "3–5 days",
  features: ["Conversion-led structure", "Brand styling", "Text and motion", "Ad-ready exports"]
}, {
  icon: MonitorSmartphone,
  title: "Landing Pages",
  price: "$100",
  description: "Focused, responsive landing pages designed around one offer, one audience, and one clear action.",
  timeline: "3–5 days",
  features: ["Responsive design", "Conversion-focused layout", "Contact integration", "SEO foundations"]
}, {
  icon: BriefcaseBusiness,
  title: "Portfolio Websites",
  price: "$150",
  description: "Modern portfolio websites that present your work, capabilities, and experience with confidence.",
  timeline: "5–7 days",
  features: ["Responsive design", "Project showcase", "About and contact pages", "SEO foundations"]
}, {
  icon: Building2,
  title: "Business Websites",
  price: "$250",
  description: "Modern, responsive business websites that look premium, load quickly, and turn visits into inquiries.",
  timeline: "7–10 days",
  features: ["Responsive design", "Conversion strategy", "SEO foundations", "Contact integration"]
}, {
  icon: CodeXml,
  title: "Data Entry",
  price: "$15/hour",
  description: "Accurate, organized data entry support for records, documents, catalogs, and recurring business tasks.",
  timeline: "Based on project",
  features: ["Data cleanup", "Record updates", "File organization", "Quality checks"]
}, {
  icon: Sheet,
  title: "Spreadsheet Automation",
  price: "$99",
  description: "Smarter spreadsheets that reduce repetitive work through formulas, workflows, and clear reporting.",
  timeline: "2–5 days",
  features: ["Workflow review", "Formula automation", "Dashboard setup", "Documentation"]
}, {
  icon: Sparkles,
  title: "AI Integration",
  price: "Starting at $150",
  description: "Practical AI features integrated into your website or workflow to save time and improve service.",
  timeline: "5–10 days",
  features: ["Use-case planning", "Workflow integration", "Interface setup", "Testing and handoff"]
}, {
  icon: Search,
  title: "Online Research",
  price: "$20/hour",
  description: "Structured online research that turns scattered information into useful, organized business insight.",
  timeline: "Based on project",
  features: ["Source research", "Competitor review", "Data organization", "Summary reporting"]
}];
const navLinks = [{
  href: "#services",
  label: "Services"
}, {
  href: "#samples",
  label: "Samples"
}, {
  href: "#pricing",
  label: "Pricing"
}, {
  href: "#about",
  label: "About"
}, {
  href: "#contact",
  label: "Contact"
}];
const sampleCategories = [{
  title: "Logo Design",
  samples: [{
    src: "/samples/logo-aurora.svg",
    alt: "Aurora wellness logo design sample"
  }, {
    src: "/samples/logo-northline.svg",
    alt: "Northline architecture logo design sample"
  }, {
    src: "/samples/logo-sable.svg",
    alt: "Sable fashion logo design sample"
  }, {
    src: "/samples/logo-tide.svg",
    alt: "Tide and Table restaurant logo design sample"
  }]
}, {
  title: "Business Cards",
  samples: [{
    src: "/samples/card-aurora.svg",
    alt: "Aurora wellness business card sample"
  }, {
    src: "/samples/card-northline.svg",
    alt: "Northline architecture business card sample"
  }, {
    src: "/samples/card-sable.svg",
    alt: "Sable fashion business card sample"
  }, {
    src: "/samples/card-tide.svg",
    alt: "Tide and Table restaurant business card sample"
  }]
}, {
  title: "Flyers",
  samples: [{
    src: "/samples/flyer-aurora.svg",
    alt: "Aurora wellness event flyer sample"
  }, {
    src: "/samples/flyer-northline.svg",
    alt: "Northline architecture exhibition flyer sample"
  }, {
    src: "/samples/flyer-sable.svg",
    alt: "Sable fashion collection flyer sample"
  }, {
    src: "/samples/flyer-tide.svg",
    alt: "Tide and Table dining event flyer sample"
  }]
}];
const faqs = [{
  question: "How quickly can my project start?",
  answer: "Most projects can begin as soon as the scope, timeline, and initial payment are confirmed. We respond to new inquiries within one business day."
}, {
  question: "Are revisions included?",
  answer: "Yes. Every project includes reasonable revision rounds, and the exact number is confirmed before work begins."
}, {
  question: "Do you work with clients outside the United States?",
  answer: "Absolutely. Better Brand Services works remotely with businesses worldwide and keeps communication clear throughout the project."
}, {
  question: "What do you need from me to get started?",
  answer: "A short description of your business, goals, preferred style, deadline, and any examples you like are enough to begin the conversation."
}];
const primaryPhone = "+14084611901";
const primaryPhoneDisplay = "+1 (408) 461-1901";
const whatsappUrl = `https://wa.me/${primaryPhone.slice(1)}?text=` + encodeURIComponent("Hello Better Brand Services, I'm interested in your services.");
function HomePage() {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [showTop, setShowTop] = reactExports.useState(false);
  const [selectedService, setSelectedService] = reactExports.useState(null);
  const [openFaq, setOpenFaq] = reactExports.useState(0);
  const [serviceChoice, setServiceChoice] = reactExports.useState("");
  const [formStatus, setFormStatus] = reactExports.useState("idle");
  const modalRef = reactExports.useRef(null);
  const modalCloseRef = reactExports.useRef(null);
  const lastFocusedElementRef = reactExports.useRef(null);
  const serviceSelectRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowTop(window.scrollY > 700);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  reactExports.useEffect(() => {
    if (!menuOpen) return;
    const handleMenuKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleMenuKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleMenuKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);
  reactExports.useEffect(() => {
    document.body.style.overflow = selectedService ? "hidden" : "";
    if (!selectedService) return;
    lastFocusedElementRef.current = document.activeElement;
    modalCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedService(null);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusableElements = Array.from(modalRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [selectedService]);
  const chooseService = (service) => {
    setServiceChoice(service.title);
    setSelectedService(null);
    window.setTimeout(() => {
      document.querySelector("#contact")?.scrollIntoView({
        behavior: "smooth"
      });
      serviceSelectRef.current?.focus();
    }, 100);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [key, String(value)])).toString()
      });
      if (!response.ok) throw new Error("Submission failed");
      setFormStatus("success");
      form.reset();
      setServiceChoice("");
    } catch {
      setFormStatus("error");
    }
  };
  const clearFormNotice = () => {
    if (formStatus === "success" || formStatus === "error") setFormStatus("idle");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { id: "top", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: `site-header ${scrolled ? "is-scrolled" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nav-shell", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "brand", href: "#top", "aria-label": "Better Brand Services home", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "BBS", width: "76", height: "46" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brand-copy", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Better Brand" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Services" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "desktop-nav", "aria-label": "Main navigation", children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: link.href, children: link.label }, link.href)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desktop-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "builder-nav-link", href: "/builder", children: [
            "Build With AI ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button button-small desktop-cta", href: "#contact", children: [
            "Get Started ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "menu-button", type: "button", onClick: () => setMenuOpen((value) => !value), "aria-label": "Toggle navigation", "aria-expanded": menuOpen, "aria-controls": "mobile-navigation", children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) })
      ] }),
      menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mobile-nav", id: "mobile-navigation", "aria-label": "Mobile navigation", children: [
        navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: link.href, onClick: () => setMenuOpen(false), children: link.label }, link.href)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button button-ghost", href: "/builder", onClick: () => setMenuOpen(false), children: [
          "Build With AI ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "button", href: "#contact", onClick: () => setMenuOpen(false), children: "Get Started" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero section-pad", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-grid", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-orb hero-orb-one", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-orb hero-orb-two", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container hero-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "eyebrow reveal reveal-one", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 15 }),
          " Premium creative partner for growing brands"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "reveal reveal-two", children: [
          "Build a Brand",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "People Remember." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hero-lead reveal reveal-three", children: "We help businesses stand out with premium branding, logos, websites, marketing visuals, and professional content that drives growth." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-actions reveal reveal-four", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button", href: "#contact", children: [
            "Get Started ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button button-ghost builder-hero-action", href: "/builder", children: [
            "Build With AI ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button button-ghost", href: "#services", children: [
            "View Services ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 18 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-proof reveal reveal-five", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proof-avatars", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "BB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "BS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stars", "aria-label": "Five star service", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: "currentColor" }, star)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Professional quality. Clear communication. Reliable delivery." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metrics reveal reveal-five", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { value: "17", label: "Creative and digital services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { value: "24h", label: "Typical response time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { value: "100%", label: "Built around your goals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { value: "Global", label: "Remote client support" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "trust-strip", "aria-label": "Service promises", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container trust-inner", children: ["Premium Quality", "Fast Delivery", "Modern Design", "Direct Communication"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 17 }),
      " ",
      item
    ] }, item)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", id: "services", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "What We Do", title: "Creative, digital, and operational support in one place.", description: "Choose focused support for branding, content, websites, AI workflows, research, and the everyday work that keeps your business moving." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "service-grid", children: services.map((service, index) => {
        const Icon = service.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `service-card service-card-${index + 1}`, type: "button", onClick: () => setSelectedService(service), "aria-haspopup": "dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "service-number", children: String(index + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 23 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "service-card-title", children: service.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "service-card-description", children: service.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "service-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { size: 14 }),
              " ",
              service.timeline
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: service.price })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "service-link", children: [
            "Explore service ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
          ] })
        ] }, service.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad section-muted samples-section", id: "samples", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "samples-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-eyebrow", children: "Selected Work" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Samples" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A focused look at our logo, business card, and flyer design work." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sample-categories", children: sampleCategories.map((category, categoryIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sample-category", "aria-labelledby": `sample-category-${categoryIndex}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sample-category-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String(categoryIndex + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: `sample-category-${categoryIndex}`, children: category.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sample-grid", children: category.samples.map((sample) => /* @__PURE__ */ jsxRuntimeExports.jsx("figure", { className: "sample-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sample.src, alt: sample.alt, width: "900", height: "675", loading: "lazy", decoding: "async" }) }, sample.src)) })
      ] }, category.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "center-action", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button button-ghost", href: "#contact", children: [
        "Start your project ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", id: "pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Simple Pricing", title: "Professional creative work without the agency overhead.", description: "Clear base rates and realistic turnaround times make it easier to plan. Final scope and pricing are confirmed before work begins." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-layout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "price-list", children: services.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => chooseService(service), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-service", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(service.icon, { size: 19 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: service.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: service.timeline })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: service.price }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] }, service.title)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "package-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "package-label", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: "currentColor" }),
            " Best value"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Better Brand Launch Package" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A coordinated visual foundation for a business ready to look established from day one." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: ["Professional logo design", "Core brand image set", "Color and type direction", "Social profile assets", "Priority communication"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
            " ",
            item
          ] }, item)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "button", href: "#contact", onClick: () => setServiceChoice("Brand Identity Design"), children: [
            "Request a Quote ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad process-section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Delivery Times", title: "A clear process. A predictable turnaround.", description: "We keep every project focused, collaborative, and moving forward." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "process-grid", children: [["01", "Logo Design", "1–3 days", Palette], ["02", "Brand Images", "1–2 days", Image], ["03", "Video Editing", "2–5 days", Play], ["04", "Website Design", "5–10 days", CodeXml]].map(([number, title, time, icon]) => {
        const Icon = icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "process-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String(number) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 23 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: String(title) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: String(time) })
        ] }, String(title));
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "timeline-note", children: "Timelines are estimates and may vary with project scope, feedback, and revision needs." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", id: "about", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container about-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "about-visual", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "about-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "", width: "210", height: "127" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orbit orbit-one", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { size: 19 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orbit orbit-two", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 19 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orbit orbit-three", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 19 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "about-badge", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Built better." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Branded better." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "about-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-eyebrow", children: "About Better Brand Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "A stronger presence starts with a better brand." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Better Brand Services helps businesses create a stronger online presence through professional branding and creative digital solutions. We bring strategy, design, and practical execution together so every asset feels consistent and credible." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Our approach stays simple: understand your goals, communicate clearly, deliver quickly, and create modern work that supports real business growth." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "value-grid", children: [[ShieldCheck, "Professional quality"], [Zap, "Fast delivery"], [MessageCircle, "Clear communication"], [BadgeCheck, "Customer satisfaction"]].map(([icon, label]) => {
          const Icon = icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }),
            " ",
            String(label)
          ] }, String(label));
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "text-link", href: "#contact", children: [
          "Let’s build your brand ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad section-muted testimonial-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "testimonial-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { size: 42 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { children: "“The goal is never just to make something attractive. It is to make your business look like the clear, confident choice.”" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "testimonial-author", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "", width: "79", height: "48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Better Brand Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creative partner for growing businesses" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container faq-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "faq-intro", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-eyebrow", children: "Frequently Asked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Questions, answered clearly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Need something more specific? Send a message and receive a personal response within one business day." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "text-link", href: "#contact", children: [
          "Ask a question ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "faq-list", children: faqs.map((faq, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `faq-item ${openFaq === index ? "open" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpenFaq(openFaq === index ? -1 : index), "aria-expanded": openFaq === index, "aria-controls": `faq-answer-${index}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: faq.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 20 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "faq-answer", id: `faq-answer-${index}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: faq.answer }) })
      ] }, faq.question)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "section-pad contact-section", id: "contact", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "contact-glow", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container contact-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-copy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-eyebrow", children: "Start a Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Ready to build a brand people remember?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Tell us what you need, where your business is going, and how we can help. We reply within 24 hours." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-details", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${primaryPhone}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Call or text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: primaryPhoneDisplay })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:info@betterbrandservices.com", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "info@betterbrandservices.com" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappUrl, target: "_blank", rel: "noreferrer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Fastest response" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Chat on WhatsApp" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "contact-form", name: "better-brand-contact", method: "POST", action: "/__forms.html", "data-netlify": "true", "netlify-honeypot": "bot-field", onSubmit: handleSubmit, onChange: clearFormNotice, "aria-busy": formStatus === "sending", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "form-name", value: "better-brand-contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "subject", value: "New Better Brand Services inquiry", "data-remove-prefix": true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden-field", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Do not fill this out: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "bot-field", tabIndex: -1, autoComplete: "off" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Project inquiry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "All fields marked * are required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Name *", name: "name", placeholder: "Your full name", autoComplete: "name", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Email *", name: "email", type: "email", placeholder: "you@company.com", autoComplete: "email", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Phone Number", name: "phone", type: "tel", placeholder: "+1 555 000 0000", autoComplete: "tel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Service Needed *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ref: serviceSelectRef, name: "service", required: true, value: serviceChoice, onChange: (event) => setServiceChoice(event.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select a service" }),
                services.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: service.title }, service.title)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Something else" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Message *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "message", required: true, rows: 5, placeholder: "Tell us about your business, project goals, and ideal timeline." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button form-submit", type: "submit", disabled: formStatus === "sending", children: formStatus === "sending" ? "Sending inquiry…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Send Inquiry ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 17 })
          ] }) }),
          formStatus === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-notice success", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }),
            " Thank you. Your inquiry was sent successfully. Better Brand Services will contact you shortly."
          ] }),
          formStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-notice error", role: "alert", children: "Something went wrong. Please retry or contact us by phone or email." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container footer-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-brand", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "brand", href: "#top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/compact-logo.png", alt: "BBS", width: "76", height: "46" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brand-copy", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Better Brand" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Services" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Premium branding, websites, visuals, and content for businesses ready to look their best." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Explore" }),
          navLinks.slice(0, 4).map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: link.href, children: link.label }, link.href))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Services" }),
          services.slice(0, 4).map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", children: service.title }, service.title))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${primaryPhone}`, children: primaryPhoneDisplay }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:info@betterbrandservices.com", children: "Email us" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: whatsappUrl, target: "_blank", rel: "noreferrer", children: "WhatsApp" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container footer-bottom", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© 2026 Better Brand Services. All rights reserved." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "betterbrandservices.com" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "whatsapp-button", href: whatsappUrl, target: "_blank", rel: "noreferrer", "aria-label": "Chat with Better Brand Services on WhatsApp", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 23, fill: "currentColor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WhatsApp" })
    ] }),
    showTop && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "top-button", type: "button", onClick: () => window.scrollTo({
      top: 0,
      behavior: "smooth"
    }), "aria-label": "Scroll to top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 20 }) }),
    selectedService && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", role: "presentation", onMouseDown: () => setSelectedService(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: modalRef, className: "service-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "service-modal-title", "aria-describedby": "service-modal-description", onMouseDown: (event) => event.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ref: modalCloseRef, className: "modal-close", type: "button", onClick: () => setSelectedService(null), "aria-label": "Close service details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx(selectedService.icon, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "modal-eyebrow", children: "Better Brand Service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "service-modal-title", children: selectedService.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "service-modal-description", children: selectedService.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { size: 16 }),
          " ",
          selectedService.timeline
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedService.price })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: selectedService.features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
        " ",
        feature
      ] }, feature)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button", type: "button", onClick: () => chooseService(selectedService), children: [
        "Request This Service ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
      ] })
    ] }) })
  ] });
}
function SectionHeading({
  eyebrow,
  title,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-eyebrow", children: eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description })
  ] });
}
function Metric({
  value,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
  ] });
}
function FormField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, placeholder, autoComplete, required })
  ] });
}
export {
  HomePage as component
};
