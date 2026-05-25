# Social Support Application

This project is being integrated phase by phase for a government social support application.

## Current Phase

Completed:

- Next.js App Router scaffold
- TypeScript configuration
- Tailwind CSS setup
- English and Arabic localized routes
- RTL/LTR layout behavior
- Core dependencies for later form, validation, AI, and testing phases
- Phase 2 form domain model, Zod schema, step metadata, wizard shell, progress indicator, active-step validation, focus handling, and error summary
- Phase 3 responsive Step 1, Step 2, and Step 3 form fields with localized labels, helpers, options, and field-level validation messages
- Phase 4 versioned `localStorage` draft persistence with restore-on-load autosave for form values and current wizard step
- Localized responsive landing page at `/en` and `/ar` with a start application CTA
- Phase 5 mock submission API at `/api/applications` with server-side validation, localized success/failure states, and draft clearing after successful submit
- Phase 6 OpenAI suggestion API at `/api/ai/suggest` with server-only API key usage, non-sensitive draft context, request validation, configurable model, and timeout/error handling

Not implemented yet:

- AI suggestion buttons and modal UI
- Wizard tests

## Run Locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/en/apply`
- `http://localhost:3000/ar/apply`

## OpenAI Environment

Create `.env.local` for AI suggestions:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Do not expose the API key through `NEXT_PUBLIC_` variables. `OPENAI_MODEL` is optional; it defaults to `gpt-4o-mini`. If an evaluator requires the case-study model exactly, set `OPENAI_MODEL=gpt-3.5-turbo`.
