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

Not implemented yet:

- Detailed step field UIs
- Local draft persistence
- Mock submission API
- OpenAI suggestion API
- Wizard tests

## Run Locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/en/apply`
- `http://localhost:3000/ar/apply`

## Environment

The OpenAI integration is planned for a later phase. When that phase is added, create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Do not expose the API key through `NEXT_PUBLIC_` variables.
