/**
 * @file src/services/authService.js
 * @description Manages global authentication state and user session.
 * Interacts with apiService for backend authentication calls.
 */
import { reactive, computed } from 'vue';
import * as apiService from './apiService'; // Import all exports

// Reactive state for authentication
const state = reactive({
  /** @type {object|null} UserDto - The authenticated user object, or null if not authenticated. */
  user: null,
  /** @type {string|null} The JWT access token. Stored in memory. */
  accessToken: null,
  /** @type {boolean} Indicates if the authentication state is currently being loaded or processed. */
  isLoading: true, // Start as true until initial auth state is loaded
});

/**
 * Key for storing user data in localStorage (excluding sensitive token).
 * @type {string}
 */
const USER_STORAGE_KEY = 'forkmyfolio_user';

/**
 * Loads initial authentication state from localStorage.
 * Called once when the application starts.
 */
function loadAuthState() {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      state.user = JSON.parse(storedUser);
      // Access token is not stored in localStorage for security with HttpOnly refresh tokens.
      // It will be fetched via refreshToken if user session was persisted or on login.
      // For now, if user is in localStorage, we assume they might have an active session
      // that refreshToken mechanism will validate or refresh.
      // If refreshToken fails, user will be logged out by the interceptor.
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    localStorage.removeItem(USER_STORAGE_KEY); // Clear potentially corrupted data
  } finally {
    state.isLoading = false;
  }
}

/**
 * Updates the authentication state after a successful login or token refresh.
 * @param {string} newAccessToken - The new JWT access token.
 * @param {object} userData - The user data (UserDto).
 */
function updateAuthState(newAccessToken, userData) {
  console.log('[AuthService] Updating auth state. New access token:', newAccessToken ? 'SET' : 'CLEARED', 'User data:', userData ? 'SET' : 'CLEARED');
  state.accessToken = newAccessToken;
  state.user = userData;
  if (userData) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  state.isLoading = false; // Ensure loading is false after auth update
}

/**
 * Clears the authentication state.
 */
function clearAuthState() {
  console.log('[AuthService] Clearing auth state.');
  state.accessToken = null;
  state.user = null;
  localStorage.removeItem(USER_STORAGE_KEY);
  state.isLoading = false;
}

// --- Public API for authService ---

/**
 * Registers a new user.
 * @param {object} userData - User registration data (username, email, password, firstName, lastName).
 * @returns {Promise<object>} AuthResponse data: { accessToken, user: UserDto }.
 * @throws {ApiError} If registration fails.
 */
async function register(userData) {
  state.isLoading = true;
  try {
    // apiService.register is expected to return the unwrapped 'data' part of ApiResponseWrapper
    // which is AuthResponse { accessToken, user }
    const authResponse = await apiService.register(userData);
    updateAuthState(authResponse.accessToken, authResponse.user);
    return authResponse;
  } catch (error) {
    clearAuthState(); // Ensure clean state on error
    throw error; // Re-throw ApiError for the component to handle
  } finally {
    state.isLoading = false;
  }
}

/**
 * Logs in an existing user.
 * @param {object} credentials - User login credentials ({ email, password }).
 * @returns {Promise<object>} AuthResponse data: { accessToken, user: UserDto }.
 * @throws {ApiError} If login fails.
 */
async function login(credentials) {
  state.isLoading = true;
  try {
    const authResponse = await apiService.login(credentials);
    updateAuthState(authResponse.accessToken, authResponse.user);
    return authResponse;
  } catch (error) {
    clearAuthState();
    throw error;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Refreshes the access token using the HttpOnly refresh token cookie.
 * This is typically called by the apiService interceptor.
 * @returns {Promise<boolean>} True if refresh was successful, false otherwise.
 */
async function refreshToken() {
  // isLoading is not set to true here, as this often happens in the background
  // and shouldn't block UI in the same way login/register might.
  // The interceptor in apiService handles retrying the original request.
  try {
    console.log('[AuthService] Attempting token refresh via apiService.refreshToken()');
    const authResponse = await apiService.refreshToken(); // This specific call in apiService should not trigger its own refresh loop
    console.log('[AuthService] Token refresh successful via apiService.');
    updateAuthState(authResponse.accessToken, authResponse.user);
    return true;
  } catch (error) {
    console.error('[AuthService] refreshToken failed:', error);
    // If refresh fails, the interceptor in apiService should handle logout.
    // We clear auth state here as a safeguard if called directly and it fails.
    console.log('[AuthService] refreshToken failed, initiating logout(false).');
    await logout(false); // Pass false to indicate not to call backend logout again if refresh failed
    return false;
  }
}

/**
 * Logs out the current user.
 * @param {boolean} [callBackend=true] - Whether to attempt calling the backend logout endpoint.
 *                                      Set to false if backend logout has already failed (e.g. during token refresh failure).
 * @returns {Promise<void>}
 */
async function logout(callBackend = true) {
  state.isLoading = true;
  if (callBackend) {
    try {
      console.log('[AuthService] Attempting backend logout via apiService.logout()');
      await apiService.logout(); // Ignores response data as per API spec (Map<String,String>)
      console.log('[AuthService] Backend logout call completed.');
    } catch (error) {
      // Log error but proceed with client-side logout regardless
      console.error('[AuthService] Backend logout failed:', error);
    }
  } else {
    console.log('[AuthService] Skipping backend logout call.');
  }
  clearAuthState();
  // Router redirection should be handled by the component or route guard calling logout
}

/**
 * Gets the current user object.
 * @returns {object|null} The user object (UserDto) or null.
 */
function getUser() {
  return state.user;
}

/**
 * Gets the current access token.
 * @returns {string|null} The access token or null.
 */
function getAccessToken() {
  return state.accessToken;
}

/**
 * A computed property that reflects if the user is authenticated.
 * @returns {boolean} True if user is authenticated, false otherwise.
 */
const isAuthenticated = computed(() => !!state.user && !!state.accessToken);

/**
 * A computed property that reflects if the auth state is currently loading.
 * @returns {boolean} True if loading, false otherwise.
 */
const isLoadingAuth = computed(() => state.isLoading);


// Export methods and reactive state properties
export const authService = {
  // State (reactive getters)
  user: computed(() => state.user),
  accessToken: computed(() => state.accessToken), // Mostly for internal use by apiService
  isAuthenticated,
  isLoading: isLoadingAuth,

  // Methods
  register,
  login,
  logout,
  refreshToken, // Exposed for apiService interceptor

  // Direct getters for non-reactive use if needed, though computed properties are preferred for Vue components
  getUser,
  getAccessToken,
  loadAuthState, // To be called on app init
  updateLocalUser, // Method to update user state after profile edit
};

/**
 * Updates the local user data in the auth state and localStorage.
 * This is typically called after a successful profile update.
 * Does not affect the access token.
 * @param {object} updatedUserData - The new user data (UserDto).
 */
function updateLocalUser(updatedUserData) {
  console.log('[AuthService] Updating local user data:', updatedUserData);
  if (updatedUserData) {
    state.user = { ...state.user, ...updatedUserData }; // Merge to preserve other potential state fields if any
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user));
  } else {
    // Should not happen if backend returns updated user, but as a guard:
    console.warn('[AuthService] updateLocalUser called with null/undefined userData. User state not changed.');
  }
  // state.isLoading should not be affected by this specific update type
}


// Dependency injection for apiService to use authService (for token and refresh logic)
// This avoids circular dependency issues at module load time.
apiService.setAuthService(authService);
