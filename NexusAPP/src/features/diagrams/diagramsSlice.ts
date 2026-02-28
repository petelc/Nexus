import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DiagramFilterDto, DiagramType } from '@/types/api.types';

export type DiagramViewMode = 'grid' | 'list';

interface DiagramsState {
  viewMode: DiagramViewMode;
  filters: DiagramFilterDto;
  favoriteDiagramIds: string[];
}

const initialState: DiagramsState = {
  viewMode: 'grid',
  filters: {
    page: 1,
    pageSize: 20,
  },
  favoriteDiagramIds: [],
};

const diagramsSlice = createSlice({
  name: 'diagrams',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<DiagramViewMode>) => {
      state.viewMode = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<DiagramFilterDto>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload || undefined;
      state.filters.page = 1;
    },

    setDiagramTypeFilter: (state, action: PayloadAction<DiagramType | undefined>) => {
      state.filters.diagramType = action.payload;
      state.filters.page = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favoriteDiagramIds.indexOf(action.payload);
      if (index > -1) {
        state.favoriteDiagramIds.splice(index, 1);
      } else {
        state.favoriteDiagramIds.push(action.payload);
      }
    },
  },
});

export const {
  setViewMode,
  setFilters,
  setSearchTerm,
  setDiagramTypeFilter,
  setPage,
  resetFilters,
  toggleFavorite,
} = diagramsSlice.actions;

export default diagramsSlice.reducer;
