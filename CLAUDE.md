# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at http://localhost:3000 (uses webpack)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations from schema changes
pnpm db:migrate   # Apply migrations to the database
pnpm db:pull      # Introspect and pull schema from database
```

No test suite is configured.

## Architecture

FlowList is a Next.js 16 App Router full-stack todo app. Authentication is handled by Better Auth with Google OAuth and session-cookie-based auth. The database is PostgreSQL via Drizzle ORM.

### Auth flow

- `lib/auth/index.ts` — server-side Better Auth config, uses Drizzle adapter
- `lib/auth/client.ts` — client-side `authClient` (used in client components for signOut etc.)
- `lib/auth/current-user.ts` — `getCurrentUser()`: reads session via `auth.api.getSession`, queries DB for user row, returns `{ id, username, email }` or `null`
- `lib/auth/utils.ts` — `requireAuth()`: used in API route handlers; returns user or a `NextResponse` 401 if not authenticated; always check `if (auth instanceof NextResponse) return auth`
- `app/api/auth/[...all]/route.ts` — Better Auth catch-all handler

### Data flow (todos)

- `app/page.tsx` (server component): calls `getCurrentUser()`, fetches todos server-side via Drizzle, passes `initialTodos` to `TodoBoardShell`
- `components/todo/todo-board-shell.tsx` — thin wrapper that renders `TodoBoard`
- `components/todo/todo-board.tsx` — client component; manages all todo state locally with optimistic updates; calls REST API via Axios for create/toggle/update/delete

### API routes

All routes in `app/api/todos/` call `requireAuth()` first, then interact with Drizzle directly. No intermediate service layer.

### Database schema

Defined in `drizzle/schema.ts`. Key tables:
- `user`, `session`, `account`, `verification` — owned by Better Auth
- `Todo` — has `userId` FK to `user.id` with cascade delete

### Path aliases

`@/` maps to the project root (configured in `tsconfig.json`).

## Environment variables

Required:
```
DATABASE_URL
BETTER_AUTH_URL          # e.g. http://localhost:3000
BETTER_AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_BETTER_AUTH_URL
NEXT_PUBLIC_API_URL
```
