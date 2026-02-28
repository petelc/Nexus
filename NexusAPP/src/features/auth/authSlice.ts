import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto, AuthResponseDto } from '@/types';
import { tokenManager } from '@api/apiClient';

interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: tokenManager.getAccessToken(),
  refreshToken: tokenManager.getRefreshToken(),
  isAuthenticated: !!tokenManager.getAccessToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponseDto>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Persist tokens
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
    },

    updateUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear tokens
      tokenManager.clearTokens();
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setAuthLoading,
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
