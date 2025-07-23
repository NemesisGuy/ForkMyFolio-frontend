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
          <!-- THIS IS THE FIX: The modal-content now has the glass-card class -->
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
              <template v-if="Array.isArray(message)">
                <ul class="mb-0 ps-3">
                  <li v-for="(item, index) in message" :key="index">{{ item }}</li>
                </ul>
              </template>
              <template v-else>
                <p>{{ message }}</p>
              </template>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-danger" type="button" @click="handleClose">
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
 * @file src/components/common/ErrorModal.vue
 * @description A reusable, glassmorphic modal component for displaying error messages.
 */

defineProps({
  title: {
    type: String,
    default: 'Error',
  },
  message: {
    type: [String, Array],
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  modalId: {
    type: String,
    default: () => `error-modal-${Math.random().toString(36).slice(2, 11)}`,
  }
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
/* THIS IS THE FIX: Glassmorphism styles for the modal */
.modal-content.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--bs-light); /* Assuming a dark backdrop, so light text */
}

/* Make header and footer semi-transparent to continue the glass effect */
.modal-header {
  background-color: rgba(var(--bs-danger-rgb), 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-body {
  color: var(--bs-body-color); /* Use standard body color for readability */
  text-align: left;
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.1);
}

/* Ensure button has good contrast */
.btn-outline-danger {
  border-color: var(--bs-danger);
  color: var(--bs-danger);
}
.btn-outline-danger:hover {
  background-color: var(--bs-danger);
  color: #fff;
}

/* Lifts the modal's content above any shimmering pseudo-elements */
.modal-content.glass-card .modal-header,
.modal-content.glass-card .modal-body,
.modal-content.glass-card .modal-footer {
  position: relative;
  z-index: 1;
}
</style>
