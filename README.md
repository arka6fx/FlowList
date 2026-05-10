# FlowList

A full-stack todo app to create, organize, and complete tasks with a polished UI and a PostgreSQL-backed API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4 + shadcn/ui (base-nova, `@base-ui/react`)
- **Animations:** Framer Motion
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **HTTP Client:** Axios
- **Authentication:** Better Auth (Google OAuth)
- **Toasts:** Sonner
- **Fonts:** Caveat (handwriting, Google Font), Geist (UI, Google Font)
- **PWA:** Web App Manifest

## Project Structure

```text
FlowList/
├── app/                               # Next.js App Router
│   ├── api/
│   │   ├── auth/[...all]/route.ts     # Better Auth handler
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
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
├── lib/
│   ├── db/index.ts                    # Drizzle db instance
│   ├── auth/
│   │   ├── index.ts                   # Better Auth server config
│   │   ├── client.ts                  # Better Auth client
│   │   ├── current-user.ts            # getCurrentUser() helper
│   │   └── utils.ts                   # requireAuth() + parseId()
│   └── utils.ts                       # cn() via clsx + tailwind-merge
├── drizzle/
│   ├── schema.ts                      # All table definitions
│   └── meta/                          # Drizzle metadata
├── components.json                    # shadcn config
├── drizzle.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## Database Models

```ts
import { boolean, foreignKey, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const authUsers = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const todos = pgTable(
    "Todo",
    {
        id: serial("id").primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        completed: boolean("completed").notNull().default(false),
        createdAt: timestamp("createdAt", { withTimezone: false, precision: 3 }).notNull().defaultNow(),
        updatedAt: timestamp("updatedAt", { withTimezone: false, precision: 3 }).notNull(),
        userId: text("userId").notNull(),
    },
    (table) => [
        index("Todo_userId_idx").on(table.userId),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [authUsers.id],
            name: "Todo_userId_fkey",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    ],
);

export const authSessions = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
});

export const authAccounts = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: "date" }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true, mode: "date" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const authVerifications = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
});
```

## API Endpoints

### App API Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/todos` | List all todos for signed-in user | Yes |
| POST | `/api/todos` | Create a new todo | Yes |
| GET | `/api/todos/:todoId` | Get one todo by ID | Yes |
| PATCH | `/api/todos/:todoId` | Update todo (title, description, completed) | Yes |
| DELETE | `/api/todos/:todoId` | Delete a todo by ID | Yes |

### Better Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...all]` | Better Auth handler (signin, signout, session, callback) |

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

- Node.js 20+
- pnpm
- PostgreSQL database (Neon/local)

### Installation

```bash
pnpm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env`.

Also set:

- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Database Setup

```bash
pnpm db:generate
pnpm db:migrate
```

### Run the App

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start development server
- `pnpm build` - create production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm db:generate` - generate Drizzle migrations
- `pnpm db:migrate` - run Drizzle migrations
- `pnpm db:pull` - pull schema from database

## Environment Variables

Required for both local development and production:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=verify-full"
BETTER_AUTH_URL="http://localhost:3000"  # Use production URL in production
BETTER_AUTH_SECRET="replace-with-a-long-random-string"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

For client-side (public):

```env
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

## License

ISC
