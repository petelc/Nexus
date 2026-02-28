import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@features/auth/authSlice';
import snippetsReducer from '@features/snippets/snippetsSlice';
import documentsReducer from '@features/documents/documentsSlice';
import workspacesReducer from '@features/workspaces/workspacesSlice';
import teamsReducer from '@features/teams/teamsSlice';
import diagramsReducer from '@features/diagrams/diagramsSlice';
import collectionsReducer from '@features/collections/collectionsSlice';
import collaborationReducer from '@features/collaboration/collaborationSlice';
import { authApi } from '@features/auth/authApi';
import { snippetsApi } from '@api/snippetsApi';
import { documentsApi } from '@api/documentsApi';
import { workspacesApi } from '@api/workspacesApi';
import { teamsApi } from '@api/teamsApi';
import { diagramsApi } from '@api/diagramsApi';
import { collectionsApi } from '@api/collectionsApi';
import { collaborationApi } from '@api/collaborationApi';
import { searchApi } from '@api/searchApi';

export const store = configureStore({
  reducer: {
    // Auth
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // Snippets
    snippets: snippetsReducer,
    [snippetsApi.reducerPath]: snippetsApi.reducer,

    // Documents
    documents: documentsReducer,
    [documentsApi.reducerPath]: documentsApi.reducer,

    // Workspaces
    workspaces: workspacesReducer,
    [workspacesApi.reducerPath]: workspacesApi.reducer,

    // Teams
    teams: teamsReducer,
    [teamsApi.reducerPath]: teamsApi.reducer,

    // Diagrams
    diagrams: diagramsReducer,
    [diagramsApi.reducerPath]: diagramsApi.reducer,

    // Collections
    collections: collectionsReducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,

    // Collaboration
    collaboration: collaborationReducer,
    [collaborationApi.reducerPath]: collaborationApi.reducer,

    // Search
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for SignalR connections
        ignoredActions: ['signalr/connection'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.connection',
          'meta.baseQueryMeta.request', // RTK Query Request object
          'meta.baseQueryMeta.response', // RTK Query Response object
        ],
        // Ignore these paths in the state
        ignoredPaths: ['signalr.connection'],
      },
    }).concat(authApi.middleware, snippetsApi.middleware, documentsApi.middleware, workspacesApi.middleware, teamsApi.middleware, diagramsApi.middleware, collectionsApi.middleware, collaborationApi.middleware, searchApi.middleware),
  devTools: import.meta.env.DEV,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
