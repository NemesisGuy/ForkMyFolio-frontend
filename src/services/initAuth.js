// src/services/initAuth.js
import { authService } from './authService';
import { setAuthService } from './api/apiClient';
import { settingsService } from './settingsService';

// First, inject the authService into the apiClient to resolve the circular dependency.
setAuthService(authService);

/**
 * Orchestrates the application's startup sequence.
 * It initializes settings and authentication state in parallel for a faster load time.
 * This top-level await ensures that these critical setup tasks complete
 * before the rest of the application in main.js continues.
 */
await Promise.all([
  settingsService.initialize(), // Fetches global/user settings
  authService.initAuth()        // Attempts to restore a user session
]);
