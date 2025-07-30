import { fetchWithAuth } from './apiClient';

/**
 * @file src/services/api/user.api.js
 * @description API functions for all authenticated user-specific operations under the /me/ scope.
 */

// --- User Account & Public Profile ---

/**
 * Fetches the private account details for the authenticated user.
 * @returns {Promise<Object>} The user's account data (name, email, etc.).
 */
export const getMyAccount = () => {
  // Endpoint: GET /api/v1/me
  return fetchWithAuth('/me', { method: 'GET' });
};

/**
 * Updates the private account details for the authenticated user.
 * @param {Object} accountData - The account data to update (firstName, lastName, profileImageUrl).
 * @returns {Promise<Object>} The updated account data.
 */
export const updateMyAccount = (accountData) => {
  // Endpoint: PUT /api/v1/me
  return fetchWithAuth('/me', { method: 'PUT', body: accountData });
};

/**
 * Fetches the public-facing profile details for the authenticated user to edit.
 * @returns {Promise<Object>} The user's public profile data.
 */
export const getMyPublicProfile = () => fetchWithAuth('/me/profile', { method: 'GET' });

/**
 * Updates the public profile for the authenticated user.
 * @param {Object} profileData - The public profile data.
 * @returns {Promise<Object>} The updated public profile data.
 */
export const updateMyPublicProfile = (profileData) => {
  // CORRECTED: This now sends a simple JSON payload, not FormData.
  // The image is handled separately via updateMyAccount.
  return fetchWithAuth('/me/profile', {
    method: 'PUT',
    body: profileData,
  });
};


// --- Generic CRUD factory ---
const createCrudFunctions = (resource) => ({
  getAll: () => fetchWithAuth(`/me/${resource}`),
  getById: (uuid) => fetchWithAuth(`/me/${resource}/${uuid}`),
  create: (data) => fetchWithAuth(`/me/${resource}`, { method: 'POST', body: data }),
  update: (uuid, data) => fetchWithAuth(`/me/${resource}/${uuid}`, { method: 'PUT', body: data }),
  remove: (uuid) => fetchWithAuth(`/me/${resource}/${uuid}`, { method: 'DELETE' }),
});

// --- Export CRUD functions for each resource ---
export const projectsApi = createCrudFunctions('projects');
export const skillsApi = createCrudFunctions('skills');
export const experiencesApi = createCrudFunctions('experiences');
export const qualificationsApi = createCrudFunctions('qualifications');
export const testimonialsApi = createCrudFunctions('testimonials');

// --- Contact Messages (User-specific) ---
export const getMyContactMessages = () => fetchWithAuth('/me/contact-messages');
export const deleteMyContactMessage = (uuid) => fetchWithAuth(`/me/contact-messages/${uuid}`, { method: 'DELETE' });

// --- Settings API ---
export const settingsApi = {
  getAll: () => fetchWithAuth('/me/settings'),
  update: (settingsList) => fetchWithAuth('/me/settings', { method: 'PUT', body: settingsList }),
};

// --- Backup & Restore (User-specific) ---
export const downloadMyBackup = async () => {
  // --- THIS IS THE FIX ---
  // The backend sends a raw JSON file, not a standard API response.
  // We must request it as a 'blob' to handle it as a file download.
  const blob = await fetchWithAuth('/me/backup', {
    method: 'GET',
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const filename = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const restoreMyBackup = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchWithAuth('/me/backup/restore', { method: 'POST', body: formData });
};
