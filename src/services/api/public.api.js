import {fetchWithAuth} from './apiClient';

/**
 * Fetches the public portfolio profile of the owner.
 * @returns {Promise<object>} PortfolioProfileDto
 */
// KEY CHANGE: The endpoint is updated from '/profile' to '/portfolio-profile'
export const getPublicProfile = () => fetchWithAuth('/portfolio-profile', {method: 'GET'}, false);

/**
 * Fetches all public projects for the portfolio.
 * @returns {Promise<Array<object>>} List of ProjectDto
 */
export const getPublicProjects = () => fetchWithAuth('/projects', {method: 'GET'}, false);

/**
 * Fetches a single public project by its UUID.
 * @param {string} uuid - The UUID of the project.
 * @returns {Promise<object>} ProjectDto
 */
export const getPublicProjectById = (uuid) => fetchWithAuth(`/projects/${uuid}`, {method: 'GET'}, false);

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
 * Fetches the list of all qualifications.
 * @returns {Promise<Array<object>>} List of QualificationDto
 */
export const getPublicQualifications = () => fetchWithAuth('/qualifications', {method: 'GET'}, false);

/**
 * Submits a contact form message.
 * @param {object} messageData - Data for the contact message.
 * @returns {Promise<object>} Confirmation message
 */
export const submitContactMessage = (messageData) => fetchWithAuth('/contact-messages', {
  method: 'POST',
  body: messageData
}, false);
