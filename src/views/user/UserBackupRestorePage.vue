<template>
  <div class="backup-restore-page container py-5">
    <h2 class="mb-4">Backup & Restore</h2>
    <p class="text-muted mb-5">
      You can download a complete backup of your portfolio data as a JSON file. You can also restore your portfolio from a previously downloaded backup file.
    </p>

    <!-- Loading and Error Modals -->
    <LoadingModal :visible="isLoading" />
    <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
    <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="handleSuccessClose" />


    <div class="row g-4">
      <!-- Backup Card -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title"><i class="bi bi-database-down me-2"></i>Download Backup</h5>
            <p class="card-text">
              Click the button below to generate and download a full backup of your projects, skills, experience, and other portfolio data.
            </p>
            <button class="btn btn-primary mt-auto" @click="handleDownloadBackup" :disabled="isLoading">
              Download My Data
            </button>
          </div>
        </div>
      </div>

      <!-- Restore Card -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title"><i class="bi bi-database-up me-2"></i>Restore from Backup</h5>
            <p class="card-text">
              Select a valid portfolio backup JSON file to restore your data.
              <strong class="text-danger">Warning: This will overwrite your current portfolio data.</strong>
            </p>
            <div class="mt-auto">
              <input
                type="file"
                class="form-control"
                ref="fileInput"
                @change="handleFileSelect"
                accept="application/json"
                :disabled="isLoading"
              />
              <button class="btn btn-warning mt-3 w-100" @click="handleRestoreBackup" :disabled="!selectedFile || isLoading">
                Restore from File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { downloadMyBackup, restoreMyBackup } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const router = useRouter();
const isLoading = ref(false);
const error = ref(null);
const successMessage = ref(null);

const fileInput = ref(null);
const selectedFile = ref(null);

const handleDownloadBackup = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    await downloadMyBackup();
    // The download is handled by the API function, so no success message is needed here.
  } catch (err) {
    console.error('Backup download failed:', err);
    error.value = err.message || 'An unexpected error occurred during the backup download.';
  } finally {
    isLoading.value = false;
  }
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0] || null;
};

const handleRestoreBackup = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a backup file first.';
    return;
  }

  error.value = null;
  isLoading.value = true;
  try {
    await restoreMyBackup(selectedFile.value);
    successMessage.value = 'Your portfolio has been successfully restored! You will now be redirected to the dashboard.';
  } catch (err) {
    console.error('Backup restore failed:', err);
    error.value = err.message || 'An unexpected error occurred during the restore process. Please ensure the file is a valid backup.';
  } finally {
    isLoading.value = false;
    // Clear the file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    selectedFile.value = null;
  }
};

const handleSuccessClose = () => {
  successMessage.value = null;
  // Redirect to dashboard to see the restored data
  router.push({ name: 'dashboard' });
};
</script>

<style scoped>
.card-title i {
  vertical-align: -0.125em;
}
</style>
