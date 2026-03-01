import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@components/layout/AppLayout';
import { PrivateRoute } from './PrivateRoute';
import { ROUTE_PATHS } from './routePaths';

// Auth pages
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@features/auth/pages/ResetPasswordPage';

// Dashboard
import { DashboardPage } from '@features/dashboard/pages/DashboardPage';

// Documents
import { DocumentsPage } from '@features/documents/pages/DocumentsPage';
import { DocumentDetailPage } from '@features/documents/pages/DocumentDetailPage';
import { CreateDocumentPage } from '@features/documents/pages/CreateDocumentPage';

// Snippets
import { SnippetsPage } from '@features/snippets/pages/SnippetsPage';
import { SnippetDetailPage } from '@features/snippets/pages/SnippetDetailPage';
import { CreateSnippetPage } from '@features/snippets/pages/CreateSnippetPage';

// Diagrams
import { DiagramsPage } from '@features/diagrams/pages/DiagramsPage';
import { DiagramDetailPage } from '@features/diagrams/pages/DiagramDetailPage';
import { DiagramEditorPage } from '@features/diagrams/pages/DiagramEditorPage';
import { CreateDiagramPage } from '@features/diagrams/pages/CreateDiagramPage';

// Teams
import { TeamsPage } from '@features/teams/pages/TeamsPage';
import { TeamDetailPage } from '@features/teams/pages/TeamDetailPage';

// Workspaces
import { WorkspacesPage } from '@features/workspaces/pages/WorkspacesPage';
import { WorkspaceDetailPage } from '@features/workspaces/pages/WorkspaceDetailPage';

// Collections
import { CollectionsPage } from '@features/collections/pages/CollectionsPage';
import { CollectionDetailPage } from '@features/collections/pages/CollectionDetailPage';

// Search
import { SearchPage } from '@features/search/pages/SearchPage';

// Settings
import { SettingsPage } from '@features/settings/pages/SettingsPage';

// Admin
import { AdminUsersPage } from '@features/admin/pages/AdminUsersPage';

// Error pages
import { NotFoundPage } from '../pages/NotFoundPage';

interface RouterConfig {
  onThemeToggle: () => void;
}

export const createAppRouter = ({ onThemeToggle }: RouterConfig) => {
  return createBrowserRouter([
    // Public routes
    {
      path: ROUTE_PATHS.LOGIN,
      element: <LoginPage />,
    },
    {
      path: ROUTE_PATHS.REGISTER,
      element: <RegisterPage />,
    },
    {
      path: ROUTE_PATHS.FORGOT_PASSWORD,
      element: <ForgotPasswordPage />,
    },
    {
      path: ROUTE_PATHS.RESET_PASSWORD,
      element: <ResetPasswordPage />,
    },

    // Protected routes with layout
    {
      path: '/',
      element: (
        <PrivateRoute>
          <AppLayout onThemeToggle={onThemeToggle} />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
        },
        {
          path: ROUTE_PATHS.DASHBOARD,
          element: <DashboardPage />,
        },
        {
          path: ROUTE_PATHS.DOCUMENTS,
          element: <DocumentsPage />,
        },
        {
          path: ROUTE_PATHS.DOCUMENT_CREATE,
          element: <CreateDocumentPage />,
        },
        {
          path: '/documents/:documentId/edit',
          element: <CreateDocumentPage />,
        },
        {
          path: ROUTE_PATHS.DOCUMENT_DETAIL,
          element: <DocumentDetailPage />,
        },
        {
          path: ROUTE_PATHS.SNIPPETS,
          element: <SnippetsPage />,
        },
        {
          path: ROUTE_PATHS.SNIPPET_CREATE,
          element: <CreateSnippetPage />,
        },
        {
          path: ROUTE_PATHS.SNIPPET_EDIT,
          element: <CreateSnippetPage />,
        },
        {
          path: ROUTE_PATHS.SNIPPET_DETAIL,
          element: <SnippetDetailPage />,
        },
        {
          path: ROUTE_PATHS.DIAGRAMS,
          element: <DiagramsPage />,
        },
        {
          path: ROUTE_PATHS.DIAGRAM_CREATE,
          element: <CreateDiagramPage />,
        },
        {
          path: ROUTE_PATHS.DIAGRAM_EDITOR,
          element: <DiagramEditorPage />,
        },
        {
          path: ROUTE_PATHS.DIAGRAM_DETAIL,
          element: <DiagramDetailPage />,
        },
        {
          path: ROUTE_PATHS.TEAMS,
          element: <TeamsPage />,
        },
        {
          path: ROUTE_PATHS.TEAM_DETAIL,
          element: <TeamDetailPage />,
        },
        {
          path: ROUTE_PATHS.WORKSPACES,
          element: <WorkspacesPage />,
        },
        {
          path: ROUTE_PATHS.WORKSPACE_DETAIL,
          element: <WorkspaceDetailPage />,
        },
        {
          path: ROUTE_PATHS.COLLECTIONS,
          element: <CollectionsPage />,
        },
        {
          path: ROUTE_PATHS.COLLECTION_DETAIL,
          element: <CollectionDetailPage />,
        },
        {
          path: ROUTE_PATHS.SEARCH,
          element: <SearchPage />,
        },
        {
          path: ROUTE_PATHS.SETTINGS,
          element: <SettingsPage />,
        },
        {
          path: ROUTE_PATHS.ADMIN_USERS,
          element: <AdminUsersPage />,
        },
      ],
    },

    // 404 page
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
};
