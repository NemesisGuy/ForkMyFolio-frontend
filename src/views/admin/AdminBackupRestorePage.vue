<template>
  <div class="admin-backup-restore-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5 animate-fade-in-up">
        <h1 class="display-5 fw-light glass-text">System Backup & Restore</h1>
        <p class="lead glass-subtitle" style="animation-delay: 0.1s;">
          Create a full system backup or restore the entire application from a previously saved
          file.
        </p>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="handleSuccessClose"/>

      <div class="row g-4 justify-content-center">
        <!-- Backup Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3">
                <i class="bi bi-database-down display-4 text-primary"></i>
              </div>
              <h5 class="card-title glass-title">Download System Backup</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                Generate and download a full backup of all users and their portfolio data as a
                single JSON file.
              </p>
              <button :disabled="isLoading" class="btn btn-primary mt-auto interactive-lift"
                      @click="handleDownloadBackup">
                Download System Data
              </button>
            </div>
          </div>
        </div>

        <!-- Restore Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3">
                <i class="bi bi-database-up display-4 text-warning"></i>
              </div>
              <h5 class="card-title glass-title">Restore from Backup</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                Select a valid system backup JSON file to restore all data.
                <strong class="text-danger d-block mt-2">Warning: This will overwrite the entire
                  system's data.</strong>
              </p>
              <div class="mt-auto">
                <input
                  ref="fileInput"
                  :disabled="isLoading"
                  accept="application/json"
                  class="form-control"
                  type="file"
                  @change="handleFileSelect"
                />
                <button :disabled="!selectedFile || isLoading"
                        class="btn btn-warning mt-3 w-100 interactive-lift"
                        @click="handleRestoreBackup">
                  Restore System from File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
// Use the dedicated backup API functions
import {downloadBackup, ingestBackup} from '@/services/api/backup.api.js';
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
  isLoading.value = true;
  error.value = null;
  try {
    await downloadBackup();
  } catch (err) {
    console.error('System backup download failed:', err);
    error.value = err.message || 'An unexpected error occurred during the system backup download.';
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
  isLoading.value = true;
  error.value = null;
  try {
    await ingestBackup(selectedFile.value);
    successMessage.value = 'The system has been successfully restored! You will now be redirected to the admin dashboard.';
  } catch (err) {
    console.error('System restore failed:', err);
    error.value = err.message || 'An unexpected error occurred during the restore. Please ensure the file is a valid system backup.';
  } finally {
    isLoading.value = false;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    selectedFile.value = null;
  }
};

const handleSuccessClose = () => {
  successMessage.value = null;
  router.push({name: 'admin'});
};
</script>

<style scoped>
.admin-backup-restore-page .display-5 {
  font-weight: 300;
}

.form-control {
  background-color: rgba(var(--bs-body-bg-rgb), 0.5);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  color: var(--bs-body-color);
}
</style>
