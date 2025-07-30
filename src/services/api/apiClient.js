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
 * @param {object} options - Fetch options (method, body, etc.). Can also include `responseType`.
 * @param {boolean} requiresAuth - Whether the endpoint requires an Authorization header.
 * @param {boolean} isRetry - Internal flag to prevent infinite refresh loops.
 * @returns {Promise<any>} The `data` property from the API response, a Blob, or the raw Response object.
 * @throws {ApiError} If the API returns a non-success status.
 */
export async function fetchWithAuth(
  endpoint,
  options = {},
  requiresAuth = true,
  isRetry = false
) {
  const { responseType = 'json', ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers || {});
  if (requiresAuth && authService?.getAccessToken()) {
    headers.append('Authorization', `Bearer ${authService.getAccessToken()}`);
  }

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const config = {
    ...fetchOptions,
    headers,
    credentials: 'include',
  };

  const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth && !isRetry) {
    try {
      await authService.refreshToken();
      return fetchWithAuth(endpoint, options, true, true);
    } catch (refreshError) {
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
      throw new ApiError(`HTTP error! Status: ${response.status}`, response.status);
    }
    throw new ApiError(
      errorData.errors?.[0]?.message || 'An unknown API error occurred.',
      response.status,
      errorData.errors || []
    );
  }

  // --- THIS IS THE FIX ---
  // Handle different response types based on the 'responseType' option.
  if (responseType === 'raw') {
    return response; // Return the entire Response object for manual handling.
  }

  if (responseType === 'blob') {
    return response.blob(); // Return the response body as a Blob.
  }
  // --- END OF FIX ---

  // Handle successful responses with no content.
  if (response.status === 204) {
    return null;
  }

  // Default to JSON parsing for all other successful responses.
  // Check if the response is JSON before parsing
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const responseData = await response.json();
    // Assuming a consistent API response structure: { status: "success", data: {...} }
    // or { status: "error", errors: [...] }
    if (responseData.status === 'success') {
      return responseData.data;
    } else {
      // If status is not 'success' but no HTTP error, it's an API-level error
      throw new ApiError(
        responseData.errors?.[0]?.message || 'API returned a non-success status.',
        response.status, // Use the actual HTTP status
        responseData.errors || []
      );
    }
  } else {
    // If not JSON, return the text or null if empty
    const text = await response.text();
    return text ? text : null;
  }

  const responseData = await response.json();
  if (responseData.status !== 'success') {
    throw new ApiError(
      responseData.errors?.[0]?.message || 'API returned a non-success status.',
      response.status,
      responseData.errors || []
    );
  }

  return responseData.data;
}
