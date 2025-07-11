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
export const createProject = (projectData) => fetchWithAuth('/admin/projects', {
  method: 'POST',
  body: projectData
});
export const updateProject = (uuid, projectData) => fetchWithAuth(`/admin/projects/${uuid}`, {
  method: 'PUT',
  body: projectData
});
export const deleteProject = (uuid) => fetchWithAuth(`/admin/projects/${uuid}`, {method: 'DELETE'});

// --- Skills ---
export const createSkill = (skillData) => fetchWithAuth('/admin/skills', {
  method: 'POST',
  body: skillData
});
export const deleteSkill = (uuid) => fetchWithAuth(`/admin/skills/${uuid}`, {method: 'DELETE'});

// --- Experience ---
export const createExperience = (expData) => fetchWithAuth('/admin/experience', {method: 'POST', body: expData});
export const updateExperience = (uuid, expData) => fetchWithAuth(`/admin/experience/${uuid}`, {
  method: 'PUT',
  body: expData
});
export const deleteExperience = (uuid) => fetchWithAuth(`/admin/experience/${uuid}`, {method: 'DELETE'});

// --- Testimonials ---
export const createTestimonial = (testData) => fetchWithAuth('/admin/testimonials', {
  method: 'POST',
  body: testData
});
export const updateTestimonial = (uuid, testData) => fetchWithAuth(`/admin/testimonials/${uuid}`, {
  method: 'PUT',
  body: testData
});
export const deleteTestimonial = (uuid) => fetchWithAuth(`/admin/testimonials/${uuid}`, {method: 'DELETE'});

// --- Qualifications ---
export const createQualification = (qualData) => fetchWithAuth('/admin/qualifications', {
  method: 'POST',
  body: qualData
});
export const updateQualification = (uuid, qualData) => fetchWithAuth(`/admin/qualifications/${uuid}`, {
  method: 'PUT',
  body: qualData
});
export const deleteQualification = (uuid) => fetchWithAuth(`/admin/qualifications/${uuid}`, {method: 'DELETE'});
