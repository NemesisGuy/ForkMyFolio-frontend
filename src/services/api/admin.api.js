/**
 * @file src/services/api/admin.api.js
 * @description API functions for all admin-only operations.
 */
import {fetchWithAuth} from './apiClient';
import {triggerDownload} from '@/utils/downloadUtils';

// --- Helper to normalize user data from the backend ---
const normalizeUser = (user) => {
  if (user && user.roles && Array.isArray(user.roles)) {
    // Ensure all roles are clean (e.g., "ADMIN" instead of "ROLE_ADMIN")
    user.roles = user.roles.map(role => role.replace('ROLE_', ''));
  }
  return user;
};


// --- User Management (Admin) ---

/**
 * Fetches a list of all users.
 * The backend returns a paginated object. This function extracts, normalizes,
 * and returns the user array from the 'content' property.
 * @param {object} [pageable={ page: 0, size: 20 }] - Pagination options.
 * @returns {Promise<Array<object>>} A list of clean UserDto objects.
 */
export const getAdminUsers = async (pageable = {page: 0, size: 20}) => {
  const params = new URLSearchParams(pageable);
  const page = await fetchWithAuth(`/admin/users?${params.toString()}`, {method: 'GET'});
  if (page && page.content) {
    // Normalize each user in the list before returning
    return page.content.map(normalizeUser);
  }
  return []; // Return empty array if no content
};

/**
 * Fetches a single user by their ID and normalizes the data.
 * @param {string|number} userId - The UUID of the user.
 * @returns {Promise<object>} A clean UserDto object.
 */
export const getAdminUserById = async (userId) => {
  const user = await fetchWithAuth(`/admin/users/${userId}`, {method: 'GET'});
  return normalizeUser(user);
};

/**
 * Updates an existing user's details as an admin.
 * @param {string|number} userId - The UUID of the user to update.
 * @param {object} userData - The new data for the user (e.g., roles, active status).
 * @returns {Promise<object>} The updated UserDto.
 */
export const updateAdminUser = (userId, userData) => fetchWithAuth(`/admin/users/${userId}`, {
  method: 'PUT',
  body: userData
});

/**
 * Deactivates (soft deletes) a user.
 * @param {string|number} userId - The UUID of the user to deactivate.
 * @returns {Promise<void>}
 */
export const deleteAdminUser = (userId) => fetchWithAuth(`/admin/users/${userId}`, {method: 'DELETE'});

/**
 * Fetches a list of all projects in the system.
 * @returns {Promise<Array<object>>} A list of all projects.
 */
export const getAdminProjects = () => fetchWithAuth('/admin/projects', {method: 'GET'});

// --- Application Settings ---

/**
 * Fetches all global application settings from the backend.
 * @returns {Promise<Array<{uuid: string, name: string, value: string, description: string}>>} The full list of setting objects.
 */
export const getAdminSettings = () => fetchWithAuth('/admin/settings', {method: 'GET'});

/**
 * Updates multiple application settings at once.
 * @param {Array<{uuid: string, value: string}>} settings - An array of settings to update.
 * @returns {Promise<Array<{uuid: string, name: string, value: string, description: string}>>} The full, updated list of all settings.
 */
export const updateAdminSettings = (settings) => {
  return fetchWithAuth('/admin/settings', {
    method: 'PUT',
    body: settings
  });
};

// --- Site-wide Statistics ---

/**
 * Fetches the consolidated visitor and authentication statistics.
 * @returns {Promise<object>} A promise that resolves to the stats object.
 */
export const getAdminStats = () => fetchWithAuth('/admin/stats', {method: 'GET'});


// --- Site-wide Contact Messages ---

/**
 * Fetches all received contact messages from all users.
 * @returns {Promise<Array<object>>} List of ContactMessageDto
 */
export const getAdminContactMessages = () => fetchWithAuth('/admin/contact-messages', {method: 'GET'});

/**
 * Deletes a specific contact message by its UUID.
 * @param {string} uuid - The UUID of the message.
 * @returns {Promise<void>}
 */
export const deleteAdminContactMessage = (uuid) => fetchWithAuth(`/admin/contact-messages/${uuid}`, {method: 'DELETE'});


// --- System Backup & Restore ---

/**
 * Initiates a download of the full system backup JSON file.
 * @returns {Promise<void>}
 */
export const downloadSystemBackup = async () => {
  const blob = await fetchWithAuth('/admin/backup/system', {
    method: 'GET',
    responseType: 'blob'
  });
  const filename = `forkmyfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
  triggerDownload(blob, filename);
};

/**
 * Uploads a backup file to restore the entire system.
 * @param {FormData} formData The form data containing the backup file (key: 'file').
 * @returns {Promise<void>}
 */
export const restoreSystemBackup = (formData) => {
  return fetchWithAuth('/admin/restore/system', {
    method: 'POST',
    body: formData,
  });
};
