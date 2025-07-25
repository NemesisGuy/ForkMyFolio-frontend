/**
 * @file src/services/settingsService.js
 * @description A reactive service to manage and provide access to application settings.
 * It initializes itself with public settings on application load and can be updated
 * on-the-fly by admin actions.
 */
import { ref, computed } from 'vue';
import { getPublicSettings } from '@/services/api/public.api.js';

// --- Reactive State ---
// The internal state will consistently be a map of setting names to their string values.
// e.g., { "SHOW_PROJECTS": "true", "DEFAULT_PDF_TEMPLATE": "modern" }
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
    // --- THIS IS THE FIX ---
    // getPublicSettings now returns an array of objects: [{ name: '...', value: '...' }, ...]
    const publicSettingsArray = await getPublicSettings() || [];

    // Convert the array into the key-value map the service uses internally.
    // This is more robust and handles any setting type (boolean or string).
    const newSettingsMap = publicSettingsArray.reduce((map, setting) => {
      map[setting.name] = setting.value;
      return map;
    }, {});

    settings.value = newSettingsMap;
    console.log('[SettingsService] Public settings loaded and normalized:', settings.value);
  } catch (err) {
    console.error('Failed to fetch public settings:', err);
    settings.value = {}; // Reset to a safe default on error
  } finally {
    isLoading.value = false;
  }
}

/**
 * Merges an array of updated settings into the existing reactive settings map.
 * This correctly handles partial updates (e.g., from the PDF settings page)
 * without wiping out the other settings (e.g., for site visibility).
 * @param {Array<{name: string, value: string}>} settingsArray - A list of setting objects to update.
 */
function updateSettings(settingsArray) {
  if (!Array.isArray(settingsArray)) {
    console.error('[SettingsService] updateSettings received invalid data:', settingsArray);
    return;
  }
  // Create a mutable copy of the current settings map.
  const newSettingsMap = { ...settings.value };

  // Iterate over the incoming (potentially partial) list and update/add values.
  settingsArray.forEach(setting => {
    newSettingsMap[setting.name] = setting.value;
  });

  // Assign the merged map back to the reactive ref.
  settings.value = newSettingsMap;
  console.log('[SettingsService] Settings merged and updated on-the-fly:', settings.value);
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
   * It robustly checks for the string "true".
   * Usage in a component: `v-if="settingsService.isEnabled.value('SHOW_PROJECTS')"`
   */
  isEnabled: computed(() => (featureName) => {
    // This is the robust check. It will correctly return false for "false", undefined, or any other string.
    return settings.value[featureName] === 'true';
  }),
};
