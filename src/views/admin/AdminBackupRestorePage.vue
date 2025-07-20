<template>
  <div class="admin-backup-restore-page py-5 animated-gradient-background">
    <!-- Modals for user feedback -->
    <LoadingModal :visible="isDownloading || isRestoring" />
    <SuccessModal :visible="showSuccessModal" title="Success" :message="modalMessage" @close="showSuccessModal = false" />
    <ErrorModal :visible="showErrorModal" title="Error" :message="modalMessage" @close="showErrorModal = false" />
    <ConfirmModal
      :visible="showConfirmModal"
      title="Confirm Restore"
      :message="confirmModalMessage"
      confirm-text="Yes, Restore Now"
      @confirm="executeRestore"
      @cancel="cancelRestore"
    />

    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-light">Backup & Restore</h1>
        <p class="lead text-muted">Manage your portfolio data by downloading backups or restoring from a file.</p>
      </div>

      <div class="row g-4 justify-content-center">
        <!-- Download Card -->
        <div class="col-lg-6">
          <div class="card h-100 glass-card shimmering">
            <div class="card-body d-flex flex-column text-center p-4 p-lg-5">
              <div class="feature-icon mb-3"><i class="bi bi-cloud-arrow-down-fill"></i></div>
              <h5 class="card-title">Download Backup</h5>
              <p class="card-text small text-muted flex-grow-1">
                Download a complete JSON file of your entire portfolio, including your profile, projects, skills, and more. Keep it in a safe place!
              </p>
              <button class="btn btn-primary mt-auto" @click="handleDownload" :disabled="isDownloading || isRestoring">
                <span v-if="isDownloading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-if="isDownloading"> Downloading...</span>
                <span v-else>Download Portfolio Data</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Restore Card -->
        <div class="col-lg-6">
          <div class="card h-100 glass-card shimmering border-danger">
            <div class="card-body d-flex flex-column text-center p-4 p-lg-5">
              <div class="feature-icon mb-3 text-danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
              <h5 class="card-title text-danger">Restore from Backup</h5>
              <p class="card-text small text-muted flex-grow-1">
                <strong class="text-danger">This is a destructive action.</strong> Restoring from a file will completely
                <strong>overwrite and replace</strong> all of your current portfolio data with the content from the backup file.
              </p>
              <div class="mt-auto">
                <input class="form-control mb-3" type="file" @change="handleFileSelect" accept=".json" :disabled="isRestoring || isDownloading" ref="fileInputRef">
                <button class="btn btn-danger w-100" @click="requestRestoreConfirmation" :disabled="!selectedFile || isRestoring || isDownloading">
                  <span v-if="isRestoring" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-if="isRestoring"> Restoring...</span>
                  <span v-else>Upload & Restore Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <router-link :to="{ name: 'admin' }" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to Admin Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// --- THIS IS THE CHANGE ---
// Import from the new, dedicated backup service file.
import { downloadBackup, ingestBackup } from '@/services/api/backup.api.js';
import LoadingModal from '@/components/common/LoadingModal.vue';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

// --- Component State ---
const isDownloading = ref(false);
const isRestoring = ref(false);
const selectedFile = ref(null);
const fileInputRef = ref(null);

// --- Modal State ---
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const showConfirmModal = ref(false);
const modalMessage = ref('');
const confirmModalMessage = 'This will permanently delete your current portfolio data and replace it with the data from the selected file. This action cannot be undone. Are you sure you want to proceed?';

// --- Event Handlers ---
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0] || null;
};

const handleDownload = async () => {
  isDownloading.value = true;
  try {
    await downloadBackup();
    modalMessage.value = 'Backup download started successfully!';
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Backup download failed:', error);
    modalMessage.value = 'Failed to download backup. Please try again.';
    showErrorModal.value = true;
  } finally {
    isDownloading.value = false;
  }
};

const requestRestoreConfirmation = () => {
  if (!selectedFile.value) {
    modalMessage.value = 'Please select a backup file to restore.';
    showErrorModal.value = true;
    return;
  }
  showConfirmModal.value = true;
};

const cancelRestore = () => {
  showConfirmModal.value = false;
};

const executeRestore = async () => {
  showConfirmModal.value = false;
  isRestoring.value = true;
  try {
    await ingestBackup(selectedFile.value);
    modalMessage.value = 'Portfolio restored successfully! The page will now reload to apply the changes.';
    showSuccessModal.value = true;
    // Reload to reflect the new data everywhere after user sees the message
    setTimeout(() => window.location.reload(), 3000);
  } catch (error) {
    console.error('Portfolio restore failed:', error);
    modalMessage.value = error.response?.data?.message || 'An unknown error occurred during restore.';
    showErrorModal.value = true;
    isRestoring.value = false; // Only stop loading on error, on success page reloads
  } finally {
    // Reset file input on error, as success will reload the page anyway
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    selectedFile.value = null;
  }
};
</script>

<style scoped>
.admin-backup-restore-page {
  min-height: calc(100vh - 56px - 1px);
  overflow-x: hidden;
}

.card-body {
  position: relative;
  z-index: 1;
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--bs-primary);
  margin-bottom: 1rem;
}
</style>
