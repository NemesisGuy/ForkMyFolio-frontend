/**
 * @fileoverview API service for interacting with the backend.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

/**
 * Performs a POST request to the login endpoint.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<object>} A promise that resolves to the API response data (user data and token).
 * @throws {Error} If the API request fails.
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Performs a POST request to the logout endpoint.
 * Note: This is often a fire-and-forget request or handled by clearing client-side token.
 *       The backend might invalidate the session/token.
 * @param {string} token - The user's auth token.
 * @returns {Promise<void>} A promise that resolves when logout is successful.
 * @throws {Error} If the API request fails.
 */
export const logoutUser = async (token) => {
  // Backend logout is optional, depending on session management strategy (e.g., token blocklisting)
  // For now, we'll assume it's good practice to notify the backend if an endpoint exists.
  // If no specific backend logout action is needed beyond clearing client token, this can be simplified.
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Don't throw critical error if backend logout fails, as client-side logout is primary
      console.warn(`Backend logout failed with status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Error during backend logout attempt:', error);
  }
  // Primary action is client-side token removal, which is handled in AuthContext.
};

// Add other API functions here as needed (e.g., signupUser, fetchUserProfile, etc.)

/**
 * Fetches the current user's profile information.
 * @param {string} token - The user's JWT token.
 * @returns {Promise<object>} A promise that resolves to the user profile data.
 * @throws {Error} If the API request fails.
 */
export const fetchUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch profile and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};


// For example:
// export const signupUser = async (userData) => { ... }
