import {reactive} from 'vue';

/**
 * @file src/services/themeService.js
 * @description Manages the application's color theme (light/dark).
 * Handles theme persistence in localStorage and applies the theme to the document.
 */

const THEME_STORAGE_KEY = 'forkmyfolio_theme';

// Determine the default theme: check localStorage first, then system preference.
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const state = reactive({
  /** @type {'light' | 'dark'} */
  current: getInitialTheme(),
});

/**
 * Applies the given theme to the document and saves it to localStorage.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  state.current = theme;
}

/**
 * Toggles the theme between 'light' and 'dark'.
 */
function toggleTheme() {
  const newTheme = state.current === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

/**
 * Loads the initial theme when the app starts.
 */
function loadTheme() {
  applyTheme(state.current);
}

export const themeService = {
  // Reactive state
  theme: state,
  // Methods
  toggleTheme,
  loadTheme,
};
