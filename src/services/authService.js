/**
 * @file src/services/authService.js
 * @description Manages authentication state, including login, logout, token storage, and session initialization.
 * This service acts as the central hub for authentication logic, using the low-level API functions.
 */
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

// Import the specific API functions and the dependency injector
import { login as apiLogin, logout as apiLogout, register as apiRegister, refreshToken as apiRefreshToken } from './api/auth.api';
import { getCurrentUserProfile } from './api/user.api';
import { setAuthService } from './api/apiClient';

// --- Reactive State ---
const isAuthenticated = ref(false);
const user = ref(null);
const isLoading = ref(true);
let accessToken = null;

// --- Token Refresh State ---
let isRefreshing = false;
let refreshPromise = null; // Stores the promise of the in-progress refresh

// --- Private Functions ---
function _updateAuthState(token, userData) {
  console.log('[AuthService] Updating auth state. New access token:', token ? 'SET' : 'CLEARED', 'User data:', userData ? 'SET' : 'CLEARED');
  accessToken = token;
  isAuthenticated.value = !!token;

  if (userData) {
    user.value = userData;
  } else if (token) {
    try {
      const decoded = jwtDecode(token);
      user.value = {
        id: decoded.sub,
        email: decoded.email,
        roles: decoded.roles || [],
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      };
    } catch (e) {
      console.error("[AuthService] Failed to decode token:", e);
      _clearAuthState();
    }
  } else {
    user.value = null;
  }
  isLoading.value = false;
}

function _clearAuthState() {
  console.log('[AuthService] Clearing auth state.');
  accessToken = null;
  isAuthenticated.value = false;
  user.value = null;
  isLoading.value = false;
}

// --- Public API for the Service ---
async function login(credentials) {
  const response = await apiLogin(credentials);
  _updateAuthState(response.accessToken, response.user);
}

async function logout() {
  try {
    await apiLogout();
  } catch (e) {
    console.error("[AuthService] Backend logout failed, clearing state anyway.", e);
  } finally {
    _clearAuthState();
  }
}

async function register(userData) {
  const response = await apiRegister(userData);
  _updateAuthState(response.accessToken, response.user);
}

/**
 * Refreshes the access token using the refresh token cookie.
 * This function is enhanced to prevent race conditions where multiple API calls
 * fail simultaneously and all attempt to refresh the token. It ensures only one
 * refresh attempt is made, and all other calls wait for its result.
 */
async function refreshToken() {
  if (isRefreshing) {
    console.log('[AuthService] A token refresh is already in progress. Waiting for it to complete.');
    // If a refresh is already happening, return the existing promise.
    // This allows subsequent failed requests to wait for the same refresh to complete.
    return refreshPromise;
  }

  console.log('[AuthService] Starting token refresh...');
  isRefreshing = true;
  // Create a new promise. All subsequent calls that arrive while this is in-progress
  // will wait on this same promise.
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await apiRefreshToken();
      _updateAuthState(response.accessToken, response.user);
      console.log('[AuthService] Token refresh successful.');
      resolve(true); // Resolve with success status.
    } catch (e) {
      console.error("[AuthService] Token refresh failed:", e.message);
      _clearAuthState(); // Log the user out if refresh fails.
      reject(e); // Reject the promise to signal failure to all waiting calls.
    } finally {
      // Reset the state once the refresh attempt is complete.
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
}

function updateLocalUser(updatedUser) {
  if (user.value) {
    user.value = { ...user.value, ...updatedUser };
  }
}

async function initAuth() {
  console.log('[AuthService] Initializing auth state...');
  try {
    // On application startup, we try to refresh the token.
    // This will restore the user's session if they have a valid refresh token cookie.
    await refreshToken();

    // If the refresh was successful, we are authenticated.
    // Let's fetch the absolute latest user profile data from the server to ensure the UI is up-to-date.
    if (isAuthenticated.value) {
      const freshUserProfile = await getCurrentUserProfile();
      updateLocalUser(freshUserProfile);
      console.log('[AuthService] User profile updated with latest data from server.');
    }
  } catch (error) {
    // This is an expected and normal failure if the user is not logged in,
    // their refresh token is expired, or the backend is offline on first load.
    // The refreshToken() function already handles clearing auth state, so we just log this for clarity.
    console.log('[AuthService] Initial token refresh failed (user is likely not logged in).');
  } finally {
    console.log(`[AuthService] Auth state initialized. User is ${isAuthenticated.value ? 'authenticated' : 'not authenticated'}.`);
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
  updateLocalUser,
  initAuth,
};

// Inject this service into the apiClient so it can handle token refreshes
setAuthService(authService);
