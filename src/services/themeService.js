/**
 * @file src/services/themeService.js
 * @description A reactive service to manage and persist the application's theme ('light' or 'dark').
 * It automatically applies the theme to the document and saves the user's choice.
 */

import {ref, watch} from 'vue';

/**
 * The reactive reference for the current theme.
 * It initializes its value from localStorage to persist the theme across sessions.
 * @type {import('vue').Ref<'light' | 'dark'>}
 */
const currentTheme = ref(localStorage.getItem('theme') || 'light');

/**
 * A watcher that reacts to changes in `currentTheme`.
 * It updates the `data-bs-theme` attribute on the root <html> element and persists the choice to localStorage.
 */
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

/**
 * A composable function that provides access to the theme state and a function to toggle it.
 * @returns {{currentTheme: import('vue').Ref<'light' | 'dark'>, toggleTheme: function(): void}}
 */
export function useTheme() {
  /**
   * Toggles the current theme between 'light' and 'dark'.
   * @returns {void}
   */
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  };

  return {
    currentTheme,
    toggleTheme
  };
}
