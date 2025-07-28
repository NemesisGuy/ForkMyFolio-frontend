import { fetchWithAuth } from './apiClient';

/**
 * @file src/services/api/auth.api.js
 * @description API functions for authentication-related endpoints.
 */

/**
 * Register a new user.
 * @param {Object} userData - The registration data.
 * @returns {Promise<object>} API response with user and accessToken.
 */
export const register = (userData) =>
  fetchWithAuth('/auth/register', {
    method: 'POST',
    body: userData,
  }, false);

/**
 * Login an existing user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise<object>} API response with user and accessToken.
 */
export const login = (credentials) =>
  fetchWithAuth('/auth/login', {
    method: 'POST',
    body: credentials,
  }, false);

/**
 * Refresh the access token using the refresh token cookie.
 * @returns {Promise<object>} API response with a new accessToken.
 */
export const refreshToken = () =>
  fetchWithAuth('/auth/refresh-token', {
    method: 'POST',
  }, true);

/**
 * Logout the current user.
 * @returns {Promise<void>}
 */
export const logout = () =>
  fetchWithAuth('/auth/logout', {
    method: 'POST',
  }, true);
