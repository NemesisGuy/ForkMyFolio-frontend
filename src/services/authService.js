/**
 * @file src/services/authService.js
 * @description Manages authentication state, including login, logout, token storage, and session initialization.
 * This service acts as the central hub for authentication logic, using the low-level API functions.
 */
import { ref, computed } from 'vue'; // Import 'computed'
import { jwtDecode } from 'jwt-decode';

// Import the specific API functions and the dependency injector
import { login as apiLogin, logout as apiLogout, register as apiRegister, refreshToken as apiRefreshToken } from './api/auth.api';
// KEY CHANGE: We will use getAccount as it provides the full user DTO, including the profile image URL.
import { getAccount } from './api/admin.api';
import { setAuthService } from './api/apiClient';

// --- Reactive State ---
const isAuthenticated = ref(false);
const user = ref(null);
const isLoading = ref(true);
let accessToken = null;

// --- Token Refresh State ---
let isRefreshing = false;
let refreshPromise = null;

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
  // After login, fetch the full account data to get the image URL
  const fullUser = await getAccount();
  _updateAuthState(response.accessToken, fullUser);
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
  // After register, fetch the full account data
  const fullUser = await getAccount();
  _updateAuthState(response.accessToken, fullUser);
}

async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await apiRefreshToken();
      _updateAuthState(response.accessToken, response.user);
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

function updateLocalUser(updatedUser) {
  if (user.value) {
    user.value = { ...user.value, ...updatedUser };
  }
}

async function initAuth() {
  console.log('[AuthService] Initializing auth state...');
  try {
    // This is the call that is likely failing in production due to an incorrect API_BASE_URL.
    // When this throws an error, the catch block below logs you out.
    await refreshToken();

    if (isAuthenticated.value) {
      // KEY CHANGE: Fetch the full account data to ensure the profile image URL is present.
      const freshUserAccount = await getAccount();
      updateLocalUser(freshUserAccount);
      console.log('[AuthService] User profile updated with latest data from server.');
    }
  } catch (error) {
    console.log('[AuthService] Initial token refresh failed (user is likely not logged in or API_BASE_URL is misconfigured in production).');
  } finally {
    console.log(`[AuthService] Auth state initialized. User is ${isAuthenticated.value ? 'authenticated' : 'not authenticated'}.`);
  }
}

// --- KEY CHANGE: Centralized Computed Property for User ---
/**
 * A computed property that provides the user object with a guaranteed
 * absolute URL for the profile image. Use this in all components.
 */
const computedUser = computed(() => {
  const currentUser = user.value;
  if (!currentUser) {
    return null;
  }

  const imageUrl = currentUser.profileImageUrl;
  let fullProfileImageUrl = null;

  if (imageUrl) {
    if (/^(https?:\/\/|\/\/)/.test(imageUrl)) {
      fullProfileImageUrl = imageUrl;
    } else {
      const apiBaseUrl = window.runtimeConfig.API_BASE_URL.startsWith('##')
        ? 'http://localhost:8080/api/v1'
        : window.runtimeConfig.API_BASE_URL;
      try {
        const serverUrl = new URL(apiBaseUrl);
        const serverRoot = `${serverUrl.protocol}//${serverUrl.host}`;
        fullProfileImageUrl = `${serverRoot}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
      } catch (e) {
        console.error('Invalid VITE_API_BASE_URL:', apiBaseUrl);
        fullProfileImageUrl = imageUrl; // Fallback
      }
    }
  }

  return {
    ...currentUser,
    fullProfileImageUrl, // Add the fully resolved URL to the user object
  };
});


export const authService = {
  // State
  isAuthenticated,
  user: computedUser, // <-- Expose the computed user object
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
