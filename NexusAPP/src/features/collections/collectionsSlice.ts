import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CollectionViewMode = 'grid' | 'list';

interface CollectionsState {
  viewMode: CollectionViewMode;
  showCreateDialog: boolean;
  selectedWorkspaceId: string | null;
  searchTerm: string;
}

const initialState: CollectionsState = {
  viewMode: 'grid',
  showCreateDialog: false,
  selectedWorkspaceId: null,
  searchTerm: '',
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<CollectionViewMode>) => {
      state.viewMode = action.payload;
    },

    setShowCreateDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateDialog = action.payload;
    },

    setSelectedWorkspaceId: (state, action: PayloadAction<string | null>) => {
      state.selectedWorkspaceId = action.payload;
      state.searchTerm = '';
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    resetFilters: (state) => {
      state.searchTerm = '';
    },
  },
});

export const {
  setViewMode,
  setShowCreateDialog,
  setSelectedWorkspaceId,
  setSearchTerm,
  resetFilters,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
