<template>
  <div class="backup-restore-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5 animate-fade-in-up">
        <h2 class="display-5 glass-text">Backup & Restore</h2>
        <p class="lead glass-subtitle" style="animation-delay: 0.1s;">
          Download a full backup of your portfolio or restore from a previously saved file.
        </p>
      </div>

      <!-- Loading and Error Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error || ''" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage || ''" :visible="!!successMessage" title="Success"
                    @close="handleSuccessClose"/>

      <div class="row g-4 justify-content-center">
        <!-- Backup Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3">
                <i class="bi bi-database-down display-4 text-primary"></i>
              </div>
              <h5 class="card-title glass-title">Download Backup</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                Generate and download a full backup of your projects, skills, experience, and other
                portfolio data as a single JSON file.
              </p>
              <button :disabled="isLoading" class="btn btn-primary mt-auto interactive-lift"
                      @click="handleDownloadBackup">
                Download My Data
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
                Select a valid portfolio backup JSON file to restore your data.
                <strong class="text-danger d-block mt-2">Warning: This will overwrite your current
                  portfolio data.</strong>
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
                  Restore from File
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
import {downloadMyBackup, restoreMyBackup} from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

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
  router.push({name: 'dashboard', params: {slug: props.slug}});
};
</script>

<style scoped>
.backup-restore-page .display-5 {
  font-weight: 300;
}

.card-title i {
  vertical-align: -0.125em;
}

.form-control {
  background-color: rgba(var(--bs-body-bg-rgb), 0.5);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  color: var(--bs-body-color);
}
</style>
