# Nexus Playwright

> End-to-end test suite for the Nexus Knowledge Management System.

Tests run against a live instance of the frontend (NexusAPP) and backend (NexusAPI).

---

## Quick Start

```bash
npm install
npx playwright install   # download browser binaries

# Run all tests (headless)
npx playwright test

# Run with browser UI visible
npx playwright test --headed

# Open interactive UI mode
npx playwright test --ui
```

---

## Prerequisites

Both the API and frontend must be running before executing tests:

```bash
# Terminal 1 — API
cd ../NexusAPI
dotnet run --project src/Nexus.API.Web

# Terminal 2 — Frontend
cd ../NexusAPP
npm run dev

# Terminal 3 — Tests
cd NexusPlayWright
npx playwright test
```

The test suite connects to `https://localhost:3000` by default (configured in `playwright.config.ts`).

---

## Project Structure

```
NexusPlayWright/
├── tests/                # Test specs grouped by feature
│   ├── auth/
│   │   └── register.spec.ts
│   ├── documents/
│   │   └── documents.spec.ts
│   ├── snippets/
│   │   └── code-snippets.spec.ts
│   ├── teams/
│   │   └── teams.spec.ts
│   └── workspaces/
│       └── workspaces.spec.ts
├── pages/                # Page Object Models
│   ├── login.page.ts
│   ├── register.page.ts
│   ├── forgot-password.page.ts
│   ├── reset-password.page.ts
│   ├── documents.page.ts
│   ├── create-document.page.ts
│   ├── document-detail.page.ts
│   ├── create-snippet.page.ts
│   ├── snippet-detail.page.ts
│   ├── code-snippets.page.ts
│   ├── teams.page.ts
│   └── workspaces.page.ts
├── fixtures/             # Shared test fixtures and setup
├── utils/                # Helper functions
├── playwright.config.ts
└── package.json
```

---

## Test Coverage

| Suite | Scenarios |
|-------|-----------|
| Auth | Registration, login, password reset |
| Documents | Create, edit, view, delete |
| Code Snippets | Create, publish, fork, filter by language |
| Teams | Create team, add members, manage roles |
| Workspaces | Create workspace, manage members |
| Diagrams | — planned |
| Collections | — planned |
| Collaboration | — planned |

---

## Scripts

```bash
npx playwright test                    # Run all tests headless
npx playwright test --headed           # Run with browser visible
npx playwright test --ui               # Interactive UI mode
npx playwright test --debug            # Debug mode (step through)
npx playwright test tests/auth/        # Run a single suite
npx playwright test --project=chromium # Run on a specific browser
npx playwright show-report             # Open last HTML report
```

---

## Browsers

Tests run against three browsers in CI:

| Browser | Engine |
|---------|--------|
| Chromium | Chrome/Edge |
| Firefox | Gecko |
| WebKit | Safari |

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---------|-------|
| Base URL | `https://localhost:3000` |
| HTTPS errors | Ignored (Vite dev server uses self-signed cert) |
| CI retries | 2 |
| Parallel | Yes (single worker in CI) |
| Trace | On first retry |
| Screenshot | On failure |

---

**Last updated:** February 2026
