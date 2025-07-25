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

/**
 * Gets the map of public settings.
 * @returns {Promise<Object<string, boolean>>} A map of feature names to their enabled state.
 */
export const getPublicSettings = () => fetchWithAuth('/settings', { method: 'GET' }, false);



/**
 * Requests a PDF version of the portfolio from the backend.
 * @param {string} templateName The name of the template to use for generation.
 * @returns {Promise<Blob>} A promise that resolves with the PDF file as a Blob.
 */
export const downloadPortfolioAsPdf = (templateName) => {
  if (!templateName) {
    // This provides a clear error if the setting isn't configured.
    return Promise.reject(new Error("A template name must be provided."));
  }
  // The endpoint is public, so requiresAuth is false.
  const endpoint = `/pdf/download?template=${encodeURIComponent(templateName)}`;
  return fetchWithAuth(endpoint, { method: 'GET' }, false, false, 'blob');
};

/**
 * Records a total visit count. This is a fire-and-forget call.
 * @returns {Promise<void>}
 */
export const recordTotalVisit = () => {
  return fetchWithAuth('/stats/increment/total-visit', { method: 'POST' }, false);
};

/**
 * Records a view for a specific project. This is a fire-and-forget call.
 * @param {string} projectId The UUID of the project.
 * @returns {Promise<void>}
 */
export const recordProjectView = (projectId) => {
  return fetchWithAuth(`/stats/increment/project-view/${projectId}`, { method: 'POST' }, false);
};
