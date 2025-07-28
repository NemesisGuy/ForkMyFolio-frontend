import { ref } from 'vue';
import { publicApi } from '@/services/api/public.api.js';

const portfolio = ref(null);
const isLoading = ref(false);
const error = ref(null);
const currentSlug = ref(null);

/**
 * A simple store to hold the currently viewed public portfolio data,
 * preventing redundant API calls across different public pages.
 */
export function usePublicPortfolioStore() {

  /**
   * Fetches the entire public portfolio for a given slug.
   * It's smart enough to not re-fetch if the data for the current slug is already loaded.
   * @param {string} slug The user's public portfolio slug.
   */
  const fetchPortfolio = async (slug) => {
    if (!slug) {
      error.value = { message: 'No portfolio slug provided.' };
      portfolio.value = null;
      currentSlug.value = null;
      return;
    }

    // Don't re-fetch if we already have the data for this user.
    if (currentSlug.value === slug && portfolio.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      // This single API call gets all portfolio data, including testimonials
      const data = await publicApi.getPortfolioBySlug(slug);
      portfolio.value = data;
      currentSlug.value = slug;
    } catch (e) {
      console.error(`Failed to fetch portfolio for slug: ${slug}`, e);
      error.value = e;
      portfolio.value = null; // Clear stale data on error
      currentSlug.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    portfolio,
    isLoading,
    error,
    fetchPortfolio,
  };
}
