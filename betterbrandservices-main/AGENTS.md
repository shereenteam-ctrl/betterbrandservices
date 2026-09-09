# Better Brand Services Architecture

## Project Overview

This repository contains the Better Brand Services marketing website. It is a single-page agency experience built with TanStack Start, React, TypeScript, Tailwind CSS, and Netlify Forms.

## Key Directories

- `src/routes/` contains TanStack Router pages and the root HTML shell.
- `src/routes/index.tsx` contains the complete home page, content data, interactions, service modal, and contact form state.
- `src/styles.css` contains the global blue luxury theme, responsive layouts, animations, and component styles.
- `public/` contains the BBS25 SVG identity assets and the static Netlify Forms detector.
- `.netlify/features/` contains platform feature markers created by Netlify skill activation scripts.

## Architecture

- The site uses one primary route at `/` with anchor navigation for Services, Work, Pricing, About, and Contact.
- Service and FAQ data stay close to the route because they are presentation content and do not require persistent storage.
- Contact submissions use Netlify Forms. The React form posts URL-encoded data to `public/__forms.html`, which is required for build-time form detection in a TanStack Start application.
- The WhatsApp action uses a prefilled `wa.me` link for the primary business number.
- Branding assets are vector SVG files to keep the logo crisp and loading fast at every size.

## Coding Conventions

- Use TypeScript and functional React components.
- Keep components PascalCase and local state variables camelCase.
- Prefer semantic HTML, accessible labels, and keyboard-accessible controls.
- Reuse CSS variables from `src/styles.css` for color and surface changes.
- Preserve the existing responsive breakpoints and reduced-motion support.
- Do not replace Netlify Forms with an external form or database service.

## Non-Obvious Decisions

- The display face uses a local fallback stack rather than a remote web font, avoiding a render-blocking third-party request.
- Portfolio visuals are CSS-generated brand studies, so the page ships without large stock photography assets.
- Email submission notifications are managed through the Netlify project notification settings; the deployed form itself is fully registered and captures every inquiry.
