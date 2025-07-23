<template>
  <teleport to="body">
    <div v-if="visible" class="loading-modal-overlay">
      <!-- Backdrop with blur effect -->
      <div class="loading-modal-backdrop"></div>
      <!-- Spinner Container -->
      <div class="loading-modal-content">
        <!-- THIS IS THE FIX: A custom glassmorphic spinner -->
        <div class="glass-spinner"></div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
/**
 * @file src/components/common/LoadingModal.vue
 * @description A full-screen, glassmorphic loading modal component.
 * Displays a blurred, semi-transparent overlay and a centered, glowing spinner.
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
  z-index: 1060;
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
  /* THIS IS THE FIX: Frosted glass effect */
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px); /* For Safari */
}

.loading-modal-content {
  position: relative;
  z-index: 1061;
}

/* THIS IS THE FIX: Custom Glassmorphic Spinner */
.glass-spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
