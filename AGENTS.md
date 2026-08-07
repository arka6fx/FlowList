# AGENTS.md

## Commands

- `pnpm dev` — starts dev server (uses `--webpack` explicitly, not turbopack)
- `pnpm lint` — ESLint only; no typecheck or formatter command
- `pnpm build` — production build; requires `DATABASE_URL` at build time (Drizzle checks env on import)
- `pnpm preview` — `opennextjs-cloudflare build && opennextjs-cloudflare preview` (local Cloudflare preview)
- `pnpm deploy` — `opennextjs-cloudflare build && opennextjs-cloudflare deploy` (deploy to Cloudflare)
- `db:pull` / `db:generate` / `db:migrate` — use `drizzle-kit`; `drizzle.config.ts` reads `DATABASE_URL` directly via `dotenv/config`
- No test suite is configured.

## Deployment

- **Hosting:** Cloudflare (Workers via OpenNext), NOT Vercel. Worker name is `flowlist`, custom domain `flowlist.arka6fx.com`. Config: `wrangler.jsonc` + `open-next.config.ts`.
- **CI/CD:** GitHub Actions `.github/workflows/deploy.yml` builds and deploys on every push to `main`. The workflow also sets the Worker secrets.
- **Windows limitation:** `opennextjs-cloudflare build` fails on Windows (it needs symlink privileges — EPERM). Always build/deploy via the GitHub Actions workflow, not locally.
- **Env vars live in GitHub Actions secrets and Worker secrets** (`DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`). Do not commit a `.env` file.

## Architecture

- **Next.js 16 App Router** — `params` in route handlers is `Promise` (must `await`)
- **Better Auth** — Google OAuth only; no email/password. Client uses `authClient.signIn.social({ provider: "google", callbackURL: "/" })`. No `<SessionProvider>` wrapper (Better Auth handles cookies natively)
- **Tailwind CSS v4** — no `tailwind.config.js`; config is via `@import "tailwindcss"` + `@custom-variant` + `@theme inline` in CSS. PostCSS plugin is `@tailwindcss/postcss`. Colors use semantic tokens (`bg-background`, `text-foreground`, `border-border`) defined in `@theme inline` — don't add new hardcoded hex classes
- **`requireAuth()`** — returns `NextResponse` (401) or user object; always guard with `if (auth instanceof NextResponse) return auth`
- **`parseId()`** — utility in `lib/auth/utils.ts` that validates positive integer IDs; returns `null` for invalid input
- **`Todo.id` is a serial (number)**, not UUID — important when constructing API paths or comparing IDs
- **API routes don't use Zod schemas** — Zod schemas exist in `validations/todo.ts` but all API routes do manual validation inline
- **`useSyncExternalStore`** in `TodoBoardShell` — acts as hydration guard to prevent server/client mismatch on mount
- **Database** — Neon serverless driver (`@neondatabase/serverless`) via `drizzle-orm/neon-http`, configured in `lib/db/index.ts`. Do NOT use `pg` (node-postgres) — it hangs on Cloudflare Workers.
- **`app/providers.tsx`** — wraps the app with `<Toaster>` (sonner); no theme or session provider
- **`lib/utils.ts`** — `cn()` using `clsx` + `tailwind-merge`; import from `@/lib/utils`
- **shadcn/ui** — style `base-nova` (uses `@base-ui/react`, not Radix). Polymorphism via `render` prop not `asChild`. Button-as-Link requires `nativeButton={false} render={<Link href="…" />}`. Installed: `button`, `card`, `input`, `textarea`, `badge`, `separator`, `dialog`, `checkbox`, `sonner`
- **Sonner** — `toast()` / `toast.success()` / `toast.error()` from `"sonner"`; `<Toaster>` in `providers.tsx` with `theme="dark"` hardcoded (no next-themes)
- **Framer Motion** — used throughout: board entrance animations, `AnimatePresence` + `motion.li layout` for todo add/remove, `whileInView` + `viewport={{ once: true }}` for landing page scroll reveals

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

### Environment Variables

Required:

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000`
- `BETTER_AUTH_SECRET` — long random string (min 32 chars)
- `NEXT_PUBLIC_BETTER_AUTH_URL` — same as `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret

### Auth Flow

- `lib/auth/index.ts` — server-side Better Auth config, uses Drizzle adapter
- `lib/auth/client.ts` — client-side `authClient` (used in client components for signOut etc.)
- `lib/auth/current-user.ts` — `getCurrentUser()`: reads session via `auth.api.getSession`, queries DB for user row, returns `{ id, username, email }` or `null`
- `lib/auth/utils.ts` — `requireAuth()`: used in API route handlers; returns user or a `NextResponse` 401 if not authenticated; always check `if (auth instanceof NextResponse) return auth`
- `app/api/auth/[...all]/route.ts` — Better Auth catch-all handler

### Data Flow (todos)

- `app/page.tsx` (server component): calls `getCurrentUser()`, fetches todos server-side via Drizzle, passes `initialTodos` to `TodoBoardShell`
- `components/todo/todo-board-shell.tsx` — thin wrapper that renders `TodoBoard`
- `components/todo/todo-board.tsx` — client component; manages all todo state locally with optimistic updates; calls REST API via Axios for create/toggle/update/delete

### UI Design

- Always follow the `DESIGN.md` design system (color palette, component patterns, visual conventions) when creating or reviewing UI.
