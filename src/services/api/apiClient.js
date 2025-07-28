import { ApiError } from './ApiError';

/**
 * @file src/services/api/apiClient.js
 * @description Centralized API client for making requests to the backend using the Fetch API.
 */

// This will be injected by initAuth.js to break the circular dependency.
let authService;

/**
 * Injects the authService into the apiClient.
 * @param {object} service - The authentication service.
 */
export function setAuthService(service) {
  authService = service;
}

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * A wrapper around the Fetch API that handles authentication, API response structure, and error handling.
 * @param {string} endpoint - The API endpoint to call (e.g., '/users').
 * @param {object} options - Fetch options (method, body, etc.).
 * @param {boolean} requiresAuth - Whether the endpoint requires an Authorization header.
 * @param {boolean} isRetry - Internal flag to prevent infinite refresh loops.
 * @param {string} responseType - The expected response type ('json' or 'blob').
 * @returns {Promise<any>} The `data` property from the API response.
 * @throws {ApiError} If the API returns a non-success status.
 */
export async function fetchWithAuth(
  endpoint,
  options = {},
  requiresAuth = true,
  isRetry = false,
  responseType = 'json'
) {
  const headers = new Headers(options.headers || {});
  if (requiresAuth && authService?.getAccessToken()) {
    headers.append('Authorization', `Bearer ${authService.getAccessToken()}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  const config = {
    ...options,
    headers,
    // --- THIS IS THE FIX ---
    // This is the native Fetch API equivalent of Axios' `withCredentials: true`.
    // It ensures that cookies (like the HttpOnly refresh token) are sent with each request.
    credentials: 'include',
  };

  const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth && !isRetry) {
    try {
      await authService.refreshToken();
      // After refreshing, retry the original request with the new token.
      return fetchWithAuth(endpoint, options, true, true, responseType);
    } catch (refreshError) {
      // If refresh fails, log the user out and redirect.
      authService.logout();
      window.location.href = '/login';
      throw new ApiError('Session expired. Please log in again.', 401, []);
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If the error response isn't valid JSON.
      throw new ApiError(`HTTP error! Status: ${response.status}`, response.status);
    }
    // Throw a structured error from the backend's response.
    throw new ApiError(
      errorData.errors?.[0]?.message || 'An unknown API error occurred.',
      response.status,
      errorData.errors || []
    );
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  // Handle successful responses with no content.
  if (response.status === 204) {
    return null;
  }

  const responseData = await response.json();
  // Ensure the backend's own status field is 'success'.
  if (responseData.status !== 'success') {
    throw new ApiError(
      responseData.errors?.[0]?.message || 'API returned a non-success status.',
      response.status,
      responseData.errors || []
    );
  }

  // Return the actual data payload.
  return responseData.data;
}
