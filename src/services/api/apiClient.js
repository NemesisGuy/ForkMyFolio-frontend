/**
 * @file src/services/api/apiClient.js
 * @description Contains the core API client logic, including the fetch wrapper and error handling.
 */

// This will be injected by authService.js to avoid circular dependencies.
let authServiceInstance;
export const VUE_APP_API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Injects the authService instance.
 * @param {object} service - The authService instance.
 */
export function setAuthService(service) {
  authServiceInstance = service;
}

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(message, httpStatus, apiStatus, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.apiStatus = apiStatus;
    this.errors = errors;
  }
}

/**
 * The core fetch wrapper.
 * @param {string} endpoint - The API endpoint (e.g., '/users/me/profile').
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication.
 * @returns {Promise<any>} The response data.
 * @throws {ApiError}
 */
export async function fetchWithAuth(endpoint, options = {}, requiresAuth = true) {
  const headers = {...options.headers};

  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth && authServiceInstance) {
    const token = authServiceInstance.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include' // Crucial for sending HttpOnly cookies
  };

  if (fetchOptions.body && typeof fetchOptions.body !== 'string' && !(fetchOptions.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const response = await fetch(`${VUE_APP_API_BASE_URL}${endpoint}`, fetchOptions);

    if (response.status === 204) {
      return null;
    }

    const responseText = await response.text();
    if (!responseText && response.ok) {
      return null;
    }

    // --- ENHANCEMENT: Safely parse JSON ---
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, throw a specific error.
      console.error('Failed to parse JSON response:', responseText);
      throw new ApiError('Invalid response format from server.', response.status, 'parse_error');
    }
    // --- END ENHANCEMENT ---

    if (!response.ok) {
      // Handle 401 Unauthorized with token refresh
      if (response.status === 401 && requiresAuth && authServiceInstance && endpoint !== '/auth/refresh-token') {
        const refreshSuccess = await authServiceInstance.refreshToken();
        if (refreshSuccess) {
          // Retry the original request with the new token
          return fetchWithAuth(endpoint, options, requiresAuth);
        }
      }
      throw new ApiError(
        responseData.errors?.[0]?.message || `API request failed with HTTP status ${response.status}`,
        response.status,
        responseData.status || 'error',
        responseData.errors || []
      );
    }

    // Handle successful responses that are not in the standard wrapper
    if (response.ok && responseData && typeof responseData.status === 'undefined') {
      return responseData;
    }

    // Handle standard success wrapper
    if (responseData.status === 'success') {
      return responseData.data;
    } else {
      // Handle cases where HTTP is 200 but API status is an error
      throw new ApiError(
        responseData.errors?.[0]?.message || 'API operation failed despite HTTP OK.',
        response.status,
        responseData.status || 'api_logic_error',
        responseData.errors || []
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw known API errors
    }
    // Wrap network or other unexpected errors
    console.error('A network or unexpected error occurred:', error);
    throw new ApiError('Network error. Please check your connection.', 0, 'network_error');
  }
}
