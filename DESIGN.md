# Design System

A dark-first, warm-toned visual system inspired by editorial planners and calm productivity.

---

## Stack

- **Styling:** Tailwind CSS v4 via `@import "tailwindcss"` + `@theme inline` in `app/globals.css` (no `tailwind.config.js`)
- **Colors:** Defined as CSS custom properties via `@theme inline` — use semantic token classes (`bg-background`, `text-foreground`, `border-border`, etc.) instead of hardcoded hex values
- **Components:** Custom, no component library — all UI is hand-built
- **Icons:** None — no icon library in use
- **Fonts:** Caveat (handwriting, Google Font) for headings; system font stack for body UI
- **Dark mode:** Class-based via `@custom-variant dark`; no `next-themes`
- **Utilities:** `cn()` from `@/lib/utils/cn.ts` (simple class joiner, not `clsx`/`twMerge`)

---

## Visual Direction

A focused task board, not a generic dashboard.

- Dark ink backgrounds (`#211f24`) with warm rose/magenta accents.
- Translucent card surfaces with visible borders.
- Handwriting display headings (Caveat) for personality.
- Subtle linear gradients on primary actions.
- Toast animations with slide-in/slide-out for feedback.
- Minimal motion — purposeful, not decorative.

---

## Color Tokens

All semantic tokens are defined in `app/globals.css` via `@theme inline` and map to Tailwind utility classes. Use `bg-background`, `text-foreground`, `border-border`, etc. instead of hardcoded hex values.

| Token | Class | Hex | Usage |
|-------|-------|-----|-------|
| `background` | `bg-background` | `#211f24` | Page canvas |
| `foreground` | `text-foreground` | `#f8f1f2` | Primary text |
| `card` | `bg-card` | `#2b232a` | Paper card backgrounds |
| `card-secondary` | `bg-card-secondary` | `#3d2b33` | Column cards |
| `card-alt` | `bg-card-alt` | `#382a32` | Alternate surfaces |
| `primary` | `bg-primary` / `from-primary` | `#c14f63` | Primary action (gradient start) |
| `primary-end` | `to-primary-end` | `#98384b` | Primary action (gradient end) |
| `muted` | `bg-muted` | `#6c3240` | Badges, pills, toast |
| `muted-fg` | `text-muted-fg` | `#ddb5bc` | Supporting copy |
| `muted-light` | `text-muted-light` | `#d8a9b2` | Lighter supporting copy |
| `border` | `border-border` | `#713743` | Panel borders |
| `border-light` | `border-border-light` | `#8d4451` | Accent borders |
| `border-muted` | `border-border-muted` | `#6d3440` | Subtle borders |
| `input` | `bg-input` | `#3a2a32` | Form field backgrounds |
| `input-border` | `border-input-border` | `#75404c` | Field borders |
| `ring` | `focus:border-ring` / `focus:ring-ring` | `#cd5f74` | Focus rings |
| `destructive` | `bg-destructive` / `border-destructive` | `#d66b7e` | Delete/error actions |
| `accent` | `text-accent` | `#ffe4e8` | Bright highlight text |

Complex gradients (radial/custom blends) remain as inline hex values in their respective components.

---

## Typography

| Token | Source | Usage |
|-------|--------|-------|
| `caveat.className` | `next/font/google` (Caveat, wght 600–700) | Display headings, hero text, decorative elements |
| System stack | `SF Pro Text, SF Pro Display, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif` | Body text, controls, forms |

Guidelines:

- Hero headings use Caveat at `text-3xl` to `text-5xl` with semibold weight.
- Section headings use Caveat for personality.
- Body text uses `text-sm` to `text-base` in system fonts with `leading-relaxed`.
- Uppercase technical labels use `text-xs uppercase tracking-[0.16em]` with system font.

---

## Patterns

### Glass panel (sticky header)

```tsx
className="sticky top-3 z-40 rounded-2xl border border-[#8a4a58]/55 bg-[linear-gradient(135deg,rgba(74,43,53,0.72),rgba(37,29,36,0.62))] px-4 py-3 shadow-[0_12px_30px_rgba(8,6,8,0.35)] backdrop-blur-xl"
```

### Paper card

```tsx
className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5"
```

### Task item

```tsx
className="rounded-2xl border border-[#8a4251] bg-[#9f4657] p-3 text-[#fff5f7]"
```

### Toast notification

```tsx
className="toast-cat fixed right-4 top-4 z-50 rounded-xl border border-[#8d4451] bg-[#6c3240] px-4 py-2 text-sm font-semibold text-[#ffe8ec] shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
```

Animated via CSS `@keyframes toast-in` (0.08s ease-out) and `toast-out` (0.12s ease-in, 0.72s delay).

### Primary button

```tsx
className="rounded-xl bg-[linear-gradient(120deg,#c14f63,#98384b)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
```

### Outline button

```tsx
className="rounded-xl border border-[#8d4451] bg-[#362730] px-5 py-3 text-sm font-semibold text-[#ffdce2] transition hover:bg-[#412e38]"
```

---

## Components

### Todo Board

Two-column layout: "To Do" and "Done". Each column is a `rounded-3xl` bordered card containing a list of task items. Column header shows title + count badge.

### Task Row

Compact card with checkbox, title (strikethrough when done), optional description, and Edit/Delete actions. Supports inline editing mode that swaps text display for input fields.

### Inputs

Rounded-xl fields with dark background, rose-tinted border, and teal/rose focus ring. Placeholder text is a lighter muted rose.

### Badges

Used for column counts. Rounded-full pills with dark background and light text.

### Checkbox

Custom 20×20px rounded square, toggling between outline (unchecked) and filled (checked) states.

---

## Layout

The app uses a single-column centered layout:

```tsx
<main className="min-h-screen bg-[#211f24] text-[#f8f1f2]">
  <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
```

The todo board splits into two columns at `sm:grid-cols-2`:

```tsx
<section className="grid gap-4 sm:grid-cols-2">
```

Landing page is single-column with full-width sections.

---

## Interaction

- Hover lift: `hover:-translate-y-0.5` on primary buttons
- Hover background: `hover:bg-[#3a2a32]` on secondary elements
- Focus: visible outline/border color change (custom)
- Disabled: `disabled:cursor-not-allowed disabled:opacity-60`
- Loading: "Saving..." text replaces button label during async operations
- Cat sound: `playCatSound()` — triangle oscillator audio feedback on create/toggle
- Toast auto-dismisses after ~900ms
- Optimistic updates: UI updates immediately, rolls back on error

---

## Animations

| Name | Duration | Purpose |
|------|----------|---------|
| `toast-in` | 80ms ease-out | Slide-in notification |
| `toast-out` | 120ms ease-in (0.72s delay) | Slide-out notification |
| `stat-sheen` | 5.8s infinite | Decorative card shimmer (landing page) |

---

## Responsive

- **Mobile-first:** Single column by default, multi-column at `sm:` and `md:` breakpoints
- **Max width:** `max-w-7xl` for content container
- **No sticky behavior** on mobile
- **Auth pages:** Centered card layout, full viewport height
