# Social Support Application

A bilingual government-style financial assistance portal built with a responsive landing page, a three-step application wizard, local draft saving, mock submission, and OpenAI-assisted writing for situation descriptions.

## Tech Stack

- Framework: Next.js App Router with React and TypeScript
- Styling: Tailwind CSS
- Forms: React Hook Form
- Validation: Zod
- Internationalization: `next-intl`
- Routing: Next.js App Router localized routes
- API calls: `fetch`
- State management: local React state plus React Hook Form state
- Tests: Vitest, Testing Library setup, jsdom

The case study listed React Router and React i18next as recommended options. This project uses the Next.js equivalents: App Router for routing and `next-intl` for route-aware translations.

## Features

- Landing page at `/en` and `/ar`
- Application wizard at `/en/apply` and `/ar/apply`
- Three form steps:
  - Personal Information
  - Family & Financial Info
  - Situation Descriptions
- Dedicated submission result screen after successful mock submit
- English and Arabic support, including RTL layout for Arabic
- Responsive mobile, tablet, and desktop layouts
- Required field indicators and accessible labels/error summaries
- Local draft persistence with `localStorage`
- Draft stage persistence, so users return to the step they left
- Draft cleanup after successful completion
- Mock submission endpoint at `/api/applications`
- AI writing suggestion endpoint at `/api/ai/suggest`
- Help Me Write flow with loading, retry, edit, accept, discard, timeout, and failure states

## Run Locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/en`
- `http://localhost:3000/ar`
- `http://localhost:3000/en/apply`
- `http://localhost:3000/ar/apply`

If port `3000` is already in use, Next.js will print the alternate local URL.

## Environment Variables

Create a local environment file in the project root:

```bash
touch .env.local
```

Add:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Restart the dev server after changing `.env.local`.

## OpenAI Setup

The AI writing helper is implemented through the server route:

```txt
POST /api/ai/suggest
```

The browser never receives the OpenAI API key. The key is read from `OPENAI_API_KEY` on the server only. Do not expose it through `NEXT_PUBLIC_` variables.

`OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`. If an evaluator requires the original case-study model exactly, set:

```bash
OPENAI_MODEL=gpt-3.5-turbo
```

## Architecture Notes

The wizard uses a parent shell plus three step-level forms.

- `WizardShell` owns wizard state, current step, merged form values, draft restore/save, and submission.
- Each step uses its own React Hook Form instance through the active `FormProvider`.
- Step schemas are split from the full Zod schema:
  - `personalInfoSchema`
  - `familyFinancialSchema`
  - `situationDescriptionsSchema`
  - `applicationSchema` for final full-payload validation
- Local draft storage lives in `src/lib/storage.ts` under `social-support-application:*` keys.
- OpenAI configuration is isolated in `src/lib/env.ts` and generation logic in `src/lib/openai.ts`.
- The AI route accepts only non-sensitive family/financial context and excludes National ID, address, phone, and email.

## Decisions And Improvements

Key decisions:

- Next.js was used instead of plain React so the project can keep API routes, routing, localization, and server-only OpenAI access in one codebase.
- `next-intl` was used instead of React i18next because it integrates cleanly with App Router locale segments like `/en` and `/ar`.
- Step-level React Hook Form instances were chosen so each step validates only its own fields. The final submit still validates the full application payload.
- Local component state is used for wizard orchestration because the flow is contained within one screen. Redux would be unnecessary overhead for this scope.
- Drafts are stored only in the browser and are cleared after successful completion.

Possible improvements:

- Add end-to-end tests for the full English and Arabic wizard flow.
- Add a review step before submission if applicants need to confirm all answers.
- Add stronger production-grade security, rate limiting, audit logging, and server-side persistence.
- Replace mock submission with a real backend integration.
- Add analytics around drop-off points and AI suggestion acceptance rates.

## Project Structure

```txt
app/
  [locale]/
    page.tsx
    apply/page.tsx
    layout.tsx
  api/
    ai/suggest/route.ts
    applications/route.ts
messages/
  en.json
  ar.json
src/
  features/application-wizard/
    components/
    schema.ts
    types.ts
    defaults.ts
    field-config.ts
  i18n/
  lib/
```

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Testing

Implemented coverage includes:

- Zod schema validation and step schema scoping
- Local draft save/restore/cleanup behavior
- Mock application submission API success and invalid-payload paths
- AI suggestion API success, invalid sensitive payload, missing key, and timeout paths

## Phase Status

Completed:

- Phase 1: Project foundation
- Phase 2: Form schema and wizard shell
- Phase 3: Step forms
- Phase 4: Local draft persistence
- Phase 5: Mock submission API
- Phase 6: AI suggestion API
- Phase 7: AI suggestion UI
- Phase 8: Accessibility and UX polish
- Phase 9: Tests
- Phase 10: Documentation and final review
