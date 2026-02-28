# Nexus App

> React frontend for the Nexus Knowledge Management System.

**Where Knowledge Connects**

---

## Quick Start

```bash
npm install
cp .env.example .env.local   # update API URLs as needed
npm run dev
```

App: `https://localhost:3000`

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Material-UI | 7 | Component library |
| Redux Toolkit | 2 | State management |
| RTK Query | — | API data fetching |
| React Router | 7 | Client-side routing |
| Vite | 6 | Build tool |
| Monaco Editor | 4 | Code snippet editor |
| React Flow | 11 | Diagram canvas |
| SignalR client | 8 | Real-time collaboration |

---

## Project Structure

```
src/
├── api/                  # API client & RTK Query services
│   ├── apiClient.ts      # Axios instance with JWT interceptors
│   ├── baseQueryWithReauth.ts
│   ├── signalrClient.ts  # SignalR hub connection
│   ├── documentsApi.ts
│   ├── snippetsApi.ts
│   ├── diagramsApi.ts
│   ├── teamsApi.ts
│   └── workspacesApi.ts
├── app/                  # Redux store
│   ├── store.ts
│   └── hooks.ts
├── components/           # Shared components
│   ├── common/
│   ├── layout/           # AppLayout, Sidebar, Header
│   ├── navigation/
│   └── forms/
├── features/             # Feature modules
│   ├── auth/             # Login, register, 2FA
│   ├── documents/        # Rich-text editor, version history
│   ├── snippets/         # Monaco editor, public library
│   ├── diagrams/         # React Flow canvas editor
│   ├── teams/            # Team management
│   ├── workspaces/       # Workspace management
│   ├── collections/      # Hierarchical content folders
│   ├── collaboration/    # Real-time sessions and comments
│   ├── search/           # Global search
│   └── dashboard/        # Overview and recent activity
├── hooks/                # Custom hooks (useAuth, useSignalR, ...)
├── routes/               # Route definitions + PrivateRoute
├── theme/                # MUI theme (dark + light)
├── types/                # TypeScript DTOs and domain types
└── utils/                # Formatters, validators, constants
```

---

## Design System

**Primary colour:** `#5D87FF` (Blue) · **Font:** Inter + Fira Code · **Border radius:** 7px · **Grid:** 8px

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F5F7FA` | `#2A3447` |
| Surface | `#FFFFFF` | `#2A3447` |
| Elevated | `#F9FAFB` | `#253662` |
| Border | `#E5E7EB` | `#333F55` |
| Text primary | `#1F2937` | `#EAEFF4` |
| Text secondary | `#6B7280` | `#7C8FAC` |

Semantic colours: Success `#13DEB9` · Warning `#FFAE1F` · Error `#FA896B` · Info `#49BEFF`

See [Brand Guidelines](../docs/NEXUS_BRAND_GUIDELINES_2026.md) for the full design specification.

---

## Environment Variables

```bash
# .env.local
VITE_API_BASE_URL=https://localhost:5001/api/v1
VITE_SIGNALR_HUB_URL=https://localhost:5001/hubs/collaboration
VITE_APP_NAME=Nexus
VITE_APP_VERSION=1.0.0
```

---

## Scripts

```bash
npm run dev        # Start development server (https://localhost:3000)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication (login, register, forgot password, 2FA) | Complete |
| Documents (rich-text editor, versioning, tags) | Complete |
| Code Snippets (Monaco editor, public library, fork) | Complete |
| Diagram Builder (React Flow, elements, connections, layers) | Complete |
| Teams | Complete |
| Workspaces | Complete |
| Dashboard | Complete |
| Collections | In progress |
| Real-time Collaboration | In progress |
| Search | In progress |

---

## References

- [API Endpoints](../docs/API-Endpoints.md)
- [Implementation Plan](../docs/NEXUS_REACT_IMPLEMENTATION_PLAN.md)
- [Brand Guidelines](../docs/NEXUS_BRAND_GUIDELINES_2026.md)

---

**Last updated:** February 2026
