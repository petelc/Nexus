/**
 * Application route paths
 * Centralized route path constants for type-safe navigation
 */

export const ROUTE_PATHS = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: '/documents/:documentId',
  DOCUMENT_CREATE: '/documents/new',

  // Code Snippets
  SNIPPETS: '/snippets',
  SNIPPET_DETAIL: '/snippets/:snippetId',
  SNIPPET_EDIT: '/snippets/:snippetId/edit',
  SNIPPET_CREATE: '/snippets/new',
  PUBLIC_SNIPPETS: '/snippets/public',

  // Diagrams
  DIAGRAMS: '/diagrams',
  DIAGRAM_DETAIL: '/diagrams/:diagramId',
  DIAGRAM_EDITOR: '/diagrams/:diagramId/edit',
  DIAGRAM_CREATE: '/diagrams/new',

  // Teams
  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:teamId',
  TEAM_CREATE: '/teams/new',

  // Workspaces
  WORKSPACES: '/workspaces',
  WORKSPACE_DETAIL: '/workspaces/:workspaceId',
  WORKSPACE_CREATE: '/workspaces/new',

  // Collections
  COLLECTIONS: '/collections',
  COLLECTION_DETAIL: '/collections/:collectionId',

  // Search
  SEARCH: '/search',

  // Settings
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',

  // Errors
  NOT_FOUND: '/404',
} as const;

/**
 * Helper function to build dynamic routes
 */
export const buildRoute = {
  documentDetail: (id: string) => `/documents/${id}`,
  snippetDetail: (id: string) => `/snippets/${id}`,
  snippetEdit: (id: string) => `/snippets/${id}/edit`,
  diagramDetail: (id: string) => `/diagrams/${id}`,
  diagramEditor: (id: string) => `/diagrams/${id}/edit`,
  teamDetail: (id: string) => `/teams/${id}`,
  workspaceDetail: (id: string) => `/workspaces/${id}`,
  collectionDetail: (id: string) => `/collections/${id}`,
};
