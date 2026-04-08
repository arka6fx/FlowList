# FlowList

A full-stack Todo app to create, organize, and complete tasks with a clean UI and a PostgreSQL-backed API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **HTTP Client:** Axios
- **Authentication:** NextAuth (Credentials)

## Project Structure

```text
flowlist/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth handler
│   │   └── v1/
│   │       ├── signup/
│   │       │   └── route.ts        # User signup API
│   │       └── todos/
│   │           ├── route.ts        # List/create todos
│   │           └── [todoId]/route.ts # Get/update/delete one todo
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── options.ts          # NextAuth providers + config
│   │   │   └── password.ts         # Password hash/verify helpers
│   │   └── db/
│   │       └── index.ts            # Prisma client singleton
│   ├── (auth)/signin/
│   │   └── page.tsx                # Sign-in page
│   ├── (auth)/signup/
│   │   └── page.tsx                # Sign-up page
│   ├── providers.tsx               # Session provider wrapper
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Landing page
├── prisma/
│   ├── migrations/
│   └── schema.prisma               # Prisma schema
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
  password  String?
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
}
```

## API Endpoints

### Auth Routes (`/api/v1`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| GET | `/todos` | List signed-in user's todos | Yes |
| POST | `/todos` | Create a todo for signed-in user | Yes |
| GET | `/todos/:todoId` | Get one todo by id | Yes |
| PATCH | `/todos/:todoId` | Update title/description/completed | Yes |
| DELETE | `/todos/:todoId` | Delete a todo by id | Yes |

### NextAuth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/[...nextauth]` | Sign in/out/session/callbacks (credentials) |

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

### Prisma Setup

```bash
pnpm prisma generate
pnpm prisma migrate dev --name add_todo_and_auth_fields
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
- `pnpm prisma generate` - generate Prisma client
- `pnpm prisma migrate dev` - run development migrations

## Environment Variables

Use `.env.example` as a template:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
```

## License

ISC
