/**
 * @file src/services/api/index.js
 * @description Barrel file to export all API functions for easy importing.
 * This makes it simple to import any API function from a single location.
 */

export * from './public.api';
export * from './admin.api';
export * from './auth.api';
export * from './user.api';

// Also export the custom error class for convenience
export { ApiError } from './apiClient';
