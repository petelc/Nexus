import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token management utilities
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem('accessToken', token);
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  setRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token);
  },
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh and errors
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or we don't have an originalRequest, reject immediately
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // If we've already tried to refresh, reject
    if (originalRequest._retry) {
      tokenManager.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      tokenManager.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh token
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(newRefreshToken);

      // Update the original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      processQueue(null, accessToken);

      isRefreshing = false;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      isRefreshing = false;
      tokenManager.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
