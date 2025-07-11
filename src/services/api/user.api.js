import { fetchWithAuth } from './apiClient';

/**
 * Fetches the profile for the currently authenticated user.
 * This is used to get user details like name and email for the app's UI.
 * This is different from the public-facing getPublicProfile().
 * @returns {Promise<object>} A UserDto object.
 */
export const getCurrentUserProfile = () => fetchWithAuth('/me/profile', { method: 'GET' }, true);
