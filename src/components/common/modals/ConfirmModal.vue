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
                :class="['btn-close', { 'btn-close-white': currentTheme === 'dark' }]"
                aria-label="Close"
                type="button"
                @click="handleCancel"
              ></button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" type="button" @click="handleCancel">
                {{ cancelText }}
              </button>
              <!-- THIS IS THE FIX: The button now uses a computed class based on the 'type' prop -->
              <button :class="['btn', confirmButtonClass]" type="button" @click="handleConfirm">
                {{ confirmText }}
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
 * @file src/components/common/ConfirmModal.vue
 * @description A reusable, glassmorphic modal for asking users to confirm an action.
 */
import { computed } from 'vue';
import { useTheme } from '@/services/themeService.js';

const { currentTheme } = useTheme();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  // THIS IS THE FIX: Replaced confirmButtonClass with a more robust 'type' prop
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'danger'].includes(value),
  },
  modalId: {
    type: String,
    default: () => `confirm-modal-${Math.random().toString(36).slice(2, 11)}`,
  }
});

// This computed property translates the 'type' prop into a Bootstrap button class
const confirmButtonClass = computed(() => {
  return `btn-${props.type}`;
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
  emit('close');
};
</script>

<style scoped>
/* Glassmorphism styles for the modal */
.modal-content.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  background-color: rgba(var(--bs-body-color-rgb), 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--bs-emphasis-color);
}

.modal-body {
  color: var(--bs-body-color);
}

.modal-footer {
  background-color: rgba(var(--bs-body-color-rgb), 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Lifts the modal's content above any shimmering pseudo-elements */
.modal-content.glass-card .modal-header,
.modal-content.glass-card .modal-body,
.modal-content.glass-card .modal-footer {
  position: relative;
  z-index: 1;
}

/* THIS IS THE FIX: Added specific styles for danger/success buttons for better visual feedback */
.modal-footer .btn {
  transition: all 0.2s ease-in-out;
}

.modal-footer .btn.btn-danger {
  color: #fff;
}

.modal-footer .btn.btn-success {
  color: #fff;
}
</style>
