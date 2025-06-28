/**
 * @file src/services/authService.js
 * @description Manages authentication state, including login, logout, token storage, and session initialization.
 * This service acts as the central hub for authentication logic, using the low-level API functions.
 */
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

// Import the specific API functions and the dependency injector
import { login as apiLogin, logout as apiLogout, register as apiRegister, refreshToken as apiRefreshToken } from './api/auth.api';
import { setAuthService } from './api/apiClient';

// --- Reactive State ---
const isAuthenticated = ref(false);
const user = ref(null);
const isLoading = ref(true);
let accessToken = null;

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

async function refreshToken() {
    try {
        const response = await apiRefreshToken();
        _updateAuthState(response.accessToken, response.user);
        return true;
    } catch (e) {
        console.error("[AuthService] Token refresh failed:", e.message);
        _clearAuthState();
        return false;
    }
}

function updateLocalUser(updatedUser) {
    if (user.value) {
        user.value = { ...user.value, ...updatedUser };
    }
}

async function initAuth() {
    console.log("[AuthService] Initializing auth state...");
    await refreshToken();
    console.log(`[AuthService] Auth state initialized. User is ${isAuthenticated.value ? 'authenticated' : 'not authenticated'}.`);
}

export const authService = {
    // State
    isAuthenticated,
    user,
    isLoading,
    // Getters
    getAccessToken: () => accessToken,
    getUser: () => user.value,
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
