<template>
  <teleport to="body">
    <div v-if="visible" class="loading-modal-overlay">
      <!-- Backdrop -->
      <div class="loading-modal-backdrop"></div>
      <!-- Spinner Container -->
      <div class="loading-modal-content">
        <LoadingSpinner class="text-light" />
      </div>
    </div>
  </teleport>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue';

/**
 * @file src/components/common/LoadingModal.vue
 * @description A full-screen loading modal component.
 * Displays a semi-transparent overlay and a centered spinner to block UI interaction
 * during long-running asynchronous operations.
 */

defineProps({
  /**
   * Controls the visibility of the loading modal.
   * @type {Boolean}
   * @required
   */
  visible: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.loading-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1060; /* Higher than other modals to ensure it's on top */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
}

.loading-modal-content {
  position: relative; /* To be above the backdrop */
  z-index: 1061;
}

/* Make the spinner inside the modal larger for better visibility */
.loading-modal-content :deep(.spinner-border) {
  width: 4rem;
  height: 4rem;
}
</style>
