<template>
  <label aria-label="Toggle theme" class="theme-switch" for="theme-switch-checkbox">
    <input
      id="theme-switch-checkbox"
      :checked="isDarkMode"
      type="checkbox"
      @change="toggleTheme"
    />
    <div class="slider">
      <div class="slider-thumb">
        <i class="bi bi-sun-fill sun-icon"></i>
        <i class="bi bi-moon-stars-fill moon-icon"></i>
      </div>
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from '@/services/themeService.js';

/**
 * @file src/components/common/ThemeToggle.vue
 * @description A stylish toggle switch component for changing between light and dark themes.
 */

// Get the reactive theme state and the toggle function from our new service.
const { currentTheme, toggleTheme } = useTheme();

// This computed property correctly reacts to changes from the central service.
const isDarkMode = computed(() => currentTheme.value === 'dark');
</script>

<style scoped>
.theme-switch {
  display: inline-block;
  height: 26px;
  width: 50px;
  position: relative;
  cursor: pointer;
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 26px;
  transition: background-color 0.4s;
  display: flex;
  align-items: center;
}

.slider-thumb {
  position: absolute;
  content: '';
  height: 22px;
  width: 22px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.4s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Hide the icon that is not active */
}

.sun-icon, .moon-icon {
  font-size: 14px;
  transition: opacity 0.4s, transform 0.4s;
  position: absolute;
}

/* --- KEY CHANGE: Swapped icon visibility --- */

/* Default state (light mode) now shows the SUN */
.sun-icon {
  color: #f39c12; /* A nice sunny yellow */
  opacity: 1;
  transform: translateY(0);
}

/* Moon is now hidden by default */
.moon-icon {
  color: #34495e; /* A dark, night-sky blue */
  opacity: 0;
  transform: translateY(100%);
}

input:checked + .slider {
  background-color: var(--bs-primary, #0d6efd);
}

input:checked + .slider .slider-thumb {
  transform: translateX(24px);
}

/* Checked state (dark mode) now shows the MOON */
input:checked + .slider .sun-icon {
  opacity: 0;
  transform: translateY(-100%);
}

input:checked + .slider .moon-icon {
  opacity: 1;
  transform: translateY(0);
}
</style>
