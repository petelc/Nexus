# Nexus React Frontend - Implementation Plan

**Version:** 1.0
**Date:** February 13, 2026
**Status:** Approved
**Project:** Nexus Knowledge Management System

---

## Table of Contents

1. [Context](#context)
2. [Updated Brand Guidelines](#phase-1-updated-brand-guidelines-documentation)
3. [Project Setup & Foundation](#phase-2-project-setup--foundation)
4. [Core Architecture](#phase-3-core-architecture-implementation)
5. [Feature Implementation](#phase-4-feature-implementation)
6. [TypeScript Types & DTOs](#phase-5-typescript-types--dtos)
7. [Testing Strategy](#phase-6-testing-strategy)
8. [Build & Deployment](#phase-7-build--deployment)
9. [Critical Files](#critical-files-to-create)
10. [Verification Plan](#verification-plan)
11. [Documentation Deliverables](#additional-documentation-deliverables)
12. [Success Criteria](#success-criteria)
13. [Risk Mitigation](#risk-mitigation)

---

## Context

We're building a modern React frontend for **Nexus**, a Knowledge Management System for IT staff. The backend API is fully implemented with 95+ endpoints across 11 feature areas (authentication, teams, workspaces, documents, diagrams, code snippets, collections, real-time collaboration, and permissions).

### Why This Implementation?

**Current State:**
- Backend API is complete using .NET 10, Clean Architecture, FastEndpoints
- All domain models, DTOs, and business logic implemented
- JWT authentication, SignalR real-time collaboration, comprehensive permission system
- No frontend exists yet

**Goal:**
- Create a professional, modern web application matching the Modernize template design
- Support all major features: documents, code snippets, diagrams, real-time collaboration
- Implement dark/light theme toggle
- Use blue color scheme (#5D87FF) instead of the original purple
- Match template's 270px fixed sidebar layout

### Technical Requirements

**Core Stack:**
- React 19.2 with TypeScript 5.9
- Material-UI v7 (MUI) for components
- React-Redux + Redux Toolkit for state management
- RTK Query for API data fetching
- React Router v7 for navigation
- SignalR client for real-time features

**Template Design:**
- Modernize Next.js Dark template as design reference
- Dark mode primary with light mode support
- Fixed 270px sidebar navigation
- Sticky header with blur backdrop
- Modern blue accent (#5D87FF)

---

## Phase 1: Updated Brand Guidelines Documentation

### Brand Identity Refresh

**New Color Palette:**

```typescript
// Primary Colors (Blue Theme)
const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#5D87FF',  // Primary brand color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Secondary/Accent Colors
  secondary: {
    cyan: '#49BEFF',
    teal: '#13DEB9',
    coral: '#FA896B',
    gold: '#FFAE1F',
  },

  // Semantic Colors
  success: '#13DEB9',
  warning: '#FFAE1F',
  error: '#FA896B',
  info: '#49BEFF',

  // Dark Mode Palette
  dark: {
    background: '#2A3447',
    paper: '#2A3447',
    surface: '#253662',
    border: '#333F55',
    text: {
      primary: '#EAEFF4',
      secondary: '#7C8FAC',
    },
  },

  // Light Mode Palette
  light: {
    background: '#F5F7FA',
    paper: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
};
```

**Typography:**
- Primary: Inter (400, 500, 600, 700) - unchanged from brand guidelines
- Monospace: Fira Code - for code snippets
- Font smoothing: antialiased for better rendering

**Design Tokens:**
- Border radius: 7px (cards), 16px (chips/badges)
- Spacing: 8px base unit (Material-UI default)
- Transitions: 150-300ms ease-in-out
- Shadow levels: MUI elevation system (0-24)

---

## Phase 2: Project Setup & Foundation

### Directory Structure

```
nexus-web/
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── manifest.json
├── src/
│   ├── api/                      # API client & RTK Query
│   │   ├── apiClient.ts          # Axios instance with interceptors
│   │   ├── signalrClient.ts      # SignalR hub connection
│   │   └── services/             # RTK Query API slices
│   │       ├── authApi.ts
│   │       ├── documentsApi.ts
│   │       ├── diagramsApi.ts
│   │       ├── snippetsApi.ts
│   │       ├── teamsApi.ts
│   │       ├── workspacesApi.ts
│   │       ├── collectionsApi.ts
│   │       └── collaborationApi.ts
│   ├── app/                      # Redux store configuration
│   │   ├── store.ts              # Store setup
│   │   ├── hooks.ts              # Typed useDispatch/useSelector
│   │   └── rootReducer.ts        # Combine reducers
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/               # Reusable components
│   │   ├── common/               # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── navigation/           # Navigation components
│   │   │   ├── NavItem.tsx
│   │   │   ├── NavSection.tsx
│   │   │   └── UserMenu.tsx
│   │   └── forms/                # Form components
│   │       ├── TextField.tsx
│   │       ├── Select.tsx
│   │       └── FormContainer.tsx
│   ├── features/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── ResetPasswordForm.tsx
│   │   │   │   └── TwoFactorSetup.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   ├── authSlice.ts      # Redux slice for auth state
│   │   │   └── authUtils.ts      # Token management, etc.
│   │   ├── documents/
│   │   │   ├── components/
│   │   │   │   ├── DocumentEditor.tsx
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   ├── DocumentCard.tsx
│   │   │   │   ├── VersionHistory.tsx
│   │   │   │   └── TagManager.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DocumentsPage.tsx
│   │   │   │   ├── DocumentDetailPage.tsx
│   │   │   │   └── CreateDocumentPage.tsx
│   │   │   ├── documentsSlice.ts
│   │   │   └── editor/           # Rich text editor
│   │   │       ├── RichTextEditor.tsx
│   │   │       ├── Toolbar.tsx
│   │   │       └── plugins/
│   │   ├── snippets/
│   │   │   ├── components/
│   │   │   │   ├── CodeEditor.tsx
│   │   │   │   ├── SnippetCard.tsx
│   │   │   │   ├── SnippetList.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   └── SyntaxHighlighter.tsx
│   │   │   ├── pages/
│   │   │   │   ├── SnippetsPage.tsx
│   │   │   │   ├── SnippetDetailPage.tsx
│   │   │   │   ├── CreateSnippetPage.tsx
│   │   │   │   └── PublicSnippetsPage.tsx
│   │   │   └── snippetsSlice.ts
│   │   ├── diagrams/
│   │   │   ├── components/
│   │   │   │   ├── DiagramCanvas.tsx
│   │   │   │   ├── DiagramToolbar.tsx
│   │   │   │   ├── ElementPalette.tsx
│   │   │   │   ├── PropertiesPanel.tsx
│   │   │   │   ├── LayerManager.tsx
│   │   │   │   └── DiagramList.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DiagramsPage.tsx
│   │   │   │   ├── DiagramEditorPage.tsx
│   │   │   │   └── CreateDiagramPage.tsx
│   │   │   ├── diagramsSlice.ts
│   │   │   └── engine/           # Diagram rendering engine
│   │   │       ├── Canvas.tsx
│   │   │       ├── Element.tsx
│   │   │       ├── Connection.tsx
│   │   │       └── shapes/
│   │   ├── teams/
│   │   │   ├── components/
│   │   │   │   ├── TeamCard.tsx
│   │   │   │   ├── TeamList.tsx
│   │   │   │   ├── MemberList.tsx
│   │   │   │   └── InviteMemberDialog.tsx
│   │   │   ├── pages/
│   │   │   │   ├── TeamsPage.tsx
│   │   │   │   ├── TeamDetailPage.tsx
│   │   │   │   └── CreateTeamPage.tsx
│   │   │   └── teamsSlice.ts
│   │   ├── workspaces/
│   │   │   ├── components/
│   │   │   │   ├── WorkspaceCard.tsx
│   │   │   │   ├── WorkspaceList.tsx
│   │   │   │   └── WorkspaceSwitcher.tsx
│   │   │   ├── pages/
│   │   │   │   ├── WorkspacesPage.tsx
│   │   │   │   ├── WorkspaceDetailPage.tsx
│   │   │   │   └── CreateWorkspacePage.tsx
│   │   │   └── workspacesSlice.ts
│   │   ├── collections/
│   │   │   ├── components/
│   │   │   │   ├── CollectionTree.tsx
│   │   │   │   ├── CollectionCard.tsx
│   │   │   │   └── ItemList.tsx
│   │   │   ├── pages/
│   │   │   │   ├── CollectionsPage.tsx
│   │   │   │   └── CollectionDetailPage.tsx
│   │   │   └── collectionsSlice.ts
│   │   ├── collaboration/
│   │   │   ├── components/
│   │   │   │   ├── CollaborationPanel.tsx
│   │   │   │   ├── ParticipantList.tsx
│   │   │   │   ├── CommentThread.tsx
│   │   │   │   ├── CommentBox.tsx
│   │   │   │   └── CursorOverlay.tsx
│   │   │   └── collaborationSlice.ts
│   │   ├── search/
│   │   │   ├── components/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   ├── SearchFilters.tsx
│   │   │   │   └── ResultCard.tsx
│   │   │   ├── pages/
│   │   │   │   └── SearchPage.tsx
│   │   │   └── searchSlice.ts
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── StatCard.tsx
│   │       │   ├── RecentActivity.tsx
│   │       │   ├── QuickActions.tsx
│   │       │   └── ActivityTimeline.tsx
│   │       └── pages/
│   │           └── DashboardPage.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useSignalR.ts
│   ├── routes/                   # Routing configuration
│   │   ├── index.tsx             # Route definitions
│   │   ├── PrivateRoute.tsx      # Auth guard
│   │   └── routePaths.ts         # Route constants
│   ├── theme/                    # MUI theme configuration
│   │   ├── index.ts              # Theme setup
│   │   ├── darkTheme.ts          # Dark theme palette
│   │   ├── lightTheme.ts         # Light theme palette
│   │   ├── typography.ts         # Typography settings
│   │   └── components.ts         # Component overrides
│   ├── types/                    # TypeScript types
│   │   ├── api.types.ts          # API DTOs
│   │   ├── domain.types.ts       # Domain models
│   │   ├── redux.types.ts        # Redux types
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts         # Date, number formatting
│   │   ├── validators.ts         # Form validation
│   │   ├── constants.ts          # App constants
│   │   └── helpers.ts            # General helpers
│   ├── App.tsx                   # Root component
│   ├── index.tsx                 # Entry point
│   └── vite-env.d.ts             # Vite types
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (gitignored)
├── .eslintrc.json                # ESLint config
├── .prettierrc                   # Prettier config
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite build config
├── package.json
└── README.md
```

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-redux": "^9.1.0",
    "react-router-dom": "^7.0.0",
    "@reduxjs/toolkit": "^2.2.0",
    "@mui/material": "^7.0.0",
    "@mui/icons-material": "^7.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@microsoft/signalr": "^8.0.7",
    "axios": "^1.7.0",
    "@monaco-editor/react": "^4.6.0",
    "react-quill": "^2.0.0",
    "reactflow": "^11.11.0",
    "dayjs": "^1.11.13",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

### Environment Configuration

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SIGNALR_HUB_URL=http://localhost:5000/hubs/collaboration
VITE_APP_NAME=Nexus
VITE_APP_VERSION=1.0.0
```

---

## Phase 3: Core Architecture Implementation

### 3.1 Theme System (Dark + Light Mode)

**File:** `src/theme/index.ts`

```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkPalette } from './darkTheme';
import { lightPalette } from './lightTheme';
import { typography } from './typography';
import { componentOverrides } from './components';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...palette,
    },
    typography,
    shape: {
      borderRadius: 7,
    },
    components: componentOverrides(mode),
  };

  return createTheme(themeOptions);
};
```

**File:** `src/theme/darkTheme.ts`

```typescript
export const darkPalette = {
  primary: {
    main: '#5D87FF',
    light: '#90caf9',
    dark: '#1e88e5',
    contrastText: '#fff',
  },
  secondary: {
    main: '#49BEFF',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  background: {
    default: '#2A3447',
    paper: '#2A3447',
  },
  text: {
    primary: '#EAEFF4',
    secondary: '#7C8FAC',
  },
  divider: '#333F55',
  success: {
    main: '#13DEB9',
  },
  warning: {
    main: '#FFAE1F',
  },
  error: {
    main: '#FA896B',
  },
  info: {
    main: '#49BEFF',
  },
};
```

**File:** `src/theme/lightTheme.ts`

```typescript
export const lightPalette = {
  primary: {
    main: '#5D87FF',
    light: '#90caf9',
    dark: '#1e88e5',
    contrastText: '#fff',
  },
  secondary: {
    main: '#49BEFF',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  },
  divider: '#E5E7EB',
  success: {
    main: '#13DEB9',
  },
  warning: {
    main: '#FFAE1F',
  },
  error: {
    main: '#FA896B',
  },
  info: {
    main: '#49BEFF',
  },
};
```

### 3.2 Redux Store Configuration

**File:** `src/app/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/services/authApi';
import { documentsApi } from '../api/services/documentsApi';
import { snippetsApi } from '../api/services/snippetsApi';
import { diagramsApi } from '../api/services/diagramsApi';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [snippetsApi.reducerPath]: snippetsApi.reducer,
    [diagramsApi.reducerPath]: diagramsApi.reducer,
    // ... other API reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      documentsApi.middleware,
      snippetsApi.middleware,
      diagramsApi.middleware,
      // ... other API middlewares
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3.3 API Client Setup

**File:** `src/api/apiClient.ts`

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { store } from '../app/store';
import { logout, refreshAccessToken } from '../features/auth/authSlice';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await store.dispatch(refreshAccessToken()).unwrap();

        // Retry original request with new token
        const token = store.getState().auth.accessToken;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 3.4 SignalR Client Setup

**File:** `src/api/signalrClient.ts`

```typescript
import * as signalR from '@microsoft/signalr';
import { store } from '../app/store';

class SignalRClient {
  private connection: signalR.HubConnection | null = null;

  async connect() {
    const token = store.getState().auth.accessToken;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SIGNALR_HUB_URL}`, {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    await this.connection.start();
    console.log('SignalR connected');
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.connection?.on(eventName, callback);
  }

  off(eventName: string) {
    this.connection?.off(eventName);
  }

  async invoke(methodName: string, ...args: any[]) {
    return this.connection?.invoke(methodName, ...args);
  }
}

export const signalRClient = new SignalRClient();
```

---

## Phase 4: Feature Implementation

### 4.1 Authentication Flow

**Key Components:**
1. **LoginPage** - Email/password login form
2. **RegisterPage** - New user registration
3. **ForgotPasswordPage** - Password reset initiation
4. **ResetPasswordPage** - Password reset completion
5. **TwoFactorSetup** - QR code display for authenticator apps

**Auth Slice:**
```typescript
// src/features/auth/authSlice.ts
interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Actions: login, register, logout, refreshAccessToken, setUser
```

### 4.2 Document Management

**Core Components:**
1. **DocumentsPage** - List view with search/filter
2. **DocumentDetailPage** - Read-only view with version history
3. **DocumentEditor** - Rich text editing with auto-save
4. **VersionHistory** - Timeline of changes with restore capability
5. **TagManager** - Add/remove tags

**Rich Text Editor:**
- Use **React Quill** or **Slate.js**
- Toolbar: Bold, Italic, Underline, Headings, Lists, Links, Images
- Auto-save every 30 seconds
- Word count display
- Reading time calculation

### 4.3 Code Snippet Library

**Core Components:**
1. **SnippetsPage** - Grid/list view of snippets
2. **CreateSnippetPage** - Create new snippet
3. **SnippetDetailPage** - View snippet with syntax highlighting
4. **CodeEditor** - Monaco Editor integration
5. **LanguageSelector** - Dropdown for 150+ languages

**Code Editor:**
- Use **Monaco Editor** (VS Code engine)
- Syntax highlighting for all languages
- Theme matches app theme (dark/light)

### 4.4 Diagram Builder

**Core Components:**
1. **DiagramsPage** - List of diagrams
2. **DiagramEditorPage** - Canvas editor
3. **DiagramCanvas** - Main canvas using React Flow
4. **ElementPalette** - Draggable shapes
5. **PropertiesPanel** - Edit selected element properties
6. **LayerManager** - Manage layers

**Diagram Engine:**
- Use **React Flow** library
- Custom nodes for different shapes
- Connections between nodes
- Export to PNG/SVG

### 4.5 Real-time Collaboration

**Core Components:**
1. **CollaborationPanel** - Side panel showing active participants
2. **ParticipantList** - List of users in session
3. **CursorOverlay** - Show other users' cursors
4. **CommentThread** - Threaded comments

**SignalR Integration:**
```typescript
signalRClient.invoke('StartSession', { resourceType: 'Document', resourceId });
signalRClient.on('UserJoined', (participant) => { /* update UI */ });
signalRClient.on('ChangeReceived', (change) => { /* apply change */ });
```

---

## Phase 5: TypeScript Types & DTOs

**File:** `src/types/api.types.ts`

All DTOs should match the backend exactly:

```typescript
// Authentication
export interface UserDto {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailConfirmed: boolean;
  twoFactorEnabled: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

// Documents
export interface DocumentDto {
  documentId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  status: DocumentStatus;
  tags: TagDto[];
  versions: DocumentVersionDto[];
}

export enum DocumentStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived',
}

// Code Snippets
export interface CodeSnippetDto {
  snippetId: string;
  title: string;
  code: string;
  language: string;
  createdBy: string;
  metadata: CodeMetadataDto;
  tags: TagDto[];
  isPublic: boolean;
}

// Diagrams
export interface DiagramDto {
  diagramId: string;
  title: string;
  diagramType: DiagramType;
  canvas: CanvasDto;
  elements: DiagramElementDto[];
  connections: DiagramConnectionDto[];
}

export enum DiagramType {
  Flowchart = 'Flowchart',
  Network = 'Network',
  UML = 'UML',
  ERD = 'ERD',
  Custom = 'Custom',
}
```

---

## Phase 6: Testing Strategy

### Unit Tests
- Component tests with React Testing Library
- Redux slice tests
- Utility function tests
- Custom hook tests

### Integration Tests
- API integration tests
- Redux + RTK Query integration
- SignalR connection tests

### E2E Tests
- Playwright for critical user flows:
  - Login → Create Document → Save → Logout
  - Create Code Snippet → Make Public → Fork
  - Create Diagram → Add Elements → Save
  - Start Collaboration Session → Join → Comment

---

## Phase 7: Build & Deployment

### Development
```bash
npm run dev
# Runs Vite dev server on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized build in /dist
```

### Environment Variables
```bash
# Development (.env.local)
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SIGNALR_HUB_URL=http://localhost:5000/hubs/collaboration

# Production (.env.production)
VITE_API_BASE_URL=https://api.nexus.io/api/v1
VITE_SIGNALR_HUB_URL=https://api.nexus.io/hubs/collaboration
```

---

## Critical Files to Create

### Priority 1: Foundation (8 files)
1. `package.json` - Dependencies
2. `vite.config.ts` - Build configuration
3. `tsconfig.json` - TypeScript configuration
4. `.env.example` - Environment variables template
5. `src/theme/index.ts` - Theme system
6. `src/app/store.ts` - Redux store
7. `src/api/apiClient.ts` - Axios client with interceptors
8. `src/types/api.types.ts` - All DTOs

### Priority 2: Layout & Routing (6 files)
9. `src/components/layout/AppLayout.tsx` - Main layout
10. `src/components/layout/Sidebar.tsx` - Navigation sidebar
11. `src/components/layout/Header.tsx` - Header with theme toggle
12. `src/routes/index.tsx` - Route definitions
13. `src/routes/PrivateRoute.tsx` - Auth guard
14. `src/App.tsx` - Root component

### Priority 3: Authentication (6 files)
15. `src/features/auth/authSlice.ts` - Auth state management
16. `src/api/services/authApi.ts` - Auth API endpoints
17. `src/features/auth/pages/LoginPage.tsx` - Login page
18. `src/features/auth/pages/RegisterPage.tsx` - Register page
19. `src/features/auth/components/LoginForm.tsx` - Login form
20. `src/features/auth/components/RegisterForm.tsx` - Register form

### Priority 4: Core Features (10 files)
21. `src/api/services/documentsApi.ts` - Documents API
22. `src/features/documents/pages/DocumentsPage.tsx` - Documents list
23. `src/features/documents/components/DocumentEditor.tsx` - Editor
24. `src/api/services/snippetsApi.ts` - Snippets API
25. `src/features/snippets/pages/SnippetsPage.tsx` - Snippets list
26. `src/features/snippets/components/CodeEditor.tsx` - Monaco editor
27. `src/api/services/diagramsApi.ts` - Diagrams API
28. `src/features/diagrams/pages/DiagramEditorPage.tsx` - Diagram editor
29. `src/api/signalrClient.ts` - SignalR client
30. `src/features/collaboration/components/CollaborationPanel.tsx` - Collaboration UI

**Total: 30 critical files**

---

## Verification Plan

### Step 1: Development Environment Setup
1. Install Node.js 20+ and npm/yarn
2. Clone repository and install dependencies
3. Create `.env.local` with API URLs
4. Run `npm run dev`
5. Verify app loads at http://localhost:3000

### Step 2: Authentication Testing
1. Navigate to `/register`
2. Create a new user account
3. Login with credentials
4. Verify JWT token stored in Redux
5. Test logout functionality
6. Test token refresh

### Step 3: Document Management Testing
1. Create a new document
2. Edit content in rich text editor
3. Verify auto-save
4. Add tags to document
5. Publish document
6. View version history
7. Restore previous version

### Step 4: Code Snippet Testing
1. Create a new snippet
2. Select language
3. Verify syntax highlighting
4. Make snippet public
5. Fork a public snippet
6. Filter by language

### Step 5: Diagram Builder Testing
1. Create a new diagram
2. Drag shapes to canvas
3. Create connections
4. Edit properties
5. Save diagram
6. Export to PNG

### Step 6: Real-time Collaboration Testing
1. Open document in two windows
2. Start collaboration session
3. Verify participants list
4. Make edit in one window
5. Verify change appears in other
6. Add comment
7. End session

### Step 7: Theme Toggle Testing
1. Toggle between dark and light mode
2. Verify all components update
3. Verify theme persists

### Step 8: Responsive Design Testing
1. Test on mobile (375px)
2. Test on tablet (768px)
3. Test on desktop (1920px)

### Step 9: Performance Testing
1. Verify page load < 3s
2. Check for memory leaks
3. Test with 100+ documents

### Step 10: Cross-browser Testing
1. Test on Chrome, Firefox, Safari, Edge
2. Verify consistent behavior

---

## Additional Documentation Deliverables

### 1. Developer Documentation
- Getting Started Guide
- Architecture Overview
- API Integration Guide
- Component Library
- State Management Guide
- Testing Guide

### 2. User Documentation
- User Guide
- FAQ
- Keyboard Shortcuts
- Video Tutorials

### 3. Deployment Documentation
- Environment Setup
- Build Process
- Deployment Guide
- Monitoring & Logging

### 4. Brand Assets Package
- Logo Files
- Color Swatches
- Icon Set
- Typography Files
- Design System

---

## Success Criteria

### Functional Requirements
✅ Users can register, login, logout, and reset password
✅ Users can create, edit, and delete documents
✅ Rich text editor supports formatting
✅ Document versioning works
✅ Users can create and manage code snippets
✅ Monaco editor provides syntax highlighting
✅ Users can create diagrams
✅ Real-time collaboration works
✅ Dark and light themes work

### Non-Functional Requirements
✅ Application loads in < 3 seconds
✅ Proper error handling
✅ Responsive design (375px - 4K)
✅ Cross-browser compatibility
✅ TypeScript strict mode
✅ React best practices
✅ Form validation
✅ User-friendly error messages

---

## Risk Mitigation

### Technical Risks

**Risk:** Monaco Editor bundle size too large
- **Mitigation:** Dynamic imports, code splitting

**Risk:** React Flow performance with 100+ nodes
- **Mitigation:** Virtualization, optimize renders

**Risk:** SignalR connection drops
- **Mitigation:** Automatic reconnection, offline mode

**Risk:** State management complexity
- **Mitigation:** Clear Redux patterns, RTK Query

### Scope Risks

**Risk:** All features in MVP is too ambitious
- **Mitigation:** Phased approach

**Risk:** Real-time collaboration complexity
- **Mitigation:** Use OT/CRDT library

**Risk:** Diagram builder complexity
- **Mitigation:** React Flow handles most complexity

---

## Next Steps

1. Create GitHub repository
2. Initialize Vite + React + TypeScript project
3. Install dependencies
4. Setup ESLint, Prettier
5. Create folder structure
6. Setup theme system
7. Configure Redux store
8. Implement authentication
9. Build layout components
10. Implement features by priority
11. Write tests
12. Deploy to staging
13. User acceptance testing
14. Deploy to production

---

**Document Version:** 1.0
**Created:** February 13, 2026
**Last Updated:** February 13, 2026
**Author:** Development Team
**Status:** Approved for Implementation

---

© 2026 Nexus. All rights reserved.
