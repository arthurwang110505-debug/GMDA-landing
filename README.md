# GMDA landing page

A polished, responsive landing page for **GMDA — Your AI team. Your control.** Built with React, TypeScript, Tailwind CSS, and Vite.

The site is a standalone frontend. It does not import or require GMDA’s server, Electron shell, database, agent runtimes, or any other backend. The product preview uses local sample data only: switching agents, expanding task activity, and approving or requesting changes only update React state in the browser. There are no accounts, pairing codes, API-key fields, signup forms, analytics, or tracking.

## Local development

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). The dev server binds to `0.0.0.0` so it also works in container and preview environments.

## Checks and production build

```bash
npm run typecheck
npm run lint
npm run build
```

To serve the production output locally:

```bash
npm run preview
```

The production site is emitted to `dist/`.

## Vercel settings

Use these exact project settings when importing this repository into Vercel:

| Setting | Value |
| --- | --- |
| Root Directory | `.` (the repository root) |
| Framework Preset | `Vite` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

The included `vercel.json` also declares the framework, install command, build command, and output directory. No environment variables are required. This repository does not deploy automatically; deployment requires a separate explicit action.

## Project structure

- `src/App.tsx` — page sections, navigation, feature content, and footer
- `src/components/HeroWorkspace.tsx` — static interface illustration
- `src/components/ProductPreview.tsx` — interactive sample workspace
- `src/components/AgentJobs.tsx` — keyboard-accessible, job-oriented sample role tabs
- `src/components/WorkflowScene.tsx` — scroll-scrubbed desktop workflow with static mobile fallback
- `src/components/ScrollProgress.tsx` — lightweight page reading-progress indicator
- `src/components/Faq.tsx` — accessible FAQ accordion
- `src/hooks/useScrollMotion.ts` — requestAnimationFrame scroll motion and IntersectionObserver reveals
- `src/data/preview.ts` — all sample agents, messages, tasks, and approvals
- `src/index.css` — Tailwind layers, motion, focus states, and decorative grids
- `public/app-icon.svg` — official GMDA ink app icon from the GMDA brand kit

## Brand palette

The page follows the GMDA brand starter: **Ink `#14142B`** for surfaces and text, **Ink Soft `#2A2A55`** for dark UI layers, **Spark Lime `#C8F23C`** for accents and buttons with Ink text, **Paper `#F5F3EC`** for light sections, **Cloud White `#FFFFFF`**, and **Blush `#FF8F73`** as a restrained warm accent. Brand surfaces are flat rather than gradient or glow effects, and lime is not used for text on Paper.

## Accessibility and privacy

The page uses semantic landmarks and headings, keyboard-operable navigation and disclosures, visible focus states, responsive layouts, and reduced-motion support. The desktop scroll-scrubbed workflow becomes a standard stacked layout on mobile and when reduced motion is requested; scroll reveals and hero parallax are also disabled for reduced motion. Fonts and icons are bundled locally; the site makes no third-party font, analytics, or tracking requests.

The privacy copy distinguishes local-first workspace storage from external model providers, integrations, and optional remote computers. It intentionally avoids absolute security or compliance claims.

## Source project

- GMDA source: <https://github.com/arthurwang110505-debug/GMDA-bot>
- License: <https://github.com/arthurwang110505-debug/GMDA-bot/blob/main/LICENSE>

Built on the open-source core of OpenMausBot. GMDA is independent and is not affiliated with xAI, Meta, OpenAI, or the OpenMausBot maintainer.
