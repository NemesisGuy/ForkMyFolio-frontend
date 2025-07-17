// src/services/initAuth.js
import { authService } from './authService';
import { setAuthService } from './api/apiClient';
import { settingsService } from './settingsService';

// First, inject the authService into the apiClient to resolve the circular dependency.
setAuthService(authService);

// Fetch public settings. We don't await this because the UI can render
// while these are loading in the background. Components will be reactive to the service.
settingsService.fetchSettings();

// Then, initialize the auth state. Top-level await ensures this completes
// before the rest of the app in main.js continues.
await authService.initAuth();
