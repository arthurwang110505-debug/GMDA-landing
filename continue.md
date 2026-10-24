# GMDA Mascot System — Continuation Guide

> This file is the handoff brief for any AI coding agent continuing the GMDA landing-page mascot work. Read this before changing mascot visuals or behavior.

## Product and design goal

Create an **original, highly lovable mascot identity for GMDA**. The emotional target is the instant affection people feel toward polished character-led products, while the characters, silhouettes, details, motion language, names, and presentation must remain distinctly GMDA—not copies or near-copies of No Nap, MausBot, or any other product.

The chosen direction is a blend of:

- **Blob Crew:** soft, simple, tactile silhouettes and approachable expressions.
- **Tiny Creatures:** each character has a different outline, personality, and small signature detail.

Working design keywords: **cute, weird, minimal, expressive, warm, a little awkward, digital but not robotic**.

Mascots should feel like a tiny team of original creatures that happen to be AI agents. Avoid making them generic animal mascots, generic round robots, or a row of interchangeable colored blobs.

## Current implementation

Work is on branch: `feat/mascot-v2-blob-creatures`

Draft PR: https://github.com/arthurwang110505-debug/GMDA-landing/pull/5

Relevant files:

- `src/components/HeroMascots.tsx` — four original inline-SVG creatures and pointer proximity behavior.
- `src/index.css` — layout, individual idle motion, blink, antenna and status-light animations.
- `src/App.tsx` — the landing-page structure and Hero placement; avoid unrelated redesigns unless necessary.

### Current character cast

| Character | Role | Visual identity | Personality |
|---|---|---|---|
| **Mori** | Research | Warm cream organic body, small green antenna, asymmetrical side detail | Curious, observant, gentle |
| **Pip** | Writing | Honey-yellow, slightly star-like / irregular silhouette | Bouncy, imaginative, enthusiastic |
| **Koda** | Coding | Sky-blue, squarer body, little status light | Calm, focused, dependable |
| **Milo** | Monitoring | Lavender rounded body, radar-like antenna | Quietly alert, thoughtful |

These are a first-pass direction, not immutable final art. Improve the craft while keeping their identities recognizable.

### What has been added so far

- Replaced the old hero mascot artwork with original inline SVG shapes.
- Added shared dark outlines and a coherent pastel palette.
- Added distinct idle motion for Mori, Pip, Koda, and Milo.
- Added eye-blink animation and small antenna/status-light movement.
- Kept pointer-proximity reactions and added a small hover sparkle.
- Added reduced-motion handling and responsive mascot placement.

**Important:** The current motion is decorative/ambient. The characters do not yet respond to actual product task states. The website currently uses sample/demo product data, so do not claim these mascots are connected to real agent execution.

## Non-negotiable creative guardrails

1. **Do not imitate No Nap's specific character designs.** References may inform the general quality bar—simplicity, personality, emotional clarity—but never trace silhouettes, faces, palettes, accessories, names, or signature poses.
2. Do not use copyrighted character art, downloaded mascot packs, or generated copies of a reference mascot.
3. Each character must be recognizable from its silhouette alone, even without its color.
4. Keep faces readable at small sizes. Avoid over-detailing SVGs.
5. Preserve a shared family resemblance: consistent outline weight, eye/mouth language, shading logic, and animation quality.
6. Give each creature a different motion rhythm. Do not make all four bob up and down in sync.
7. Motion should be subtle and charming, never distract from the headline or cause layout shifts.
8. Respect `prefers-reduced-motion`; no interaction may be required to understand the page.
9. Keep the site’s existing flat, editorial visual direction. Do not add generic neon gradients, glows, glassmorphism, or a heavy animation library just to make the mascots feel more polished.
10. Keep the implementation lightweight, responsive, keyboard/accessibility-conscious, and consistent with the existing React + TypeScript + Vite + Tailwind stack.

## Next tasks — recommended order

### Phase A — Inspect, run, and polish the first pass

1. Check out `feat/mascot-v2-blob-creatures`.
2. Install dependencies using the lockfile: `npm ci`.
3. Run:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
4. Fix actual errors before adding more features.
5. Preview at desktop and mobile widths, in both dark and light themes.
6. Check whether the four creatures feel charming at the actual rendered size. Their SVGs currently use a 120×120 viewBox; refine proportions, facial spacing, outline consistency, and negative space as needed.
7. Ensure hover sparkle and pointer reactions do not conflict with CSS transforms or make the mascots jitter.
8. Confirm no mascot overlaps the hero headline, CTA, or navigation on narrow screens.

### Phase B — Improve the character art

Work on one character at a time, then review all four together.

- Refine silhouette and facial proportions before adding accessories.
- Add small signature details that remain legible at hero size.
- Use a restrained palette with distinct character colors and a consistent dark outline.
- Make faces more expressive with simple changes to eyes, brows, and mouth—not complicated illustration detail.
- Consider adding an optional tiny “character sheet” / “Meet the team” section only after the hero mascots are visually strong.
- If creating a new image concept board, keep it as an exploration artifact; production mascots should remain original, editable SVG/component assets.

### Phase C — Build a reusable expression system

Move beyond animation-only personality. Create a maintainable model such as:

```ts
type MascotState =
  | 'idle'
  | 'thinking'
  | 'working'
  | 'waiting'
  | 'success'
  | 'confused'
  | 'error'
```

Requirements:

- Use one shared state vocabulary across characters, but customize how each character expresses it.
- Keep expression rendering separate from the role/character definition so future agents can add states without duplicating the whole SVG.
- Use a stable prop/API for future reuse, e.g. `<Mascot name="mori" state="thinking" size="md" />`.
- Provide a static, understandable fallback when animations are disabled.
- Avoid random animation on every render; use stable CSS animations or controlled effects.
- Add expressive but subtle visual cues: eye shape/position, mouth, antenna, posture, or one small symbol. Do not rely on color alone to communicate state.

Suggested expression map:

| State | Visual direction |
|---|---|
| Idle | Relaxed eyes, tiny breathing / personality-specific idle |
| Thinking | Eyes glance upward/sideways; antenna or detail gently reacts |
| Working | Focused expression and slightly more purposeful movement |
| Waiting | Still pose, gentle blink, clear waiting indicator |
| Success | Brighter eyes / happy mouth; one short celebratory bounce |
| Confused | Asymmetric eyes or tilted posture; avoid making it look distressed |
| Error | Mildly puzzled expression plus explicit text in the UI; never communicate an error by color alone |

Do not imply the mascot has real emotions or autonomous agency beyond the UI's actual state. These are interface illustrations.

### Phase D — Connect mascot states to the landing-page demo

The site preview is demo/sample content. Make that explicit in code and copy.

- Add an interactive “Meet your team” or product preview treatment only if it strengthens the story.
- Let a user select a character with accessible buttons and see its role, sample task, and expression.
- Use simulated task states only as clearly labeled demo behavior.
- Example: Mori → “Gathering research” → “Waiting for review” → “Research summary ready”.
- Never claim a live task is running unless a real backend confirms it.
- Ensure controls have visible focus states, labels, and usable touch targets.

### Phase E — Quality and regression checks

Before opening or updating a PR:

- Run typecheck, lint, and build.
- Verify dark/light themes.
- Verify mobile, tablet, and desktop layouts.
- Verify reduced-motion mode.
- Verify no console errors or React key warnings.
- Check SVGs scale cleanly and do not overflow their viewBox.
- Check the visual hierarchy: hero headline and CTA remain the main focus.
- Summarize changed files, tests run, known limitations, and any decisions for the next AI.

## Suggested component architecture

Do not refactor the whole application without need. As the mascot system grows, consider extracting:

- `src/components/mascots/Mascot.tsx` — reusable wrapper and state API.
- `src/components/mascots/creatures/Mori.tsx`, `Pip.tsx`, `Koda.tsx`, `Milo.tsx` — individual SVG art.
- `src/components/mascots/mascotTypes.ts` — types and shared metadata.
- `src/components/HeroMascots.tsx` — hero-specific arrangement only.

Only do this when it reduces complexity. Avoid splitting into many files prematurely.

## Definition of done

The mascot work is ready for review when:

- The four creatures are visually distinct and lovable at real page sizes.
- The shared art direction feels like one original GMDA universe.
- Each character has a recognizable role and personality.
- Idle motion is individual, polished, and non-distracting.
- The expression/state API can be extended without rewriting every character.
- Mobile, theme switching, and reduced-motion behavior work.
- Typecheck, lint, and build pass.
- The PR description documents exactly what is implemented versus what remains demo-only.

## Instructions to the next AI

Start by inspecting the current branch and files; do not assume this document describes the latest code perfectly. Run the checks, review the live rendering, and report any mismatch. Continue from the existing implementation rather than replacing it wholesale. Prioritize **visual quality and character appeal over adding more sections or complexity**. Keep the original-art guardrails above, and do not merge the PR unless explicitly asked.
