/**
 * @file src/services/api/apiClient.js
 * @description Contains the core API client logic, including the fetch wrapper and error handling.
 */

// This will be injected by authService.js to avoid circular dependencies.
let authServiceInstance;

// --- KEY CHANGE: Read the Base URL from Environment Variables ---
// We no longer hardcode the URL. Vite replaces `import.meta.env.VITE_API_BASE_URL`
// with the actual value at build time.
const API_BASE_URL = window.runtimeConfig.API_BASE_URL.startsWith('##')
  ? 'http://localhost:8080/api/v1' // Fallback for local dev
  : window.runtimeConfig.API_BASE_URL;
// It's good practice to throw an error if the URL is not configured.
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not configured.");
}

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
  // ... (rest of the class is unchanged)
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
 */
export async function fetchWithAuth(endpoint, options = {}, requiresAuth = true) {
  // ... (headers and auth logic is unchanged)
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
    credentials: 'include'
  };

  if (fetchOptions.body && typeof fetchOptions.body !== 'string' && !(fetchOptions.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    // --- KEY CHANGE: Use the new configurable base URL ---
   // const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);


    // ... (the rest of the function remains exactly the same)
    if (response.status === 204) {
      return null;
    }

    const responseText = await response.text();
    if (!responseText && response.ok) {
      return null;
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', responseText);
      throw new ApiError('Invalid response format from server.', response.status, 'parse_error');
    }

    if (!response.ok) {
      if (response.status === 401 && requiresAuth && authServiceInstance && endpoint !== '/auth/refresh-token') {
        const refreshSuccess = await authServiceInstance.refreshToken();
        if (refreshSuccess) {
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

    if (response.ok && responseData && typeof responseData.status === 'undefined') {
      return responseData;
    }

    if (responseData.status === 'success') {
      return responseData.data;
    } else {
      throw new ApiError(
        responseData.errors?.[0]?.message || 'API operation failed despite HTTP OK.',
        response.status,
        responseData.status || 'api_logic_error',
        responseData.errors || []
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('A network or unexpected error occurred:', error);
    throw new ApiError('Network error. Please check your connection.', 0, 'network_error');
  }
}
