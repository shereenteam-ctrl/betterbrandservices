export type BbsAiRequest = {
  prompt: string
}

export type BbsAiResponse = {
  html: string
}

function cleanHtml(value: string): string {
  let html = String(value || '').trim()

  html = html
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  if (!html.toLowerCase().includes('<!doctype')) {
    html = `<!doctype html>\n${html}`
  }

  return html.trim()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function generateWithBbsAI(
  request: BbsAiRequest,
): Promise<BbsAiResponse> {
  const prompt = request.prompt.trim()

  if (!prompt) {
    throw new Error('BBS AI prompt is empty.')
  }

  const safePrompt = escapeHtml(prompt)

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BBS AI Website</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f5f7fb;
      color: #111827;
    }

    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .card {
      width: min(900px, 100%);
      padding: 60px 40px;
      background: white;
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    }

    h1 {
      margin: 0 0 20px;
      font-size: clamp(42px, 7vw, 72px);
    }

    p {
      margin: 0 auto;
      max-width: 700px;
      font-size: 20px;
      line-height: 1.6;
      color: #6b7280;
    }

    .prompt {
      margin-top: 30px;
      padding: 20px;
      background: #f3f4f6;
      border-radius: 14px;
      color: #374151;
    }
  </style>
</head>
<body>
  <main class="hero">
    <section class="card">
      <h1>BBS AI</h1>
      <p>Better Brand Services AI generated this website.</p>
      <div class="prompt">${safePrompt}</div>
    </section>
  </main>
</body>
</html>
`

  return {
    html: cleanHtml(html),
  }
}
