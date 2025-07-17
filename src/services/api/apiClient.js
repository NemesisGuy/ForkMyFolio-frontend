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
export async function fetchWithAuth(endpoint, options = {}, requiresAuth = true, isRetry = false, responseType = 'json') {
  // ... (headers and auth logic is unchanged)
  const headers = {...options.headers};

  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // --- KEY CHANGE ---
  // Always attach the token if the user is logged in (i.e., a token exists).
  // This allows the backend to identify the user even on public endpoints,
  // which is crucial for not incrementing view counters for the admin.
  // The `requiresAuth` flag is now primarily used to trigger the token
  // refresh logic on a 401 response for protected routes.
  if (authServiceInstance) {
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
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // --- RESTRUCTURED LOGIC ---
    // 1. Immediately handle 401 Unauthorized to attempt a token refresh.
    if (response.status === 401 && requiresAuth && !isRetry) {
      console.log('[ApiClient] Received 401. Attempting to refresh token...');
      try {
        await authServiceInstance.refreshToken();
        console.log('[ApiClient] Token refresh successful. Retrying original request...');
        // After a successful refresh, call this function again, marking it as a retry.
        return await fetchWithAuth(endpoint, options, requiresAuth, true, responseType);
      } catch (refreshError) {
        console.error('[ApiClient] Token refresh process failed, logging out.', refreshError);
        // If the refresh itself fails, the session is unrecoverable.
        authServiceInstance.logout();
        throw new ApiError(401, 'Your session has expired and could not be renewed. Please log in again.');
      }
    }

    // 2. Handle all other non-successful responses.
    if (!response.ok) {
      let errorData = {};
      try {
        // Try to parse the error response, but don't fail if it's empty.
        const errorText = await response.text();
        if (errorText) errorData = JSON.parse(errorText);
      } catch(e) {
        console.error("Could not parse error response body", e);
      }
      throw new ApiError(
        errorData.message || errorData.errors?.[0]?.message || `API request failed with HTTP status ${response.status}`,
        response.status,
        errorData.status || 'error',
        errorData.errors || []
      );
    }

    // 3. Handle file downloads (blob response) BEFORE trying to parse JSON.
    if (responseType === 'blob') {
      return response.blob();
    }

    // 4. Handle the success path for JSON.
    if (response.status === 204) return null; // No Content

    const responseText = await response.text();
    if (!responseText) return null; // Handle empty 200 OK

    const responseData = JSON.parse(responseText);

    // If the response is not in a structured format (e.g., JSend), return it directly.
    if (typeof responseData.status === 'undefined') {
      return responseData;
    }

    return responseData.data; // Assuming JSend-like { status: 'success', data: ... }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('A network or unexpected error occurred:', error);
    throw new ApiError('Network error. Please check your connection.', 0, 'network_error');
  }
}
