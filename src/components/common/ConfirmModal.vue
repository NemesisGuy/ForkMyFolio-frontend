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
          <div class="modal-content">
            <div class="modal-header">
              <h5 :id="modalId + 'Label'" class="modal-title">{{ title }}</h5>
              <button
                aria-label="Close"
                class="btn-close"
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
              <button class="btn btn-primary" type="button" @click="handleConfirm">
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
 * @description A reusable modal component for asking users to confirm an action.
 * This is a custom implementation using Vue and Bootstrap CSS, without Bootstrap JS.
 */

const props = defineProps({
  /**
   * The title of the modal.
   * @type {String}
   * @required
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * The confirmation message to display in the modal body.
   * @type {String}
   * @required
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * Controls the visibility of the modal.
   * @type {Boolean}
   * @required
   */
  visible: {
    type: Boolean,
    required: true,
  },
  /**
   * Text for the confirmation button.
   * @type {String}
   * @default 'Confirm'
   */
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  /**
   * Text for the cancel button.
   * @type {String}
   * @default 'Cancel'
   */
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  /**
   * A unique ID for the modal.
   * @type {String}
   */
  modalId: {
    type: String,
    default: () => `confirm-modal-${Math.random().toString(36).slice(2, 11)}`,
  }
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

/**
 * Handles the click on the confirm button.
 * Emits a 'confirm' event.
 */
const handleConfirm = () => {
  emit('confirm');
};

/**
 * Handles the click on the cancel button or the header close button.
 * Emits a 'cancel' event. Also emits 'close' for general handling.
 */
const handleCancel = () => {
  emit('cancel');
  emit('close'); // Emit 'close' as well for general purpose modal handling
};
</script>

<style scoped>
/* Scoped styles for the modal if needed */
.modal-header {
  /* Standard Bootstrap header, can be customized if needed */
}

/* Ensure button spacing or specific styling if defaults aren't ideal */
.modal-footer .btn + .btn {
  margin-left: 0.5rem;
}
</style>
