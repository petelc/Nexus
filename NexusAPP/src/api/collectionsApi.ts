import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  CollectionDto,
  CollectionSummaryDto,
  CollectionItemDto,
  CreateCollectionDto,
  UpdateCollectionDto,
  AddItemToCollectionDto,
  ReorderCollectionItemDto,
} from '@types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

// Backend wraps list responses in envelope objects
interface CollectionsListResponse { collections: CollectionSummaryDto[] }
interface CollectionDetailResponse { collection: CollectionDto }
interface BreadcrumbResponse { breadcrumb: CollectionSummaryDto[] }
interface CreateCollectionResponse { collection: CollectionDto }
interface UpdateCollectionResponse { collection: CollectionDto }

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Collection', 'CollectionItem'],
  endpoints: (builder) => ({
    // GET /workspaces/{workspaceId}/collections/roots → { collections: CollectionSummaryDto[] }
    getRootCollections: builder.query<CollectionSummaryDto[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/collections/roots`,
      transformResponse: (res: CollectionsListResponse) => res.collections,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ collectionId }) => ({ type: 'Collection' as const, id: collectionId })),
              { type: 'Collection', id: 'ROOTS' },
            ]
          : [{ type: 'Collection', id: 'ROOTS' }],
    }),

    // GET /collections/{id} → { collection: CollectionDto }
    getCollectionById: builder.query<CollectionDto, string>({
      query: (id) => ({ url: `/collections/${id}`, params: { includeItems: true } }),
      transformResponse: (res: CollectionDetailResponse) => res.collection,
      providesTags: (_result, _error, id) => [{ type: 'Collection', id }],
    }),

    // GET /collections/{parentId}/children → { collections: CollectionSummaryDto[] }
    getChildCollections: builder.query<CollectionSummaryDto[], string>({
      query: (parentId) => `/collections/${parentId}/children`,
      transformResponse: (res: CollectionsListResponse) => res.collections,
      providesTags: (result, _error, parentId) =>
        result
          ? [
              ...result.map(({ collectionId }) => ({ type: 'Collection' as const, id: collectionId })),
              { type: 'Collection', id: `CHILDREN_${parentId}` },
            ]
          : [{ type: 'Collection', id: `CHILDREN_${parentId}` }],
    }),

    // GET /collections/{id}/breadcrumb → { breadcrumb: CollectionSummaryDto[] }
    getCollectionBreadcrumb: builder.query<CollectionSummaryDto[], string>({
      query: (id) => `/collections/${id}/breadcrumb`,
      transformResponse: (res: BreadcrumbResponse) => res.breadcrumb,
      providesTags: (_result, _error, id) => [{ type: 'Collection', id: `BREADCRUMB_${id}` }],
    }),

    // GET /workspaces/{workspaceId}/collections/search → { collections: CollectionSummaryDto[] }
    searchCollections: builder.query<CollectionSummaryDto[], { workspaceId: string; keyword: string }>({
      query: ({ workspaceId, keyword }) => ({
        url: `/workspaces/${workspaceId}/collections/search`,
        params: { keyword },
      }),
      transformResponse: (res: CollectionsListResponse) => res.collections,
      providesTags: [{ type: 'Collection', id: 'SEARCH' }],
    }),

    // POST /collections
    createCollection: builder.mutation<CreateCollectionResponse, CreateCollectionDto>({
      query: (data) => ({
        url: '/collections',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Collection', id: 'ROOTS' },
        { type: 'Collection', id: 'SEARCH' },
      ],
    }),

    // PUT /collections/{id}
    updateCollection: builder.mutation<UpdateCollectionResponse, { id: string; data: UpdateCollectionDto }>({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Collection', id },
        { type: 'Collection', id: 'ROOTS' },
      ],
    }),

    // DELETE /collections/{id}
    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Collection', id },
        { type: 'Collection', id: 'ROOTS' },
      ],
    }),

    // POST /collections/{collectionId}/items
    addItemToCollection: builder.mutation<CollectionItemDto, { collectionId: string; data: AddItemToCollectionDto }>({
      query: ({ collectionId, data }) => ({
        url: `/collections/${collectionId}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { collectionId }) => [
        { type: 'Collection', id: collectionId },
        { type: 'CollectionItem', id: collectionId },
      ],
    }),

    // DELETE /collections/{collectionId}/items/{itemReferenceId}
    removeItemFromCollection: builder.mutation<void, { collectionId: string; itemReferenceId: string }>({
      query: ({ collectionId, itemReferenceId }) => ({
        url: `/collections/${collectionId}/items/${itemReferenceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { collectionId }) => [
        { type: 'Collection', id: collectionId },
        { type: 'CollectionItem', id: collectionId },
      ],
    }),

    // PUT /collections/{collectionId}/items/{itemReferenceId}/order
    reorderCollectionItem: builder.mutation<void, { collectionId: string; itemReferenceId: string; data: ReorderCollectionItemDto }>({
      query: ({ collectionId, itemReferenceId, data }) => ({
        url: `/collections/${collectionId}/items/${itemReferenceId}/order`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { collectionId }) => [
        { type: 'Collection', id: collectionId },
      ],
    }),
  }),
});

export const {
  useGetRootCollectionsQuery,
  useGetCollectionByIdQuery,
  useGetChildCollectionsQuery,
  useGetCollectionBreadcrumbQuery,
  useSearchCollectionsQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddItemToCollectionMutation,
  useRemoveItemFromCollectionMutation,
  useReorderCollectionItemMutation,
} = collectionsApi;
