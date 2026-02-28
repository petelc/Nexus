# CLAUDE.md — Project Instructions (.NET)
## What this repo is
- .NET 10 backend API focused on scalability, p95/p99 latency, and production reliability.
- Prefer simple, copy/pasteable patterns over "clever architecture". 
- React 19 TypeScript applications focused on a clean modern look using Material UI v7.

## Tech stack (depending on your setup)
- .NET 10 / C# (modern style)
- ASP.NET Core (FastEndpoints)
- Clean Architecture
- Domain Driven Design
- EF Core 
- Redis (IDistributedCache / StackExchange.Redis depending on project)
- Azure hosting (App Service / Containers)
- Observability: Application Insights (logs + metrics)

### React Tech Stack
- React 19
- TypeScript
- Material UI v7

## Repo map (edit to match your folders)
- Apex.API/src/Api/ → API: containes endpoints, use cases, infrastructure and Aggregates
- ApexApp/src/App/ → contains react application, language is TypeScript
- Apex/src/ → React with TypScript Marketing application
- Apex.API/tests/ → unit + integration tests for API

## Hard rules (do not violate)
- NEVER add new framework layers or "Clean Architecture cosplay".
- NEVER introduce patterns we don't use (AutoMapper, repositories, magic abstractions).
- Always pass CancellationToken through all async calls.
- No sync-over-async (no .Result/.Wait).
- No Task.Run inside request handlers.
- Outbound HTTP MUST have timeouts + cancellation.
- Caching MUST have: time budget, stampede protection strategy, and key versioning.

## Default workflow
1) Ask for missing requirements before changing code.
2) Propose a plan + list files to touch.
3) Implement smallest change that works.
4) Add/update tests when relevant.
5) Provide commands to verify (build/test/run).

## Commands (edit to match your codebase)
### DotNet Commands
- Build: `dotnet build`
- Test: `dotnet test`
- Run API: `dotnet run --project src/Api`
- Format: `dotnet format`

### React Commands
- Build: npm build
- Run Application: npm run dev

## Output format
- Prefer short sections, small code blocks, and explain trade-offs.
- When making changes: show diff-level guidance + why.

## Documentation

- Output plans to markdown files to the docs folder
- Output guides to markdown files to the docs folder