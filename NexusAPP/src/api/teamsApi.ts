import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  TeamDto,
  TeamMemberDto,
  TeamRole,
  CreateTeamDto,
  InviteTeamMemberDto,
  PaginatedResultDto,
} from '@types/api.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export interface UpdateTeamDto {
  name?: string;
  description?: string;
}

export interface UpdateTeamMemberRoleDto {
  role: TeamRole;
}

export interface TeamFilterDto {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TeamWithMembers extends TeamDto {
  members: TeamMemberDto[];
}

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Team', 'TeamMember'],
  endpoints: (builder) => ({
    // Get current user's teams
    getMyTeams: builder.query<TeamDto[], void>({
      query: () => '/teams/my',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Team' as const, id })),
              { type: 'Team', id: 'LIST' },
            ]
          : [{ type: 'Team', id: 'LIST' }],
    }),

    // Get team by ID
    getTeamById: builder.query<TeamDto, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    // Get team with members
    getTeamWithMembers: builder.query<TeamWithMembers, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Team', id },
        { type: 'TeamMember', id },
      ],
    }),

    // Search teams
    searchTeams: builder.query<PaginatedResultDto<TeamDto>, { keyword: string; filters?: TeamFilterDto }>({
      query: ({ keyword, filters }) => ({
        url: '/teams/search',
        params: { ...filters, keyword },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Team' as const, id })),
              { type: 'Team', id: 'SEARCH' },
            ]
          : [{ type: 'Team', id: 'SEARCH' }],
    }),

    // Create team
    createTeam: builder.mutation<TeamDto, CreateTeamDto>({
      query: (data) => ({
        url: '/teams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }],
    }),

    // Update team
    updateTeam: builder.mutation<TeamDto, { id: string; data: UpdateTeamDto }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Team', id },
        { type: 'Team', id: 'LIST' },
      ],
    }),

    // Delete team
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Team', id },
        { type: 'Team', id: 'LIST' },
      ],
    }),

    // Add member to team
    addTeamMember: builder.mutation<void, { id: string; data: InviteTeamMemberDto }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}/members`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TeamMember', id },
        { type: 'Team', id },
      ],
    }),

    // Remove member from team
    removeTeamMember: builder.mutation<void, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/teams/${id}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TeamMember', id },
        { type: 'Team', id },
      ],
    }),

    // Update member role
    updateTeamMemberRole: builder.mutation<void, { id: string; userId: string; data: UpdateTeamMemberRoleDto }>({
      query: ({ id, userId, data }) => ({
        url: `/teams/${id}/members/${userId}/role`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TeamMember', id },
        { type: 'Team', id },
      ],
    }),
  }),
});

export const {
  useGetMyTeamsQuery,
  useGetTeamByIdQuery,
  useGetTeamWithMembersQuery,
  useSearchTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useUpdateTeamMemberRoleMutation,
} = teamsApi;
