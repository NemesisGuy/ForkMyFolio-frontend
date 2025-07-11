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
            <div class="modal-header bg-success text-white">
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
 * @description A reusable modal component for displaying success messages.
 * This is a custom implementation using Vue and Bootstrap CSS, without Bootstrap JS.
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

/**
 * Handles the click on the close button or OK button.
 * Emits a 'close' event to the parent component.
 */
const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
/* The .show class from Bootstrap CSS will handle the opacity of the backdrop. */
/* The `style="display: block"` makes the modal visible. */
/* No extra CSS is needed for basic functionality. */
.modal-header.bg-success {
  /* Customizations for success header if Bootstrap defaults aren't enough */
}

.btn-outline-success {
  /* Ensure good contrast and theming */
}
</style>
