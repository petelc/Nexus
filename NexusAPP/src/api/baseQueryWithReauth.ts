import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { tokenManager } from './apiClient';
import { logout } from '@features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers) => {
    const token = tokenManager.getAccessToken();
    console.log('[prepareHeaders] token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    tokenManager.setAccessToken(data.accessToken);
    tokenManager.setRefreshToken(data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Capture the token used for this request
  const tokenBeforeRequest = tokenManager.getAccessToken();

  let result = await rawBaseQuery(args, api, extraOptions);

  // Only attempt refresh on 401 Unauthorized (not 403 Forbidden)
  if (result.error && result.error.status === 401) {
    // Check if the token has changed since we made the request
    // (e.g., user re-logged in while this request was in flight)
    const currentToken = tokenManager.getAccessToken();
    if (currentToken && currentToken !== tokenBeforeRequest) {
      // Token changed — retry with the new token instead of refreshing
      result = await rawBaseQuery(args, api, extraOptions);
      return result;
    }

    // Ensure only one refresh at a time
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshTokens();
    }

    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      // Retry the original request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Before logging out, check if the token has changed again
      // (user may have re-logged in while refresh was in progress)
      const tokenAfterRefresh = tokenManager.getAccessToken();
      if (tokenAfterRefresh && tokenAfterRefresh !== tokenBeforeRequest) {
        // Token changed during refresh — retry instead of logging out
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Token hasn't changed and refresh failed — truly logged out
        api.dispatch(logout());
      }
    }
  }

  return result;
};
