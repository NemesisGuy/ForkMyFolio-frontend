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
            <div class="modal-header bg-danger text-white">
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
 * @description A reusable modal component for displaying error messages.
 * This is a custom implementation using Vue and Bootstrap CSS, without Bootstrap JS.
 */

const props = defineProps({
  /**
   * The title of the modal.
   * @type {String}
   * @default 'Error'
   */
  title: {
    type: String,
    default: 'Error',
  },
  /**
   * The error message(s) to display. Can be a single string or an array of strings.
   * If an array, messages will be displayed as a list.
   * @type {String|Array<String>}
   * @required
   */
  message: {
    type: [String, Array],
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
   * A unique ID for the modal.
   * @type {String}
   */
  modalId: {
    type: String,
    default: () => `error-modal-${Math.random().toString(36).slice(2, 11)}`,
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
/* Scoped styles for the modal if needed */
.modal-header.bg-danger {
  /* Customizations for error header if Bootstrap defaults aren't enough */
}

.btn-outline-danger {
  /* Ensure good contrast and theming */
}

.modal-body ul {
  text-align: left;
}
</style>
