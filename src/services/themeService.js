// C:/Users/Reign/IdeaProjects/ForkMyFolio-frontend-vue/src/services/theme.js

import { ref, watch } from 'vue';

/**
 * A reactive service to manage and persist the application's theme.
 */

// 1. Define a reactive reference for the current theme.
//    Initialize it by reading from localStorage, defaulting to 'light' mode.
const currentTheme = ref(localStorage.getItem('theme') || 'light');

// 2. Create a watcher that reacts to changes in `currentTheme`.
//    This is the core of the solution. Whenever `currentTheme.value` changes,
//    this function will run.
watch(currentTheme, (newTheme) => {
  // Update the `data-bs-theme` attribute on the root <html> element.
  // This is what makes Bootstrap's dark mode variables work globally.
  document.documentElement.setAttribute('data-bs-theme', newTheme);

  // Save the new theme choice to localStorage for persistence across sessions.
  localStorage.setItem('theme', newTheme);
}, {
  // The `immediate: true` option is crucial. It forces the watcher to
  // run immediately when the service is first used, ensuring the theme is
  // applied on the very first load, before anything is displayed.
  immediate: true
});

// 3. Export a composable function that components can use to interact with the theme.
export function useTheme() {
  /**
   * Toggles the current theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  };

  return {
    currentTheme,
    toggleTheme
  };
}
