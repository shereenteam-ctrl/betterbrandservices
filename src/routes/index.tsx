import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Code2,
  CreditCard,
  FileText,
  Globe2,
  Image,
  Images,
  Layers3,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  Phone,
  Play,
  Quote,
  Rocket,
  Search,
  Send,
  Sheet,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Video,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title:
          'Better Brand Services | Branding, Websites, Logos & Creative Solutions',
      },
      {
        name: 'description',
        content:
          'Better Brand Services helps businesses grow with premium branding, websites, logo design, marketing graphics, and creative digital solutions.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://betterbrandservices.com/' },
      { property: 'og:site_name', content: 'Better Brand Services' },
      {
        property: 'og:title',
        content: 'Better Brand Services — Build a Brand People Remember',
      },
      {
        property: 'og:description',
        content:
          'Premium logos, websites, marketing visuals, branding, and professional content for growing businesses.',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: 'https://betterbrandservices.com/' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: HomePage,
})

type Service = {
  icon: LucideIcon
  title: string
  price: string
  description: string
  timeline: string
  features: string[]
}

const services: Service[] = [
  {
    icon: Palette,
    title: 'Logo Design',
    price: '$30',
    description:
      'Professional custom logos designed to make your business recognizable, credible, and memorable.',
    timeline: '2–3 days',
    features: ['Custom concepts', 'Revision rounds', 'High-resolution files', 'Web and print formats'],
  },
  {
    icon: Layers3,
    title: 'Brand Identity Design',
    price: '$149',
    description:
      'A cohesive visual identity that gives your business a clear, consistent, and professional presence.',
    timeline: '5–7 days',
    features: ['Logo system', 'Color palette', 'Typography direction', 'Brand guidelines'],
  },
  {
    icon: WandSparkles,
    title: 'AI Generated Images',
    price: '$20 per image',
    description:
      'Custom AI-assisted imagery created for campaigns, products, concepts, and branded digital content.',
    timeline: '12–24 hours',
    features: ['Custom art direction', 'Prompt development', 'High-resolution output', 'Commercial-ready files'],
  },
  {
    icon: Images,
    title: 'Social Media Designs',
    price: '$15 per design',
    description:
      'Platform-ready social graphics designed to keep your content polished, consistent, and easy to recognize.',
    timeline: '12–24 hours',
    features: ['Feed posts', 'Story graphics', 'Campaign creatives', 'Platform-ready sizing'],
  },
  {
    icon: CreditCard,
    title: 'Business Cards',
    price: '$35',
    description:
      'Professional business card layouts that carry your brand confidently into every introduction.',
    timeline: '1–2 days',
    features: ['Front and back design', 'Print-ready files', 'Brand alignment', 'Digital preview'],
  },
  {
    icon: FileText,
    title: 'Flyers',
    price: '$40',
    description:
      'Clear, compelling flyer designs for promotions, events, launches, and local marketing campaigns.',
    timeline: '1–2 days',
    features: ['Custom layout', 'Print-ready files', 'Digital version', 'Focused call to action'],
  },
  {
    icon: Video,
    title: 'Video Editing',
    price: '$50 per video',
    description:
      'Polished video edits with clean pacing, refined audio, and visuals built to keep viewers engaged.',
    timeline: '2–4 days',
    features: ['Professional editing', 'Color and audio polish', 'Captions and motion', 'Platform-ready exports'],
  },
  {
    icon: Play,
    title: 'YouTube Shorts Editing',
    price: '$20 per short',
    description:
      'Fast-paced vertical edits optimized for YouTube Shorts, retention, clarity, and repeat viewing.',
    timeline: '24 hours',
    features: ['Vertical formatting', 'Paced cuts', 'On-screen captions', 'Platform-ready export'],
  },
  {
    icon: Smartphone,
    title: 'Instagram Reels Editing',
    price: '$20 per reel',
    description:
      'Engaging reel edits that combine pacing, captions, and visual polish for mobile-first audiences.',
    timeline: '24 hours',
    features: ['Vertical formatting', 'Captions', 'Music synchronization', 'Instagram-ready export'],
  },
  {
    icon: Clapperboard,
    title: 'Advertisement Videos',
    price: '$99',
    description:
      'Focused advertisement videos designed to communicate your offer quickly and inspire action.',
    timeline: '3–5 days',
    features: ['Conversion-led structure', 'Brand styling', 'Text and motion', 'Ad-ready exports'],
  },
  {
    icon: MonitorSmartphone,
    title: 'Landing Pages',
    price: '$100',
    description:
      'Focused, responsive landing pages designed around one offer, one audience, and one clear action.',
    timeline: '3–5 days',
    features: ['Responsive design', 'Conversion-focused layout', 'Contact integration', 'SEO foundations'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Portfolio Websites',
    price: '$150',
    description:
      'Modern portfolio websites that present your work, capabilities, and experience with confidence.',
    timeline: '5–7 days',
    features: ['Responsive design', 'Project showcase', 'About and contact pages', 'SEO foundations'],
  },
  {
    icon: Building2,
    title: 'Business Websites',
    price: '$250',
    description:
      'Modern, responsive business websites that look premium, load quickly, and turn visits into inquiries.',
    timeline: '7–10 days',
    features: ['Responsive design', 'Conversion strategy', 'SEO foundations', 'Contact integration'],
  },
  {
    icon: Code2,
    title: 'Data Entry',
    price: '$15/hour',
    description:
      'Accurate, organized data entry support for records, documents, catalogs, and recurring business tasks.',
    timeline: 'Based on project',
    features: ['Data cleanup', 'Record updates', 'File organization', 'Quality checks'],
  },
  {
    icon: Sheet,
    title: 'Spreadsheet Automation',
    price: '$99',
    description:
      'Smarter spreadsheets that reduce repetitive work through formulas, workflows, and clear reporting.',
    timeline: '2–5 days',
    features: ['Workflow review', 'Formula automation', 'Dashboard setup', 'Documentation'],
  },
  {
    icon: Sparkles,
    title: 'AI Integration',
    price: 'Starting at $150',
    description:
      'Practical AI features integrated into your website or workflow to save time and improve service.',
    timeline: '5–10 days',
    features: ['Use-case planning', 'Workflow integration', 'Interface setup', 'Testing and handoff'],
  },
  {
    icon: Search,
    title: 'Online Research',
    price: '$20/hour',
    description:
      'Structured online research that turns scattered information into useful, organized business insight.',
    timeline: 'Based on project',
    features: ['Source research', 'Competitor review', 'Data organization', 'Summary reporting'],
  },
]

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#samples', label: 'Samples' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const sampleCategories = [
  {
    title: 'Logo Design',
    samples: [
      { src: '/samples/logo-aurora.svg', alt: 'Aurora wellness logo design sample' },
      { src: '/samples/logo-northline.svg', alt: 'Northline architecture logo design sample' },
      { src: '/samples/logo-sable.svg', alt: 'Sable fashion logo design sample' },
      { src: '/samples/logo-tide.svg', alt: 'Tide and Table restaurant logo design sample' },
    ],
  },
  {
    title: 'Business Cards',
    samples: [
      { src: '/samples/card-aurora.svg', alt: 'Aurora wellness business card sample' },
      { src: '/samples/card-northline.svg', alt: 'Northline architecture business card sample' },
      { src: '/samples/card-sable.svg', alt: 'Sable fashion business card sample' },
      { src: '/samples/card-tide.svg', alt: 'Tide and Table restaurant business card sample' },
    ],
  },
  {
    title: 'Flyers',
    samples: [
      { src: '/samples/flyer-aurora.svg', alt: 'Aurora wellness event flyer sample' },
      { src: '/samples/flyer-northline.svg', alt: 'Northline architecture exhibition flyer sample' },
      { src: '/samples/flyer-sable.svg', alt: 'Sable fashion collection flyer sample' },
      { src: '/samples/flyer-tide.svg', alt: 'Tide and Table dining event flyer sample' },
    ],
  },
]

const faqs = [
  {
    question: 'How quickly can my project start?',
    answer:
      'Most projects can begin as soon as the scope, timeline, and initial payment are confirmed. We respond to new inquiries within one business day.',
  },
  {
    question: 'Are revisions included?',
    answer:
      'Yes. Every project includes reasonable revision rounds, and the exact number is confirmed before work begins.',
  },
  {
    question: 'Do you work with clients outside the United States?',
    answer:
      'Absolutely. Better Brand Services works remotely with businesses worldwide and keeps communication clear throughout the project.',
  },
  {
    question: 'What do you need from me to get started?',
    answer:
      'A short description of your business, goals, preferred style, deadline, and any examples you like are enough to begin the conversation.',
  },
]

const primaryPhone = '+14084611901'
const primaryPhoneDisplay = '+1 (408) 461-1901'
const whatsappUrl =
  `https://wa.me/${primaryPhone.slice(1)}?text=` +
  encodeURIComponent(
    "Hello Better Brand Services, I'm interested in your services.",
  )

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [openFaq, setOpenFaq] = useState(0)
  const [serviceChoice, setServiceChoice] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const modalRef = useRef<HTMLDivElement>(null)
  const modalCloseRef = useRef<HTMLButtonElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const serviceSelectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
      setShowTop(window.scrollY > 700)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false)
    }

    document.addEventListener('keydown', handleMenuKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('keydown', handleMenuKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = selectedService ? 'hidden' : ''

    if (!selectedService) return

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null
    modalCloseRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedService(null)
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) return

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedElementRef.current?.focus()
    }
  }, [selectedService])

  const chooseService = (service: Service) => {
    setServiceChoice(service.title)
    setSelectedService(null)
    window.setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
      serviceSelectRef.current?.focus()
    }, 100)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus('sending')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(
          Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
        ).toString(),
      })

      if (!response.ok) throw new Error('Submission failed')

      setFormStatus('success')
      form.reset()
      setServiceChoice('')
    } catch {
      setFormStatus('error')
    }
  }

  const clearFormNotice = () => {
    if (formStatus === 'success' || formStatus === 'error') setFormStatus('idle')
  }

  return (
    <main id="top">
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-shell">
          <a className="brand" href="#top" aria-label="Better Brand Services home">
            <img src="/compact-logo.png" alt="BBS" width="76" height="46" />
            <span className="brand-copy">
              <strong>Better Brand</strong>
              <small>Services</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="desktop-actions">
            <a className="builder-nav-link" href="/builder">
              Build With AI <Sparkles size={14} />
            </a>
            <a className="button button-small desktop-cta" href="#contact">
              Get Started <ArrowRight size={16} />
            </a>
          </div>

          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a className="button button-ghost" href="/builder" onClick={() => setMenuOpen(false)}>
              Build With AI <Sparkles size={16} />
            </a>
            <a className="button" href="#contact" onClick={() => setMenuOpen(false)}>
              Get Started
            </a>
          </nav>
        )}
      </header>

      <section className="hero section-pad">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="container hero-content">
          <div className="eyebrow reveal reveal-one">
            <Sparkles size={15} /> Premium creative partner for growing brands
          </div>
          <h1 className="reveal reveal-two">
            Build a Brand
            <span>People Remember.</span>
          </h1>
          <p className="hero-lead reveal reveal-three">
            We help businesses stand out with premium branding, logos, websites,
            marketing visuals, and professional content that drives growth.
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button" href="#contact">
              Get Started <ArrowRight size={18} />
            </a>
            <a className="button button-ghost builder-hero-action" href="/builder">
              Build With AI <Sparkles size={18} />
            </a>
            <a className="button button-ghost" href="#services">
              View Services <ChevronDown size={18} />
            </a>
          </div>

          <div className="hero-proof reveal reveal-five">
            <div className="proof-avatars" aria-hidden="true">
              <span>BB</span><span>BS</span><span>+</span>
            </div>
            <div>
              <div className="stars" aria-label="Five star service">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}
              </div>
              <p>Professional quality. Clear communication. Reliable delivery.</p>
            </div>
          </div>

          <div className="metrics reveal reveal-five">
            <Metric value="17" label="Creative and digital services" />
            <Metric value="24h" label="Typical response time" />
            <Metric value="100%" label="Built around your goals" />
            <Metric value="Global" label="Remote client support" />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Service promises">
        <div className="container trust-inner">
          {['Premium Quality', 'Fast Delivery', 'Modern Design', 'Direct Communication'].map((item) => (
            <span key={item}><BadgeCheck size={17} /> {item}</span>
          ))}
        </div>
      </section>

      <section className="section-pad" id="services">
        <div className="container">
          <SectionHeading
            eyebrow="What We Do"
            title="Creative, digital, and operational support in one place."
            description="Choose focused support for branding, content, websites, AI workflows, research, and the everyday work that keeps your business moving."
          />
          <div className="service-grid">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <button
                  className={`service-card service-card-${index + 1}`}
                  type="button"
                  key={service.title}
                  onClick={() => setSelectedService(service)}
                  aria-haspopup="dialog"
                >
                  <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="icon-box"><Icon size={23} /></span>
                  <span className="service-card-title">{service.title}</span>
                  <span className="service-card-description">{service.description}</span>
                  <span className="service-meta">
                    <span><Clock3 size={14} /> {service.timeline}</span>
                    <strong>{service.price}</strong>
                  </span>
                  <span className="service-link">Explore service <ArrowRight size={16} /></span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-pad section-muted samples-section" id="samples">
        <div className="container">
          <header className="samples-heading">
            <span className="section-eyebrow">Selected Work</span>
            <h2>Samples</h2>
            <p>A focused look at our logo, business card, and flyer design work.</p>
          </header>
          <div className="sample-categories">
            {sampleCategories.map((category, categoryIndex) => (
              <section className="sample-category" key={category.title} aria-labelledby={`sample-category-${categoryIndex}`}>
                <div className="sample-category-heading">
                  <span>{String(categoryIndex + 1).padStart(2, '0')}</span>
                  <h3 id={`sample-category-${categoryIndex}`}>{category.title}</h3>
                </div>
                <div className="sample-grid">
                  {category.samples.map((sample) => (
                    <figure className="sample-card" key={sample.src}>
                      <img
                        src={sample.src}
                        alt={sample.alt}
                        width="900"
                        height="675"
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="center-action">
            <a className="button button-ghost" href="#contact">Start your project <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="section-pad" id="pricing">
        <div className="container">
          <SectionHeading
            eyebrow="Simple Pricing"
            title="Professional creative work without the agency overhead."
            description="Clear base rates and realistic turnaround times make it easier to plan. Final scope and pricing are confirmed before work begins."
          />
          <div className="pricing-layout">
            <div className="price-list">
              {services.map((service) => (
                <button type="button" key={service.title} onClick={() => chooseService(service)}>
                  <span className="price-service">
                    <service.icon size={19} />
                    <span><b>{service.title}</b><small>{service.timeline}</small></span>
                  </span>
                  <strong>{service.price}</strong>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
            <aside className="package-card">
              <span className="package-label"><Star size={14} fill="currentColor" /> Best value</span>
              <h3>Better Brand Launch Package</h3>
              <p>A coordinated visual foundation for a business ready to look established from day one.</p>
              <ul>
                {['Professional logo design', 'Core brand image set', 'Color and type direction', 'Social profile assets', 'Priority communication'].map((item) => (
                  <li key={item}><Check size={16} /> {item}</li>
                ))}
              </ul>
              <a className="button" href="#contact" onClick={() => setServiceChoice('Brand Identity Design')}>
                Request a Quote <ArrowRight size={17} />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-pad process-section">
        <div className="container">
          <SectionHeading
            eyebrow="Delivery Times"
            title="A clear process. A predictable turnaround."
            description="We keep every project focused, collaborative, and moving forward."
          />
          <div className="process-grid">
            {[
              ['01', 'Logo Design', '1–3 days', Palette],
              ['02', 'Brand Images', '1–2 days', Image],
              ['03', 'Video Editing', '2–5 days', Play],
              ['04', 'Website Design', '5–10 days', Code2],
            ].map(([number, title, time, icon]) => {
              const Icon = icon as LucideIcon
              return (
                <article className="process-card" key={String(title)}>
                  <span>{String(number)}</span>
                  <Icon size={23} />
                  <h3>{String(title)}</h3>
                  <p>{String(time)}</p>
                </article>
              )
            })}
          </div>
          <p className="timeline-note">Timelines are estimates and may vary with project scope, feedback, and revision needs.</p>
        </div>
      </section>

      <section className="section-pad" id="about">
        <div className="container about-grid">
          <div className="about-visual">
            <div className="about-logo"><img src="/compact-logo.png" alt="" width="210" height="127" /></div>
            <div className="orbit orbit-one"><Globe2 size={19} /></div>
            <div className="orbit orbit-two"><Sparkles size={19} /></div>
            <div className="orbit orbit-three"><Rocket size={19} /></div>
            <div className="about-badge"><span>Built better.</span><strong>Branded better.</strong></div>
          </div>
          <div className="about-copy">
            <span className="section-eyebrow">About Better Brand Services</span>
            <h2>A stronger presence starts with a better brand.</h2>
            <p>
              Better Brand Services helps businesses create a stronger online presence through professional branding and creative digital solutions. We bring strategy, design, and practical execution together so every asset feels consistent and credible.
            </p>
            <p>
              Our approach stays simple: understand your goals, communicate clearly, deliver quickly, and create modern work that supports real business growth.
            </p>
            <div className="value-grid">
              {[
                [ShieldCheck, 'Professional quality'],
                [Zap, 'Fast delivery'],
                [MessageCircle, 'Clear communication'],
                [BadgeCheck, 'Customer satisfaction'],
              ].map(([icon, label]) => {
                const Icon = icon as LucideIcon
                return <span key={String(label)}><Icon size={18} /> {String(label)}</span>
              })}
            </div>
            <a className="text-link" href="#contact">Let’s build your brand <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="section-pad section-muted testimonial-section">
        <div className="container">
          <div className="testimonial-card">
            <Quote size={42} />
            <blockquote>
              “The goal is never just to make something attractive. It is to make your business look like the clear, confident choice.”
            </blockquote>
            <div className="testimonial-author">
              <img src="/compact-logo.png" alt="" width="79" height="48" />
              <div><strong>Better Brand Services</strong><span>Creative partner for growing businesses</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container faq-layout">
          <div className="faq-intro">
            <span className="section-eyebrow">Frequently Asked</span>
            <h2>Questions, answered clearly.</h2>
            <p>Need something more specific? Send a message and receive a personal response within one business day.</p>
            <a className="text-link" href="#contact">Ask a question <ArrowRight size={17} /></a>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span><ChevronDown size={20} />
                </button>
                <div className="faq-answer" id={`faq-answer-${index}`}><p>{faq.answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad contact-section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="section-eyebrow">Start a Project</span>
            <h2>Ready to build a brand people remember?</h2>
            <p>Tell us what you need, where your business is going, and how we can help. We reply within 24 hours.</p>
            <div className="contact-details">
              <a href={`tel:${primaryPhone}`}><span><Phone size={20} /></span><div><small>Call or text</small><strong>{primaryPhoneDisplay}</strong></div></a>
              <a href="mailto:info@betterbrandservices.com"><span><Mail size={20} /></span><div><small>Email</small><strong>info@betterbrandservices.com</strong></div></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer"><span><MessageCircle size={20} /></span><div><small>Fastest response</small><strong>Chat on WhatsApp</strong></div></a>
            </div>
          </div>

          <form
            className="contact-form"
            name="better-brand-contact"
            method="POST"
            action="/__forms.html"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            onChange={clearFormNotice}
            aria-busy={formStatus === 'sending'}
          >
            <input type="hidden" name="form-name" value="better-brand-contact" />
            <input type="hidden" name="subject" value="New Better Brand Services inquiry" data-remove-prefix />
            <p className="hidden-field" aria-hidden="true">
              <label>Do not fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
            </p>
            <div className="form-heading"><span>Project inquiry</span><small>All fields marked * are required</small></div>
            <div className="form-row">
              <FormField label="Name *" name="name" placeholder="Your full name" autoComplete="name" required />
              <FormField label="Email *" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
            </div>
            <div className="form-row">
              <FormField label="Phone Number" name="phone" type="tel" placeholder="+1 555 000 0000" autoComplete="tel" />
              <label className="field-label">
                <span>Service Needed *</span>
                <select ref={serviceSelectRef} name="service" required value={serviceChoice} onChange={(event) => setServiceChoice(event.target.value)}>
                  <option value="" disabled>Select a service</option>
                  {services.map((service) => <option key={service.title}>{service.title}</option>)}
                  <option>Something else</option>
                </select>
              </label>
            </div>
            <label className="field-label">
              <span>Message *</span>
              <textarea name="message" required rows={5} placeholder="Tell us about your business, project goals, and ideal timeline." />
            </label>
            <button className="button form-submit" type="submit" disabled={formStatus === 'sending'}>
              {formStatus === 'sending' ? 'Sending inquiry…' : <>Send Inquiry <Send size={17} /></>}
            </button>
            {formStatus === 'success' && <div className="form-notice success" role="status" aria-live="polite"><Check size={18} /> Thank you. Your inquiry was sent successfully. Better Brand Services will contact you shortly.</div>}
            {formStatus === 'error' && <div className="form-notice error" role="alert">Something went wrong. Please retry or contact us by phone or email.</div>}
          </form>
        </div>
      </section>

      <footer>
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand" href="#top"><img src="/compact-logo.png" alt="BBS" width="76" height="46" /><span className="brand-copy"><strong>Better Brand</strong><small>Services</small></span></a>
            <p>Premium branding, websites, visuals, and content for businesses ready to look their best.</p>
          </div>
          <div><strong>Explore</strong>{navLinks.slice(0, 4).map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
          <div><strong>Services</strong>{services.slice(0, 4).map((service) => <a key={service.title} href="#services">{service.title}</a>)}</div>
          <div><strong>Contact</strong><a href={`tel:${primaryPhone}`}>{primaryPhoneDisplay}</a><a href="mailto:info@betterbrandservices.com">Email us</a><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Better Brand Services. All rights reserved.</span><span>betterbrandservices.com</span></div>
      </footer>

      <a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with Better Brand Services on WhatsApp">
        <MessageCircle size={23} fill="currentColor" /><span>WhatsApp</span>
      </a>

      {showTop && <button className="top-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><ArrowUp size={20} /></button>}

      {selectedService && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedService(null)}>
          <div ref={modalRef} className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" aria-describedby="service-modal-description" onMouseDown={(event) => event.stopPropagation()}>
            <button ref={modalCloseRef} className="modal-close" type="button" onClick={() => setSelectedService(null)} aria-label="Close service details"><X size={20} /></button>
            <span className="icon-box"><selectedService.icon size={24} /></span>
            <span className="modal-eyebrow">Better Brand Service</span>
            <h2 id="service-modal-title">{selectedService.title}</h2>
            <p id="service-modal-description">{selectedService.description}</p>
            <div className="modal-meta"><span><Clock3 size={16} /> {selectedService.timeline}</span><strong>{selectedService.price}</strong></div>
            <ul>{selectedService.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul>
            <button className="button" type="button" onClick={() => chooseService(selectedService)}>Request This Service <ArrowRight size={17} /></button>
          </div>
        </div>
      )}
    </main>
  )
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="section-heading"><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span></div>
}

function FormField({ label, name, type = 'text', placeholder, autoComplete, required = false }: { label: string; name: string; type?: string; placeholder: string; autoComplete?: string; required?: boolean }) {
  return <label className="field-label"><span>{label}</span><input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required={required} /></label>
}
