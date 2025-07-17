/**
 * @file src/services/settingsService.js
 * @description A lightweight, reactive service for managing public-facing application settings.
 * This service acts as a simple, custom state store without needing a full library like Pinia.
 */
import { ref, computed } from 'vue';
import { getPublicSettings } from '@/services/api/public.api.js';

// --- Reactive State ---
const settings = ref({});
const isLoading = ref(true);

let hasFetched = false; // Prevents re-fetching on hot-reloads during development

// --- Service Functions ---

/**
 * Fetches the public settings from the API and stores them in the reactive state.
 * It ensures the settings are only fetched once per application lifecycle.
 */
async function fetchSettings() {
  if (hasFetched) return;
  isLoading.value = true;
  hasFetched = true; // Mark as fetched immediately to prevent race conditions
  try {
    const publicSettings = await getPublicSettings();
    settings.value = publicSettings || {};
    console.log('[SettingsService] Public settings loaded:', settings.value);
  } catch (err) {
    console.error('Failed to fetch public settings:', err);
    settings.value = {}; // Reset to a safe default on error
  } finally {
    isLoading.value = false;
  }
}

/**
 * Updates the reactive settings map from an array of setting objects.
 * This is called from the admin settings page after a successful save
 * to ensure the UI (like the navbar) updates instantly without a refresh.
 * @param {Array<{name: string, enabled: boolean}>} settingsArray - The full array of setting objects from the admin API.
 */
function updateSettings(settingsArray) {
  if (!Array.isArray(settingsArray)) {
    console.error('[SettingsService] updateSettings received invalid data:', settingsArray);
    return;
  }
  const newSettingsMap = settingsArray.reduce((map, setting) => {
    map[setting.name] = setting.enabled;
    return map;
  }, {});
  settings.value = newSettingsMap;
  console.log('[SettingsService] Settings updated on-the-fly:', settings.value);
}

// --- Exported Service ---
// We export a single object that contains our reactive state and functions.
export const settingsService = {
  isLoading,
  settings,
  fetchSettings,
  updateSettings,
  /**
   * A computed property that returns a function to check if a feature is enabled.
   * Usage in a component: `v-if="settingsService.isEnabled.value('SHOW_PROJECTS')"`
   */
  isEnabled: computed(() => (featureName) => !!settings.value[featureName]),
};