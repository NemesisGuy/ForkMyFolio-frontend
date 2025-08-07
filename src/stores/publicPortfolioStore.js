import {ref} from 'vue';
import {publicApi} from '@/services/api/public.api.js';
import {ApiError} from '@/services/api/ApiError.js';

// These refs are defined outside the function, making them singletons (shared state).
// This is the core of the simple store pattern.
const portfolio = ref(null);
const isLoading = ref(false);
const error = ref(null);
const currentSlug = ref(null);

/**
 * New state to specifically track if a portfolio is inaccessible because it's private.
 * This allows the UI to show a specific "Private" message instead of a generic error.
 */
const isPrivate = ref(false);

/**
 * A composable that acts as a simple store for the publicly viewed portfolio.
 * It holds the portfolio data and prevents redundant API calls.
 */
export function usePublicPortfolioStore() {

  /**
   * Fetches the public portfolio for a given slug.
   * It's smart enough to not re-fetch if the data for the current slug is already loaded.
   * It now also handles the 403 Forbidden error for private portfolios.
   * @param {string} slug The user's public portfolio slug.
   * @param {boolean} force - If true, bypasses the cache and re-fetches data.
   */
  const fetchPortfolio = async (slug, force = false) => {
    if (!slug) {
      error.value = new ApiError('No portfolio slug provided.', 400);
      portfolio.value = null;
      currentSlug.value = null;
      return;
    }

    // If not forcing a refresh, and we already have the data for this slug, do nothing.
    if (!force && currentSlug.value === slug && portfolio.value) {
      return;
    }

    // Reset state for the new request
    isLoading.value = true;
    error.value = null;
    isPrivate.value = false; // Reset privacy flag on each new fetch

    try {
      // Use Promise.all to fetch all parts of the portfolio in parallel for performance.
      const [
        profileData,
        projects,
        skills,
        experiences,
        qualifications,
        testimonials,
      ] = await Promise.all([
        publicApi.getPortfolioBySlug(slug), // Gets the base user/profile info
        publicApi.getPortfolioProjects(slug),
        publicApi.getPortfolioSkills(slug),
        publicApi.getPortfolioExperience(slug),
        publicApi.getPortfolioQualifications(slug),
        publicApi.getPortfolioTestimonials(slug),
      ]);

      // Combine all the fetched data into a single portfolio object in the store.
      portfolio.value = {
        ...profileData, // Contains the base user and profile details
        projects,
        userSkills: skills, // The backend returns skills, but components might expect userSkills
        experiences,
        qualifications,
        testimonials,
      };

      currentSlug.value = slug; // Set the new slug after a successful fetch
    } catch (e) {
      // Handle errors, with special handling for the 403 (Forbidden) status
      if (e.response && e.response.status === 403) {
        // This is the specific case for a private portfolio.
        console.log('Access denied: The requested portfolio is private.');
        isPrivate.value = true;
      } else {
        // For all other errors (e.g., 404 Not Found, 500 Server Error), set a generic error.
        console.error(`Failed to fetch portfolio for slug: ${slug}`, e);
        error.value = e;
      }
      // Clear stale data on any error
      portfolio.value = null;
      currentSlug.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clears the store's state, useful when logging out or navigating away.
   */
  const clearPortfolio = () => {
    portfolio.value = null;
    error.value = null;
    isLoading.value = false;
    currentSlug.value = null;
    isPrivate.value = false;
  };

  // Expose the state and actions for any component to use.
  return {
    portfolio,
    isLoading,
    error,
    isPrivate, // Expose the new state
    currentSlug,
    fetchPortfolio,
    clearPortfolio,
  };
}
