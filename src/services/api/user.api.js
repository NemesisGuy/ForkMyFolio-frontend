import {fetchWithAuth} from './apiClient';

/**
 * @file src/services/api/user.api.js
 * @description API functions for all authenticated user-specific operations.
 */

// --- User Account & Public Profile ---

/**
 * Fetches the private account details for the authenticated user.
 * @returns {Promise<object>} The user's account data (UserDto).
 */
export const getMyAccount = () => {
  // Endpoint: GET /api/v1/me
  return fetchWithAuth('/me', {method: 'GET'});
};

/**
 * Updates the private account details for the authenticated user.
 * @param {object} accountData The account data to update (firstName, lastName, profileImageUrl).
 * @returns {Promise<object>} The updated account data (UserDto).
 */
export const updateMyAccount = (accountData) => {
  // Endpoint: PUT /api/v1/me
  return fetchWithAuth('/me', {method: 'PUT', body: accountData});
};

/**
 * Fetches the public-facing profile details for the authenticated user to edit.
 * @returns {Promise<object>} The user's public profile data (ProfileDto).
 */
export const getMyPublicProfile = () => fetchWithAuth('/me/profile', {method: 'GET'});

/**
 * Updates the public profile for the authenticated user.
 * @param {object} profileData The public profile data.
 * @returns {Promise<object>} The updated public profile data (ProfileDto).
 */
export const updateMyPublicProfile = (profileData) => {
  // The image is handled separately via updateMyAccount.
  return fetchWithAuth('/me/profile', {
    method: 'PUT',
    body: profileData,
  });
};

/**
 * Updates the master public visibility of the authenticated user's portfolio.
 * @param {object} visibilityData The visibility data, e.g., `{ isPublic: true }`.
 * @returns {Promise<void>}
 */
export const updateMyProfileVisibility = (visibilityData) => {
  // Endpoint: PUT /api/v1/me/profile/visibility
  return fetchWithAuth('/me/profile/visibility', {
    method: 'PUT',
    body: visibilityData,
  });
};

/**
 * Changes the password for the currently authenticated user.
 * @param {string} newPassword The new password.
 * @returns {Promise<void>}
 */
export const changeMyPassword = (newPassword) => {
  // Endpoint: POST /api/v1/me/password
  return fetchWithAuth('/me/password', {
    method: 'POST',
    body: { newPassword },
  });
};

/**
 * Records that the authenticated user has accepted the terms and conditions.
 * @returns {Promise<void>}
 */
export const acceptMyTerms = () => {
  // Endpoint: POST /api/v1/me/accept-terms
  return fetchWithAuth('/me/accept-terms', {
    method: 'POST',
  });
};

// --- Generic CRUD factory for /me resources ---
const createCrudFunctions = (resource) => ({
  getAll: () => fetchWithAuth(`/me/${resource}`),
  getById: (uuid) => fetchWithAuth(`/me/${resource}/${uuid}`),
  create: (data) => fetchWithAuth(`/me/${resource}`, {method: 'POST', body: data}),
  update: (uuid, data) => fetchWithAuth(`/me/${resource}/${uuid}`, {method: 'PUT', body: data}),
  remove: (uuid) => fetchWithAuth(`/me/${resource}/${uuid}`, {method: 'DELETE'}),
});

// --- Export CRUD functions for each resource ---
export const projectsApi = createCrudFunctions('projects');
export const experiencesApi = createCrudFunctions('experiences');
export const qualificationsApi = createCrudFunctions('qualifications');
export const testimonialsApi = createCrudFunctions('testimonials');

// REFACTOR: The skillsApi now points to the dedicated /user/skills endpoint,
// not the generic /me/skills factory endpoint, to align with the new UserSkillController.
const USER_SKILLS_RESOURCE = '/user/skills';
export const skillsApi = {
  getAll: () => fetchWithAuth(USER_SKILLS_RESOURCE),
  create: (data) => fetchWithAuth(USER_SKILLS_RESOURCE, {method: 'POST', body: data}),
  update: (uuid, data) => fetchWithAuth(`${USER_SKILLS_RESOURCE}/${uuid}`, {
    method: 'PUT',
    body: data
  }),
  remove: (uuid) => fetchWithAuth(`${USER_SKILLS_RESOURCE}/${uuid}`, {method: 'DELETE'}),
};


// --- Contact Messages (User-specific) ---
/**
 * Fetches all contact messages for the authenticated user.
 * @returns {Promise<Array<object>>} A list of contact message objects.
 */
export const getMyContactMessages = () => fetchWithAuth('/me/contact-messages');

export const deleteMyContactMessage = (uuid) => fetchWithAuth(`/me/contact-messages/${uuid}`, {method: 'DELETE'});

/**
 * Fetches the count of unread messages for the authenticated user.
 * @returns {Promise<number>} The number of unread messages.
 */
export const getUnreadMessageCount = async () => {
  // Endpoint: GET /api/v1/me/contact-messages/unread-count
  const response = await fetchWithAuth('/me/contact-messages/unread-count');
  // The backend returns { "unreadCount": 3 }, so we access the property.
  return response.unreadCount;
};

/**
 * Partially updates a contact message for the authenticated user.
 * @param {string} uuid The UUID of the message to update.
 * @param {object} updateData An object with the fields to update (e.g., `{ read: true, priority: 'HIGH' }`).
 * @returns {Promise<object>} The updated message object from the server.
 */
export const updateMyContactMessage = (uuid, updateData) => {
  // Endpoint: PUT /api/v1/me/contact-messages/{uuid}
  return fetchWithAuth(`/me/contact-messages/${uuid}`, {
    method: 'PUT',
    body: updateData,
  });
};


// --- Settings API ---
/**
 * API service for managing user-specific settings.
 */
export const settingsApi = {
  /**
   * @returns {Promise<Array<object>>}
   */
  getAll: () => fetchWithAuth('/me/settings'),
  /**
   * @param {Array<object>} settingsList
   * @returns {Promise<Array<object>>}
   */
  update: (settingsList) => fetchWithAuth('/me/settings', {method: 'PUT', body: settingsList}),
};

// --- Backup & Restore (User-specific) ---
export const downloadMyBackup = async () => {
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

/**
 * Restores a user's portfolio from a backup file.
 * @param {File} file The JSON backup file.
 * @returns {Promise<void>}
 */
export const restoreMyBackup = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchWithAuth('/me/backup/restore', {method: 'POST', body: formData});
};
