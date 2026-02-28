import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WorkspaceFilterDto } from '@api/workspacesApi';

export type WorkspaceViewMode = 'grid' | 'list';

interface WorkspacesState {
  // Current selected workspace for the entire app
  currentWorkspaceId: string | null;

  // UI state
  viewMode: WorkspaceViewMode;
  showCreateDialog: boolean;
  showSettingsDialog: boolean;
  selectedWorkspaceForSettings: string | null;

  // Filters for workspace list
  filters: WorkspaceFilterDto;
}

const initialState: WorkspacesState = {
  currentWorkspaceId: null,
  viewMode: 'grid',
  showCreateDialog: false,
  showSettingsDialog: false,
  selectedWorkspaceForSettings: null,
  filters: {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    // Set current workspace (persisted across sessions)
    setCurrentWorkspace: (state, action: PayloadAction<string | null>) => {
      state.currentWorkspaceId = action.payload;
      // Store in localStorage for persistence
      if (action.payload) {
        localStorage.setItem('currentWorkspaceId', action.payload);
      } else {
        localStorage.removeItem('currentWorkspaceId');
      }
    },

    // Load current workspace from localStorage on app init
    loadCurrentWorkspace: (state) => {
      const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
      if (savedWorkspaceId) {
        state.currentWorkspaceId = savedWorkspaceId;
      }
    },

    // View mode
    setViewMode: (state, action: PayloadAction<WorkspaceViewMode>) => {
      state.viewMode = action.payload;
    },

    // Dialog states
    setShowCreateDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateDialog = action.payload;
    },

    setShowSettingsDialog: (state, action: PayloadAction<boolean>) => {
      state.showSettingsDialog = action.payload;
    },

    setSelectedWorkspaceForSettings: (state, action: PayloadAction<string | null>) => {
      state.selectedWorkspaceForSettings = action.payload;
    },

    openWorkspaceSettings: (state, action: PayloadAction<string>) => {
      state.selectedWorkspaceForSettings = action.payload;
      state.showSettingsDialog = true;
    },

    closeWorkspaceSettings: (state) => {
      state.showSettingsDialog = false;
      state.selectedWorkspaceForSettings = null;
    },

    // Filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.filters.pageNumber = 1; // Reset to first page on search
    },

    setTeamFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.teamId = action.payload;
      state.filters.pageNumber = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.filters.pageNumber = action.payload;
    },

    setSortBy: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },

    resetFilters: (state) => {
      state.filters = {
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      };
    },
  },
});

export const {
  setCurrentWorkspace,
  loadCurrentWorkspace,
  setViewMode,
  setShowCreateDialog,
  setShowSettingsDialog,
  setSelectedWorkspaceForSettings,
  openWorkspaceSettings,
  closeWorkspaceSettings,
  setSearchTerm,
  setTeamFilter,
  setPage,
  setSortBy,
  resetFilters,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;
