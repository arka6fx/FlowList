# FlowList

A full-stack Todo app to create, organize, and complete tasks with a clean UI and a PostgreSQL-backed API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **HTTP Client:** Axios

## Project Structure

```text
flowlist/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── signup/
│   │           └── route.ts        # User signup API
│   ├── lib/
│   │   └── db/
│   │       └── index.ts            # Prisma client singleton
│   ├── signin/
│   │   └── page.tsx                # Sign-in page
│   ├── signup/
│   │   └── page.tsx                # Sign-up page
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

## Current Database Model

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String
  password String
}
```

## API Endpoints

### Auth Routes (`/api/v1`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |

> Note: `/signin` and todo CRUD routes are planned next.

## Todo Data Shape (Planned)

FlowList todo items are intended to include:

```json
{
  "id": "todo_01",
  "title": "Finish Prisma setup",
  "description": "Create schema, run migration, and generate client",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-04-09T12:00:00.000Z",
  "createdAt": "2026-04-07T05:30:00.000Z"
}
```

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

### Prisma Setup

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init_schema
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
```

## License

ISC
