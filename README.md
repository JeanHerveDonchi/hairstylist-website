# Brinelle Hair — Booking & Growth Platform

A full-stack web application that gives an independent hairstylist in Moncton, NB a professional online presence, 24/7 self-serve booking, and the digital foundation to grow her clientele — without relying on third-party booking apps that take a cut or dilute the brand.

---

## The Vision

Most independent hair stylists operate without a website, rely on DMs and phone calls for bookings, and lose potential customers who can't find them online. **Brinelle Hair** solves that by giving the stylist:

- A branded, bilingual (FR/EN) website she fully owns
- An online booking system that works around the clock — no phone tag
- A centralized place for customers to discover her services, pricing, and availability
- A CMS-managed content layer so she can update copy, prices, and promotions without a developer
- The data foundation to eventually add loyalty features, customer analytics, and targeted outreach

This is not just a portfolio piece — it is a real business tool built for a real client, designed to evolve as the business grows.

---

## Features

| Feature | Description |
|---------|-------------|
| **Hairstyle catalog** | Browse hairstyles by category (Women, Men, Children) with images, descriptions, durations, and prices |
| **Real-time availability** | Dynamic availability engine that factors in business hours, existing appointments, and manually blocked slots |
| **Multi-step booking flow** | Guided flow: service selection → date & time → customer info → confirmation, with session persistence |
| **Email notifications** | Automatic confirmation emails to both customer and stylist on booking |
| **Bilingual (FR/EN)** | Full locale switching — French-first for the Moncton market, English fallback |
| **CMS-managed content** | All copy (brand name, navbar, hero, CTAs) lives in cms0 — zero hardcoded strings |
| **Responsive UI** | Mobile-first design built with Tailwind CSS v4 |
| **Secure by design** | No API keys in the client bundle — all data access proxied through the backend |

---

## Stack

### Frontend — Vue 3 + TypeScript + Vite

- **Vue 3** (Composition API) with `<script setup>` throughout
- **TypeScript** — strict mode, full type coverage including API responses and CMS schema
- **Tailwind CSS v4** — utility-first, mobile-first styling with `@tailwindcss/vite`
- **Pinia** for global state management
- **vue-router** — history mode routing
- **Vitest + Vue Test Utils** — unit and integration tests for composables and services

### Backend — ElysiaJS on Bun

- **Bun** runtime — fast startup, native TypeScript, no transpilation step
- **ElysiaJS** — typed, lightweight HTTP framework with built-in schema validation (TypeBox)
- **Route groups:** `/api/categories`, `/api/hairstyles`, `/api/availability`, `/api/bookings`, `/api/email`
- All business logic lives here — the frontend is a thin UI layer

### Database — Supabase (PostgreSQL)

- Tables: `hairstyle_categories`, `hairstyles`, `customers`, `appointments`, `business_hours`, `blocked_events`
- Accessed server-side only via `service_role` key — no direct client DB access
- Clean relational model with foreign key constraints and timestamptz precision for scheduling

### CMS — cms0

**[cms0](https://docs.cms0.io/)** is a code-first, type-safe headless CMS. The content schema is defined in TypeScript — cms0 generates the management API and editor UI from it automatically. No dashboard configuration, no drag-and-drop.

```typescript
type RootSchema = {
  HomePage: {
    heroTitle: string;
  };
  SiteSettings: {
    brandName: LocalizedString;
    navbar: {
      servicesLabel: LocalizedString;
      contactsLabel: LocalizedString;
      bookingCta: LocalizedString;
    };
  };
};
```

Every piece of user-facing text flows through cms0. The schema is the contract — TypeScript enforces it at compile time, and the CMS enforces it at runtime. Content editors work in a generated UI while developers work against typed fields.

---

## Architecture

```
Browser (Vue 3 SPA)
    │
    ├── GET /api/categories ──────┐
    ├── GET /api/hairstyles ──────┤
    ├── GET /api/availability ────┼── ElysiaJS (Bun)  :3000
    ├── POST /api/bookings ───────┤       │
    └── POST /api/email          ─┘       ├── Supabase (PostgreSQL)
                                          └── EmailJS (transactional email)
    │
    └── cms0 delivery API ─────────────── cms0.io (read-only key, safe to bundle)
```

**Supabase and EmailJS are exclusively server-side.** The frontend calls cms0 directly using a read-only delivery key — it cannot modify content. This architecture makes it straightforward to add authentication middleware, rate limiting, and request logging in one place for all mutable operations.

---

## Skills Demonstrated

### Full-Stack Architecture
Designed and implemented a clean three-tier architecture with separation of concerns between presentation, business logic, and data. Deliberate decisions around where secrets live, where validation runs, and where data access is enforced.

### TypeScript End-to-End
Types flow from the database schema → Elysia route handlers → frontend API client → Vue components. CMS content schema is defined once in TypeScript and shared across the stack via a typed client.

### API Design
RESTful API with typed request/response contracts using Elysia's TypeBox integration. Eden Treaty for type-safe client-server communication.

### Real-Time Availability Engine
Custom scheduling logic that computes available time slots from business hours, appointment duration, booked slots, and manually blocked events — without a scheduling library.

### Headless CMS Integration
Integrated cms0 as a code-first CMS. The schema-as-code approach keeps content contracts in version control and eliminates CMS configuration drift. The backend proxies CMS requests so the client never holds credentials.

### Localization
Bilingual FR/EN support built as a clean composable layer: `LocaleService` handles localStorage persistence, `useLocale()` exposes a module-level singleton reactive `locale` ref (so all components share one source of truth without a store), and `getLocalizedString()` resolves a `LocalizedString` value with fallback to the CMS-defined default locale. `LocalizedString` uses the cms0 native shape `{ defaultLocale: string, locales: Record<string, string> }` — adding a third language is a schema-only change with zero component rewrites.

### Security Practices
- No API keys in the client bundle
- Server-side input validation on all mutation endpoints
- Single transactional booking endpoint (create customer + appointment atomically)
- Planned: JWT auth, rate limiting middleware, RLS for future admin access

### Testing
Unit tests for the availability engine, booking composable, and all service layers (customer, booking, email, blocked events) using Vitest. Tests written before and during the architecture migration.

### Entrepreneurial Thinking
Built around a real business goal: give an independent stylist a tool that converts website visitors into bookings, builds her brand credibility, and reduces administrative overhead — so she can focus on clients, not logistics.

---

## Local Development

**Prerequisites:** [Bun](https://bun.sh/) ≥ 1.0, Node.js ≥ 18

### Backend

```bash
cd src/backend
cp .env.example .env   # fill in Supabase, cms0, EmailJS credentials
bun install
bun run dev            # starts on :3000
```

### Frontend

```bash
cd src/frontend
cp .env.example .env   # set VITE_API_BASEURL=http://localhost:3000
bun install            # or npm install
bun run dev            # starts on :5173
```

### Environment variables

| Variable | Layer | Purpose |
|----------|-------|---------|
| `SUPABASE_URL` | Backend | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Server-side DB access |
| `CMS0_API_BASEURL` | Backend | cms0 API endpoint (management key — for `cms0 dev` CLI) |
| `CMS0_API_KEY` | Backend | cms0 management key (read-write, CLI only) |
| `EMAILJS_SERVICE_ID` | Backend | EmailJS service |
| `EMAILJS_PUBLIC_KEY` | Backend | EmailJS auth |
| `VITE_API_BASEURL` | Frontend | Points to Elysia backend |
| `VITE_CMS0_API_BASEURL` | Frontend | cms0 delivery API endpoint |
| `VITE_CMS0_API_KEY` | Frontend | cms0 delivery key (read-only, safe to bundle) |

---

## Project Status

| Phase | Milestone | Status |
|-------|-----------|--------|
| 1 | Codebase audit & target architecture defined | ✅ Done |
| 2 | ElysiaJS backend scaffolded, API keys moved server-side | ✅ Done |
| 3 | Frontend services migrated to Elysia API | 🔜 In progress |
| 4 | Remove legacy direct Supabase/EmailJS/cms0 client calls | ⬜ Planned |
| 5 | Server-side validation, error handling, rate limiting | ⬜ Planned |
| 6 | Testing, CI/CD, deployment | ⬜ Planned |
| 7 | Admin dashboard, authentication, customer analytics | ⬜ Future |

---

## About

Built by **Jean Herve** — full-stack developer with a focus on clean architecture, type safety, and building software that solves real problems for real people.
