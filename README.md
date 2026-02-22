# PRAXIS

**Deterministic Policy Enforcement Layer for AI Agents**

Praxis is an external control layer that ensures AI agents can only execute actions that comply with formal business, security, and compliance rules. Instead of trusting probabilistic model outputs, Praxis intercepts every proposed action, evaluates it against deterministic rules, and allows or blocks execution — logging every decision for auditability.

> For the same input and ruleset, the execution outcome is always the same.

## The Problem

AI models are probabilistic. The same input can produce different outputs, outputs may seem plausible yet unsafe, and there is no guarantee of policy compliance. Praxis solves this by inserting a deterministic verification layer between the AI agent and any downstream system.

## How It Works

```
AI Agent → Intercept → Verify → Enforce → Tool Execution
                                   ↓            ↓
                              Audit Log    Policy Store
```

1. **Intercept** — Captures every outbound agent action (tool calls, API requests, data writes) with sub-millisecond latency (~0.4ms average)
2. **Verify** — Evaluates the action against a versioned policy ruleset in real time (<2ms P99 latency)
3. **Enforce** — Three outcomes: ALLOW (proceed), BLOCK (reject with structured error context), or ESCALATE (human review)
4. **Audit Log** — Immutable, tamper-evident log of every decision, SIEM-compatible (Splunk, Datadog, Elastic)
5. **Policy Store** — Git-native versioned rulesets authored in PRAXIS DSL or imported from OPA/Rego

## Tech Stack

This repository contains the PRAXIS marketing and landing page.

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Animation:** Framer Motion (scroll-triggered animations, interactive flowchart with data pulse)
- **UI Components:** shadcn/ui + Radix UI primitives
- **Icons:** Lucide React, MUI Icons Material
- **Fonts:** Inter (body), Playfair Display (headings), JetBrains Mono (code)

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Production output is written to `dist/`.

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── app/
│   ├── App.tsx                       # Page layout orchestrator
│   └── components/
│       ├── Navbar.tsx                # Navigation bar
│       ├── HeroSection.tsx           # Hero / above the fold
│       ├── ProblemSection.tsx        # Problem statement
│       ├── HowItWorksSection.tsx     # Step-by-step explanation
│       ├── ArchitectureSection.tsx   # Animated interactive flowchart
│       ├── PolicySection.tsx         # Policy authoring showcase
│       ├── LiveDemo.tsx              # Live demo interaction
│       ├── UseCasesSection.tsx       # Use case cards
│       ├── TrustSection.tsx          # Trust / security signals
│       ├── CTABand.tsx               # Call-to-action banner
│       ├── Footer.tsx                # Footer
│       ├── ui/                       # Reusable UI primitives (shadcn/ui)
│       └── figma/                    # Figma-specific helpers
├── styles/
│   ├── index.css                     # CSS entry point
│   ├── tailwind.css                  # Tailwind config
│   ├── theme.css                     # Design tokens (CSS variables)
│   └── fonts.css                     # Font face declarations
```

## Key Design Decisions

- **Path alias:** `@` resolves to `./src` (configured in `vite.config.ts`)
- **No global state:** All component state is local (`useState` / `useRef`)
- **Hardcoded brand colors:** Architecture section uses precise hex values (`#D9532B`, `#1AC8D2`, `#6CE1FF`, `#2BC37B`) for exact visual control rather than CSS variables
- **Performance:** The animated data pulse in the Architecture section uses `requestAnimationFrame` with direct DOM manipulation to avoid React re-renders at 60fps
