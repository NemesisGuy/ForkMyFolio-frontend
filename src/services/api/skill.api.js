import {fetchWithAuth} from './apiClient.js';

const PLATFORM_SKILLS_URL = '/skills';

/**
 * API service for fetching the global pool of skills.
 */
export const platformSkillApi = {
  /**
   * Retrieves the list of all skills available on the platform.
   * This is an authenticated endpoint.
   * @returns {Promise<Array<object>>} A list of all platform skills (SkillDto).
   */
  getAll() {
    // Endpoint: GET /api/v1/skills
    return fetchWithAuth(PLATFORM_SKILLS_URL, {method: 'GET'});
  },
};
