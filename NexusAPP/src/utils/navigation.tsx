import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  AccountTree as DiagramIcon,
  Group as TeamIcon,
  Folder as WorkspaceIcon,
  Collections as CollectionsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { NavItem } from '@/types';
import { ROUTE_PATHS } from '../routes/routePaths';

/**
 * Main navigation configuration
 * Used by the Sidebar component
 */
export const navigationConfig: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: ROUTE_PATHS.DASHBOARD,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: DocumentIcon,
    path: ROUTE_PATHS.DOCUMENTS,
  },
  {
    id: 'snippets',
    label: 'Code Snippets',
    icon: CodeIcon,
    path: ROUTE_PATHS.SNIPPETS,
  },
  {
    id: 'diagrams',
    label: 'Diagrams',
    icon: DiagramIcon,
    path: ROUTE_PATHS.DIAGRAMS,
  },
  {
    id: 'collections',
    label: 'Collections',
    icon: CollectionsIcon,
    path: ROUTE_PATHS.COLLECTIONS,
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: TeamIcon,
    path: ROUTE_PATHS.TEAMS,
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    icon: WorkspaceIcon,
    path: ROUTE_PATHS.WORKSPACES,
  },
  {
    id: 'search',
    label: 'Search',
    icon: SearchIcon,
    path: ROUTE_PATHS.SEARCH,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    path: ROUTE_PATHS.SETTINGS,
  },
];
