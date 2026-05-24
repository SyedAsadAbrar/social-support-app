# Social Support Application

Phase 1 establishes the project foundation for a government social support application.

## Current Phase

Completed:

- Next.js App Router scaffold
- TypeScript configuration
- Tailwind CSS setup
- English and Arabic localized routes
- RTL/LTR layout behavior
- Core dependencies for later form, validation, AI, and testing phases

Not implemented yet:

- Multi-step form wizard
- Form validation
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
