import { fetchWithAuth } from './apiClient';

/**
 * @file src/services/api/policy.api.js
 * @description API service for fetching legal policy documents.
 */

/**
 * Fetches the current Terms of Service document.
 * @returns {Promise<object>} The policy data, including version and content.
 */
export const getTermsOfService = () => fetchWithAuth('/policies/terms-of-service', { method: 'GET' }, false);

/**
 * Fetches the current Privacy Policy document.
 * @returns {Promise<object>} The policy data, including version and content.
 */
export const getPrivacyPolicy = () => fetchWithAuth('/policies/privacy-policy', { method: 'GET' }, false);