# FlowList

A full-stack Todo app to create, organize, and complete tasks with a clean UI and a PostgreSQL-backed API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **HTTP Client:** Axios
- **Authentication:** NextAuth (Google OAuth)

## Project Structure

```text
flowlist/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth handler
│   │   └── todos/
│   │       ├── route.ts                # List/create todos
│   │       └── [todoId]/route.ts      # Get/update/delete one todo
│   ├── components/
│   │   ├── theme-toggle.tsx           # Dark mode toggle
│   │   ├── todo-board.tsx             # Todo board component
│   │   └── todo-board-shell.tsx        # Todo board wrapper with auth
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── options.ts              # NextAuth providers + config
│   │   │   └── current-user.ts        # Get current user helper
│   │   └── db/
│   │       └── index.ts                # Prisma client singleton
│   ├── (auth)/
│   │   ├── layout.tsx                  # Auth pages layout
│   │   ├── signin/page.tsx             # Sign-in page
│   │   └── signup/page.tsx             # Sign-up page
│   ├── providers.tsx                  # Session provider wrapper
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Landing page
├── prisma/
│   ├── migrations/
│   └── schema.prisma                   # Prisma schema
├── .env.example
├── prisma.config.ts
└── package.json
```

## Database Models

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
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

### NextAuth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | Google OAuth handler (signin, signout, session, callback) |

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

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Prisma Setup

```bash
pnpm prisma generate
pnpm prisma migrate dev
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
NEXTAUTH_URL="http://localhost:3000"  # Use production URL in production
NEXTAUTH_SECRET="replace-with-a-long-random-string"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## License

ISC
