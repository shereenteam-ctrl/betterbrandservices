export type BbsAiRequest = {
  prompt: string
}

export type BbsAiResponse = {
  html: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function detectBusiness(prompt: string) {
  const text = prompt.toLowerCase()

  if (
    text.includes('cafe') ||
    text.includes('coffee') ||
    text.includes('coffee shop')
  ) {
    return {
      type: 'Cafe',
      title: 'Brew & Bean',
      subtitle: 'Fresh coffee, warm moments.',
      primary: 'View Our Menu',
      secondary: 'Visit Us',
    }
  }

  if (
    text.includes('restaurant') ||
    text.includes('food') ||
    text.includes('dining')
  ) {
    return {
      type: 'Restaurant',
      title: 'Savor & Table',
      subtitle: 'Great food. Great people. Great moments.',
      primary: 'Explore Menu',
      secondary: 'Reserve a Table',
    }
  }

  if (
    text.includes('portfolio') ||
    text.includes('designer') ||
    text.includes('developer')
  ) {
    return {
      type: 'Portfolio',
      title: 'Creative Portfolio',
      subtitle: 'Ideas transformed into meaningful digital experiences.',
      primary: 'View My Work',
      secondary: 'Get In Touch',
    }
  }

  if (
    text.includes('agency') ||
    text.includes('marketing') ||
    text.includes('business')
  ) {
    return {
      type: 'Business',
      title: 'Better Business',
      subtitle: 'Modern solutions built to help your business grow.',
      primary: 'Get Started',
      secondary: 'Learn More',
    }
  }

  if (
    text.includes('gym') ||
    text.includes('fitness') ||
    text.includes('workout')
  ) {
    return {
      type: 'Fitness',
      title: 'Peak Fitness',
      subtitle: 'Build strength. Build confidence. Become your best.',
      primary: 'Join Today',
      secondary: 'Explore Programs',
    }
  }

  return {
    type: 'Business',
    title: 'Your New Website',
    subtitle: 'A modern website designed around your vision.',
    primary: 'Get Started',
    secondary: 'Learn More',
  }
}

function generateWebsite(prompt: string) {
  const business = detectBusiness(prompt)
  const safePrompt = escapeHtml(prompt)

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${escapeHtml(business.title)} | Better Brand Services</title>

  <style>
    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
      background: #07111f;
      color: #ffffff;
    }

    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 7%;
      background: rgba(7, 17, 31, 0.82);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255,255,255,.08);
    }

    .logo {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    nav a {
      color: #dbeafe;
      text-decoration: none;
      margin-left: 28px;
      font-size: 14px;
    }

    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 130px 7% 80px;
      background:
        radial-gradient(circle at 20% 20%, rgba(59,130,246,.28), transparent 35%),
        radial-gradient(circle at 80% 70%, rgba(139,92,246,.24), transparent 35%),
        #07111f;
    }

    .hero-content {
      max-width: 850px;
    }

    .badge {
      display: inline-block;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(96,165,250,.12);
      border: 1px solid rgba(147,197,253,.2);
      color: #93c5fd;
      font-size: 13px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: clamp(52px, 9vw, 110px);
      line-height: .95;
      letter-spacing: -5px;
    }

    .subtitle {
      max-width: 650px;
      margin-top: 30px;
      color: #a9b7ca;
      font-size: clamp(18px, 2.5vw, 25px);
      line-height: 1.6;
    }

    .buttons {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 35px;
    }

    .button {
      display: inline-block;
      padding: 15px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
    }

    .primary {
      background: #ffffff;
      color: #07111f;
    }

    .secondary {
      border: 1px solid rgba(255,255,255,.18);
      color: white;
      background: rgba(255,255,255,.05);
    }

    section {
      padding: 100px 7%;
    }

    .section-title {
      max-width: 700px;
      margin-bottom: 50px;
    }

    .section-title h2 {
      font-size: clamp(36px, 5vw, 62px);
      margin: 0 0 18px;
      letter-spacing: -2px;
    }

    .section-title p {
      color: #9caec3;
      font-size: 18px;
      line-height: 1.7;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .card {
      padding: 30px;
      min-height: 220px;
      border-radius: 22px;
      background: linear-gradient(
        145deg,
        rgba(255,255,255,.09),
        rgba(255,255,255,.03)
      );
      border: 1px solid rgba(255,255,255,.08);
    }

    .card h3 {
      font-size: 24px;
      margin-top: 0;
    }

    .card p {
      color: #9caec3;
      line-height: 1.7;
    }

    .cta {
      margin: 40px 7% 100px;
      padding: 70px;
      border-radius: 30px;
      text-align: center;
      background:
        linear-gradient(
          135deg,
          rgba(59,130,246,.25),
          rgba(139,92,246,.22)
        );
      border: 1px solid rgba(255,255,255,.1);
    }

    .cta h2 {
      font-size: clamp(36px, 5vw, 60px);
      margin: 0 0 20px;
    }

    .cta p {
      color: #c3cede;
      max-width: 650px;
      margin: 0 auto 30px;
      line-height: 1.7;
    }

    footer {
      padding: 35px 7%;
      border-top: 1px solid rgba(255,255,255,.08);
      color: #8090a6;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    @media (max-width: 800px) {
      nav a {
        display: none;
      }

      .cards {
        grid-template-columns: 1fr;
      }

      .cta {
        margin-left: 4%;
        margin-right: 4%;
        padding: 45px 25px;
      }

      h1 {
        letter-spacing: -3px;
      }
    }
  </style>
</head>

<body>

  <nav>
    <div class="logo">BBS AI</div>

    <div>
      <a href="#about">About</a>
      <a href="#features">Features</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <main>

    <section class="hero">
      <div class="hero-content">

        <div class="badge">
          ${escapeHtml(business.type)} • Built by BBS AI
        </div>

        <h1>${escapeHtml(business.title)}</h1>

        <p class="subtitle">
          ${escapeHtml(business.subtitle)}
        </p>

        <div class="buttons">
          <a class="button primary" href="#features">
            ${escapeHtml(business.primary)}
          </a>

          <a class="button secondary" href="#contact">
            ${escapeHtml(business.secondary)}
          </a>
        </div>

      </div>
    </section>

    <section id="about">

      <div class="section-title">
        <h2>Built around your idea.</h2>

        <p>
          BBS AI transformed your request into a modern website structure
          designed for ${escapeHtml(business.type.toLowerCase())} businesses.
        </p>
      </div>

      <div class="cards">

        <div class="card">
          <h3>Modern Design</h3>
          <p>
            A clean, responsive interface designed to look great across
            desktop, tablet, and mobile devices.
          </p>
        </div>

        <div class="card">
          <h3>Responsive</h3>
          <p>
            The layout automatically adapts to different screen sizes
            so visitors get a smooth experience everywhere.
          </p>
        </div>

        <div class="card">
          <h3>Built by BBS AI</h3>
          <p>
            This website was generated by the Better Brand Services
            website-building engine.
          </p>
        </div>

      </div>

    </section>

    <section id="features">

      <div class="section-title">
        <h2>Everything you need.</h2>

        <p>
          Your website can be expanded with additional pages, sections,
          branding, forms, products, services, and more.
        </p>
      </div>

      <div class="cards">

        <div class="card">
          <h3>01</h3>
          <p>Clear navigation and strong calls to action.</p>
        </div>

        <div class="card">
          <h3>02</h3>
          <p>Professional sections designed around your business.</p>
        </div>

        <div class="card">
          <h3>03</h3>
          <p>Simple structure that can be customized later.</p>
        </div>

      </div>

    </section>

    <section id="contact" class="cta">

      <h2>Ready to get started?</h2>

      <p>
        Turn your idea into a professional online presence with
        Better Brand Services.
      </p>

      <a class="button primary" href="#">
        ${escapeHtml(business.primary)}
      </a>

    </section>

  </main>

  <footer>
    <span>© 2026 Better Brand Services</span>
    <span>Generated by BBS AI</span>
  </footer>

  <!-- Original user request:
       ${safePrompt}
  -->

</body>
</html>`
}

export async function generateWithBbsAI(
  request: BbsAiRequest,
): Promise<BbsAiResponse> {
  const html = generateWebsite(request.prompt)

  return {
    html,
  }
}