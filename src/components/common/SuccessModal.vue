<template>
  <div
    class="modal fade"
    tabindex="-1"
    :aria-labelledby="modalId + 'Label'"
    aria-hidden="true"
    :id="modalId"
    ref="modalEl"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title" :id="modalId + 'Label'">{{ title }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="handleClose"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-success" @click="handleClose">
            OK
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
 * @file src/components/common/SuccessModal.vue
 * @description A reusable modal component for displaying success messages.
 * Uses Bootstrap 5 modal functionality.
 */

const props = defineProps({
  /**
   * The title of the modal.
   * @type {String}
   * @default 'Success'
   */
  title: {
    type: String,
    default: 'Success',
  },
  /**
   * The success message to display in the modal body.
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
   * A unique ID for the modal, useful if multiple modals are on a page.
   * Defaults to a dynamically generated unique ID.
   * @type {String}
   */
  modalId: {
    type: String,
    default: () => `success-modal-${Math.random().toString(36).slice(2, 11)}`,
  }
});

const emit = defineEmits(['close']);

/** @type {import('vue').Ref<HTMLElement|null>} */
const modalEl = ref(null);
/** @type {BootstrapModal|null} */
let bsModal = null;

onMounted(() => {
  if (modalEl.value) {
    bsModal = new BootstrapModal(modalEl.value);
    // Listen for Bootstrap's hidden event to emit close, ensuring sync if closed via backdrop/esc
    modalEl.value.addEventListener('hidden.bs.modal', () => {
      if (props.visible) { // Only emit if it was closed by means other than prop change
        emit('close');
      }
    });
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
      bsModal.hide();
    }
  }
});

/**
 * Handles the click on the close button or OK button.
 * Emits a 'close' event to the parent component.
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
/* Scoped styles for the modal if needed */
.modal-header.bg-success {
  /* Customizations for success header if Bootstrap defaults aren't enough */
}
.btn-outline-success {
    /* Ensure good contrast and theming */
}
</style>
