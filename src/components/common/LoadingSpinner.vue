<template>
  <div class="d-flex justify-content-center align-items-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/components/common/LoadingSpinner.vue
 * @description A simple loading spinner component.
 * Displays a Bootstrap spinner, typically used to indicate that data is being fetched.
 */

// No script logic needed for this simple component.
// Props could be added later for customization (e.g., size, color).
</script>

<style scoped>
/* Optional: Add custom styles if needed */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
