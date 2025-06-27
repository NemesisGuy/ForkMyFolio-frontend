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
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" :id="modalId + 'Label'">{{ title }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="handleClose"
            aria-label="Close"
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
          <button type="button" class="btn btn-outline-danger" @click="handleClose">
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
 * @file src/components/common/ErrorModal.vue
 * @description A reusable modal component for displaying error messages.
 * Can display a single message string or a list of error strings.
 * Uses Bootstrap 5 modal functionality.
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

/** @type {import('vue').Ref<HTMLElement|null>} */
const modalEl = ref(null);
/** @type {BootstrapModal|null} */
let bsModal = null;

onMounted(() => {
  if (modalEl.value) {
    bsModal = new BootstrapModal(modalEl.value);
    modalEl.value.addEventListener('hidden.bs.modal', () => {
      if (props.visible) {
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
