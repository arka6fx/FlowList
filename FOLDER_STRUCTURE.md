# Production-Grade Folder Structure for Next.js App Router

A scalable, maintainable architecture for modern full-stack applications.

## Tech Stack
- Next.js 15+ (App Router)
- TypeScript
- Drizzle ORM + PostgreSQL
- Better Auth
- Tailwind CSS
- pnpm

---

## Folder Structure Overview

```
project-root/
├── app/                      # Next.js App Router (Server Components & Routes)
├── components/               # React Components (Feature-wise)
├── lib/                      # Core utilities and configurations
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── drizzle/                  # Database schema and migrations
├── actions/                  # Server Actions (optional, inside app or root)
├── services/                 # Business logic layer (optional)
├── validations/              # Zod schemas (optional)
├── config/                   # Application configuration
├── public/                   # Static assets
├── styles/                   # Global styles
└── [other root files]        # package.json, tsconfig, etc.
```

---

## Detailed Folder Explanation

### 1. `app/` - Next.js App Router

**Purpose**: Contains all routing, layouts, pages, API routes, and server components.

**Inside app/**:
- `(auth)/` - Route group for authentication (signin, signup)
- `(dashboard)/` - Protected dashboard routes
- `api/` - API routes (route.ts files)
- `layout.tsx` - Root layout
- `page.tsx` - Home page

**Why inside app/**:
- Next.js App Router requires this specific location
- Route handlers must be here
- Server components live here

**Scalability Benefit**:
- Route groups `(folder)` allow logical organization without affecting URLs
- Parallel routes and intercepting routes for advanced patterns

---

### 2. `components/` - Feature-wise UI Components

**Purpose**: Reusable React components organized by feature/domain.

**Structure**:
```
components/
├── ui/                       # Base UI components (Button, Input, Card)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── auth/                     # Auth-specific components
│   ├── signin-form.tsx
│   ├── signup-form.tsx
│   └── ...
├── dashboard/                # Dashboard feature components
│   ├── dashboard-header.tsx
│   ├── stats-card.tsx
│   └── ...
├── todo/                     # Todo feature components
│   ├── todo-board.tsx
│   ├── todo-item.tsx
│   ├── todo-form.tsx
│   └── ...
└── layout/                   # Layout components (Header, Footer, Sidebar)
    ├── header.tsx
    ├── sidebar.tsx
    └── footer.tsx
```

**Why outside app/**:
- Better separation of concerns
- Easier to import in both client and server components
- Can be tested independently

**Scalability Benefit**:
- Feature folders make it easy to find related components
- Easy to delete entire feature when needed
- Team can work on different features without conflicts

---

### 3. `lib/` - Core Utilities and Configurations

**Purpose**: Core utilities, database connections, auth config, third-party integrations.

**Structure**:
```
lib/
├── db/                       # Database connection
│   └── index.ts              # Drizzle client instance
├── auth/                     # Auth configuration
│   ├── index.ts              # Better Auth setup
│   ├── client.ts             # Client-side auth utilities
│   ├── current-user.ts       # Server-side current user helper
│   └── utils.ts              # Auth helpers
├── utils/                    # General utilities
│   ├── cn.ts                 # classnames helper
│   ├── format-date.ts
│   └── ...
├── api/                      # API client utilities
│   └── client.ts             # Fetch wrapper, axios instance
└── config.ts                 # App-wide config
```

**Why outside app/**:
- Shared between app and other directories
- Database connections work with any React component
- Reusable across the entire application

**Scalability Benefit**:
- Single source of truth for database/auth
- Easy to swap implementations (e.g., DB provider)
- Centralized configuration

---

### 4. `hooks/` - Custom React Hooks

**Purpose**: Encapsulate reusable client-side logic.

**Structure**:
```
hooks/
├── use-auth.ts               # Auth state management
├── use-todos.ts              # Todo data fetching/mutations
├── use-debounce.ts           # Utility hooks
├── use-media-query.ts
└── use-local-storage.ts
```

**Scalability Benefit**:
- Share logic across components
- Easy to test in isolation
- Can be composed into more complex hooks

---

### 5. `types/` - TypeScript Definitions

**Purpose**: Global type definitions, interfaces, and type utilities.

**Structure**:
```
types/
├── index.ts                  # Global types export
├── todo.ts                   # Todo-related types
├── user.ts                   # User-related types
└── api.ts                    # API response types
```

**Scalability Benefit**:
- Single source of truth for types
- Easy to maintain consistency
- Type checking across the app

---

### 6. `drizzle/` - Database Schema and Migrations

**Purpose**: Database schema, migrations, and seed data.

**Structure**:
```
drizzle/
├── schema.ts                 # All table definitions
├── index.ts                  # Type exports, relations
├── relations.ts              # Drizzle relations (optional)
├── migrations/               # SQL migrations
│   └── ...
├── meta/                    # Drizzle meta (journal, snapshots)
│   ├── _journal.json
│   └── 0000_snapshot.json
└── seed.ts                   # Seed data (optional)
```

**Why separate**:
- Database schema is infrastructure, not UI
- Migrations are version-controlled
- Can be used by any part of the app

**Scalability Benefit**:
- Clean separation of schema from code
- Easy to review schema changes via git
- Migration history is preserved

---

### 7. `actions/` - Server Actions (Optional)

**Purpose**: Server-side mutations and data fetching.

**Structure**:
```
actions/
├── auth-actions.ts           # Sign in, sign up, sign out
├── todo-actions.ts           # CRUD operations for todos
└── user-actions.ts           # User profile operations
```

**Placement Options**:
- **Option A**: Inside `app/actions/` (recommended for simple apps)
- **Option B**: At root `actions/` (better for larger apps)

**Scalability Benefit**:
- Type-safe API between client and server
- Reduces API routes for simple operations
- Can be imported directly in components

---

### 8. `services/` - Business Logic Layer (Optional)

**Purpose**: Complex business logic, third-party integrations.

**Structure**:
```
services/
├── email/                    # Email service
│   └── index.ts             # SendGrid, Resend, etc.
├── storage/                  # File storage (S3, Uploadthing)
│   └── index.ts
├── analytics/                # Analytics tracking
│   └── index.ts
└── payment/                  # Payment processing (Stripe)
    └── index.ts
```

**Scalability Benefit**:
- Separates business logic from UI
- Easy to test services independently
- Swappable implementations

---

### 9. `validations/` - Zod Schemas (Optional)

**Purpose**: Input validation schemas for forms and API.

**Structure**:
```
validations/
├── auth.ts                   # Sign in/up validation
├── todo.ts                   # Todo validation
├── user.ts                   # User profile validation
└── index.ts                  # Combined exports
```

**Scalability Benefit**:
- Single source of truth for validation
- Use in API routes, forms, and actions
- Type inference from schemas

---

### 10. `config/` - Application Configuration

**Purpose**: Environment variables, app constants.

**Structure**:
```
config/
├── app.ts                    # App-wide constants
├── features.ts               # Feature flags
└── limits.ts                 # Rate limits, pagination
```

---

### 11. `public/` - Static Assets

**Purpose**: Images, fonts, icons that don't need processing.

```
public/
├── images/
├── icons/
└── fonts/
```

---

### 12. `styles/` - Global Styles

**Purpose**: Global CSS, Tailwind config, theme.

**Structure**:
```
styles/
├── globals.css              # Global CSS
├── tailwind.css            # Tailwind entry (if separate)
└── themes/                 # Theme configurations
    └── ...
```

---

## Where to Keep Things: Inside vs Outside `app/`

### INSIDE `app/` (Required)
| Path | Reason |
|------|--------|
| `app/page.tsx` | Routes must be in app |
| `app/layout.tsx` | Root layout must be in app |
| `app/(auth)/` | Route groups |
| `app/api/` | API route handlers |
| `app/[...catchall]/` | Catch-all routes |

### OUTSIDE `app/` (Recommended)
| Path | Reason |
|------|--------|
| `components/` | Reusable, testable components |
| `lib/` | Shared utilities |
| `hooks/` | Custom React hooks |
| `types/` | TypeScript definitions |
| `drizzle/` | Database schema |
| `actions/` | Server actions |
| `validations/` | Zod schemas |
| `services/` | Business logic |

---

## Example Final Folder Tree

```
FLowList/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Dashboard layout (with sidebar)
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts     # Better Auth API
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                       # Base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── auth/                     # Auth components
│   │   ├── signin-form.tsx
│   │   └── signup-form.tsx
│   ├── todo/                     # Todo components
│   │   ├── todo-board.tsx
│   │   ├── todo-board-shell.tsx
│   │   ├── todo-item.tsx
│   │   └── todo-form.tsx
│   └── layout/                   # Layout components
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/
│   ├── db/
│   │   └── index.ts              # Drizzle client
│   ├── auth/
│   │   ├── index.ts              # Better Auth config
│   │   ├── client.ts             # Client auth utils
│   │   ├── current-user.ts       # Server auth helper
│   │   └── utils.ts              # Auth utilities
│   ├── utils/
│   │   ├── cn.ts                 # classnames helper
│   │   └── format-date.ts
│   └── config.ts                 # App config
├── hooks/
│   ├── use-auth.ts
│   ├── use-todos.ts
│   └── use-debounce.ts
├── types/
│   ├── index.ts
│   ├── todo.ts
│   └── user.ts
├── drizzle/
│   ├── schema.ts                 # Database schema
│   ├── index.ts                  # Exports & relations
│   ├── migrations/               # SQL migrations
│   └── meta/                    # Drizzle metadata
├── actions/                      # Server Actions
│   ├── auth-actions.ts
│   └── todo-actions.ts
├── validations/                  # Zod schemas
│   ├── auth.ts
│   └── todo.ts
├── services/                     # Business logic
│   ├── email/
│   └── storage/
├── config/                       # App configuration
│   ├── app.ts
│   └── features.ts
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── .env
├── .env.example
└── README.md
```

---

## Optional Folders for Future Scaling

| Folder | Purpose | When to Add |
|--------|---------|-------------|
| `tests/` | Unit and integration tests | When adding test suite |
| `store/` | Client state (Zustand, Jotai) | When complex state needed |
| `scripts/` | Build/deploy scripts | When CI/CD matures |
| `docs/` | Project documentation | When team grows |
| `mocks/` | Mock data for development | When testing increases |
| `workers/` | Background jobs (Inngest, Trigger) | When async tasks needed |
| `email/` | Email templates | When sending emails |
| `locales/` | i18n translations | When adding translations |

---

## Scalability Benefits Summary

### 1. **Feature-Based Organization**
- Easy to find related files
- Teams can own features
- Easy to remove features

### 2. **Separation of Concerns**
- UI separate from business logic
- Database schema separate from routes
- Types separate from implementation

### 3. **Server vs Client Separation**
- Clear distinction between server/client code
- Better tree-shaking
- Reduced bundle size

### 4. **Type Safety**
- Single source of truth for types
- Zod schemas for validation
- Type inference throughout

### 5. **Testing**
- Components testable in isolation
- Services testable independently
- Easy to mock dependencies

---

## Developer Experience Benefits

1. **Intuitive file locations** - Developers know where to look
2. **Consistent naming** - camelCase files, PascalCase components
3. **Clear imports** - Use path aliases (@/, ~/)
4. **Scalable imports** - No deep nesting (max 3-4 levels)
5. **Auto-imports** - IDE-friendly structure

---

## Recommended Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/types/*": ["types/*"],
      "@/drizzle/*": ["drizzle/*"],
      "@/actions/*": ["actions/*"],
      "@/validations/*": ["validations/*"]
    }
  }
}
```

---

## Migration Tips

1. **Start simple** - Add folders as needed
2. **Keep migrations atomic** - Move one feature at a time
3. **Update imports** - Use path aliases to reduce breakage
4. **Test thoroughly** - Ensure routes still work
5. **Document changes** - Update README and FOLDER_STRUCTURE.md

---

## Summary

This folder structure provides:

✅ **Scalability** - Grows with your application  
✅ **Maintainability** - Easy to find and modify code  
✅ **Type Safety** - Full TypeScript support  
✅ **Testability** - Components and services independently testable  
✅ **Team Collaboration** - Multiple teams can work on different features  
✅ **Modern Best Practices** - Follows Next.js App Router patterns  
✅ **Developer Experience** - Intuitive, consistent, IDE-friendly  

The structure is opinionated but flexible - adapt it to your team's needs while maintaining the core principles of separation of concerns and feature-based organization.