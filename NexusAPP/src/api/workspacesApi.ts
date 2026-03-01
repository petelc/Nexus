import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  WorkspaceDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  UserDto,
} from '@/types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export interface WorkspaceMemberDto {
  userId: string;
  user?: UserDto;
  role: WorkspaceRole;
  joinedAt: string;
}

export enum WorkspaceRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer',
}

export interface InviteWorkspaceMemberDto {
  email: string;
  role: WorkspaceRole;
}

export interface UpdateWorkspaceMemberRoleDto {
  role: WorkspaceRole;
}

export interface WorkspaceFilterDto {
  searchTerm?: string;
  teamId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WorkspaceWithMembersDto extends WorkspaceDto {
  members?: WorkspaceMemberDto[];
}

export const workspacesApi = createApi({
  reducerPath: 'workspacesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workspace', 'WorkspaceMember'],
  endpoints: (builder) => ({
    // Get current user's workspaces
    getMyWorkspaces: builder.query<WorkspaceDto[], WorkspaceFilterDto>({
      query: (filters) => ({
        url: '/workspaces/my',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ workspaceId }) => ({ type: 'Workspace' as const, id: workspaceId })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),

    // Get workspace by ID
    getWorkspaceById: builder.query<WorkspaceDto, string>({
      query: (id) => `/workspaces/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Workspace', id }],
    }),

    // Get workspace by ID with members
    getWorkspaceWithMembers: builder.query<WorkspaceWithMembersDto, string>({
      query: (id) => `/workspaces/${id}?includeMembers=true`,
      providesTags: (_result, _error, id) => [
        { type: 'Workspace', id },
        { type: 'WorkspaceMember', id },
      ],
    }),

    // Search workspaces
    searchWorkspaces: builder.query<WorkspaceDto[], { keyword: string; filters?: WorkspaceFilterDto }>({
      query: ({ keyword, filters }) => ({
        url: '/workspaces/search',
        params: { ...filters, keyword },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ workspaceId }) => ({ type: 'Workspace' as const, id: workspaceId })),
              { type: 'Workspace', id: 'SEARCH' },
            ]
          : [{ type: 'Workspace', id: 'SEARCH' }],
    }),

    // Get workspaces for a team
    getTeamWorkspaces: builder.query<WorkspaceDto[], string>({
      query: (teamId) => `/teams/${teamId}/workspaces`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ workspaceId }) => ({ type: 'Workspace' as const, id: workspaceId })),
              { type: 'Workspace', id: 'TEAM' },
            ]
          : [{ type: 'Workspace', id: 'TEAM' }],
    }),

    // Create workspace
    createWorkspace: builder.mutation<WorkspaceDto, CreateWorkspaceDto>({
      query: (data) => ({
        url: '/workspaces',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    // Update workspace
    updateWorkspace: builder.mutation<WorkspaceDto, { id: string; data: UpdateWorkspaceDto }>({
      query: ({ id, data }) => ({
        url: `/workspaces/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Delete workspace
    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Add member to workspace
    addWorkspaceMember: builder.mutation<void, { id: string; data: InviteWorkspaceMemberDto }>({
      query: ({ id, data }) => ({
        url: `/workspaces/${id}/members`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkspaceMember', id },
        { type: 'Workspace', id },
      ],
    }),

    // Remove member from workspace
    removeWorkspaceMember: builder.mutation<void, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/workspaces/${id}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkspaceMember', id },
        { type: 'Workspace', id },
      ],
    }),

    // Update member role
    updateWorkspaceMemberRole: builder.mutation<void, { id: string; userId: string; data: UpdateWorkspaceMemberRoleDto }>({
      query: ({ id, userId, data }) => ({
        url: `/workspaces/${id}/members/${userId}/role`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkspaceMember', id },
        { type: 'Workspace', id },
      ],
    }),
  }),
});

export const {
  useGetMyWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useGetWorkspaceWithMembersQuery,
  useSearchWorkspacesQuery,
  useGetTeamWorkspacesQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMemberRoleMutation,
} = workspacesApi;
