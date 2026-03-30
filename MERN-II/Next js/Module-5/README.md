# MERN-II · Module 5 — Auth UI + Animated Product Page

> **Stack:** Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS · Shadcn/ui  
> **New in Module 5:** Framer Motion · next-themes (dark mode) · RHF + Zod · Mobile hamburger · next/font

---

## Quick Start

```bash
npm install
npm run dev         # http://localhost:3000
npm run type-check  # zero errors expected
```

---

## Requirements → Implementation

| Requirement | File(s) |
|---|---|
| Login form — RHF + Zod (email, password min 8) | `components/auth/LoginForm.tsx` + `schemas/auth.ts` |
| Register form — RHF + Zod + password strength meter | `components/auth/RegisterForm.tsx` |
| Uncontrolled file upload input with `useRef` | `components/auth/RegisterForm.tsx` — `avatarRef` |
| Disable Submit while invalid or submitting | Both forms — `disabled={form.formState.isSubmitting}` |
| Shadcn Form components with inline field errors | `components/ui/form.tsx`, `input.tsx`, `label.tsx` |
| Animated CartDrawer with AnimatePresence | `components/layout/AnimatedCartDrawer.tsx` |
| Product detail image gallery with Framer Motion | `components/products/ImageGallery.tsx` |
| Full dark mode — Tailwind `dark:` + next-themes | `components/layout/ThemeProvider.tsx` + `ThemeToggle.tsx` |
| Responsive hamburger menu (mobile) | `components/layout/MobileMenu.tsx` |
| next/font — self-hosted, zero layout shift | `lib/fonts.ts` → injected in `app/layout.tsx` |

---

## Mental Models

### 1. RHF + Zod + Shadcn Form

```
useForm({ resolver: zodResolver(Schema) })
  → FormField (Controller wrapper — tracks touched/dirty per field)
  → FormControl (Slot — spreads ref, id, aria-* onto Input automatically)
  → FormMessage (reads formState.errors[name] → shows message only after touched)

mode: "onTouched" → errors appear after the user leaves a field (not on first render)
```

### 2. Uncontrolled file input

```tsx
const avatarRef = useRef<HTMLInputElement>(null);

// DOM owns the value — React does NOT control it
<input ref={avatarRef} type="file" accept="image/*" />

// Read on submit:
const file = avatarRef.current?.files?.[0];
```

Why uncontrolled for files? File inputs cannot be set programmatically (browser security).
The value is only needed on submit — not on every keystroke.

### 3. AnimatePresence — exit animations

```tsx
// React unmounts instantly. AnimatePresence intercepts unmount,
// runs the exit animation, THEN removes the DOM node.
<AnimatePresence>
  {isOpen && (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0, transition: { type: "spring", damping: 28 } }}
      exit={{ x: "100%" }}
    />
  )}
</AnimatePresence>
```

### 4. Dark mode architecture

```
next-themes ThemeProvider
  → reads localStorage / system preference
  → sets class="dark" on <html>
  → Tailwind dark: variants activate globally
  → suppressHydrationWarning on <html> prevents SSR/CSR mismatch warning

❌ Wrong: .dark body { background: #000 }   ← fights next-themes
✅ Right: body { @apply dark:bg-dark-bg }    ← Tailwind utility, always wins
```

### 5. next/font — zero layout shift

```ts
// lib/fonts.ts — runs at BUILD TIME
import { DM_Sans, DM_Serif_Display } from "next/font/google";

export const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

// app/layout.tsx
<html className={`${dmSans.variable} ${dmSerif.variable}`}>

// tailwind.config.ts
fontFamily: { sans: ["var(--font-dm-sans)"] }
```

Font is served from your own origin — no Google Fonts CDN request, no layout shift.

---

## Route Map

```
app/
├── layout.tsx              ← ThemeProvider + AnimatedCartDrawer + Navbar + Footer
├── page.tsx                ← / (hero, featured products, feature list)
├── not-found.tsx           ← 404
├── error.tsx               ← Error boundary
│
├── (shop)/
│   ├── products/
│   │   ├── page.tsx        ← /products (Suspense + ProductGrid)
│   │   ├── loading.tsx     ← /products skeleton
│   │   └── [id]/
│   │       ├── page.tsx    ← /products/[id] (ImageGallery + SSG)
│   │       └── loading.tsx ← /products/[id] skeleton
│   └── cart/
│       └── page.tsx        ← /cart (Zustand)
│
└── auth/
    ├── login/page.tsx      ← /auth/login (RHF + Zod)
    └── register/page.tsx   ← /auth/register (RHF + Zod + file upload)
```

---

## Verification Checklist

### Auth forms
- [ ] `/auth/login` — submit empty → email + password errors appear
- [ ] `/auth/login` — invalid email → "valid email address" error
- [ ] `/auth/login` — valid email + 8-char password → success state
- [ ] `/auth/register` — password strength bar updates live while typing
- [ ] `/auth/register` — mismatched passwords → "Passwords do not match" on confirmPassword
- [ ] `/auth/register` — Submit disabled while submitting (spinner visible)
- [ ] `/auth/register` — click file input → browser file picker opens → preview appears

### Dark mode
- [ ] Click theme toggle → light → dark → system cycles
- [ ] Dark mode: navbar, cards, drawer, forms all use dark variants
- [ ] Reload in dark mode → theme persists (localStorage)

### Animated CartDrawer
- [ ] Add product → drawer slides in from right (spring animation)
- [ ] Click backdrop → drawer slides out
- [ ] Cart empty → ShoppingBag empty state shown

### Image Gallery
- [ ] `/products/p-001` → image gallery renders with 4 thumbnails
- [ ] Click thumbnail → main image crossfades with slide direction
- [ ] Click arrow buttons → cycles through images
- [ ] Dot indicators animate width on active

### TypeScript
```bash
npm run type-check   # must print nothing
```
