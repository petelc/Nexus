import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  DocumentDto,
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentFilterDto,
  PaginatedResultDto,
  DocumentVersionDto,
} from '@/types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Document', 'DocumentVersions', 'Workspace'],
  endpoints: (builder) => ({
    // Get all documents with filtering
    getDocuments: builder.query<PaginatedResultDto<DocumentDto>, DocumentFilterDto>({
      query: (filters) => ({
        url: '/documents',
        params: filters,
      }),
      transformResponse: (response: {
        data: DocumentDto[];
        pagination: {
          currentPage: number;
          pageSize: number;
          totalPages: number;
          totalItems: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }): PaginatedResultDto<DocumentDto> => ({
        items: response.data,
        totalCount: response.pagination.totalItems,
        pageNumber: response.pagination.currentPage,
        pageSize: response.pagination.pageSize,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage,
        hasPreviousPage: response.pagination.hasPreviousPage,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ documentId }) => ({ type: 'Document' as const, id: documentId })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    // Get document by ID
    getDocumentById: builder.query<DocumentDto, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id }],
    }),

    // Create document
    createDocument: builder.mutation<DocumentDto, CreateDocumentDto>({
      query: (document) => ({
        url: '/documents',
        method: 'POST',
        body: document,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }, { type: 'Workspace', id: 'LIST' }],
    }),

    // Update document
    updateDocument: builder.mutation<DocumentDto, { id: string; data: UpdateDocumentDto }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    // Delete document
    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Publish document
    publishDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    // Add tag to document
    addTagToDocument: builder.mutation<void, { id: string; tagName: string }>({
      query: ({ id, tagName }) => ({
        url: `/documents/${id}/tags`,
        method: 'POST',
        body: { tagName },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Document', id }],
    }),

    // Remove tag from document
    removeTagFromDocument: builder.mutation<void, { id: string; tagName: string }>({
      query: ({ id, tagName }) => ({
        url: `/documents/${id}/tags/${tagName}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Document', id }],
    }),

    // Get document versions
    getDocumentVersions: builder.query<DocumentVersionDto[], string>({
      query: (id) => `/documents/${id}/versions`,
      providesTags: (_result, _error, id) => [{ type: 'DocumentVersions', id }],
    }),

    // Get specific document version
    getDocumentVersion: builder.query<DocumentVersionDto, { id: string; versionNumber: number }>({
      query: ({ id, versionNumber }) => `/documents/${id}/versions/${versionNumber}`,
    }),

    // Restore document version
    restoreDocumentVersion: builder.mutation<DocumentDto, { id: string; versionNumber: number }>({
      query: ({ id, versionNumber }) => ({
        url: `/documents/${id}/versions/${versionNumber}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        { type: 'DocumentVersions', id },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  usePublishDocumentMutation,
  useAddTagToDocumentMutation,
  useRemoveTagFromDocumentMutation,
  useGetDocumentVersionsQuery,
  useGetDocumentVersionQuery,
  useRestoreDocumentVersionMutation,
} = documentsApi;
