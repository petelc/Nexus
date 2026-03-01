import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  DiagramDto,
  DiagramPagedResultDto,
  DiagramFilterDto,
  CreateDiagramRequest,
  UpdateDiagramRequest,
  DiagramElementDto,
  AddElementRequest,
  UpdateElementRequest,
  DiagramConnectionDto,
  AddConnectionRequest,
  UpdateConnectionRequest,
  LayerDto,
  AddLayerRequest,
  UpdateLayerRequest,
} from '@/types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const diagramsApi = createApi({
  reducerPath: 'diagramsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Diagram', 'Workspace'],
  endpoints: (builder) => ({
    // Get current user's diagrams
    getDiagrams: builder.query<DiagramPagedResultDto, DiagramFilterDto>({
      query: (filters) => ({
        url: '/diagrams/my',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ diagramId }) => ({ type: 'Diagram' as const, id: diagramId })),
              { type: 'Diagram', id: 'LIST' },
            ]
          : [{ type: 'Diagram', id: 'LIST' }],
    }),

    // Get diagram by ID (full detail)
    getDiagramById: builder.query<DiagramDto, string>({
      query: (id) => `/diagrams/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Diagram', id }],
    }),

    // Create diagram
    createDiagram: builder.mutation<DiagramDto, CreateDiagramRequest>({
      query: (data) => ({
        url: '/diagrams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Diagram', id: 'LIST' }, { type: 'Workspace', id: 'LIST' }],
    }),

    // Update diagram title/canvas
    updateDiagram: builder.mutation<DiagramDto, { id: string; data: UpdateDiagramRequest }>({
      query: ({ id, data }) => ({
        url: `/diagrams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Diagram', id },
        { type: 'Diagram', id: 'LIST' },
      ],
    }),

    // Delete diagram
    deleteDiagram: builder.mutation<void, string>({
      query: (id) => ({
        url: `/diagrams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Diagram', id },
        { type: 'Diagram', id: 'LIST' },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Add element to diagram
    addElement: builder.mutation<DiagramElementDto, { diagramId: string; data: AddElementRequest }>({
      query: ({ diagramId, data }) => ({
        url: `/diagrams/${diagramId}/elements`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Update element
    updateElement: builder.mutation<DiagramElementDto, { diagramId: string; elementId: string; data: UpdateElementRequest }>({
      query: ({ diagramId, elementId, data }) => ({
        url: `/diagrams/${diagramId}/elements/${elementId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Delete element
    deleteElement: builder.mutation<void, { diagramId: string; elementId: string }>({
      query: ({ diagramId, elementId }) => ({
        url: `/diagrams/${diagramId}/elements/${elementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Add connection
    addConnection: builder.mutation<DiagramConnectionDto, { diagramId: string; data: AddConnectionRequest }>({
      query: ({ diagramId, data }) => ({
        url: `/diagrams/${diagramId}/connections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Update connection
    updateConnection: builder.mutation<DiagramConnectionDto, { diagramId: string; connectionId: string; data: UpdateConnectionRequest }>({
      query: ({ diagramId, connectionId, data }) => ({
        url: `/diagrams/${diagramId}/connections/${connectionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Delete connection
    deleteConnection: builder.mutation<void, { diagramId: string; connectionId: string }>({
      query: ({ diagramId, connectionId }) => ({
        url: `/diagrams/${diagramId}/connections/${connectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Add layer
    addLayer: builder.mutation<LayerDto, { diagramId: string; data: AddLayerRequest }>({
      query: ({ diagramId, data }) => ({
        url: `/diagrams/${diagramId}/layers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Update layer
    updateLayer: builder.mutation<LayerDto, { diagramId: string; layerId: string; data: UpdateLayerRequest }>({
      query: ({ diagramId, layerId, data }) => ({
        url: `/diagrams/${diagramId}/layers/${layerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),

    // Delete layer
    deleteLayer: builder.mutation<void, { diagramId: string; layerId: string }>({
      query: ({ diagramId, layerId }) => ({
        url: `/diagrams/${diagramId}/layers/${layerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { diagramId }) => [{ type: 'Diagram', id: diagramId }],
    }),
  }),
});

export const {
  useGetDiagramsQuery,
  useGetDiagramByIdQuery,
  useCreateDiagramMutation,
  useUpdateDiagramMutation,
  useDeleteDiagramMutation,
  useAddElementMutation,
  useUpdateElementMutation,
  useDeleteElementMutation,
  useAddConnectionMutation,
  useUpdateConnectionMutation,
  useDeleteConnectionMutation,
  useAddLayerMutation,
  useUpdateLayerMutation,
  useDeleteLayerMutation,
} = diagramsApi;
