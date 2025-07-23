import { fetchWithAuth } from './apiClient';

/**
 * Register a new user.
 * @param {Object} userData - The registration data.
 * @returns {Promise} API response.
 */
export const register = (userData) =>
  fetchWithAuth('/auth/register', {
    method: 'POST',
    body: userData,
  }, false);

/**
 * Login an existing user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise} API response.
 */
export const login = (credentials) =>
  fetchWithAuth('/auth/login', {
    method: 'POST',
    body: credentials,
  }, false);

/**
 * Refresh the access token using the refresh token cookie.
 * Must include credentials to send cookies.
 * @returns {Promise} API response.
 */
export const refreshToken = () =>
  fetchWithAuth('/auth/refresh-token', {
    method: 'POST',
  }, true);

/**
 * Logout the current user.
 * Must include credentials to send cookies.
 * @returns {Promise} API response.
 */
export const logout = () =>
  fetchWithAuth('/auth/logout', {
    method: 'POST',
  }, true);
