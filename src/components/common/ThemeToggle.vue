<template>
  <label class="theme-switch" for="theme-switch-checkbox" aria-label="Toggle theme">
    <input
      type="checkbox"
      id="theme-switch-checkbox"
      :checked="isDarkMode"
      @change="themeService.toggleTheme"
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
import { themeService } from '@/services/themeService';

/**
 * @file src/components/common/ThemeToggle.vue
 * @description A stylish toggle switch component for changing between light and dark themes.
 */

const isDarkMode = computed(() => themeService.theme.current === 'dark');
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

.sun-icon {
  color: #f39c12; /* A nice sunny yellow */
  opacity: 0;
  transform: translateY(100%);
}

.moon-icon {
  color: #34495e; /* A dark, night-sky blue */
  opacity: 1;
  transform: translateY(0);
}

input:checked + .slider {
  background-color: var(--bs-primary, #0d6efd);
}

input:checked + .slider .slider-thumb {
  transform: translateX(24px);
}

/* Icon visibility based on theme */
input:checked + .slider .sun-icon {
  opacity: 1;
  transform: translateY(0);
}

input:checked + .slider .moon-icon {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
