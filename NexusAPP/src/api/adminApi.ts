import { createApi } from '@reduxjs/toolkit/query/react';
import { AdminUserDto, AdminUsersPagedDto, UpdateUserRolesRequest, UpdateUserStatusRequest } from '@/types';
import { baseQueryWithReauth } from '@api/baseQueryWithReauth';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminUser'],
  endpoints: (builder) => ({
    getUsers: builder.query<AdminUsersPagedDto, { page?: number; pageSize?: number; search?: string }>({
      query: ({ page = 1, pageSize = 20, search } = {}) => {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search) params.set('search', search);
        return `/admin/users?${params}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ userId }) => ({ type: 'AdminUser' as const, id: userId })),
              { type: 'AdminUser', id: 'LIST' },
            ]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),

    getUser: builder.query<AdminUserDto, string>({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'AdminUser', id: userId }],
    }),

    updateUserRoles: builder.mutation<AdminUserDto, { userId: string; body: UpdateUserRolesRequest }>({
      query: ({ userId, body }) => ({
        url: `/admin/users/${userId}/roles`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'AdminUser', id: userId },
        { type: 'AdminUser', id: 'LIST' },
      ],
    }),

    updateUserStatus: builder.mutation<AdminUserDto, { userId: string; body: UpdateUserStatusRequest }>({
      query: ({ userId, body }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'AdminUser', id: userId },
        { type: 'AdminUser', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRolesMutation,
  useUpdateUserStatusMutation,
} = adminApi;
