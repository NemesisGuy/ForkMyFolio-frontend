<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title">Modal Test Page</h1>
        <p class="card-text">Use these buttons to test the application's modals.</p>
        <hr>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-success" @click="triggerSuccessModal">
            Show Success Modal
          </button>
          <button class="btn btn-danger" @click="triggerErrorModalString">
            Show Error Modal (String)
          </button>
          <button class="btn btn-danger" @click="triggerErrorModalList">
            Show Error Modal (List)
          </button>
          <button class="btn btn-warning" @click="triggerConfirmModal">
            Show Confirm Modal
          </button>
        </div>
        <div v-if="confirmResult" class="mt-3 alert alert-info">
          Confirm Modal Result: {{ confirmResult }}
        </div>
      </div>
    </div>

    <!-- Modals to be tested -->
    <SuccessModal
      :message="successMessage"
      :title="successTitle"
      :visible="showSuccess"
      @close="closeSuccessModal"
    />

    <ErrorModal
      :message="errorMessage"
      :title="errorTitle"
      :visible="showError"
      @close="closeErrorModal"
    />

    <ConfirmModal
      :cancelText="cancelButtonText"
      :confirmText="confirmButtonText"
      :message="confirmMessage"
      :title="confirmTitle"
      :visible="showConfirm"
      @cancel="handleCancel"
      @close="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue'; // Import ConfirmModal

/**
 * @file src/views/dev/ModalTestPage.vue
 * @description A development page for testing modal components.
 */

// --- Success Modal State & Logic ---
const showSuccess = ref(false);
const successTitle = ref('Operation Successful');
const successMessage = ref('Your action was completed without any issues.');

const triggerSuccessModal = () => {
  showSuccess.value = true;
};

const closeSuccessModal = () => {
  showSuccess.value = false;
};


// --- Error Modal State & Logic ---
const showError = ref(false);
const errorTitle = ref('An Error Occurred');
const errorMessage = ref(''); // Can be a string or an array

const triggerErrorModalString = () => {
  errorTitle.value = 'Login Failed';
  errorMessage.value = 'The credentials you provided are incorrect. Please try again.';
  showError.value = true;
};

const triggerErrorModalList = () => {
  errorTitle.value = 'Validation Failed';
  errorMessage.value = [
    'Username must be at least 3 characters.',
    'Email address is invalid.',
    'Password does not meet complexity requirements.'
  ];
  showError.value = true;
};

const closeErrorModal = () => {
  showError.value = false;
};

// --- Confirm Modal State & Logic ---
const showConfirm = ref(false);
const confirmTitle = ref('Confirm Action');
const confirmMessage = ref('Are you sure you want to proceed with this action?');
const confirmButtonText = ref('Proceed');
const cancelButtonText = ref('Abort');
const confirmResult = ref(null); // To display the result of the confirmation

const triggerConfirmModal = () => {
  confirmResult.value = null; // Clear previous result
  showConfirm.value = true;
};

const handleConfirm = () => {
  confirmResult.value = 'Confirmed!';
  showConfirm.value = false; // Hide the modal
};

const handleCancel = () => {
  confirmResult.value = 'Cancelled.';
  showConfirm.value = false; // Hide the modal
};
</script>

<style scoped>
/* You can add any specific styles for the test page here if needed */
</style>
