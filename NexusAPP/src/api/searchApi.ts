import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export interface SearchResult {
  type: string; // 'Document' | 'Diagram' | 'CodeSnippet'
  id: string;
  title: string;
  excerpt: string;
  score: number;
  highlights: string[];
  createdBy: { username: string };
  createdAt: string;
  links: { self: string };
}

export interface SearchFacets {
  types: Record<string, number>;
  tags: Record<string, number>;
}

export interface SearchPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  pagination: SearchPagination;
  facets: SearchFacets;
}

export interface SearchParams {
  query: string;
  types?: string; // comma-separated: "document,diagram,snippet"
  page?: number;
  pageSize?: number;
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchParams>({
      query: ({ query, types, page = 1, pageSize = 20 }) => {
        const params = new URLSearchParams({ query, page: String(page), pageSize: String(pageSize) });
        if (types) params.set('types', types);
        return `search?${params.toString()}`;
      },
    }),
  }),
});

export const { useSearchQuery } = searchApi;
