import { createApi } from '@reduxjs/toolkit/query/react';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  RefreshTokenRequestDto,
  UserDto,
  TwoFactorSetupResponseDto,
} from '@/types';
import { baseQueryWithReauth } from '@api/baseQueryWithReauth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponseDto, LoginRequestDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Register
    register: builder.mutation<AuthResponseDto, RegisterRequestDto>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Refresh Token
    refreshToken: builder.mutation<AuthResponseDto, RefreshTokenRequestDto>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Get Current User
    getCurrentUser: builder.query<UserDto, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Confirm Email
    confirmEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (body) => ({
        url: '/auth/confirm-email',
        method: 'POST',
        body,
      }),
    }),

    // Setup 2FA
    setup2FA: builder.mutation<TwoFactorSetupResponseDto, void>({
      query: () => ({
        url: '/auth/2fa/setup',
        method: 'POST',
      }),
    }),

    // Verify 2FA
    verify2FA: builder.mutation<{ message: string }, { code: string }>({
      query: (body) => ({
        url: '/auth/2fa/verify',
        method: 'POST',
        body,
      }),
    }),

    // Disable 2FA
    disable2FA: builder.mutation<{ message: string }, { password: string }>({
      query: (body) => ({
        url: '/auth/2fa/disable',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirmEmailMutation,
  useSetup2FAMutation,
  useVerify2FAMutation,
  useDisable2FAMutation,
} = authApi;
