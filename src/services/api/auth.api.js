import {fetchWithAuth} from './apiClient';

/**
 * @file src/services/api/auth.api.js
 * @description API functions for authentication-related endpoints.
 */

/**
 * Register a new user.
 * @param {object} userData The registration data (firstName, lastName, email, password).
 * @returns {Promise<{accessToken: string}>} API response containing the access token.
 */
export const register = (userData) =>
  fetchWithAuth('/auth/register', {
    method: 'POST',
    body: userData,
  }, false);

/**
 * Login an existing user.
 * @param {object} credentials The login credentials (email, password).
 * @returns {Promise<{accessToken: string}>} API response containing the access token.
 */
export const login = (credentials) =>
  fetchWithAuth('/auth/login', {
    method: 'POST',
    body: credentials,
  }, false);

/**
 * Refresh the access token using the refresh token cookie.
 * @returns {Promise<{accessToken: string}>} API response with a new accessToken.
 */
export const refreshToken = () =>
  // FIX: Pass `isRetry = true` to prevent this call from triggering another refresh,
  // which would cause an infinite loop if the refresh token is invalid.
  fetchWithAuth('/auth/refresh-token', {method: 'POST'}, true, true);

/**
 * Logout the current user.
 * @returns {Promise<void>}
 */
export const logout = () =>
  // FIX: A logout should be a simple fire-and-forget request. Setting `requiresAuth`
  // to `false` prevents the apiClient from trying to refresh an expired token during
  // logout, which was causing an infinite loop and preventing the network call.
  // The backend will invalidate the session using the secure HttpOnly refresh token cookie.
  fetchWithAuth('/auth/logout', {method: 'POST'}, false);
