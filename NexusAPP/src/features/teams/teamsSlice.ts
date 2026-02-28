import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TeamFilterDto } from '@api/teamsApi';

export type TeamViewMode = 'grid' | 'list';

interface TeamsState {
  // UI state
  viewMode: TeamViewMode;
  showCreateDialog: boolean;
  showMembersDialog: boolean;
  selectedTeamId: string | null;

  // Filters for teams list
  filters: TeamFilterDto;
}

const initialState: TeamsState = {
  viewMode: 'grid',
  showCreateDialog: false,
  showMembersDialog: false,
  selectedTeamId: null,
  filters: {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortOrder: 'asc',
  },
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // View mode
    setViewMode: (state, action: PayloadAction<TeamViewMode>) => {
      state.viewMode = action.payload;
    },

    // Dialog states
    setShowCreateDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateDialog = action.payload;
    },

    setShowMembersDialog: (state, action: PayloadAction<boolean>) => {
      state.showMembersDialog = action.payload;
    },

    setSelectedTeam: (state, action: PayloadAction<string | null>) => {
      state.selectedTeamId = action.payload;
    },

    openTeamMembers: (state, action: PayloadAction<string>) => {
      state.selectedTeamId = action.payload;
      state.showMembersDialog = true;
    },

    closeTeamMembers: (state) => {
      state.showMembersDialog = false;
      state.selectedTeamId = null;
    },

    // Filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.filters.pageNumber = 1; // Reset to first page on search
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
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
  },
});

export const {
  setViewMode,
  setShowCreateDialog,
  setShowMembersDialog,
  setSelectedTeam,
  openTeamMembers,
  closeTeamMembers,
  setSearchTerm,
  setPage,
  setSortBy,
  resetFilters,
} = teamsSlice.actions;

export default teamsSlice.reducer;
