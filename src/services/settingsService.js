/**
 * @file src/services/settingsService.js
 * @description A reactive, centralized service for managing application and user settings.
 * This acts as a single source of truth, ensuring that when settings are updated
 * in one part of the app (e.g., UserSettingsPage), other parts (e.g., Navbar)
 * react to the changes instantly.
 */
import { ref, computed } from 'vue';
import { publicApi } from '@/services/api/public.api.js';
import { settingsApi } from '@/services/api/user.api.js';
import { authService } from './authService';

// --- Reactive State ---
// The internal state is a key-value map: { "SHOW_PROJECTS": "true", ... }
const settings = ref({});
const isLoading = ref(true);

/**
 * Initializes the settings from the backend based on the current context.
 * This should be called when the application loads or the route changes.
 * @param {string|null} slug - The user slug for a public portfolio page. If null, fetches for the current context.
 */
async function initializeSettings(slug = null) {
  isLoading.value = true;
  try {
    let settingsArray = [];
    if (slug) {
      // We are on a specific user's public portfolio page
      settingsArray = await publicApi.getPortfolioSettings(slug);
    } else if (authService.isAuthenticated.value) {
      // The logged-in user is browsing their own dashboard area (/me/*)
      settingsArray = await settingsApi.getAll();
    } else {
      // A generic public page (e.g., /login, /register)
      settingsArray = await publicApi.getGlobalSettings();
    }
    // Normalize the array from the API into the service's internal map format.
    updateSettings(settingsArray);
  } catch (err) {
    console.error('Failed to initialize settings:', err);
    settings.value = {}; // Reset to a safe default
  } finally {
    isLoading.value = false;
  }
}

/**
 * Updates the central reactive settings state from an array of setting objects.
 * This is the key function that allows UserSettingsPage to broadcast changes.
 * @param {Array<{name: string, value: string}>} settingsArray - A list of setting objects to update.
 */
function updateSettings(settingsArray) {
  if (!Array.isArray(settingsArray)) {
    console.error('[SettingsService] updateSettings received invalid data:', settingsArray);
    return;
  }
  // Create a mutable copy of the current settings map.
  const newSettingsMap = { ...settings.value };

  // Iterate over the incoming list and update/add values.
  settingsArray.forEach(setting => {
    newSettingsMap[setting.name] = setting.value;
  });

  // Assign the merged map back to the reactive ref to trigger updates across the app.
  settings.value = newSettingsMap;
  console.log('[SettingsService] Settings state updated:', settings.value);
}

// --- Exported Service ---
export const settingsService = {
  isLoading,
  settings,
  initialize: initializeSettings,
  updateSettings,
  /**
   * A computed property that returns a function to check if a feature is enabled.
   * It robustly checks for the string "true".
   * Usage in a component: `v-if="settingsService.isEnabled.value('SHOW_PROJECTS')"`
   */
  isEnabled: computed(() => (featureName) => {
    return settings.value[featureName] === 'true';
  }),
};
