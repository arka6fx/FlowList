# Design System

A dark-first, warm-toned visual system inspired by editorial planners and calm productivity.

---

## Stack

- **Styling:** Tailwind CSS v4 via `@import "tailwindcss"` + `@theme inline` in `app/globals.css` (no `tailwind.config.js`)
- **Component library:** shadcn/ui with `base-nova` style — uses `@base-ui/react` primitives (not Radix UI)
- **Icons:** Lucide React (`lucide-react`)
- **Fonts:** Caveat (handwriting, Google Font) for display; Geist (Google Font) for UI body
- **Animations:** Framer Motion — entrance animations, `AnimatePresence` for list transitions, `whileInView` for scroll reveals
- **Toasts:** Sonner (`sonner`) — `toast()` / `toast.success()` / `toast.error()`; hardcoded `theme="dark"`
- **Dark mode:** Always dark; no `next-themes`
- **Utilities:** `cn()` from `@/lib/utils` (clsx + tailwind-merge)

---

## Visual Direction

A focused task board, not a generic dashboard.

- Dark ink backgrounds (`#210124`) with Light Gold accents with Fern and Dark Slate Grey supporting tones (palette: Lime Cream, Light Gold, Fern, Dark Slate Grey, Midnight Violet).
- Translucent card surfaces with visible borders.
- Handwriting display headings (Caveat) for personality.
- Subtle linear gradients and radial gradients on hero sections.
- Purposeful motion — entrance animations, smooth list reordering, Apple-style press feedback (pill buttons, hover lift, spring easing).

---

## Color Tokens

All semantic tokens are defined in `app/globals.css` via `@theme inline` and map to Tailwind utility classes. Use semantic token classes instead of hardcoded hex values.

| Token | Class | Hex | Usage |
|-------|-------|-----|-------|
| `background` | `bg-background` | `#210124` | Page canvas |
| `foreground` | `text-foreground` | `#f4fdaf` | Primary text |
| `card` | `bg-card` | `#2e1032` | Card backgrounds |
| `primary` | `bg-primary` / `text-primary` | `#efdd8d` | Primary actions, accents |
| `primary-foreground` | `text-primary-foreground` | `#210124` | Text on primary bg |
| `secondary` | `bg-secondary` | `#394f49` | Secondary surfaces |
| `secondary-foreground` | `text-secondary-foreground` | `#f4fdaf` | Text on secondary bg |
| `muted` | `bg-muted` | `#65743a` | Badges, pills |
| `muted-foreground` | `text-muted-foreground` | `#cdd79c` | Supporting copy |
| `accent` | `bg-accent` | `#3a1c3f` | Alternate surfaces |
| `accent-foreground` | `text-accent-foreground` | `#f4fdaf` | Bright highlight text |
| `border` | `border-border` | `#4a2c4f` | Panel borders |
| `input` | `border-input` | `#5a3a60` | Input field border |
| `ring` | `ring-ring` | `#efdd8d` | Focus rings |
| `destructive` | `bg-destructive` | `#ff9a86` | Delete/error actions |

Input background is not a semantic token — apply via `className="bg-[var(--color-input-bg)]"` (`#26092a`).

Complex gradients (radial/custom blends) remain as inline values in their respective components.

---

## Typography

| Token | Source | Usage |
|-------|--------|-------|
| `caveat.className` | `next/font/google` (Caveat) | Display headings, hero text, decorative elements |
| `font-sans` / default | Geist (loaded in root layout) | Body text, controls, forms |

Guidelines:

- Hero headings use Caveat at `text-3xl` to `text-5xl` with semibold weight.
- Section headings use Caveat for personality; body headings use `font-semibold`.
- Body text uses `text-sm` to `text-base` with `leading-relaxed`.
- Uppercase technical labels use `text-xs uppercase tracking-widest`.

---

## Components

### Button (shadcn base-nova)

Uses `@base-ui/react`. Polymorphism via `render` prop, **not** `asChild`.

```tsx
// Standard button
<Button variant="outline" size="sm">Sign in</Button>

// Button rendered as Next.js Link
<Button nativeButton={false} render={<Link href="/signup" />}>Sign up</Button>
```

Variants: `default`, `outline`, `ghost`, `destructive`. Sizes: `sm`, `default`, `lg`, `icon`, `icon-xs`.

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

### Todo Board

Two-column layout (`grid gap-4 sm:grid-cols-2`): "To Do" and "Done". Each column is a Card containing an animated list of task items. Column header shows title + count Badge.

List animations via `AnimatePresence` + `motion.li` with `layout` prop for smooth reordering.

### Task Row

shadcn Checkbox for toggle, title (line-through when done), optional description, and Edit/Delete icon buttons. Edit opens a shadcn Dialog — no inline editing state.

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="ghost" size="icon-xs" />}>
    <PencilIcon className="size-3.5" />
  </DialogTrigger>
  <DialogContent>…</DialogContent>
</Dialog>
```

### Inputs

shadcn Input/Textarea with `border-input` border and `bg-[var(--color-input-bg)]` background.

```tsx
<Input className="h-9 bg-[var(--color-input-bg)]" />
```

### Toast

Sonner — import `toast` from `"sonner"`:

```tsx
toast.success("Task created")
toast.error("Failed to delete")
toast("Task completed 🎉")
```

`<Toaster position="top-right" richColors />` lives in `app/providers.tsx`.

### Badge

```tsx
<Badge variant="secondary">Daily focus system</Badge>
<Badge variant="outline">Morning</Badge>
```

---

## Layout

Single-column centered container:

```tsx
<main className="min-h-screen bg-background text-foreground">
  <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
```

Todo board splits into two columns at `sm:grid-cols-2`.

---

## Animations (Framer Motion)

| Pattern | Usage |
|---------|-------|
| Entrance (`opacity 0→1, y offset→0`) | Board header, form, columns on mount |
| `AnimatePresence` + `motion.li layout` | Todo add/remove with smooth reorder |
| `whileInView` + `viewport={{ once: true }}` | Landing page section reveals |
| `whileTap={{ scale: 0.97 }}` | Button press feedback |
| Stagger variants (`staggerChildren: 0.1`) | Hero section children |

Common easing constant:

```ts
const ease = [0.25, 0.46, 0.45, 0.94] as const;
```

---

## Interaction

- Buttons are pill-shaped (Apple style): hover lifts 1px, press scales to 0.96 via CSS (`--ease-apple`); do not wrap in `motion.div whileTap`
- Focus: shadcn default ring (`ring-ring`)
- Disabled: `disabled:cursor-not-allowed disabled:opacity-60`
- Loading: button label changes during async operations (e.g. "Saving…")
- Optimistic updates: UI changes immediately, rolls back on error

---

## Responsive

- **Mobile-first:** Single column by default, multi-column at `sm:` and `md:` breakpoints
- **Max width:** `max-w-5xl` for content container
- **Sticky nav:** landing page header is `sticky top-3` with backdrop blur
- **Auth pages:** Centered Card layout, full viewport height
