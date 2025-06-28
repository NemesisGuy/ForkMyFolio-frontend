/**
 * @file src/services/api/index.js
 * @description Barrel file to export all API functions for easy importing.
 */

export * from './public.api';
export * from './admin.api';
export * from './auth.api';
export * from './user.api'; // <-- Exporting our new user-related functions

// Also export the custom error class for convenience
export { ApiError } from './apiClient';
