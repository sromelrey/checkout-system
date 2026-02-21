# 🍡 Mochi Checkout System

A modern, type-safe checkout system built with **TanStack Start**, **TanStack Query**, **Zod**, and **TailwindCSS v4**. Demonstrates clean architecture, domain-driven design, and real-world React patterns.

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Framework      | TanStack Start (SSR + file-based routing) |
| Data Fetching  | TanStack Query (React Query)              |
| Validation     | Zod (runtime schema validation)           |
| Styling        | TailwindCSS v4                            |
| Language       | TypeScript (strict mode)                  |
| Build Tool     | Vite 7                                    |
| Server Runtime | Nitro                                     |

### Folder Structure

```bash
src/
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout – providers, global shell
│   ├── index.tsx        # Home – product listing
│   ├── cart.tsx         # Cart page
│   └── checkout.tsx     # Checkout form + order submission
│
├── domains/             # Pure domain models & business logic
│   ├── product/         # Product types
│   ├── cart/            # Cart types, reducer, pure logic
│   └── promotion/       # Promotion rules & evaluation engine
│
├── features/            # Feature modules (hooks + components)
│   ├── products/        # useProductsQuery, ProductList, ProductCard
│   ├── cart/            # CartContext, CartSummary, CartItem, CartBadge
│   └── checkout/        # useCheckoutMutation, CheckoutForm, OrderSummary
│
├── api/                 # API layer (typed clients + Zod schemas)
│   ├── client.ts        # Typed fetch wrapper
│   ├── schemas/         # Zod schemas for API request/response
│   └── services/        # Service functions (getProducts, submitCheckout)
│
├── components/          # Shared, reusable UI components
│   ├── layout/          # Header, Footer
│   ├── ui/              # Button, Input, Card, Badge, Spinner, Alert
│   └── feedback/        # LoadingState, ErrorState
│
└── lib/                 # Shared utilities & configuration
    ├── query-client.ts  # QueryClient factory
    ├── query-keys.ts    # Centralized query key factory
    └── constants.ts     # API URLs, config values
```

---

## 🧠 Architecture Decisions

### 1. Domain-Driven Separation (`domains/` vs `api/` vs `features/`)

**Decision:** Business logic lives in `domains/` as pure functions with zero React or framework imports. API concerns (schemas, fetch calls) live in `api/`. React-specific code (hooks, context, components) lives in `features/`.

**Why:** This three-layer separation ensures:

- **Testability** – Domain logic is unit-testable without any React test utilities.
- **Portability** – Domain rules can be shared with a server, CLI, or different UI framework.
- **Clarity** – When reading `cart.logic.ts`, you know it contains only business rules, never UI concerns.

### 2. React Context + `useReducer` for Cart State

**Decision:** Cart state is managed via React Context with `useReducer`, not an external state library.

**Why:**

- Cart is inherently **scoped to the current user session** – it doesn't need a global store that survives across pages (we persist to `localStorage` manually).
- `useReducer` gives us **predictable state transitions** through a discriminated union of action types, which pairs perfectly with TypeScript.
- Avoids adding Zustand/Redux as a dependency for a single slice of state.

### 3. Zod for Runtime Validation at the API Boundary

**Decision:** Every API response is validated through a Zod schema before entering the application.

**Why:**

- TypeScript types are erased at runtime. If the API returns unexpected data, the app would silently break.
- Zod schemas act as a **runtime contract** – bad data fails fast with a clear error instead of causing subtle bugs downstream.
- The same schemas can generate TypeScript types via `z.infer<>`, keeping API types and validation in sync.

### 4. TanStack Query with Centralized Query Keys

**Decision:** All query/mutation hooks use a `queryKeys` factory object for cache key management.

**Why:**

- Prevents key collisions and makes **cache invalidation explicit** (`queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })`).
- Centralizing keys in one file makes it trivial to audit what data is being cached.

### 5. File-Based Routing (TanStack Router)

**Decision:** Routes are defined by the file system rather than a central route config.

**Why:**

- **Convention over configuration** – adding a page means adding a file, no manual registration.
- **Code splitting** – each route is naturally its own chunk.
- **Type safety** – TanStack Router generates fully typed route trees, so `Link` and `useNavigate` are type-checked at compile time.

### 6. Strategy Pattern for Promotions

**Decision:** Promotion rules are modeled as a config-driven array of objects implementing a `PromotionRule` interface, evaluated by a generic engine.

**Why:**

- Adding a new promotion rule means **adding one object to an array** – zero changes to engine code.
- Rules are pure functions, making them trivially testable.
- Supports future complexity (combinable rules, date-based rules) without architectural changes.

---

## ⚖️ Tradeoffs

| Decision                             | Benefit                                          | Tradeoff                                                                     |
| ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| React Context for cart               | Zero extra dependencies, simple mental model     | Could hit performance issues with very frequent updates (not a concern here) |
| Zod validation on every API response | Catches bad data early, self-documenting schemas | Small runtime overhead per request (negligible for this scale)               |
| Separate `domains/` folder           | Pure, testable logic                             | More files/folders to navigate vs. colocating everything in `features/`      |
| FakeStore API as mock                | Quick setup, realistic data shape                | No control over data; can't test edge cases server-side                      |
| TanStack Start (SSR framework)       | SSR, server functions, full-stack capabilities   | Newer ecosystem, fewer community examples compared to Next.js                |
| TailwindCSS v4                       | Utility-first, fast iteration                    | Verbose class names, can be harder to read in complex layouts                |
| `localStorage` cart persistence      | Works offline, no server dependency              | Not synced across devices, lost on storage clear                             |

---

## 📈 How I Would Scale This

### Short-Term (Multi-Page E-Commerce)

- **Add authentication** – Protect checkout with auth middleware, persist cart per user server-side.
- **Server-side cart** – Move cart state from `localStorage` to a database-backed API. Use TanStack Start server functions to keep the cart synced.
- **Product pagination + filtering** – Use TanStack Query's `useInfiniteQuery` for paginated product lists with search/category filters.
- **Optimistic updates** – Apply cart changes optimistically via `useMutation`'s `onMutate` for instant UI feedback.

### Medium-Term (Team & Complexity)

- **Feature flags** – Wrap promotions and checkout variants behind feature flags for A/B testing.
- **Component library extraction** – Move `components/ui/` into a separate package for cross-project reuse.
- **E2E testing** – Add Playwright tests for critical checkout flows (add to cart → checkout → order confirmation).
- **Error monitoring** – Integrate Sentry for runtime error tracking (the Vite config already excludes Sentry from Nitro's bundle).
- **i18n** – Add internationalization with `react-intl` or `next-intl` equivalent for TanStack Start.

### Long-Term (Production SaaS)

- **Microservices** – Break the API into separate services (Products, Orders, Promotions) behind an API gateway.
- **CDN & edge caching** – Deploy with Vercel/Cloudflare, use TanStack Start's SSR for first-paint and TanStack Query's `staleTime` for client-side cache.
- **Database** – PostgreSQL with Prisma for orders and user data, Redis for session/cart caching.
- **Event-driven** – Order events published to a message queue for inventory updates, email notifications, analytics.

---

## 🔧 What I Would Improve in Production

### Code Quality

- [ ] **100% type coverage** – Audit for any remaining `as` assertions and replace with proper type narrowing.
- [ ] **Error boundaries** – Add React error boundaries per route segment, not just a global fallback.
- [ ] **Accessibility audit** – Ensure all interactive elements have ARIA labels, keyboard navigation works, and color contrast meets WCAG AA.

### Performance

- [ ] **Image optimization** – Use responsive images (`<picture>` + `srcset`) or an image CDN for product photos.
- [ ] **Bundle analysis** – Run `vite-bundle-analyzer` to identify and code-split heavy dependencies.
- [ ] **Prefetching** – Leverage TanStack Router's `defaultPreload: 'intent'` (already configured) and add query prefetching on hover for product details.

### Security

- [ ] **Input sanitization** – Sanitize user inputs server-side beyond Zod validation (XSS prevention).
- [ ] **Rate limiting** – Add rate limiting on checkout API to prevent abuse.
- [ ] **CSRF protection** – Implement CSRF tokens for POST mutations.
- [ ] **CSP headers** – Add Content Security Policy headers via Nitro middleware.

### DevOps

- [ ] **CI/CD pipeline** – GitHub Actions for lint → type-check → test → build → deploy on every PR.
- [ ] **Staging environment** – Preview deployments on Vercel for PR review.
- [ ] **Environment variables** – Move API URLs and config to `.env` files with Zod-validated env parsing.
- [ ] **Monitoring** – APM (Application Performance Monitoring) for server-side response times and client-side Web Vitals.

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Scripts

| Script         | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start dev server on port 3000  |
| `pnpm build`   | Production build               |
| `pnpm preview` | Preview production build       |
| `pnpm test`    | Run tests (Vitest)             |
| `pnpm lint`    | Lint with ESLint               |
| `pnpm format`  | Check formatting with Prettier |
| `pnpm check`   | Fix formatting + lint          |

---

## 🛡️ DevOps & CI/CD Setup

This project uses **GitHub Actions** for continuous integration, a **PR template** for consistent pull requests, and **Husky** for Git hook automation.

### GitHub Actions

A CI workflow runs automatically on every push/PR to `main` and `develop`.

**File:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Pipeline steps:**

| Step          | Command                          | Purpose                           |
| ------------- | -------------------------------- | --------------------------------- |
| Checkout      | `actions/checkout@v4`            | Clone the repository              |
| Setup pnpm    | `pnpm/action-setup@v4` (v10)     | Install pnpm package manager      |
| Setup Node.js | `actions/setup-node@v4` (v22)    | Install Node.js with pnpm caching |
| Install       | `pnpm install --frozen-lockfile` | Deterministic dependency install  |
| Format check  | `pnpm format`                    | Verify Prettier formatting        |
| Lint          | `pnpm lint`                      | Run ESLint                        |
| Build         | `pnpm build`                     | Type-check + production bundle    |
| Test          | `pnpm test`                      | Run Vitest test suite             |

**How to set up in a new repo:**

1. Create `.github/workflows/ci.yml` with the workflow above.
2. Ensure branch protection rules require the `ci` job to pass before merging.

### PR Template

Every new pull request is pre-filled with a structured template.

**File:** [`.github/pull_request_template.md`](.github/pull_request_template.md)

**Template sections:**

- **Summary** – What the PR does.
- **Type of change** – `feat` / `fix` / `chore` / `refactor` / `docs` / `test`.
- **Changes** – Key files changed and why.
- **Checklist** – `pnpm check` passes, `pnpm build` passes, `pnpm test` passes, no `any` types, no direct fetch calls in components.
- **Screenshots** – Before/after for UI changes.

**How to set up:** Place the file at `.github/pull_request_template.md` — GitHub auto-detects it.

### Husky (Git Hooks)

Husky automates code quality checks before commits and pushes ever reach the remote.

**Install & initialize:**

```bash
# Install (already in devDependencies)
pnpm add -D husky lint-staged

# Initialize Husky (creates .husky/ directory)
pnpm exec husky init
```

The `"prepare": "husky"` script in `package.json` ensures Husky installs automatically when anyone runs `pnpm install`.

**Hooks configured:**

| Hook         | File                | Command           | What it does                            |
| ------------ | ------------------- | ----------------- | --------------------------------------- |
| `pre-commit` | `.husky/pre-commit` | `npx lint-staged` | Runs ESLint + Prettier on staged files  |
| `pre-push`   | `.husky/pre-push`   | `pnpm test`       | Runs the full test suite before pushing |

**lint-staged config** (in `package.json`):

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

This ensures only staged files are linted/formatted, keeping commits fast.

---

## 🤖 AI Usage Disclosure

AI assistance (Gemini / Antigravity) was used during this project. Per Mochi's requirements, here is exactly where and how.

### Where AI was used

| Area                      | What AI helped with                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| Architecture planning     | Drafting the initial folder structure and layer separation strategy                                 |
| Domain modeling guidance  | Suggesting the discriminated union pattern for `CartAction` and the strategy pattern for promotions |
| `cart.logic.ts` bug catch | Flagging that `const existing` inside a `case` without braces causes a lexical declaration error    |
| CI/CD & dev tooling       | Setting up Husky pre-commit/pre-push hooks, GitHub Actions CI pipeline, and PR template             |
| Unit & E2E testing        | Planning and implementing Vitest + RTL unit tests and Playwright E2E tests                          |
| README                    | Drafting the initial structure; content was reviewed and adapted                                    |

### Example prompts used

**1. Architecture planning**

> _"I want you to create an implementation plan for this task — let's make an implementation plan first for folder structure. You can browse the TanStack Start docs for more info."_

AI generated a proposed folder structure split across `routes/`, `domains/`, `features/`, `api/`, `lib/`, and `components/`. I reviewed and approved it, then implemented it myself.

**2. Domain modeling guidance**

> _"Promotions (Extensible Design) — implement promotional rules: 10% off > $20, 15% off > $50, 20% off > $100. Do not hardcode these directly in UI logic. Design your promotion system in a way that allows adding new rules easily, is type-safe, and separates calculation logic from components."_

AI suggested the strategy pattern (config-driven rules array + evaluation engine). I wrote the actual implementation myself, using the suggestion as a reference.

**3. CI/CD & dev tooling**

> _"Let's integrate Husky for pre-commit hooks, GitHub Actions for CI, and a PR template. Set up Husky with lint-staged on pre-commit (ESLint + Prettier on staged files) and run tests on pre-push. Create a GitHub Actions workflow that runs format check, lint, build, and test on every PR to main and develop. Also add a PR template with summary, type of change, changes list, and a checklist."_

AI generated the `.husky/pre-commit`, `.husky/pre-push`, `.github/workflows/ci.yml`, and `.github/pull_request_template.md` files. I reviewed the configuration, adjusted branch targets, and verified the pipeline locally before merging.

**4. Unit & E2E testing**

> _"Let's implement Unit tests (Vitest + RTL) and E2E tests using Playwright. Create an implementation plan — cover all domain logic (cart reducer, promotions engine), Zod schema validation, React components with Testing Library, and E2E flows for product listing, cart management, and the full checkout flow."_

AI generated the implementation plan with test file structure, test cases per function, and Playwright config. I reviewed the plan, approved the scope, and then implemented the tests with AI assistance.

**5. README**

> _"Drafting the initial structure; content was reviewed and adapted"_

AI drafted the initial README structure, which I reviewed and adapted to fit my project's needs.
