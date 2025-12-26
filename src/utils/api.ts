/**
 * API Configuration and Utilities
 * 
 * Centralized API client for communicating with the Next.js backend.
 * Implements enterprise-grade error handling, request/response interceptors,
 * and type-safe API calls.
 * 
 * @module utils/api
 */

/**
 * API Configuration
 */
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API Response wrapper for type-safe responses
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request Options Interface
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Core API Client Class
 * 
 * Provides a robust, type-safe HTTP client with:
 * - Automatic timeout handling
 * - Consistent error handling
 * - Request/response transformation
 * - Bearer token authentication support
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private authToken: string | null = null;

  constructor(baseURL: string, defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build complete URL with base URL
   */
  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Build headers with authentication if available
   */
  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders as Record<string, string>,
      ...customHeaders as Record<string, string>,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Core request method with timeout support
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = this.buildURL(endpoint);
      const headers = this.buildHeaders(options.headers);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data
        );
      }

      return {
        data,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error', 0);
      }

      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Unknown error
      throw new ApiError('Unknown error occurred', 500);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Default API client instance
 */
export const api = new ApiClient(API_CONFIG.baseURL, API_CONFIG.headers);

/**
 * Example API Endpoints
 * 
 * Organize your API calls by domain for better maintainability
 */
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', userData),
  
  logout: () => api.post('/api/auth/logout'),
  
  refreshToken: () => api.post('/api/auth/refresh'),
};

export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  
  updateProfile: (data: Partial<{ name: string; email: string }>) =>
    api.patch('/api/user/profile', data),
};

/**
 * Example usage:
 * 
 * ```typescript
 * import { api, authAPI, ApiError } from './utils/api';
 * 
 * async function loginUser(email: string, password: string) {
 *   try {
 *     const response = await authAPI.login({ email, password });
 *     api.setAuthToken(response.data.token);
 *     return response.data;
 *   } catch (error) {
 *     if (error instanceof ApiError) {
 *       console.error('Login failed:', error.message, error.status);
 *     }
 *     throw error;
 *   }
 * }
 * ```
 */





