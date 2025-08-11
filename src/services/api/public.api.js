import {fetchWithAuth} from './apiClient';
import {authService} from '@/services/authService';

/**
 * @file src/services/api/public.api.js
 * @description API functions for publicly accessible data and portfolio-related actions.
 */

// --- Named Exports for use with the barrel file (index.js) ---

/**
 * Fetches the core profile and user data for a public portfolio.
 * @param {string} slug The user's portfolio slug.
 * @returns {Promise<object>} The combined user and profile data.
 */
export const getPortfolioBySlug = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}`, {method: 'GET'}, false);
};

/**
 * Fetches a user's public projects by their slug.
 * @param {string} slug - The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of project objects.
 */
export const getPortfolioProjects = (slug) => fetchWithAuth(`/portfolios/${slug}/projects`, {method: 'GET'}, false);

/**
 * Fetches a user's public skills by their slug.
 * @param {string} slug - The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of skill objects.
 */
export const getPortfolioSkills = (slug) => fetchWithAuth(`/portfolios/${slug}/skills`, {method: 'GET'}, false);

/**
 * Fetches a user's public experiences by their slug.
 * @param {string} slug - The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of experience objects.
 */
export const getPortfolioExperience = (slug) => fetchWithAuth(`/portfolios/${slug}/experience`, {method: 'GET'}, false);

/**
 * Fetches a user's public qualifications by their slug.
 * @param {string} slug - The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of qualification objects.
 */
export const getPortfolioQualifications = (slug) => fetchWithAuth(`/portfolios/${slug}/qualifications`, {method: 'GET'}, false);

/**
 * Fetches a user's public testimonials by their slug.
 * @param {string} slug - The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of testimonial objects.
 */
export const getPortfolioTestimonials = (slug) => fetchWithAuth(`/portfolios/${slug}/testimonials`, {method: 'GET'}, false);

/**
 * Fetches the public settings for a portfolio by its slug.
 * @param {string} slug The user's portfolio slug.
 * @returns {Promise<Array<object>>} A list of setting objects.
 */
export const getPortfolioSettings = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}/settings`, {method: 'GET'}, false);
};

/**
 * Fetches the global, unauthenticated application settings.
 * @returns {Promise<Array<object>>} A list of global setting objects.
 */
export const getGlobalSettings = () => {
  return fetchWithAuth('/settings', {method: 'GET'}, false);
};

/**
 * Sends a contact message to a portfolio owner.
 * @param {string} slug The user's portfolio slug.
 * @param {object} messageData The contact message data.
 * @returns {Promise<void>}
 */
export const sendContactMessage = (slug, messageData) => {
  return fetchWithAuth(`/portfolios/${slug}/contact-messages`, {
    method: 'POST',
    body: messageData
  }, false);
};

/**
 * Fetches the list of available PDF templates.
 * @returns {Promise<Array<object>>} A list of PDF template metadata objects.
 */
export const getAvailablePdfTemplates = () => {
  return fetchWithAuth('/settings/pdf-templates', {method: 'GET'}, false);
};

/**
 * Fetches a single public project by its UUID.
 * @param {string} uuid - The UUID of the project.
 * @returns {Promise<Object>} The project data.
 */
export const getPublicProjectById = (uuid) => {
  return fetchWithAuth(`/projects/${uuid}`, {method: 'GET'}, false);
};

/**
 * Downloads a public portfolio as a PDF using its slug.
 * This is an unauthenticated action.
 * @param {string} slug - The slug of the portfolio to download.
 * @returns {Promise<Response>} The raw response object containing the blob and headers.
 */
export const downloadPublicPortfolioBySlug = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}/pdf`, {
    method: 'GET',
    responseType: 'raw' // 'raw' gets the full Response object
  }, false);
};

/**
 * Downloads a public portfolio as a Markdown file.
 * @param {string} slug - The slug of the portfolio.
 * @returns {Promise<Response>} The raw response object containing the blob and headers.
 */
export const downloadMarkdownBySlug = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}/markdown`, {
    method: 'GET',
    responseType: 'raw'
  }, false);
};

/**
 * Downloads a public portfolio as a vCard file.
 * @param {string} slug - The slug of the portfolio.
 * @returns {Promise<Response>} The raw response object containing the blob and headers.
 */
export const downloadVCardBySlug = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}/vcard`, {
    method: 'GET',
    responseType: 'raw'
  }, false);
};


/**
 * Fetches the profile data for the homepage.
 * This is now dynamic:
 * - If a user is logged in, it fetches their own portfolio.
 * - If no user is logged in, it returns null, allowing the UI to show a generic state.
 * @returns {Promise<object|null>} The flattened profile data or null.
 */
export const getPublicProfile = async () => {
  // --- DYNAMIC LOGIC ---
  if (authService.isAuthenticated.value && authService.user.value?.slug) {
    const userSlug = authService.user.value.slug;
    console.log(`[Public Profile] Authenticated user detected. Fetching profile for slug: ${userSlug}`);
    try {
      const portfolioData = await getPortfolioBySlug(userSlug);

      // --- THIS IS THE FIX ---
      // The API returns nested `user` and `profile` objects. We need to merge them
      // to create a single, flat object for the UI to use easily.
      if (portfolioData && portfolioData.user && portfolioData.profile) {
        // Merge the base data, user details, and profile details.
        // The order is important: profile details should override user details if there are conflicts (e.g., firstName).
        const flatProfile = {...portfolioData, ...portfolioData.user, ...portfolioData.profile};

        // Clean up the now-redundant nested objects.
        delete flatProfile.user;
        delete flatProfile.profile;

        return flatProfile;
      }
      return null; // User exists but has no portfolio data.
    } catch (error) {
      console.error(`[Public Profile] Failed to fetch portfolio for authenticated user slug '${userSlug}'.`, error);
      throw error;
    }
  } else {
    console.log("[Public Profile] No authenticated user. Homepage will show a generic state.");
    return null;
  }
};

/**
 * Downloads the authenticated user's portfolio as a PDF.
 * This is an authenticated action.
 * @param {string} templateName - The name of the PDF template to use.
 * @returns {Promise<Blob>} The PDF file as a blob.
 */
export const downloadPortfolioAsPdf = (templateName) => {
  // This is an authenticated call to a user-specific endpoint.
  return fetchWithAuth(`/me/portfolio/download?template=${encodeURIComponent(templateName)}`, {
    method: 'GET',
    responseType: 'blob' // Crucial for handling file downloads
  }, true); // `true` indicates this is an authenticated request
};


// --- Object Export for backward compatibility with existing components ---

/**
 * An object containing all public API functions. This provides an alternative
 * way to import and use the functions, maintaining compatibility with components
 * that import `publicApi` directly.
 */
export const publicApi = {
  getPortfolioBySlug,
  getPortfolioProjects,
  getPortfolioSkills,
  getPortfolioExperience,
  getPortfolioQualifications,
  getPortfolioTestimonials,
  getPortfolioSettings,
  getGlobalSettings,
  sendContactMessage,
  getAvailablePdfTemplates,
  getPublicProfile,
  downloadPortfolioAsPdf,
  downloadPublicPortfolioBySlug,
  downloadMarkdownBySlug, // <-- ADDED
  downloadVCardBySlug,    // <-- ADDED
};
