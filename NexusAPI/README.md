# Nexus API

> RESTful backend for the Nexus Knowledge Management System.

**Framework:** .NET 10 · **Architecture:** Clean Architecture + DDD · **Shared Kernel:** Traxs.SharedKernel

---

## Quick Start

```bash
# Restore & build
dotnet restore
dotnet build

# Apply migrations
dotnet ef database update \
  --project src/Nexus.API.Infrastructure \
  --startup-project src/Nexus.API.Web \
  --context IdentityDbContext

dotnet ef database update \
  --project src/Nexus.API.Infrastructure \
  --startup-project src/Nexus.API.Web \
  --context AppDbContext

# Run
dotnet run --project src/Nexus.API.Web
```

API: `https://localhost:5001`
Swagger: `https://localhost:5001/swagger`

---

## Project Structure

```
NexusAPI/
├── src/
│   ├── Nexus.API.Core/           # Domain layer
│   ├── Nexus.API.UseCases/       # Application layer (CQRS)
│   ├── Nexus.API.Infrastructure/ # Infrastructure layer
│   ├── Nexus.API.Web/            # Presentation layer (API)
│   ├── Nexus.API.ServiceDefaults/ # Shared service config
│   └── Nexus.API.AspireHost/     # .NET Aspire host
└── tests/
    ├── Nexus.API.UnitTests/
    ├── Nexus.API.IntegrationTests/
    ├── Nexus.API.FunctionalTests/
    └── Nexus.API.AspireTests/
```

---

## Architecture

### Domain Layer — Nexus.API.Core

All aggregates use `Traxs.SharedKernel` base classes (`EntityBase<TId>`, `ValueObject`, `DomainEventBase`).

| Aggregate | Description |
|-----------|-------------|
| `DocumentAggregate` | Rich-text docs with versioning, tags, and soft delete |
| `CodeSnippetAggregate` | Code storage with language metadata and forking |
| `DiagramAggregate` | Visual diagrams with elements, connections, and layers |
| `CollectionAggregate` | Hierarchical folder structure for all content types |
| `TeamAggregate` | Team membership with role-based access |
| `WorkSpaceAggregate` | Scoped containers for team content |
| `CollaborationAggregate` | Real-time sessions, participants, and comments |
| `UserAggregate` | User profile and identity link |
| `ResourcePermissions` | Fine-grained resource-level permissions |
| `AuditAggregate` | Audit trail for all state changes |

### Application Layer — Nexus.API.UseCases

CQRS pattern via MediatR. Each feature area has:
- Commands + Handlers
- Queries + Handlers
- DTOs
- FluentValidation validators

Feature areas: `Auth`, `Documents`, `CodeSnippets`, `Diagrams`, `Collections`, `Teams`, `Workspaces`, `Collaborations`, `Permissions`, `Search`

### Infrastructure Layer — Nexus.API.Infrastructure

| Component | Technology |
|-----------|-----------|
| ORM | Entity Framework Core 10 |
| Database | SQL Server (two DbContexts: `AppDbContext`, `IdentityDbContext`) |
| Cache | Redis via `StackExchange.Redis` |
| File storage | Azure Blob Storage |
| Search | Elasticsearch |
| Email | SMTP via `EmailService` |
| Identity | ASP.NET Core Identity |

Repositories: `DocumentRepository`, `DiagramRepository`, `CodeSnippetRepository`, `CollectionRepository`, `TeamRepository`, `WorkspaceRepository`, `CollaborationRepository`, `PermissionRepository`, `UserRepository`, `TagRepository`, `RefreshTokenRepository`

### Presentation Layer — Nexus.API.Web

95 endpoints across 10 feature areas. See [API Endpoints reference](../docs/API-Endpoints.md) for the full list.

| Feature | Endpoints |
|---------|-----------|
| Authentication | 9 |
| Documents | 11 |
| Diagrams | 14 |
| Code Snippets | 12 |
| Collections | 11 |
| Teams | 9 |
| Workspaces | 10 |
| Collaboration (sessions + comments) | 13 |
| Permissions | 3 |
| Search | 1 |

SignalR hub: `CollaborationHub` at `/hubs/collaboration`

---

## Configuration

Key settings in `appsettings.json` / environment variables:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=NexusDB;...",
    "Redis": "localhost:6379"
  },
  "Jwt": {
    "Secret": "<secret>",
    "Issuer": "nexus-api",
    "Audience": "nexus-app",
    "AccessTokenExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7
  },
  "AzureBlobStorage": {
    "ConnectionString": "...",
    "ContainerName": "nexus-files"
  },
  "Elasticsearch": {
    "Url": "http://localhost:9200"
  }
}
```

---

## Commands

```bash
# Build
dotnet build

# Run all tests
dotnet test

# Run only functional tests
dotnet test tests/Nexus.API.FunctionalTests

# Format code
dotnet format

# Add a new migration (AppDbContext)
dotnet ef migrations add <MigrationName> \
  --project src/Nexus.API.Infrastructure \
  --startup-project src/Nexus.API.Web \
  --context AppDbContext \
  --output-dir Migrations/App

# Run the API
dotnet run --project src/Nexus.API.Web
```

---

## Security

- JWT bearer tokens (15-minute access, 7-day refresh)
- ASP.NET Core Identity for user management
- RBAC roles: `Admin`, `Editor`, `Viewer`
- Policy-based authorization on all endpoints
- Rate limiting, CORS, and CSP headers configured

---

## References

- [Clean Architecture — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Traxs.SharedKernel on NuGet](https://www.nuget.org/packages/Traxs.SharedKernel)
- [MediatR](https://github.com/jbogard/MediatR)
- [EF Core Docs](https://learn.microsoft.com/en-us/ef/core/)

---

**Last updated:** February 2026
