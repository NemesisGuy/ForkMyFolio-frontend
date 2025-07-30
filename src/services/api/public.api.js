import { fetchWithAuth } from './apiClient';
import { authService } from '@/services/authService';

/**
 * @file src/services/api/public.api.js
 * @description API functions for publicly accessible data and portfolio-related actions.
 */

// --- Named Exports for use with the barrel file (index.js) ---

export const getPortfolioBySlug = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}`, { method: 'GET' }, false);
};

export const getPortfolioSettings = (slug) => {
  return fetchWithAuth(`/portfolios/${slug}/settings`, { method: 'GET' }, false);
};

export const getGlobalSettings = () => {
  return fetchWithAuth('/settings', { method: 'GET' }, false);
};

export const sendContactMessage = (slug, messageData) => {
  return fetchWithAuth(`/portfolios/${slug}/contact-messages`, { method: 'POST', body: messageData }, false);
};

export const getAvailablePdfTemplates = () => {
  return fetchWithAuth('/settings/pdf-templates', { method: 'GET' }, false);
};

/**
 * Fetches a single public project by its UUID.
 * @param {string} uuid - The UUID of the project.
 * @returns {Promise<Object>} The project data.
 */
export const getPublicProjectById = (uuid) => {
  return fetchWithAuth(`/projects/${uuid}`, { method: 'GET' }, false);
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
 * @returns {Promise<Object|null>} The profile data or null.
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
        const flatProfile = { ...portfolioData, ...portfolioData.user, ...portfolioData.profile };

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
