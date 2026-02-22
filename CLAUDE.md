# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project: PRAXIS — Deterministic Policy Enforcement Layer for AI Agents

**Praxis** is a deterministic policy enforcement layer that ensures AI agents can only execute actions that comply with formal business, security, and compliance rules.

Instead of trusting the AI model itself to make safe execution decisions, Praxis acts as an external control layer that:

1. Intercepts proposed actions
2. Evaluates them against deterministic rules
3. Allows or blocks execution
4. Logs decision details for auditability

---

## Purpose

This file defines:

1. How Claude should interpret project context
2. Expected formats for responses
3. What Claude *can* and *cannot* generate
4. Rule writing standards
5. Testing expectations
6. Safety constraints

Claude should always respond in alignment with this guide.

---

## What Praxis Solves

AI models are probabilistic:

- The same input can produce different outputs
- Outputs may seem plausible yet unsafe
- No guarantee of policy compliance

Praxis ensures that **no action is executed without deterministic verification**, meaning:

> For the same input and ruleset, the execution outcome is always the same.

---

## Key Concepts

### 1. Intercept
AI agent proposes actions (as structured data).

Examples:
```jsonc
{
  "action": "refund",
  "amount": 1500,
  "customerId": "cust_123"
}
```

---

## Commands

- `npm i` — install dependencies
- `npm run dev` — start Vite dev server (default: http://localhost:5173)
- `npm run build` — production build to `dist/`

There are no test or lint scripts configured.

## Landing Page Architecture

This repository contains the PRAXIS marketing/landing page — a React 18 + TypeScript SPA built with Vite, generated from a Figma Make file.

**Entry point:** `src/main.tsx` → `src/app/App.tsx`

**App.tsx** is the page layout orchestrator. It renders all sections in order:
Navbar → HeroSection → ProblemSection → HowItWorksSection → ArchitectureSection → PolicySection → LiveDemo → UseCasesSection → TrustSection → CTABand → Footer

**Source layout:**
- `src/app/components/` — 13 page-section components (one per landing page section)
- `src/app/components/ui/` — 46 reusable UI components (shadcn/ui + Radix UI primitives)
- `src/app/components/figma/` — Figma-specific helpers (e.g., ImageWithFallback)
- `src/styles/` — global CSS: `index.css` (entry), `tailwind.css`, `theme.css` (design tokens), `fonts.css`

**Path alias:** `@` resolves to `./src` (configured in `vite.config.ts`)

## Key Libraries & Patterns

- **Styling:** Tailwind CSS 4 utilities + CSS custom properties in `src/styles/theme.css` for theming. The `cn()` helper in `src/app/components/ui/utils.ts` merges class names via `clsx` + `tailwind-merge`.
- **Animation:** Framer Motion (`motion` package) for scroll-triggered animations using `useInView`. `ParticleField.tsx` uses raw HTML5 Canvas + `requestAnimationFrame`.
- **UI components:** shadcn/ui built on Radix UI. Variant management via `class-variance-authority`.
- **Icons:** Lucide React (primary), MUI Icons Material (supplementary).
- **State:** Local component state only (useState/useRef) — no global state management.

## Design Tokens

Defined in `src/styles/theme.css` as CSS variables. Key landing page colors used directly in components:
- Background: `#0F1114`
- Accent orange: `#D9532B`
- Accent cyan: `#1AC8D2`
- Fonts: Inter (body), Playfair Display (display headings), JetBrains Mono (code)

## Vite Config Notes

The React and Tailwind plugins in `vite.config.ts` are **required for Figma Make** — do not remove them even if Tailwind appears unused. Raw asset imports are enabled for `.svg` and `.csv` files only; never add `.css`, `.tsx`, or `.ts` to `assetsInclude`.
