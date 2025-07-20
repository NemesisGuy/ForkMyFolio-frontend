/**
 * @file src/services/api/admin.api.js
 * @description API functions for all admin-only operations.
 * All functions use UUIDs for resource identification as per the new API spec.
 */
import {fetchWithAuth} from './apiClient';

// --- Account & Portfolio Profile ---

/**
 * Gets the authenticated admin's user account details.
 * @returns {Promise<object>} UserDto
 */
export const getAccount = () => fetchWithAuth('/admin/account', { method: 'GET' });

/**
 * Updates the authenticated admin's user account details.
 * @param {object} accountData - The data for the user account (e.g., firstName, lastName, email).
 * @returns {Promise<object>} Updated UserDto
 */
export const updateAccount = (accountData) => fetchWithAuth('/admin/account', {
  method: 'PUT',
  body: accountData
});

/**
 * Gets the portfolio profile content for the authenticated admin.
 * @returns {Promise<object>} PortfolioProfileDto
 */
export const getPortfolioProfile = () => fetchWithAuth('/admin/portfolio-profile', { method: 'GET' });

/**
 * Creates the portfolio profile for the authenticated admin for the first time.
 * @param {object} profileData - The data for the new portfolio profile.
 * @returns {Promise<object>} Created PortfolioProfileDto
 */
export const createPortfolioProfile = (profileData) => fetchWithAuth('/admin/portfolio-profile', {
  method: 'POST',
  body: profileData
});

/**
 * Updates the public-facing portfolio profile content.
 * @param {object} profileData - The data for the portfolio profile.
 * @returns {Promise<void>}
 */
export const updatePortfolioProfile = (profileData) => fetchWithAuth('/admin/portfolio-profile', {
  method: 'PUT',
  body: profileData
});


// --- Projects ---

/**
 * Fetches all projects for the admin view.
 * @returns {Promise<Array<object>>} A list of ProjectDto objects.
 */
export const getAdminProjects = () => fetchWithAuth('/admin/projects', { method: 'GET' });

/**
 * Creates a new project.
 * @param {object} projectData - The data for the new project.
 * @returns {Promise<object>} The created ProjectDto.
 */
export const createProject = (projectData) => fetchWithAuth('/admin/projects', {
  method: 'POST',
  body: projectData
});

/**
 * Updates an existing project.
 * @param {string} uuid - The UUID of the project to update.
 * @param {object} projectData - The new data for the project.
 * @returns {Promise<object>} The updated ProjectDto.
 */
export const updateProject = (uuid, projectData) => fetchWithAuth(`/admin/projects/${uuid}`, {
  method: 'PUT',
  body: projectData
});

/**
 * Deletes a project.
 * @param {string} uuid - The UUID of the project to delete.
 * @returns {Promise<void>}
 */
export const deleteProject = (uuid) => fetchWithAuth(`/admin/projects/${uuid}`, {method: 'DELETE'});

// --- Skills ---

/**
 * Creates a new skill.
 * @param {object} skillData - The data for the new skill.
 * @returns {Promise<object>} The created SkillDto.
 */
export const createSkill = (skillData) => fetchWithAuth('/admin/skills', {
  method: 'POST',
  body: skillData
});

/**
 * Deletes a skill.
 * @param {string} uuid - The UUID of the skill to delete.
 * @returns {Promise<void>}
 */
export const deleteSkill = (uuid) => fetchWithAuth(`/admin/skills/${uuid}`, {method: 'DELETE'});

// --- Experience ---

/**
 * Creates a new experience entry.
 * @param {object} expData - The data for the new experience.
 * @returns {Promise<object>} The created ExperienceDto.
 */
export const createExperience = (expData) => fetchWithAuth('/admin/experience', {method: 'POST', body: expData});

/**
 * Updates an existing experience entry.
 * @param {string} uuid - The UUID of the experience to update.
 * @param {object} expData - The new data for the experience.
 * @returns {Promise<object>} The updated ExperienceDto.
 */
export const updateExperience = (uuid, expData) => fetchWithAuth(`/admin/experience/${uuid}`, {
  method: 'PUT',
  body: expData
});

/**
 * Deletes an experience entry.
 * @param {string} uuid - The UUID of the experience to delete.
 * @returns {Promise<void>}
 */
export const deleteExperience = (uuid) => fetchWithAuth(`/admin/experience/${uuid}`, {method: 'DELETE'});

// --- Testimonials ---

/**
 * Creates a new testimonial.
 * @param {object} testData - The data for the new testimonial.
 * @returns {Promise<object>} The created TestimonialDto.
 */
export const createTestimonial = (testData) => fetchWithAuth('/admin/testimonials', {
  method: 'POST',
  body: testData
});

/**
 * Updates an existing testimonial.
 * @param {string} uuid - The UUID of the testimonial to update.
 * @param {object} testData - The new data for the testimonial.
 * @returns {Promise<object>} The updated TestimonialDto.
 */
export const updateTestimonial = (uuid, testData) => fetchWithAuth(`/admin/testimonials/${uuid}`, {
  method: 'PUT',
  body: testData
});

/**
 * Deletes a testimonial.
 * @param {string} uuid - The UUID of the testimonial to delete.
 * @returns {Promise<void>}
 */
export const deleteTestimonial = (uuid) => fetchWithAuth(`/admin/testimonials/${uuid}`, {method: 'DELETE'});

// --- Qualifications ---

/**
 * Creates a new qualification.
 * @param {object} qualData - The data for the new qualification.
 * @returns {Promise<object>} The created QualificationDto.
 */
export const createQualification = (qualData) => fetchWithAuth('/admin/qualifications', {
  method: 'POST',
  body: qualData
});

/**
 * Updates an existing qualification.
 * @param {string} uuid - The UUID of the qualification to update.
 * @param {object} qualData - The new data for the qualification.
 * @returns {Promise<object>} The updated QualificationDto.
 */
export const updateQualification = (uuid, qualData) => fetchWithAuth(`/admin/qualifications/${uuid}`, {
  method: 'PUT',
  body: qualData
});

/**
 * Deletes a qualification.
 * @param {string} uuid - The UUID of the qualification to delete.
 * @returns {Promise<void>}
 */
export const deleteQualification = (uuid) => fetchWithAuth(`/admin/qualifications/${uuid}`, {method: 'DELETE'});


// --- Contact Messages ---

/**
 * Fetches all received contact messages.
 * @returns {Promise<Array<object>>} List of ContactMessageDto
 */
export const getContactMessages = () => fetchWithAuth('/admin/contact-messages', { method: 'GET' });

/**
 * Deletes a specific contact message by its UUID.
 * @param {string} uuid - The UUID of the message.
 * @returns {Promise<void>}
 */
export const deleteContactMessage = (uuid) => fetchWithAuth(`/admin/contact-messages/${uuid}`, { method: 'DELETE' });


// --- Application Settings ---

/**
 * Fetches all application feature settings.
 * @returns {Promise<Array<{uuid: string, name: string, enabled: boolean, description: string}>>} The full list of setting objects.
 */
export const getAdminSettings = () => fetchWithAuth('/admin/settings', { method: 'GET' });

/**
 * Updates multiple application settings at once.
 * @param {Array<{uuid: string, name: string, enabled: boolean}>} settings - An array of settings to update.
 * @returns {Promise<Array<{uuid: string, name: string, enabled: boolean, description: string}>>} The full, updated list of all settings.
 */
export const updateAdminSettings = (settings) => fetchWithAuth('/admin/settings', {
  method: 'PUT',
  body: settings
});

// --- Statistics ---

/**
 * Fetches the consolidated visitor and authentication statistics.
 * @returns {Promise<object>} A promise that resolves to the stats object.
 */
export const getAdminStats = () => fetchWithAuth('/admin/stats', { method: 'GET' });




