/**
 * @file src/services/authService.js
 * @description Manages authentication state, including login, logout, token storage, and session initialization.
 * This service acts as the central hub for authentication logic.
 */
import {computed, ref} from 'vue';

// Import the specific API functions
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister
} from './api/auth.api';
import {getMyAccount} from './api/user.api';
// --- THIS IS THE FIX ---
// We need to import the services we want to reset on logout.
import {publicApi} from './api/public.api';
import {settingsService} from './settingsService.js';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';

// --- Reactive State ---
const isAuthenticated = ref(false);
const user = ref(null);
const settings = ref({}); // Reactive store for application settings
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

// --- Public API for the Service ---

/**
 * Logs in a user and establishes their session.
 * @param {object} credentials - { email, password }
 */
async function login(credentials) {
  const response = await apiLogin(credentials);
  // The user object is now part of the login response to be more efficient.
  _updateAuthState(response.accessToken, response.user);
  // Settings are already loaded by initAuth, so no need to fetch them again here.
}

/**
 * Logs out the user from the backend and clears local state.
 */
async function logout() {
  try {
    await apiLogout();
  } catch (e) {
    console.error("[AuthService] Backend logout failed, clearing state anyway.", e);
  } finally {
    _clearAuthState();

    // --- THIS IS THE FIX ---
    // After clearing authentication, we must reset the application's context
    // to the default state for a public, non-logged-in visitor.

    // 1. Reset the public portfolio store to clear the previous user's data.
    const portfolioStore = usePublicPortfolioStore();
    portfolioStore.portfolio.value = null;
    portfolioStore.currentSlug.value = null;
    portfolioStore.error.value = null;

    // 2. Re-initialize the settings service to load the global defaults.
    //    This ensures the navbar shows the correct links for the landing page.
    await settingsService.initialize('default');
    // --- END OF FIX ---
  }
}

/**
 * Registers a new user and logs them in.
 * @param {object} userData - { firstName, lastName, email, password }
 */
async function register(userData) {
  const response = await apiRegister(userData);
  // The user object is now part of the register response.
  _updateAuthState(response.accessToken, response.user);
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
      console.error("[AuthService] Token refresh failed:", e.message);
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
 * Initializes the auth service on app startup.
 * This now includes fetching critical application settings.
 */
async function initAuth() {
  console.log('[AuthService] Initializing session...');
  try {
    // Fetch settings and attempt to refresh the token in parallel.
    // The UI needs settings regardless of auth state.
    // --- THIS IS THE FIX ---
    // We now call the correct function from the imported `publicApi` object.
    const settingsPromise = publicApi.getGlobalSettings().then(fetchedSettings => {
      // Normalize settings from an array of {name, value} to an object {name: value}
      const normalized = fetchedSettings.reduce((acc, setting) => {
        acc[setting.name] = setting.value;
        return acc;
      }, {});
      settings.value = normalized;
      console.log('[AuthService] Application settings loaded.');
    });

    const authPromise = refreshToken().then(async () => {
      if (isAuthenticated.value) {
        // If session is valid, fetch the latest user data to ensure it's fresh
        const freshUserAccount = await getMyAccount();
        _updateAuthState(accessToken, freshUserAccount);
        console.log('[AuthService] Session restored and user data refreshed.');
      }
    }).catch(() => {
      console.log('[AuthService] No active session found or refresh failed.');
      _clearAuthState(); // Ensure clean state if auth part fails
    });

    // Wait for both initialization tasks to complete.
    await Promise.all([settingsPromise, authPromise]);

  } catch (error) {
    console.error('[AuthService] A critical error occurred during initialization.', error);
    _clearAuthState(); // Ensure clean state if anything fails
  } finally {
    isLoading.value = false;
    console.log(`[AuthService] Session initialized. User is ${isAuthenticated.value ? 'authenticated' : 'not authenticated'}.`);
  }
}

export const authService = {
  // State
  isAuthenticated,
  user,
  settings: computed(() => settings.value), // Expose settings as a readonly computed property
  isLoading,
  // Getters
  getAccessToken: () => accessToken,
  // Actions
  login,
  logout,
  register,
  refreshToken,
  initAuth,
};
