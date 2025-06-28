import {fetchWithAuth} from './apiClient';

/**
 * Fetches the public portfolio profile of the owner.
 * @returns {Promise<object>} ProfileDto
 */
// KEY CHANGE: This now correctly points to the public, unauthenticated endpoint.
export const getPublicProfile = () => fetchWithAuth('/profile', {method: 'GET'}, false);

/**
 * Fetches all public projects for the portfolio.
 * @returns {Promise<Array<object>>} List of ProjectDto
 */
export const getPublicProjects = () => fetchWithAuth('/projects', {method: 'GET'}, false);

/**
 * Fetches a single public project by its ID.
 * @param {string|number} id - The ID of the project.
 * @returns {Promise<object>} ProjectDto
 */
export const getPublicProjectById = (id) => fetchWithAuth(`/projects/${id}`, {method: 'GET'}, false);

/**
 * Fetches the list of all skills.
 * @returns {Promise<Array<object>>} List of SkillDto
 */
export const getPublicSkills = () => fetchWithAuth('/skills', {method: 'GET'}, false);

/**
 * Fetches the list of all work experiences.
 * @returns {Promise<Array<object>>} List of ExperienceDto
 */
export const getPublicExperience = () => fetchWithAuth('/experience', {method: 'GET'}, false);

/**
 * Fetches the list of all testimonials.
 * @returns {Promise<Array<object>>} List of TestimonialDto
 */
export const getPublicTestimonials = () => fetchWithAuth('/testimonials', {method: 'GET'}, false);

/**
 * Submits a contact form message.
 * @param {object} messageData - Data for the contact message.
 * @returns {Promise<object>} Confirmation message
 */
export const submitContactMessage = (messageData) => fetchWithAuth('/contact', {
  method: 'POST',
  body: messageData
}, false);
