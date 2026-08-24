# AGENTS.md

## Commands

- `bun install` — install dependencies (Bun is the package manager; no pnpm)
- `bun run dev` — starts dev server (uses `--webpack` explicitly, not turbopack); D1 bindings work locally via miniflare (`initOpenNextCloudflareForDev` in `next.config.ts`)
- `bun run lint` — ESLint only; no typecheck or formatter command
- `bun run build` — production build
- `bun run preview` — `opennextjs-cloudflare build && opennextjs-cloudflare preview` (local Cloudflare preview)
- `bun run deploy` — `opennextjs-cloudflare build && opennextjs-cloudflare deploy` (deploy to Cloudflare)
- `db:generate` — generate Drizzle migrations for SQLite (`drizzle-kit generate`)
- Apply migrations with `wrangler d1 execute flowlist-db --local|--remote --file=drizzle/XXXX.sql`
- No test suite is configured.

## Deployment

- **Hosting:** Cloudflare (Workers via OpenNext), NOT Vercel. Worker name is `flowlist`, served at `https://flowlist.arkagarai292.workers.dev` (workers.dev URL, no custom domain). Config: `wrangler.jsonc` + `open-next.config.ts`.
- **Database:** Cloudflare D1 (`flowlist-db`, binding name `DB`). Schema in `drizzle/schema.ts` uses `drizzle-orm/sqlite-core`. Do NOT reintroduce Postgres/Neon.
- **CI/CD:** GitHub Actions `.github/workflows/deploy.yml` builds and deploys on every push to `main`. Uses Bun (`oven-sh/setup-bun`), not pnpm.
- **Windows limitation:** `opennextjs-cloudflare build` fails on Windows (it needs symlink privileges — EPERM). Always build/deploy via the GitHub Actions workflow, not locally.
- **Env vars:** only `NEXT_PUBLIC_APP_URL` (set in the workflow at build time; optional — code falls back to the workers.dev URL). Do not commit a `.env` file.

## Architecture

- **Next.js 16 App Router** — `params` in route handlers is `Promise` (must `await`)
- **Auth** — hand-rolled email/password auth (no Better Auth):
  - `lib/auth/password.ts` — PBKDF2 hashing via Web Crypto (`hashPassword` / `verifyPassword`)
  - `lib/auth/session.ts` — session tokens in the `session` table + httpOnly cookie `flowlist_session`; `createSession` / `getSessionUser` / `destroySession`
  - `lib/auth/current-user.ts` — `getCurrentUser()` returns `{ id, name, email }` or `null`
  - `lib/auth/utils.ts` — `requireAuth()` for API routes; always guard with `if (auth instanceof NextResponse) return auth`
  - API routes: `POST /api/auth/signup`, `POST /api/auth/signin`, `POST /api/auth/signout`, `GET /api/auth/session`
  - Client code calls these endpoints directly with `fetch`; session state via `useAuth()` in `hooks/use-auth.ts`
- **Tailwind CSS v4** — no `tailwind.config.js`; config is via `@import "tailwindcss"` + `@custom-variant` + `@theme inline` in CSS. PostCSS plugin is `@tailwindcss/postcss`. Colors use semantic tokens (`bg-background`, `text-foreground`, `border-border`) defined in `@theme inline` — don't add new hardcoded hex classes
- **`parseId()`** — utility in `lib/auth/utils.ts` that validates positive integer IDs; returns `null` for invalid input
- **`Todo.id` is an autoincrement integer**, not UUID — important when constructing API paths or comparing IDs
- **API routes don't use Zod schemas** — Zod schemas exist in `validations/todo.ts` but all todo API routes do manual validation inline (auth routes do use Zod)
- **`useSyncExternalStore`** in `TodoBoardShell` — acts as hydration guard to prevent server/client mismatch on mount
- **Database access** — `lib/db/index.ts`: `drizzle(getCloudflareContext().env.DB)` from `drizzle-orm/d1`. Bindings come from `wrangler.jsonc` (`d1_databases`), typed by generated Worker config types. Never use node-postgres or Neon drivers.
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

- Whenever you change `drizzle/schema.ts`, ALWAYS run `bunx drizzle-kit generate`, then apply the new SQL file to both local and remote D1:
  - `bunx wrangler d1 execute flowlist-db --local --file=drizzle/XXXX.sql -y`
  - `bunx wrangler d1 execute flowlist-db --remote --file=drizzle/XXXX.sql -y`
- NEVER run `drizzle-kit push`.

### Testing

- Use any testing tools, libraries, or scripts available in the project for testing your changes.
- Never assume your changes simply work — always test.
- If the project has no testing tools, scripts, MCP tools, skills, etc., ask the user whether testing should be skipped.

### Data Flow (todos)

- `app/page.tsx` (server component): calls `getCurrentUser()`, fetches todos server-side via Drizzle, passes `initialTodos` to `TodoBoardShell`
- `components/todo/todo-board-shell.tsx` — thin wrapper that renders `TodoBoard`
- `components/todo/todo-board.tsx` — client component; manages all todo state locally with optimistic updates; calls REST API via Axios for create/toggle/update/delete; sign-out POSTs `/api/auth/signout`

### UI Design

- Always follow the `DESIGN.md` design system (color palette, component patterns, visual conventions) when creating or reviewing UI.
