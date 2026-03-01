# Plan: Workspace-Aware Content (Documents, Snippets, Diagrams)

**Date:** 2026-02-28
**Goal:** Add `WorkspaceId` to all three content aggregates so the dashboard can show workspace-scoped counts and recent items.

---

## Key Findings

- None of the three entities (Document, CodeSnippet, Diagram) store `WorkspaceId` today — they track `CreatedBy` only.
- `WorkspaceDto.documentCount/snippetCount/diagramCount` exist in the TypeScript types but the C# backend never populates them — they are always 0. This plan fixes both problems.
- Documents and Snippets create pages already send `workspaceId` from the frontend — the backend silently ignores it.
- CreateDiagramPage does not send `workspaceId` at all.

---

## Architecture Decisions

- Store `WorkspaceId` as a plain `Guid` column (consistent with how `CreatedBy` is stored).
- Column is **nullable** at the DB level so the migration doesn't require a default workspace for historical rows.
- No FK constraint from content tables to Workspaces (cross-aggregate reference — consistent with existing pattern).
- Workspace counts computed with small COUNT queries per workspace in the workspace handlers (3 COUNT queries per workspace). Acceptable for typical workspace counts; replaceable with a single GROUP BY query if needed later.

---

## Files to Touch

### Backend

| File | Change |
|---|---|
| `Core/Aggregates/DocumentAggregate/Document.cs` | Add `WorkspaceId` property; update `Create()` |
| `Core/Aggregates/CodeSnippetAggregate/CodeSnippet.cs` | Add `WorkspaceId` property; update `Create()` |
| `Core/Aggregates/DiagramAggregate/Diagram.cs` | Add `WorkspaceId` property; update private ctor + `Create()` |
| `Infrastructure/Data/Config/DocumentConfiguration.cs` | Map column + index |
| `Infrastructure/Data/Config/CodeSnippetConfiguration.cs` | Map column + index |
| `Infrastructure/Data/Config/DiagramConfiguration.cs` | Map column + index |
| `Infrastructure/Migrations/AppDb/` | New migration (generated via `dotnet ef`) |
| `Core/Interfaces/IDocumentRepository.cs` | Add `CountByWorkspaceIdAsync` + `GetByWorkspaceIdAsync` |
| `Core/Interfaces/ICodeSnippetRepository.cs` | Add `CountByWorkspaceIdAsync` + `GetByWorkspaceIdAsync` |
| `Core/Interfaces/IDiagramRepository.cs` | Add `CountByWorkspaceIdAsync` + `GetByWorkspaceIdAsync` |
| `Infrastructure/Data/Repositories/DocumentRepository.cs` | Implement new methods |
| `Infrastructure/Data/Repositories/CodeSnippetRepository.cs` | Implement new methods |
| `Infrastructure/Data/Repositories/DiagramRepository.cs` | Implement new methods |
| `UseCases/Documents/Commands/CreateDocument/CreateDocumentCommand.cs` | Add `WorkspaceId` field |
| `UseCases/Documents/Commands/CreateDocument/CreateDocumentCommandHandler.cs` | Pass `WorkspaceId` to `Document.Create()` |
| `UseCases/Documents/Commands/CreateDocument/CreateDocumentCommandValidator.cs` | Validate `WorkspaceId` not empty |
| `UseCases/CodeSnippets/DTOs/CodeSnippetDtos.cs` | Add `WorkspaceId` to `CreateSnippetRequest` |
| `UseCases/Diagrams/DTOs/DiagramDtos.cs` | Add `WorkspaceId` to `CreateDiagramRequest` |
| `Web/Endpoints/CodeSnippets/CreateSnippetEndpoint.cs` | Validate + pass `WorkspaceId` to `CodeSnippet.Create()` |
| `Web/Endpoints/Diagrams/CreateDiagramEndpoint.cs` | Validate + pass `WorkspaceId` to `Diagram.Create()` |
| `UseCases/Workspaces/DTOs/WorkspaceDto.cs` | Add `DocumentCount`, `SnippetCount`, `DiagramCount` |
| `UseCases/Workspaces/Handlers/GetUserWorkspacesHandler.cs` | Inject repos; populate counts per workspace |
| `UseCases/Workspaces/Handlers/GetWorkspaceByIdHandler.cs` | Inject repos; populate counts on single workspace |

### Frontend

| File | Change |
|---|---|
| `src/types/api.types.ts` | Add `workspaceId: string` to `CreateDiagramRequest` |
| `src/features/diagrams/pages/CreateDiagramPage.tsx` | Read `currentWorkspaceId` from Redux; pass to `createDiagram`; guard if null |
| `src/api/documentsApi.ts` | Add `'Workspace'` to `tagTypes`; invalidate Workspace LIST on create/delete |
| `src/api/snippetsApi.ts` | Add `'Workspace'` to `tagTypes`; invalidate Workspace LIST on create/delete |
| `src/api/diagramsApi.ts` | Add `'Workspace'` to `tagTypes`; invalidate Workspace LIST on create/delete |

`DashboardPage.tsx` — no changes needed. Already reads the count fields from `currentWorkspace`.

---

## Implementation Order

1. **Domain entities** (Document, CodeSnippet, Diagram) — add `WorkspaceId`
2. **EF Core configs** — map column + index for all three
3. **Run `dotnet ef migrations add`**
4. **Repository interfaces** — add `CountByWorkspaceIdAsync` + `GetByWorkspaceIdAsync`
5. **Repository implementations** — implement the new methods
6. **CreateDocument command + handler + validator** — thread `WorkspaceId` through
7. **CreateSnippet + CreateDiagram DTOs and endpoints** — add + validate `WorkspaceId`
8. **C# WorkspaceDto** — add count fields
9. **Workspace handlers** — compute and populate counts
10. **Frontend** — `CreateDiagramRequest` type + `CreateDiagramPage` wiring + cache invalidation on all three APIs
11. **`dotnet build`** to verify — then `dotnet test`
