# Nexus — Master TODO

**Last updated:** 2026-02-28

## Legend
- ✅ Done
- 🔄 In Progress
- ⬜ Pending

---

## Phase 1 — Database Migration
| # | Task | Status |
|---|------|--------|
| 1.1 | Create AppDbContext EF migration (app tables) | ✅ Done — SQL scripts used; `AddCollectionItemTitle` migration added |

---

## Phase 2 — Frontend: Collections Feature
| # | Task | Status |
|---|------|--------|
| 2.1 | `collectionsApi.ts` — RTK Query (11 endpoints) | ✅ Done |
| 2.2 | `collectionsSlice.ts` — local UI state | ✅ Done |
| 2.3 | `CollectionsPage.tsx` — root collections list | ✅ Done |
| 2.4 | `CollectionDetailPage.tsx` — items + breadcrumb | ✅ Done |
| 2.5 | `CollectionCard.tsx` | ✅ Done |
| 2.6 | `CreateCollectionDialog.tsx` | ✅ Done |
| 2.7 | `EditCollectionDialog.tsx` | ✅ Done |
| 2.8 | `AddToCollectionDialog.tsx` — from Document/Snippet/Diagram pages | ✅ Done |
| 2.9 | `ConfirmDialog.tsx` — shared confirmation modal | ✅ Done |
| 2.10 | Denormalized `ItemTitle` on `CollectionItem` entity + migration | ✅ Done |
| 2.11 | Fix MediatR handler registrations (5 handlers + 4 commands) | ✅ Done |
| 2.12 | Fix Add-to-Collection button on Documents & Snippets | ✅ Done |

---

## Phase 3 — Frontend: Collaboration Feature
| # | Task | Status |
|---|------|--------|
| 3.1 | Update `api.types.ts` — correct collaboration types matching backend | ✅ Done |
| 3.2 | `collaborationApi.ts` — RTK Query (REST endpoints) | ✅ Done |
| 3.3 | `collaborationSlice.ts` — active session, participants, cursor state | ✅ Done |
| 3.4 | `useCollaboration.ts` — join/leave, SignalR subscriptions | ✅ Done |
| 3.5 | `CollaborationButton.tsx` — Start/Join button with error snackbar | ✅ Done |
| 3.6 | `ParticipantList.tsx` — avatars of active users | ✅ Done |
| 3.7 | `CommentBox.tsx` — new comment input | ✅ Done |
| 3.8 | `CommentThread.tsx` — threaded comment list | ✅ Done |
| 3.9 | `CollaborationPanel.tsx` — slide-out drawer (participants + comments) | ✅ Done |
| 3.10 | Wire `CollaborationPanel` into `DocumentDetailPage` | ✅ Done |
| 3.11 | Wire `CollaborationPanel` into `DiagramDetailPage` | ✅ Done |

**Notes:**
- SignalR URL set via `VITE_SIGNALR_HUB_URL=/hubs/collaboration` (proxied by Vite). "ws proxy socket error" = backend not running — now shows a user-friendly snackbar instead of unhandled rejection.
- Hub events handled: `SessionSynced`, `ParticipantJoined`, `ParticipantLeft`, `SessionStatusChanged`, `CursorMoved`

---

## Phase 4 — Frontend: Search Feature
| # | Task | Status |
|---|------|--------|
| 4.1 | `searchApi.ts` — RTK Query (`GET /search`) | ✅ Done |
| 4.2 | `SearchPage.tsx` — replace stub with full results page | ✅ Done |
| 4.3 | ⌘K shortcut + Enter-to-search wired in `Header.tsx` | ✅ Done |
| 4.4 | Grouped results with type facet chips + type filter dropdown | ✅ Done |
| 4.5 | Pagination support | ✅ Done |
| 4.6 | `SearchPage` auto-fetches from `?q=` URL param | ✅ Done |

**Backend endpoint:** `GET /api/v1/search?query=...&types=document,snippet,diagram&page=1&pageSize=20`

---

## Phase 5 — Settings & User Management (NEW)

### 5A — Settings Page (current user)
| # | Task | Status |
|---|------|--------|
| 5A.1 | `SettingsPage.tsx` — tabs: Profile / Security / Preferences | ⬜ |
| 5A.2 | Profile tab — edit display name, avatar URL | ⬜ |
| 5A.3 | Security tab — change password form | ⬜ |
| 5A.4 | Security tab — 2FA enable/disable (wires to existing backend endpoints) | ⬜ |
| 5A.5 | Preferences tab — theme toggle, notification prefs (local/persisted) | ⬜ |
| 5A.6 | Wire Settings route (`/settings`) in router | ⬜ |

**Backend endpoints available:**
- `GET /auth/me` — current user profile
- `POST /auth/enable-2fa`, `POST /auth/verify-2fa`, `POST /auth/disable-2fa`
- Change password: **needs new backend endpoint** (`PUT /auth/change-password`)

### 5B — Admin: User Management (new feature)
| # | Task | Status |
|---|------|--------|
| 5B.1 | **Backend**: `GET /admin/users` — paginated list of all users (Admin only) | ⬜ |
| 5B.2 | **Backend**: `GET /admin/users/{id}` — user detail with roles | ⬜ |
| 5B.3 | **Backend**: `PUT /admin/users/{id}/roles` — assign/update user roles | ⬜ |
| 5B.4 | **Backend**: `PUT /admin/users/{id}/status` — activate / deactivate account | ⬜ |
| 5B.5 | Frontend: `AdminUsersPage.tsx` — data grid of all users (Admin-gated route) | ⬜ |
| 5B.6 | Frontend: User role assignment dialog | ⬜ |
| 5B.7 | Frontend: Admin sidebar section (only visible to Admin role) | ⬜ |

**Available roles (ASP.NET Identity):** `Viewer`, `Editor`, `Admin`, `Guest`

---

## Phase 6 — Backend Functional Tests
| # | File | Endpoints | Status |
|---|------|-----------|--------|
| 6.1 | `Diagrams/DiagramEndpointTests.cs` | 14 diagram endpoints | ⬜ |
| 6.2 | `Collections/CollectionEndpointTests.cs` | 11 collection endpoints | ⬜ |
| 6.3 | `Collaboration/CollaborationEndpointTests.cs` | 13 collaboration endpoints | ⬜ |
| 6.4 | `Permissions/PermissionEndpointTests.cs` | 3 permission endpoints | ⬜ |
| 6.5 | `Search/SearchEndpointTests.cs` | 1 search endpoint | ⬜ |
| 6.6 | `Admin/AdminUserEndpointTests.cs` | 4 admin/user endpoints | ⬜ |

---

## Phase 7 — Playwright E2E Tests
| # | File | Scenarios | Status |
|---|------|-----------|--------|
| 7.1 | `diagrams/diagrams.spec.ts` | Create diagram, add element, save, view | ⬜ |
| 7.2 | `collections/collections.spec.ts` | Create collection, add document, navigate breadcrumb | ⬜ |
| 7.3 | `collaboration/collaboration.spec.ts` | Start session, join, add comment | ⬜ |
| 7.4 | `settings/settings.spec.ts` | Edit profile, change password | ⬜ |
| 7.5 | `admin/admin-users.spec.ts` | List users, assign role | ⬜ |

---

## Phase 8 — Polish & Production Readiness
| # | Task | Status |
|---|------|--------|
| 8.1 | `.env.example` is complete — `VITE_SIGNALR_HUB_URL` already present | ✅ Done |
| 8.2 | Error handling audit — RTK Query error states render user-friendly messages | ⬜ |
| 8.3 | API build verification: `dotnet build && dotnet test` | ⬜ |
| 8.4 | Frontend build verification: `npm run build && npm run lint` | ⬜ |
| 8.5 | End-to-end smoke test (full Playwright suite) | ⬜ |

---

## Known Issues / Notes
- Monaco CodeEditor red line fixed via `beforeMount` custom theme (`nexus-dark` / `nexus-light`)
- `EF` migration for `CollectionItems.ItemTitle` applied (`AddCollectionItemTitle`)
- `CollectionItem.ItemTitle` is denormalized at add-time (won't auto-update if resource renamed — acceptable trade-off)
- 96/96 backend functional tests passing (Auth, Documents, Snippets, Teams, Workspaces)
- SignalR "ws proxy socket error" = API not running; `CollaborationButton` now shows a friendly error snackbar
- Settings route (`/settings`) exists in `routePaths.ts` but page is not yet built
