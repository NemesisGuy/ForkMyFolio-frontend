/**
 * @file src/services/api/index.js
 * @description Barrel file to re-export all API service functions.
 * This allows for clean, single-line imports in components.
 * e.g., import { login, getPublicProjects, createSkill } from '@/services/api';
 */

export * from './auth.api';
export * from './public.api';
export * from './admin.api';

// Also re-export the ApiError class for type checking in components
export { ApiError } from './apiClient';
