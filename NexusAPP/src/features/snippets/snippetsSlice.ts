import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SnippetFilterDto } from '@/types/api.types';

export type SnippetViewMode = 'grid' | 'list';
export type SnippetTabType = 'my-snippets' | 'public' | 'favorites';

interface SnippetsState {
  // UI State
  viewMode: SnippetViewMode;
  activeTab: SnippetTabType;
  selectedSnippetId: string | null;

  // Filter State
  filters: SnippetFilterDto;

  // Editor State
  editorTheme: 'vs-dark' | 'vs-light';
  editorFontSize: number;
  editorWordWrap: boolean;

  // Preferences
  favoriteSnippetIds: string[];
}

const initialState: SnippetsState = {
  // UI State
  viewMode: 'grid',
  activeTab: 'my-snippets',
  selectedSnippetId: null,

  // Filter State
  filters: {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },

  // Editor State
  editorTheme: 'vs-dark',
  editorFontSize: 14,
  editorWordWrap: true,

  // Preferences
  favoriteSnippetIds: [],
};

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    // UI Actions
    setViewMode: (state, action: PayloadAction<SnippetViewMode>) => {
      state.viewMode = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<SnippetTabType>) => {
      state.activeTab = action.payload;
      // Reset filters when switching tabs
      state.filters.pageNumber = 1;
    },

    setSelectedSnippet: (state, action: PayloadAction<string | null>) => {
      state.selectedSnippetId = action.payload;
    },

    // Filter Actions
    setFilters: (state, action: PayloadAction<Partial<SnippetFilterDto>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    setLanguageFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.language = action.payload;
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

    // Editor Actions
    setEditorTheme: (state, action: PayloadAction<'vs-dark' | 'vs-light'>) => {
      state.editorTheme = action.payload;
    },

    setEditorFontSize: (state, action: PayloadAction<number>) => {
      state.editorFontSize = action.payload;
    },

    toggleEditorWordWrap: (state) => {
      state.editorWordWrap = !state.editorWordWrap;
    },

    // Favorites Actions
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favoriteSnippetIds.includes(action.payload)) {
        state.favoriteSnippetIds.push(action.payload);
      }
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteSnippetIds = state.favoriteSnippetIds.filter(
        (id) => id !== action.payload
      );
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favoriteSnippetIds.indexOf(action.payload);
      if (index > -1) {
        state.favoriteSnippetIds.splice(index, 1);
      } else {
        state.favoriteSnippetIds.push(action.payload);
      }
    },
  },
});

export const {
  setViewMode,
  setActiveTab,
  setSelectedSnippet,
  setFilters,
  resetFilters,
  setLanguageFilter,
  setSearchTerm,
  setPage,
  setSortBy,
  setEditorTheme,
  setEditorFontSize,
  toggleEditorWordWrap,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} = snippetsSlice.actions;

export default snippetsSlice.reducer;
