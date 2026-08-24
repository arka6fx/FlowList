# FlowList

A full-stack todo app to create, organize, and complete tasks with a polished UI, deployed on Cloudflare Workers with a D1 database.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4 + shadcn/ui (base-nova, `@base-ui/react`)
- **Animations:** Framer Motion
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM (`drizzle-orm/sqlite-core` + `drizzle-orm/d1`)
- **HTTP Client:** Axios
- **Authentication:** Custom email/password auth (PBKDF2 + session cookies)
- **Package Manager:** Bun
- **Hosting:** Cloudflare Workers via `@opennextjs/cloudflare`
- **Toasts:** Sonner
- **Fonts:** Caveat (handwriting), Geist (UI)
- **PWA:** Web App Manifest

## Project Structure

```text
FlowList/
├── app/                               # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/route.ts        # POST - sign in
│   │   │   ├── signup/route.ts        # POST - sign up
│   │   │   ├── signout/route.ts       # POST - sign out
│   │   │   └── session/route.ts       # GET  - current session
│   │   └── todos/
│   │       ├── route.ts               # List/create todos
│   │       └── [todoId]/route.ts      # Get/update/delete todo
│   ├── (auth)/                        # Auth route group
│   │   ├── signin/page.tsx            # Sign-in page
│   │   ├── signup/page.tsx            # Sign-up page
│   │   └── layout.tsx                 # Auth layout
│   ├── lib/fonts.ts                   # Caveat font export
│   ├── layout.tsx                     # Root layout (Geist font)
│   ├── page.tsx                       # Landing/Dashboard server component
│   ├── providers.tsx                  # Toaster provider
│   └── globals.css                    # Global styles + CSS variables
├── components/
│   ├── landing/
│   │   └── landing-page.tsx           # Animated landing page
│   ├── todo/
│   │   ├── todo-board.tsx             # Todo board (client)
│   │   └── todo-board-shell.tsx       # Hydration guard wrapper
│   └── ui/                            # shadcn/ui components
├── lib/
│   ├── db/index.ts                    # Drizzle over D1 binding
│   ├── auth/
│   │   ├── password.ts                # PBKDF2 hash/verify (Web Crypto)
│   │   ├── session.ts                 # Session create/read/destroy + cookie
│   │   ├── current-user.ts            # getCurrentUser() helper
│   │   └── utils.ts                   # requireAuth() + parseId()
│   └── utils.ts                       # cn() via clsx + tailwind-merge
├── drizzle/
│   ├── schema.ts                      # All table definitions (SQLite)
│   └── *.sql                          # Generated migrations
├── drizzle.config.ts
├── wrangler.jsonc                     # Worker config + D1 binding
├── open-next.config.ts
├── next.config.ts
└── .env.example
```

## Database Models

Three tables in D1 (`drizzle/schema.ts`):

| Table    | Purpose                                                                  |
|----------|--------------------------------------------------------------------------|
| `user`   | `id` (uuid text), `name`, `email` (unique), `password_hash`, `created_at` |
| `session`| `id` (random token = cookie value), `user_id`, `expires_at`, `created_at` |
| `Todo`   | `id` (autoincrement int), `title`, `description`, `completed`, `createdAt`, `updatedAt`, `userId` |

## API Endpoints

### App API Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/todos` | List all todos for signed-in user | Yes |
| POST | `/api/todos` | Create a new todo | Yes |
| GET | `/api/todos/:todoId` | Get one todo by ID | Yes |
| PATCH | `/api/todos/:todoId` | Update todo (title, description, completed) | Yes |
| DELETE | `/api/todos/:todoId` | Delete a todo by ID | Yes |

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | `{ name, email, password }` — creates user, starts session |
| POST | `/api/auth/signin` | `{ email, password }` — verifies password, starts session |
| POST | `/api/auth/signout` | Destroys the current session |
| GET | `/api/auth/session` | Returns `{ user }` or `{ user: null }` |

Sessions are httpOnly cookies (`flowlist_session`) backed by rows in the `session` table (30-day TTL). Passwords are hashed with PBKDF2-SHA256 (100k iterations) using the Workers-compatible Web Crypto API.

## Todo Frontend

- Authenticated users are taken to the Todo board on `/`
- Guests see an animated landing page and can navigate to sign up/sign in
- The board supports create, read, update, delete, and complete toggling
- Edit dialog (shadcn Dialog) for updating title and description inline
- Sonner toasts for user action feedback (success and error states)
- Framer Motion animations: entrance animations, `AnimatePresence` for list add/remove, `layout` prop for smooth reordering
- Optimistic updates: UI changes immediately, rolls back on error

## Getting Started

### Prerequisites

- Bun 1.2+
- Cloudflare account (for D1 + deploy)

### Installation

```bash
bun install
cp .env.example .env   # optional; only NEXT_PUBLIC_APP_URL is used
```

### Database Setup

D1 bindings come from `wrangler.jsonc`. Apply migrations:

```bash
# local dev database (miniflare state)
bunx wrangler d1 execute flowlist-db --local --file=drizzle/0000_yielding_ender_wiggin.sql

# production database
bunx wrangler d1 execute flowlist-db --remote --file=drizzle/0000_yielding_ender_wiggin.sql
```

After changing `drizzle/schema.ts`, generate a new migration first:

```bash
bunx drizzle-kit generate
```

### Run the App

```bash
bun run dev
```

Open `http://localhost:3000`. Local D1 access works through miniflare (`initOpenNextCloudflareForDev()` in `next.config.ts`).

## Deployment

Deployments run automatically via GitHub Actions on every push to `main` (`.github/workflows/deploy.yml`). Required repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Manual deploy (Linux/macOS only — OpenNext builds fail on Windows due to symlink privileges):

```bash
bun run deploy
```

Live URL: https://flowlist.arkagarai292.workers.dev

## License

ISC
