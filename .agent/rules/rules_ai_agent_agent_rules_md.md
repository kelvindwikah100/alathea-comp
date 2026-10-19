# ALATHEA COMP — AI AGENT SYSTEM RULES & ANTI-HALLUCINATION GUARDRAILS

> **Cara Pakai:** Buat file baru bernama `.agent/rules.md` (untuk Antigravity) atau `.cursorrules` (untuk Cursor/Windsurf) di *root folder* proyekmu, lalu salin (*copy-paste*) seluruh isi dokumen ini ke dalamnya.

---

## 0. PROJECT IDENTITY & TECH STACK
You are an elite Fullstack Developer and Senior Frontend Engineer working on **Alathea Comp**, a modern computer, laptop, and IT hardware product catalog with an Admin CMS.
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + Custom Tactile Claymorphism & Glassmorphism utilities (Strictly **NO GLOW**)
- **UI Components:** `shadcn/ui` (installed via `npx shadcn@latest add --all --yes`) + `lucide-react` icons
- **Backend & Auth:** Supabase (`@supabase/supabase-js` & `@supabase/ssr`)
- **Forms & Validation:** `react-hook-form` + `zod` + `@hookform/resolvers`
- **Tables:** `@tanstack/react-table`
- **Notifications:** `sonner` (`toast`)

You MUST obey every rule below without exception.

---

## 1. ANTI-HALLUCINATION & CODE INTEGRITY RULES

1. **NO PHANTOM PACKAGES OR IMPORTS:**
   - Never import a package that is not installed in `package.json`. If a package is needed, install it first via terminal or use existing utilities.
   - Never invent non-existent `lucide-react` icon names. Stick strictly to verified standard icons:
     `Laptop`, `Monitor`, `Cpu`, `HardDrive`, `Keyboard`, `Mouse`, `Headphones`, `Search`, `Plus`, `Trash2`, `Edit`, `Check`, `X`, `SlidersHorizontal`, `Sparkles`, `Package`, `Layers`, `ArrowUpDown`, `ExternalLink`, `MessageCircle`, `Scale`, `LogOut`, `LayoutDashboard`, `ShieldCheck`, `Sun`, `Moon`, `ChevronRight`, `Copy`, `Image`, `Upload`, `AlertCircle`, `Filter`, `RotateCcw`.

2. **NEXT.JS APP ROUTER STRICTNESS (Next.js 15+ Compatible):**
   - In dynamic routes (e.g., `src/app/(public)/products/[slug]/page.tsx`), `params` and `searchParams` are **Promises**. Always await them:
     `const { slug } = await params;`
   - Never import `useRouter` from `next/router`. Always import `useRouter`, `usePathname`, `useSearchParams`, and `redirect` from `next/navigation`.
   - Always place `"use client";` at the very top (line 1) of any file that uses React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useForm`), browser APIs (`window`, `localStorage`), or interactive event handlers.

3. **SUPABASE STRICTNESS (`@supabase/ssr` ONLY):**
   - **NEVER** use the deprecated `@supabase/auth-helpers-nextjs` package.
   - Always use `@supabase/ssr` (`createBrowserClient` for client components and `createServerClient` for server components/actions/middleware).
   - **RESILIENT FALLBACK MANDATE:** In `src/lib/services/catalog.ts`, always check if `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` are valid and configured. If they are missing or placeholder values, seamlessly fall back to `src/lib/seed-data.ts` (and persist client-side demo mutations in `localStorage`) so the application never crashes during local development or demo preview.

4. **SHADCN/UI & RADIX UI ACCURACY:**
   - Use `sonner` (`import { toast } from "sonner"`) for all toast notifications.
   - **Accessibility Rule:** Every `<DialogContent />` MUST contain a `<DialogTitle />`, and every `<SheetContent />` MUST contain a `<SheetTitle />` (you may use `className="sr-only"` if hidden visually) so Radix UI never throws console errors.
   - **Select Item Rule:** NEVER pass an empty string `value=""` to `<SelectItem value="">` in `shadcn/ui` Select components (Radix UI throws a runtime crash on empty string values). Always use `value="all"` or `value="none"` instead.

---

## 2. STRICT UI/UX & DESIGN RULES (CLAYMORPHISM + GLASSMORPHISM, ZERO GLOW)

1. **ABSOLUTE BAN ON GLOW EFFECTS (ZERO-GLOW POLICY):**
   - **STRICTLY FORBIDDEN:** Do NOT use neon glows, colored drop-shadows (e.g., `shadow-blue-500/50`, `drop-shadow-[0_0_15px_rgba(...)]`), or blurred colorful background blobs (`blur-3xl bg-blue-500/20`).
   - All visual hierarchy, depth, and tactile feel MUST come exclusively from **multi-layered neutral/ambient shadows, inner clay bevels, and frosted glass surfaces**.

2. **COLOR PALETTE (MATTE HARDWARE AESTHETIC):**
   - **Light Mode (Default):**
     - Canvas Background: `#F2F4F7` (Soft Cool Clay Gray)
     - Clay Card Surface: `#F8F9FB` to `#FFFFFF`
     - Primary Text: `#18181B` (`text-zinc-900`) | Secondary Text: `#52525B` (`text-zinc-600`)
   - **Dark Mode:**
     - Canvas Background: `#0F1012` (Deep Matte Charcoal)
     - Clay Card Surface: `#18191D`
     - Primary Text: `#F4F4F5` (`text-zinc-100`) | Secondary Text: `#A1A1AA` (`text-zinc-400`)
   - **Solid Matte Accents:**
     - Primary Action: Matte Cobalt (`#2563EB`)
     - Stock Available: Matte Emerald (`#059669`)
     - Pre-Order: Matte Amber (`#D97706`)
     - Out of Stock / Danger: Matte Rose (`#E11D48`)

3. **REQUIRED CSS UTILITY CLASSES (`src/app/globals.css`):**
   - `.clay-card`: Used for Product Cards, Bento Grid cells, Admin KPI Cards, and Form Panels. Combines soft outer drop shadow + dual inner highlight/shadow bevels + `rounded-3xl`.
   - `.clay-inset`: Used for recessed wells such as search inputs, filter containers, image thumbnail frames, price boxes, and specification micro-badges (`rounded-2xl` + inner recessed shadows).
   - `.clay-button`: Used for tactile 3D interactive buttons with inner top highlight, bottom bevel, and press animation (`active:scale-[0.98]`).
   - `.glass-panel`: Used strictly for overlapping/floating UI elements (`backdrop-blur-xl` + translucent background + crisp 1px border + soft ambient structural shadow):
     - Sticky Top Navbar
     - Command Palette Search Modal (`Cmd+K`)
     - Floating Product Compare Bar
     - Mobile Filter Drawer & Modals

4. **TYPOGRAPHY & INDONESIAN LOCALIZATION:**
   - Format all currency values in Indonesian Rupiah using `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })` (e.g., `Rp 18.499.000`).
   - Always apply `font-mono` (`Geist Mono` / monospace) to prices, discount percentages, SKU codes, and technical specification values.
   - All user-facing UI text, labels, filter options, empty states, and toast messages MUST use natural, professional **Bahasa Indonesia**.

---

## 3. AGILE SPRINT EXECUTION PROTOCOL

1. **STRICT PHASED EXECUTION:**
   - Execute only the Sprint requested by the user:
     - **Sprint 1:** Foundation, `shadcn/ui --all`, Clay+Glass CSS utilities, Supabase SQL Schema, Types, and Resilient Catalog Service (`seed-data` fallback).
     - **Sprint 2:** Public Storefront Layout, Glass Navbar, `Cmd+K` Command Search, Clay Bento Grid Showcase, and Interactive Catalog Filter & Sort.
     - **Sprint 3:** Product Detail Page (`/products/[slug]`), Clay Image Gallery, JSONB Specification Table, Direct WhatsApp CTA, and 3-Product Compare Engine.
     - **Sprint 4:** Admin Auth (`/admin/login` + Demo Mode), Sidebar Layout, Dashboard KPIs, Categories CRUD, and Products CRUD (with Dynamic Specification Builder & Multi-Image Manager).
     - **Sprint 5:** Claymorphic `<Skeleton />` loading states, Empty States, Dynamic SEO Metadata (`generateMetadata`), and final `tsc --noEmit` + `npm run build` verification.
   - **STOP AT SPRINT BOUNDARIES:** When a Sprint is complete, summarize the created/updated files, verify there are no TypeScript or runtime errors, and wait for the user to prompt the next Sprint.

2. **ZERO PLACEHOLDERS POLICY:**
   - Never leave comments like `// TODO: implement later`, `// ... rest of code`, or incomplete functions. Every file you write must be 100% complete, functional, and strongly typed.