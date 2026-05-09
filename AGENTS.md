# AGENTS.md

## Commands
- `pnpm dev` — starts dev server (uses `--webpack` explicitly, not turbopack)
- `pnpm lint` — ESLint only; no typecheck or formatter command
- `pnpm build` — production build; requires `DATABASE_URL` at build time (Drizzle checks env on import)
- `db:pull` / `db:generate` / `db:migrate` — use `drizzle-kit`; `drizzle.config.ts` reads `DATABASE_URL` directly via `dotenv/config`

## Architecture
- **Next.js 16 App Router** — `params` in route handlers is `Promise` (must `await`)
- **Better Auth** — Google OAuth only; no email/password. Client uses `authClient.signIn.social({ provider: "google", callbackURL: "/" })`. No `<SessionProvider>` wrapper (Better Auth handles cookies natively)
- **Tailwind CSS v4** — no `tailwind.config.js`; config is via `@import "tailwindcss"` + `@custom-variant` + `@theme inline` in CSS. PostCSS plugin is `@tailwindcss/postcss`. Colors use semantic tokens (`bg-background`, `text-foreground`, `border-border`) defined in `@theme inline` — don't add new hardcoded hex classes
- **`requireAuth()`** — returns `NextResponse` (401) or user object; always guard with `if (auth instanceof NextResponse) return auth`
- **`parseId()`** — utility in `lib/auth/utils.ts` that validates positive integer IDs; returns `null` for invalid input
- **`Todo.id` is a serial (number)**, not UUID — important when constructing API paths or comparing IDs
- **API routes don't use Zod schemas** — Zod schemas exist in `validations/todo.ts` but all API routes do manual validation inline
- **`useSyncExternalStore`** in `TodoBoardShell` — acts as hydration guard to prevent server/client mismatch on mount
- **Database** — `node-postgres` Pool (not Neon serverless), configured in `lib/db/index.ts`
- **`app/providers.tsx`** — no-op wrapper; no theme or session provider exists
- **`lib/utils/cn.ts`** — simple class joiner; not `clsx`/`twMerge`

## Critical Rules

### Responses
- Keep responses concise and to the point unless the user asks otherwise.

### Planning Mode
- Always ask clarifying questions.
- Never assume design, tech stack, or features.
- Use deep-dive sub-agents to assist with research.
- Use deep-dive sub-agents to review different aspects of your plan before presenting to the user.

### Change / Edit Mode
- Never implement features yourself when possible — use sub-agents.
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement them efficiently.
- When using sub-agents to implement features, act as a coordinator only.
- Use the best model for the task — premium models for complex tasks (coding), mid-tier models for simpler tasks (documentation).
- After completing features (large or small), always run lint, type check, and `next build` to verify code quality.

### Database Schema Changes
- Whenever you make changes to the database schema, ALWAYS run `drizzle-kit generate` and `drizzle-kit migrate`.
- NEVER run `drizzle-kit push`.

### Testing
- Use any testing tools, libraries, or scripts available in the project for testing your changes.
- Never assume your changes simply work — always test.
- If the project has no testing tools, scripts, MCP tools, skills, etc., ask the user whether testing should be skipped.

### UI Design
- Always follow the `DESIGN.md` design system (color palette, component patterns, visual conventions) when creating or reviewing UI.
