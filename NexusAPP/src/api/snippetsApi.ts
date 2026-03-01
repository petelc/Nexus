import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CodeSnippetDto,
  CreateCodeSnippetDto,
  UpdateCodeSnippetDto,
  SnippetFilterDto,
  PaginatedResultDto,
} from '@/types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const snippetsApi = createApi({
  reducerPath: 'snippetsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Snippet', 'PublicSnippets', 'Workspace'],
  endpoints: (builder) => ({
    // Get current user's snippets with filtering
    getSnippets: builder.query<PaginatedResultDto<CodeSnippetDto>, SnippetFilterDto>({
      query: (filters) => ({
        url: '/snippets/my',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ snippetId }) => ({ type: 'Snippet' as const, id: snippetId })),
              { type: 'Snippet', id: 'LIST' },
            ]
          : [{ type: 'Snippet', id: 'LIST' }],
    }),

    // Get public snippets
    getPublicSnippets: builder.query<PaginatedResultDto<CodeSnippetDto>, SnippetFilterDto>({
      query: (filters) => ({
        url: '/snippets/public',
        params: filters,
      }),
      providesTags: ['PublicSnippets'],
    }),

    // Get snippet by ID
    getSnippetById: builder.query<CodeSnippetDto, string>({
      query: (id) => `/snippets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Snippet', id }],
    }),

    // Create snippet
    createSnippet: builder.mutation<CodeSnippetDto, CreateCodeSnippetDto>({
      query: (snippet) => ({
        url: '/snippets',
        method: 'POST',
        body: snippet,
      }),
      invalidatesTags: [{ type: 'Snippet', id: 'LIST' }, { type: 'Workspace', id: 'LIST' }],
    }),

    // Update snippet
    updateSnippet: builder.mutation<CodeSnippetDto, { id: string; data: UpdateCodeSnippetDto }>({
      query: ({ id, data }) => ({
        url: `/snippets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Snippet', id },
        { type: 'Snippet', id: 'LIST' },
      ],
    }),

    // Delete snippet
    deleteSnippet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/snippets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Snippet', id },
        { type: 'Snippet', id: 'LIST' },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Fork snippet
    forkSnippet: builder.mutation<CodeSnippetDto, string>({
      query: (id) => ({
        url: `/snippets/${id}/fork`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Snippet', id: 'LIST' }],
    }),

    // Get snippets by language
    getSnippetsByLanguage: builder.query<PaginatedResultDto<CodeSnippetDto>, { language: string; filters?: SnippetFilterDto }>({
      query: ({ language, filters }) => ({
        url: `/snippets/by-language/${language}`,
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ snippetId }) => ({ type: 'Snippet' as const, id: snippetId })),
              { type: 'Snippet', id: 'LIST' },
            ]
          : [{ type: 'Snippet', id: 'LIST' }],
    }),

    // Search snippets
    searchSnippets: builder.query<PaginatedResultDto<CodeSnippetDto>, { keyword: string; filters?: SnippetFilterDto }>({
      query: ({ keyword, filters }) => ({
        url: '/snippets/search',
        params: { ...filters, keyword },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ snippetId }) => ({ type: 'Snippet' as const, id: snippetId })),
              { type: 'Snippet', id: 'LIST' },
            ]
          : [{ type: 'Snippet', id: 'LIST' }],
    }),

    // Get snippets by tag
    getSnippetsByTag: builder.query<PaginatedResultDto<CodeSnippetDto>, { tagName: string; filters?: SnippetFilterDto }>({
      query: ({ tagName, filters }) => ({
        url: `/snippets/by-tag/${tagName}`,
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ snippetId }) => ({ type: 'Snippet' as const, id: snippetId })),
              { type: 'Snippet', id: 'LIST' },
            ]
          : [{ type: 'Snippet', id: 'LIST' }],
    }),

    // Publish snippet (make public)
    publishSnippet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/snippets/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Snippet', id },
        { type: 'Snippet', id: 'LIST' },
        'PublicSnippets',
      ],
    }),

    // Unpublish snippet (make private)
    unpublishSnippet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/snippets/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Snippet', id },
        { type: 'Snippet', id: 'LIST' },
        'PublicSnippets',
      ],
    }),
  }),
});

export const {
  useGetSnippetsQuery,
  useGetPublicSnippetsQuery,
  useGetSnippetByIdQuery,
  useCreateSnippetMutation,
  useUpdateSnippetMutation,
  useDeleteSnippetMutation,
  useForkSnippetMutation,
  useGetSnippetsByLanguageQuery,
  useSearchSnippetsQuery,
  useGetSnippetsByTagQuery,
  usePublishSnippetMutation,
  useUnpublishSnippetMutation,
} = snippetsApi;
