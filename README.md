# FlowList

A full-stack Todo app to create, organize, and complete tasks with a clean UI and a PostgreSQL-backed API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **HTTP Client:** Axios
- **Authentication:** Better Auth (Google OAuth)

## Project Structure

```text
flowlist/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/route.ts        # Better Auth handler
│   │   └── todos/
│   │       ├── route.ts                # List/create todos
│   │       └── [todoId]/route.ts      # Get/update/delete one todo
│   ├── components/
│   │   ├── theme-toggle.tsx           # Dark mode toggle
│   │   ├── todo-board.tsx             # Todo board component
│   │   └── todo-board-shell.tsx        # Todo board wrapper with auth
│   ├── lib/
│   │   ├── auth/
│   │   │   └── current-user.ts         # Get current app user helper
│   │   └── db/
│   │       ├── index.ts                # Drizzle db singleton
│   │       └── schema.ts               # Drizzle schema
│   ├── (auth)/
│   │   ├── layout.tsx                  # Auth pages layout
│   │   ├── signin/page.tsx             # Sign-in page
│   │   └── signup/page.tsx             # Sign-up page
│   ├── providers.tsx                  # Session provider wrapper
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Landing page
├── drizzle/
│   └── ...                             # Drizzle migrations/meta
├── drizzle.config.ts
├── .env.example
└── package.json
```

## Database Models

```ts
import { boolean, foreignKey, index, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "User",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email"),
    createdAt: timestamp("createdAt", { withTimezone: false, precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: false, precision: 3 }).notNull(),
  },
  (table) => [
    uniqueIndex("User_username_key").on(table.username),
    uniqueIndex("User_email_key").on(table.email),
  ],
);

export const todos = pgTable(
  "Todo",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("createdAt", { withTimezone: false, precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: false, precision: 3 }).notNull(),
    userId: integer("userId").notNull(),
  },
  (table) => [
    index("Todo_userId_idx").on(table.userId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "Todo_userId_fkey",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);
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
- Guests still see the landing page and can navigate to sign up/sign in
- The board supports create, read, update, delete, and complete toggling

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

## Environment Variables

Required for both local development and production:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
BETTER_AUTH_URL="http://localhost:3000"  # Use production URL in production
BETTER_AUTH_SECRET="replace-with-a-long-random-string"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## License

ISC
