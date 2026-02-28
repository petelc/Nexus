import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentStatus } from '@/types/api.types';
import type { DocumentFilterDto } from '@/types/api.types';

export type DocumentViewMode = 'grid' | 'list';
export type DocumentTabType = 'all' | 'drafts' | 'published' | 'archived';

interface DocumentsState {
  // UI State
  viewMode: DocumentViewMode;
  activeTab: DocumentTabType;
  selectedDocumentId: string | null;
  showVersionHistory: boolean;

  // Filter State
  filters: DocumentFilterDto;

  // Editor State
  autoSaveEnabled: boolean;
  lastSavedAt: string | null;

  // Preferences
  favoriteDocumentIds: string[];
}

const initialState: DocumentsState = {
  // UI State
  viewMode: 'list',
  activeTab: 'all',
  selectedDocumentId: null,
  showVersionHistory: false,

  // Filter State
  filters: {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },

  // Editor State
  autoSaveEnabled: true,
  lastSavedAt: null,

  // Preferences
  favoriteDocumentIds: [],
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    // UI Actions
    setViewMode: (state, action: PayloadAction<DocumentViewMode>) => {
      state.viewMode = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<DocumentTabType>) => {
      state.activeTab = action.payload;
      // Reset filters when switching tabs
      state.filters.pageNumber = 1;

      // Set status filter based on tab
      if (action.payload === 'drafts') {
        state.filters.status = DocumentStatus.Draft;
      } else if (action.payload === 'published') {
        state.filters.status = DocumentStatus.Published;
      } else if (action.payload === 'archived') {
        state.filters.status = DocumentStatus.Archived;
      } else {
        state.filters.status = undefined;
      }
    },

    setSelectedDocument: (state, action: PayloadAction<string | null>) => {
      state.selectedDocumentId = action.payload;
    },

    toggleVersionHistory: (state) => {
      state.showVersionHistory = !state.showVersionHistory;
    },

    setShowVersionHistory: (state, action: PayloadAction<boolean>) => {
      state.showVersionHistory = action.payload;
    },

    // Filter Actions
    setFilters: (state, action: PayloadAction<Partial<DocumentFilterDto>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    setStatusFilter: (state, action: PayloadAction<DocumentStatus | undefined>) => {
      state.filters.status = action.payload;
      state.filters.pageNumber = 1;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload || undefined;
      state.filters.pageNumber = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.filters.pageNumber = action.payload;
    },

    setSortBy: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },

    setCreatedByFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.createdBy = action.payload;
      state.filters.pageNumber = 1;
    },

    setTagsFilter: (state, action: PayloadAction<string[] | undefined>) => {
      state.filters.tags = action.payload;
      state.filters.pageNumber = 1;
    },

    // Editor Actions
    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
    },

    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },

    setLastSavedAt: (state, action: PayloadAction<string>) => {
      state.lastSavedAt = action.payload;
    },

    // Favorites Actions
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favoriteDocumentIds.includes(action.payload)) {
        state.favoriteDocumentIds.push(action.payload);
      }
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteDocumentIds = state.favoriteDocumentIds.filter(
        (id) => id !== action.payload
      );
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favoriteDocumentIds.indexOf(action.payload);
      if (index > -1) {
        state.favoriteDocumentIds.splice(index, 1);
      } else {
        state.favoriteDocumentIds.push(action.payload);
      }
    },
  },
});

export const {
  setViewMode,
  setActiveTab,
  setSelectedDocument,
  toggleVersionHistory,
  setShowVersionHistory,
  setFilters,
  resetFilters,
  setStatusFilter,
  setSearchTerm,
  setPage,
  setSortBy,
  setCreatedByFilter,
  setTagsFilter,
  toggleAutoSave,
  setAutoSave,
  setLastSavedAt,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} = documentsSlice.actions;

export default documentsSlice.reducer;
