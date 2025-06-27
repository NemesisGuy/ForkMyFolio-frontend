<template>
  <div
    class="modal fade"
    tabindex="-1"
    :aria-labelledby="modalId + 'Label'"
    aria-hidden="true"
    :id="modalId"
    ref="modalEl"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="modalId + 'Label'">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="handleCancel"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button type="button" class="btn btn-primary" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Modal as BootstrapModal } from 'bootstrap';

/**
 * @file src/components/common/ConfirmModal.vue
 * @description A reusable modal component for asking users to confirm an action.
 * Uses Bootstrap 5 modal functionality.
 * Backdrop clicks and ESC key are disabled by default to force explicit choice.
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

/** @type {import('vue').Ref<HTMLElement|null>} */
const modalEl = ref(null);
/** @type {BootstrapModal|null} */
let bsModal = null;

onMounted(() => {
  if (modalEl.value) {
    // Initialize with backdrop static and keyboard false
    bsModal = new BootstrapModal(modalEl.value, {
      backdrop: 'static', // Already set via data-bs-backdrop but explicit here for clarity
      keyboard: false     // Already set via data-bs-keyboard but explicit here for clarity
    });

    // Unlike other modals, we don't emit 'close' or 'cancel' on 'hidden.bs.modal'
    // because for confirmation modals, dismissal should be explicit via buttons.
    // The data-bs-backdrop="static" and data-bs-keyboard="false" attributes
    // prevent closing on backdrop click or ESC.
  }
});

onBeforeUnmount(() => {
  if (bsModal) {
    bsModal.dispose();
  }
});

watch(() => props.visible, (newValue) => {
  if (bsModal) {
    if (newValue) {
      bsModal.show();
    } else {
      // Ensure modal is hidden if prop changes externally, e.g. after confirm/cancel action in parent
      bsModal.hide();
    }
  }
});

/**
 * Handles the click on the confirm button.
 * Emits a 'confirm' event.
 */
const handleConfirm = () => {
  emit('confirm');
  // Parent should set visible to false after handling confirm
};

/**
 * Handles the click on the cancel button or the header close button.
 * Emits a 'cancel' event. Also emits 'close' for general handling.
 */
const handleCancel = () => {
  emit('cancel');
  emit('close'); // Emit 'close' as well for general purpose modal handling
  // Parent should set visible to false after handling cancel/close
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
