/**
 * @file src/services/authService.js
 * @description Manages authentication state, including login, logout, token storage, and session initialization.
 * This service acts as the central hub for authentication logic.
 */
import {ref} from 'vue';

// Import the specific API functions
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister
} from './api/auth.api';
import {getMyAccount} from './api/user.api';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore';

// --- Reactive State ---
const isAuthenticated = ref(false);
const user = ref(null);
// This isLoading flag now specifically tracks the initial authentication process.
const isLoading = ref(true);
let accessToken = null;

// --- Token Refresh State ---
let isRefreshing = false;
let refreshPromise = null;

// --- Private Functions ---

/**
 * Updates the authentication state.
 * @param {string|null} token - The new access token.
 * @param {object|null} userData - The user data object.
 * @private
 */
function _updateAuthState(token, userData) {
  accessToken = token;
  isAuthenticated.value = !!token;
  user.value = userData;
  // Note: isLoading is handled by initAuth to signal when the *entire* app is ready.
  console.log('[AuthService] Auth state updated. Authenticated:', isAuthenticated.value);
}

/**
 * Clears the authentication state.
 * @private
 */
function _clearAuthState() {
  console.log('[AuthService] Clearing auth state.');
  accessToken = null;
  isAuthenticated.value = false;
  user.value = null;
  isLoading.value = false;
}

/**
 * Clears all local session data without making an API call.
 * This is used internally by the apiClient to prevent infinite loops.
 */
function clearLocalSession() {
  _clearAuthState();
  // Reset the portfolio store to clear any previous user's data.
  const portfolioStore = usePublicPortfolioStore();
  portfolioStore.clearPortfolio();
}

/**
 * Manually updates the local user state after a successful password change.
 * This prevents the navigation guard from re-triggering.
 */
function passwordHasBeenChanged() {
    if (user.value) {
        // Set a non-null value to satisfy the router guard. The next full page
        // reload or re-login will fetch the real timestamp from the backend.
        user.value.passwordLastChangedAt = new Date().toISOString();
        console.log('[AuthService] passwordLastChangedAt flag updated locally to prevent re-redirect.');
    }
}

/**
 * Manually updates the local user state after a successful terms acceptance.
 * This prevents the navigation guard from re-triggering.
 */
function termsHaveBeenAccepted() {
    if (user.value) {
        // Set a non-null value to satisfy the router guard. The next full page
        // reload or re-login will fetch the real timestamp from the backend.
        user.value.termsAcceptedAt = new Date().toISOString();
        console.log('[AuthService] termsAcceptedAt flag updated locally to prevent re-redirect.');
    }
}
// --- Public API for the Service ---

/**
 * Logs in a user and establishes their session.
 * @param {object} credentials - { email, password }
 */
async function login(credentials) {
  const loginResponse = await apiLogin(credentials);

  // The login response gives us the token. We'll use that token to fetch the
  // full, authoritative user object from the `/me` endpoint. This is more
  // robust than trusting the user object that might be nested in the login
  // response, as it ensures all fields (like `passwordLastChangedAt`) are present.

  // Temporarily set the token so the next API call is authenticated.
  accessToken = loginResponse.accessToken;

  const freshUserAccount = await getMyAccount();

  // Now, formally update the application's state with the token and the complete user object.
  _updateAuthState(loginResponse.accessToken, freshUserAccount);
}

/**
 * Logs out the user from the backend and clears local state.
 */
async function logout() {
  try {
    await apiLogout();
  } catch (e) {
    console.error('[AuthService] Backend logout failed, clearing state anyway.', e);
  } finally {
    clearLocalSession();
  }
}

/**
 * Registers a new user and logs them in.
 * @param {object} userData - { firstName, lastName, email, password }
 */
async function register(userData) {
  const registerResponse = await apiRegister(userData);

  // Just like in login, we use the new token to fetch the authoritative user object.
  // This ensures data consistency regardless of which auth endpoint is used.
  accessToken = registerResponse.accessToken;

  const freshUserAccount = await getMyAccount();

  _updateAuthState(registerResponse.accessToken, freshUserAccount);
}

/**
 * Refreshes the access token using the HttpOnly refresh token cookie.
 * @returns {Promise<boolean>}
 */
async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await apiRefreshToken();
      accessToken = response.accessToken;
      isAuthenticated.value = true; // We have a new token
      console.log('[AuthService] Token refresh successful.');
      resolve(true);
    } catch (e) {
      console.error('[AuthService] Token refresh failed:', e.message);
      _clearAuthState();
      reject(e);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
}

/**
 * Initializes the authentication state on application startup.
 * It attempts to restore a session by refreshing the token and fetching user data.
 * Settings are handled separately by the settingsService.
 */
async function initAuth() {
  console.log('[AuthService] Initializing session...');
  isLoading.value = true;
  try {
    // Attempt to refresh the token to see if a session exists.
    await refreshToken();
    if (isAuthenticated.value) {
      // If the session is valid, fetch the latest user data to ensure it's fresh.
      const freshUserAccount = await getMyAccount();
      _updateAuthState(accessToken, freshUserAccount);
      console.log('[AuthService] Session restored and user data refreshed.');
    }
  } catch (error) {
    // This catch block handles failures from refreshToken(), which already calls _clearAuthState.
    // We just need to log that no active session was found.
    console.log('[AuthService] No active session found or refresh failed.');
  } finally {
    isLoading.value = false;
    console.log(
      `[AuthService] Session initialization complete. User is ${isAuthenticated.value ? 'authenticated' : ' not authenticated'}.`
    );
  }
}

export const authService = {
  // State
  isAuthenticated,
  user,
  isLoading,
  // Getters
  getAccessToken: () => accessToken,
  // Actions
  login,
  logout,
  register,
  refreshToken,
  initAuth,
  // For internal use by apiClient
  clearLocalSession,
  // For use after forced password change
  passwordHasBeenChanged,
  // For use after terms acceptance
  termsHaveBeenAccepted,
};
