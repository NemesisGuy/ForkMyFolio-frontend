/**
 * @file src/services/settingsService.js
 * @description A reactive, centralized service for managing application and user settings.
 * This acts as a single source of truth, ensuring that when settings are updated
 * in one part of the app (e.g., UserSettingsPage), other parts (e.g., Navbar)
 * react to the changes instantly.
 */
import {computed, ref, watch} from 'vue';
import {publicApi} from '@/services/api/public.api.js';
import {settingsApi} from '@/services/api/user.api.js';
import {authService} from './authService';

// --- Reactive State ---
// The internal state is a key-value map: { "SHOW_PROJECTS": "true", ... }
const settings = ref({});
const isLoading = ref(true);

/**
 * Fetches settings from the backend based on the current authentication state
 * and applies them to the reactive `settings` ref.
 * This is the single source of truth for fetching application-level settings.
 * @private
 */
async function _fetchAndApplySettings() {
  isLoading.value = true;
  console.log(`[SettingsService] Fetching settings. User is authenticated: ${authService.isAuthenticated.value}`);
  try {
    const settingsArray = authService.isAuthenticated.value
      ? await settingsApi.getAll() // Fetch user-specific settings
      : await publicApi.getGlobalSettings(); // Fetch global default settings

    updateSettings(settingsArray);
  } catch (err) {
    console.error('Failed to fetch settings:', err);
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
  // Normalize the array into a key-value map.
  const newSettingsMap = settingsArray.reduce((acc, setting) => {
    acc[setting.name] = setting.value;
    return acc;
  }, {});

  settings.value = newSettingsMap;
  console.log('[SettingsService] Settings state updated:', settings.value);
}

// --- Reactive Logic ---
// Watch for changes in authentication state (login/logout).
// When the user logs in or out, automatically refetch the correct settings.
watch(authService.isAuthenticated, (isNowAuthenticated, wasPreviouslyAuthenticated) => {
  // Only refetch if the state has actually changed to avoid redundant calls on startup.
  if (isNowAuthenticated !== wasPreviouslyAuthenticated) {
    _fetchAndApplySettings();
  }
});

// --- Exported Service ---
export const settingsService = {
  isLoading,
  settings,
  // The initialize function is now just a simple trigger for the first load,
  // called by initAuth.js.
  initialize: _fetchAndApplySettings,
  // This is used by pages like UserSettingsPage to push changes directly.
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
