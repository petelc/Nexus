# Nexus — Knowledge Management System

> **Where Knowledge Connects**

Nexus is a knowledge management platform built for IT professionals and development teams. It brings documentation, code snippets, and diagrams together in one place with real-time collaboration, teams, workspaces, and full-text search.

---

## Projects

| Project | Description | Tech |
|---------|-------------|------|
| [NexusAPI/](NexusAPI/) | RESTful backend API | .NET 10, Clean Architecture, EF Core, SignalR |
| [NexusAPP/](NexusAPP/) | Web application | React 19, TypeScript, MUI v7, Redux Toolkit |
| [NexusPlayWright/](NexusPlayWright/) | End-to-end test suite | Playwright, TypeScript |
| [docs/](docs/) | Architecture & design docs | — |

---

## Features

- **Document Management** — rich-text editor, version history, tags, auto-save
- **Code Snippets** — Monaco editor, 150+ languages, public library, forking
- **Diagram Builder** — flowcharts, network diagrams, UML via React Flow
- **Real-time Collaboration** — presence awareness, comments, live sessions via SignalR
- **Teams & Workspaces** — role-based membership, scoped content organisation
- **Collections** — hierarchical folder structure across all content types
- **Search** — global full-text search across documents, snippets, and diagrams
- **Auth** — JWT, refresh tokens, 2FA (TOTP)

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| .NET SDK | 10.0+ |
| Node.js | 20+ |
| SQL Server | 2022 (or Docker) |
| Redis | 7+ (or Docker) |

### 1 — Start the API

```bash
cd NexusAPI

# Restore & build
dotnet restore
dotnet build

# Apply database migrations
dotnet ef database update --project src/Nexus.API.Infrastructure --startup-project src/Nexus.API.Web --context IdentityDbContext
dotnet ef database update --project src/Nexus.API.Infrastructure --startup-project src/Nexus.API.Web --context AppDbContext

# Run
dotnet run --project src/Nexus.API.Web
# API available at https://localhost:5001
# Swagger UI at https://localhost:5001/swagger
```

### 2 — Start the Frontend

```bash
cd NexusAPP

npm install
cp .env.example .env.local   # update API URLs if needed
npm run dev
# App available at https://localhost:3000
```

### 3 — Run E2E Tests

```bash
# Requires the API and frontend to be running
cd NexusPlayWright

npm install
npx playwright install
npx playwright test
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              NexusAPP (React)                │
│  React 19 · MUI v7 · Redux Toolkit · Vite   │
└────────────────────┬────────────────────────┘
                     │ REST + SignalR
┌────────────────────▼────────────────────────┐
│              NexusAPI (.NET 10)              │
│  FastEndpoints · MediatR · EF Core · JWT    │
└──────┬────────────────────────┬─────────────┘
       │                        │
┌──────▼──────┐         ┌───────▼──────┐
│  SQL Server │         │     Redis    │
│  (primary)  │         │   (cache)    │
└─────────────┘         └──────────────┘
```

The API follows Clean Architecture with four layers:

- **Nexus.API.Core** — domain aggregates, value objects, domain events
- **Nexus.API.UseCases** — CQRS commands/queries via MediatR
- **Nexus.API.Infrastructure** — EF Core, repositories, external services
- **Nexus.API.Web** — endpoints, SignalR hubs, middleware

---

## Documentation

| Document | Description |
|----------|-------------|
| [Solution Architecture](docs/NEXUS%20-%20Solution%20Architecture%20Document.md) | Full system architecture |
| [API Endpoints](docs/API-Endpoints.md) | All 95 endpoints with auth requirements |
| [React Implementation Plan](docs/NEXUS_REACT_IMPLEMENTATION_PLAN.md) | Frontend design decisions |
| [Brand Guidelines](docs/NEXUS_BRAND_GUIDELINES_2026.md) | Colours, typography, design tokens |
| [Project Evaluation & Plan](docs/NEXUS_PROJECT_EVALUATION_AND_PLAN.md) | Current status and remaining work |

---

## License

© 2026 Nexus. All rights reserved.
