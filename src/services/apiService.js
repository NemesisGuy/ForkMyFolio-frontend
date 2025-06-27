/**
 * @file src/services/apiService.js
 * @description Centralized API service for interacting with the backend.
 * Includes a fetch wrapper with authentication, token refresh logic,
 * and consistent response/error handling for the ApiResponseWrapper.
 */

// Import authService dynamically to avoid circular dependencies if apiService is imported by authService for API calls.
// This is a common pattern: authService will set a callback or provide a getter for the token.
let authServiceInstance;
/*
export const VUE_APP_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
*/
/*
export const VUE_APP_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
*/

export const VUE_APP_API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8080/api/v1';



/**
 * Sets the authService instance for dependency injection.
 * This allows apiService to access authentication tokens and refresh logic
 * without creating circular dependencies.
 * @param {object} service - The authService instance.
 */
export function setAuthService(service) {
  authServiceInstance = service;
}

/**
 * Custom error class for API errors.
 * Contains structured error information from ApiResponseWrapper.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Overall error message.
   * @param {string|number} httpStatus - HTTP status code.
   * @param {string} apiStatus - The 'status' field from ApiResponseWrapper (e.g., "validation_failed").
   * @param {Array<object>} [errors=[]] - Array of specific field errors or general errors from ApiResponseWrapper.
   */
  constructor(message, httpStatus, apiStatus, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.apiStatus = apiStatus;
    this.errors = errors; // [{ field: string, message: string }]
  }
}

/**
 * A wrapper around the native fetch function to handle common API interaction patterns.
 * - Adds Authorization header for authenticated requests.
 * - Implements access token refresh logic on 401 errors.
 * - Parses the standard ApiResponseWrapper.
 *
 * @param {string} endpoint - The API endpoint (e.g., '/users/me/profile').
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication. Defaults to true.
 * @returns {Promise<any>} A promise that resolves with the 'data' field from ApiResponseWrapper on success.
 * @throws {ApiError} If the API returns an error status or network error occurs.
 */
async function fetchWithAuth(endpoint, options = {}, requiresAuth = true) {
  const headers = { ...options.headers };
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth && authServiceInstance) {
    const token = authServiceInstance.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`[ApiService] fetchWithAuth: Added Bearer token for ${endpoint}.`);
    } else if (endpoint !== '/auth/refresh-token') { // Don't error if no token for refresh itself
      console.warn(`[ApiService] fetchWithAuth: Auth required for ${endpoint}, but no access token found. Proceeding, expect 401 or public access.`);
    } else {
      console.log(`[ApiService] fetchWithAuth: No token needed or available for ${endpoint} (refresh token call).`);
    }
  } else if (requiresAuth && !authServiceInstance) {
    console.error('[ApiService] fetchWithAuth: authServiceInstance is not set, cannot perform authenticated request.');
    // Potentially throw an error here or handle as unauthenticated
  }


  const fetchOptions = { ...options, headers };
  if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(`${VUE_APP_API_BASE_URL}${endpoint}`, fetchOptions);
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new ApiError('Network error. Please check your connection.', 0, 'network_error', [{ field: 'general', message: networkError.message }]);
  }

  let responseDataWrapper;
  try {
    if (response.status === 204) { // No Content
      responseDataWrapper = { status: 'success', data: null, errors: [] };
    } else {
      responseDataWrapper = await response.json();
    }
  } catch (jsonError) {
    console.error('Error parsing JSON response:', jsonError, 'for status:', response.status);
    throw new ApiError(`Invalid JSON response from server (HTTP ${response.status}).`, response.status, 'json_parse_error', [{ field: 'general', message: 'Server returned non-JSON response.' }]);
  }

  if (!response.ok) { // HTTP status is not 2xx
    console.log(`[ApiService] fetchWithAuth: Request to ${endpoint} failed with HTTP status ${response.status}. Response Body:`, responseDataWrapper);
    if (response.status === 401 && requiresAuth && authServiceInstance && endpoint !== '/auth/refresh-token') {
      console.log(`[ApiService] fetchWithAuth: Received 401 for ${endpoint}. Attempting token refresh.`);
      try {
        // console.log('Access token expired or invalid. Attempting refresh...'); // Old log
        const refreshSuccess = await authServiceInstance.refreshToken();
        if (refreshSuccess) {
          console.log(`[ApiService] fetchWithAuth: Token refreshed successfully for ${endpoint}. Retrying original request...`);
          // Update headers with new token for the retry
          // Ensure new token is actually fetched and logged for debugging
          const newToken = authServiceInstance.getAccessToken();
          if (!newToken) {
            console.error(`[ApiService] fetchWithAuth: New token is null after successful refresh for ${endpoint}. This should not happen.`);
            // Fall through to logout or throw specific error
            authServiceInstance.logout(); // Logout as state is inconsistent
            throw new ApiError('Session error after refresh. Please login again.', 401, 'token_refresh_missing_new_token');
          }
          fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
          // Perform the original request again
          // IMPORTANT: This simple retry doesn't handle FormData correctly if it was consumed.
          // For FormData, a more complex retry or pre-request cloning is needed.
          // Assuming JSON bodies for now for simplicity of retry.
          const retryResponse = await fetch(`${VUE_APP_API_BASE_URL}${endpoint}`, fetchOptions);
          if (retryResponse.status === 204) {
             return null; // Or some other indicator of success for 204
          }
          const retryDataWrapper = await retryResponse.json();
          if (!retryResponse.ok) {
             // Refresh worked but retry still failed. Throw based on retry's error.
             throw new ApiError(
              retryDataWrapper.errors?.[0]?.message || `API error after retry (HTTP ${retryResponse.status})`,
              retryResponse.status,
              retryDataWrapper.status || 'error_after_retry',
              retryDataWrapper.errors || []
            );
          }
          if (retryDataWrapper.status === 'success') {
            return retryDataWrapper.data;
          } else {
            // Refresh worked, retry was HTTP OK, but API wrapper status is error.
             throw new ApiError(
              retryDataWrapper.errors?.[0]?.message || 'API operation failed after retry.',
              retryResponse.status, // Should be 2xx here
              retryDataWrapper.status || 'api_error_after_retry',
              retryDataWrapper.errors || []
            );
          }
        } else {
          // Refresh token failed
          console.log(`[ApiService] fetchWithAuth: Token refresh failed for ${endpoint}. Logging out.`);
          // authServiceInstance.logout(); // This is now awaited in refreshToken's catch block or if refreshSuccess is false here
          // The refreshToken function itself now handles logout if it returns false.
          // If logout() was not awaited in refreshToken, we would need it here.
          // Given refreshToken's structure, it should have already called logout.
          // We just need to throw the error.
          throw new ApiError('Session expired. Please login again.', 401, 'token_refresh_failed', responseDataWrapper?.errors || []);
        }
      } catch (refreshError) {
        // Catch errors from refreshToken() itself or the logout process if it threw an error
        console.error(`[ApiService] fetchWithAuth: Error during token refresh process for ${endpoint}:`, refreshError);
        // Ensure logout if refreshError implies session is unrecoverable
        // (e.g., if refreshError isn't an ApiError that already caused logout)
        // authService.refreshToken() is designed to call logout(false) internally on its own failure path
        // and then return false, which is handled above.
        // This catch block is more for truly unexpected errors from within refreshToken()
        // or if refreshToken() re-throws an error that wasn't an ApiError causing logout.

        if (!(refreshError instanceof ApiError)) {
            console.error('[ApiService] fetchWithAuth: Uncaught error during refresh process, ensuring logout and wrapping error.', refreshError);
            await authServiceInstance.logout(); // Ensure logout is awaited
            throw new ApiError('Session refresh failed due to an unexpected error. Please login again.', 401, 'token_refresh_unexpected_exception', [{ field: 'general', message: refreshError.message }]);
        }
        // If it's already an ApiError (e.g., one that might have been thrown by logout() itself if called within refreshToken), re-throw.
        throw refreshError;
      }
    }
    // For non-401 errors, or 401s that shouldn't trigger refresh (e.g. /auth/refresh-token itself failing with 401)
    throw new ApiError(
      responseDataWrapper.errors?.[0]?.message || `API request failed with HTTP status ${response.status}`,
      response.status,
      responseDataWrapper.status || 'error',
      responseDataWrapper.errors || []
    );
  }

  // HTTP status is OK (2xx)
  if (responseDataWrapper.status === 'success') {
    return responseDataWrapper.data;
  } else {
    // HTTP OK, but API wrapper indicates an error (e.g. validation failure returned with 200 OK but status: "validation_failed")
    // This case might be unusual if backend strictly uses HTTP status codes for errors.
    // However, the ApiResponseWrapper structure allows for it.
    console.warn('API response HTTP OK, but wrapper status is not "success":', responseDataWrapper);
    throw new ApiError(
      responseDataWrapper.errors?.[0]?.message || 'API operation failed despite HTTP OK.',
      response.status, // Should be 2xx here
      responseDataWrapper.status || 'api_logic_error',
      responseDataWrapper.errors || []
    );
  }
}

// --- Authentication API Functions ---
/**
 * Registers a new user.
 * @param {object} userData - User registration data (e.g., { username, email, password, firstName, lastName }).
 * @returns {Promise<object>} AuthResponse: { accessToken, user: UserDto }.
 */
export const register = (userData) => fetchWithAuth('/auth/register', { method: 'POST', body: userData }, false);

/**
 * Logs in an existing user.
 * @param {object} credentials - User login credentials ({ email, password }).
 * @returns {Promise<object>} AuthResponse: { accessToken, user: UserDto }.
 */
export const login = (credentials) => fetchWithAuth('/auth/login', { method: 'POST', body: credentials }, false);

/**
 * Refreshes the access token using the HttpOnly refresh token cookie.
 * @returns {Promise<object>} AuthResponse: { accessToken, user: UserDto }.
 */
export const refreshToken = () => fetchWithAuth('/auth/refresh-token', { method: 'POST' }, false); // requiresAuth is false as it relies on cookie

/**
 * Logs out the current user.
 * @returns {Promise<object>} Message object e.g. { message: "User logged out successfully." }.
 */
export const logout = () => fetchWithAuth('/auth/logout', { method: 'POST' }, true);


// --- User API Functions ---
/**
 * Fetches the current authenticated user's profile.
 * @returns {Promise<object>} UserDto.
 */
export const getUserProfile = () => fetchWithAuth('/users/me/profile', { method: 'GET' }, true);


// --- Project API Functions ---
/**
 * Fetches all projects.
 * @returns {Promise<Array<object>>} List of ProjectDto.
 */
export const getProjects = () => fetchWithAuth('/projects', { method: 'GET' }, false);

/**
 * Fetches a single project by ID.
 * @param {string|number} id - The ID of the project.
 * @returns {Promise<object>} ProjectDto.
 */
export const getProjectById = (id) => fetchWithAuth(`/projects/${id}`, { method: 'GET' }, false);

/**
 * Creates a new project.
 * Requires admin role.
 * @param {object} projectData - Data for the new project (conforming to CreateProjectRequest DTO).
 * @returns {Promise<object>} ProjectDto.
 */
export const createProject = (projectData) => fetchWithAuth('/projects', { method: 'POST', body: projectData }, true);

/**
 * Updates an existing project by its ID.
 * Requires admin role.
 * @param {string|number} id - The ID of the project to update.
 * @param {object} projectData - Data to update the project with (conforming to UpdateProjectRequest DTO).
 * @returns {Promise<object>} ProjectDto.
 */
export const updateProject = (id, projectData) => fetchWithAuth(`/projects/${id}`, { method: 'PUT', body: projectData }, true);

/**
 * Deletes a project by its ID.
 * Requires admin role.
 * @param {string|number} id - The ID of the project to delete.
 * @returns {Promise<null>} Resolves with null on success (204 No Content).
 */
export const deleteProject = (id) => fetchWithAuth(`/projects/${id}`, { method: 'DELETE' }, true);

/**
 * Fetches all projects for the currently authenticated user.
 * @returns {Promise<Array<object>>} List of ProjectDto.
 */
export const getMyProjects = () => fetchWithAuth('/users/me/projects', { method: 'GET' }, true);


// --- Skill API Functions ---
/**
 * Fetches all skills.
 * @returns {Promise<Array<object>>} List of SkillDto.
 */
export const getSkills = () => fetchWithAuth('/skills', { method: 'GET' }, false);

/**
 * Fetches a single skill by ID.
 * @param {string|number} id - The ID of the skill.
 * @returns {Promise<object>} SkillDto.
 */
export const getSkillById = (id) => fetchWithAuth(`/skills/${id}`, { method: 'GET' }, false);

/**
 * Creates a new skill.
 * Requires admin role.
 * @param {object} skillData - Data for the new skill (conforming to CreateSkillRequest DTO).
 * @returns {Promise<object>} SkillDto.
 */
export const createSkill = (skillData) => fetchWithAuth('/skills', { method: 'POST', body: skillData }, true);

/**
 * Deletes a skill by its ID.
 * Requires admin role.
 * @param {string|number} id - The ID of the skill to delete.
 * @returns {Promise<null>} Resolves with null on success (204 No Content).
 */
export const deleteSkill = (id) => fetchWithAuth(`/skills/${id}`, { method: 'DELETE' }, true);


// --- Contact Message API Functions ---
/**
 * Submits a contact message.
 * @param {object} messageData - Data for the contact message (e.g., { name, email, message }).
 * @returns {Promise<object>} Message object e.g. { message: "Contact message submitted successfully." }.
 */
export const submitContactMessage = (messageData) => fetchWithAuth('/contact-messages', { method: 'POST', body: messageData }, false);

// Add other API functions as needed following this pattern.
// Ensure JSDoc for all exported functions.
// Remember to handle requiresAuth flag correctly for each endpoint.
// The UserDto, ProjectDto, SkillDto types are based on the provided API documentation.
// AuthResponse is { accessToken: string, user: UserDto }
// The actual DTOs for request bodies (e.g. LoginRequest, RegisterRequest) are not detailed here but should match backend expectations.
