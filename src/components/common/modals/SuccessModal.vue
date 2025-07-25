<template>
  <teleport to="body">
    <div v-if="visible">
      <!-- Backdrop -->
      <div class="modal-backdrop fade show"></div>
      <!-- Modal Dialog -->
      <div
        :aria-labelledby="modalId + 'Label'"
        aria-modal="true"
        class="modal fade show"
        role="dialog"
        style="display: block"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-card">
            <div class="modal-header">
              <h5 :id="modalId + 'Label'" class="modal-title">{{ title }}</h5>
              <button
                aria-label="Close"
                class="btn-close btn-close-white"
                type="button"
                @click="handleClose"
              ></button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-success" type="button" @click="handleClose">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
/**
 * @file src/components/common/SuccessModal.vue
 * @description A reusable, glassmorphic modal component for displaying success messages.
 */

defineProps({
  title: {
    type: String,
    default: 'Success',
  },
  message: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  modalId: {
    type: String,
    default: () => `success-modal-${Math.random().toString(36).slice(2, 11)}`,
  }
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
/* Glassmorphism styles for the modal */
.modal-content.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--bs-light);
}

.modal-header {
  background-color: rgba(var(--bs-success-rgb), 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-body {
  color: var(--bs-body-color);
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-outline-success {
  border-color: var(--bs-success);
  color: var(--bs-success);
}
.btn-outline-success:hover {
  background-color: var(--bs-success);
  color: #fff;
}

/*
  THIS IS THE FIX: Lifts the modal's content above any shimmering
  pseudo-element, making all buttons inside clickable.
*/
.modal-content.glass-card .modal-header,
.modal-content.glass-card .modal-body,
.modal-content.glass-card .modal-footer {
  position: relative;
  z-index: 1;
}
</style>
