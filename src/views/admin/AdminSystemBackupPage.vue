<template>
  <div class="admin-system-backup-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5 animate-fade-in-up">
        <h2 class="display-5 glass-text">System Backup & Restore</h2>
        <p class="lead glass-subtitle" style="animation-delay: 0.1s;">
          Perform system-wide data management operations. Use with extreme caution.
        </p>
      </div>

      <!-- Modals for feedback -->
      <LoadingModal :visible="isLoading"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Operation Successful"
                    @close="successMessage = null"/>
      <ErrorModal :message="errorMessage" :visible="!!errorMessage" title="Operation Failed"
                  @close="errorMessage = null"/>
      <ConfirmModal
        ref="confirmModalRef"
        :message="confirmMessage"
        title="Confirm Destructive Action"
        type="danger"
        @close="actionToConfirm = null"
        @confirm="executeConfirmedAction"
      />

      <div class="row g-4 justify-content-center">
        <!-- System Backup Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-cloud-download-fill display-4 text-primary"></i>
              </div>
              <h5 class="card-title glass-title">System Backup</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                Download a single JSON file containing all data for all users.
              </p>
              <button :disabled="isLoading" class="btn btn-primary mt-auto"
                      @click="handleDownloadSystemBackup">
                Download System Backup
              </button>
            </div>
          </div>
        </div>

        <!-- System Restore Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="card h-100 glass-card interactive-card-lift">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-cloud-upload-fill display-4 text-warning"></i></div>
              <h5 class="card-title glass-title">System Restore</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                <strong class="text-danger">Wipes all data</strong> and restores from a system
                backup file.
              </p>
              <div class="mt-auto">
                <input ref="systemRestoreInput" accept="application/json" class="form-control"
                       type="file" @change="e => systemRestoreFile = e.target.files[0]">
                <button :disabled="!systemRestoreFile || isLoading"
                        class="btn btn-warning mt-3 w-100" @click="confirmAction('restoreSystem')">
                  Restore Entire System
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Single User Restore Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.4s;">
          <div class="card h-100 glass-card interactive-card-lift">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-person-up display-4 text-info"></i></div>
              <h5 class="card-title glass-title">Restore Single User</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                <strong class="text-danger">Wipes one user's portfolio</strong> and restores it
                from a standard user backup file.
              </p>
              <div class="mt-auto">
                <select v-model="selectedUserUuid" class="form-select mb-2">
                  <option disabled value="">Select a user to restore...</option>
                  <option v-for="user in allUsers" :key="user.uuid" :value="user.uuid">
                    {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                  </option>
                </select>
                <input ref="userRestoreInput" accept="application/json" class="form-control"
                       type="file" @change="e => userRestoreFile = e.target.files[0]">
                <button :disabled="!userRestoreFile || !selectedUserUuid || isLoading"
                        class="btn btn-info mt-3 w-100" @click="confirmAction('restoreUser')">
                  Restore User
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Wipe Data Card -->
        <div class="col-md-6 col-lg-5 animate-fade-in-up" style="animation-delay: 0.5s;">
          <div class="card h-100 glass-card interactive-card-lift border-danger">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-exclamation-octagon-fill display-4 text-danger"></i>
              </div>
              <h5 class="card-title text-danger">Wipe All Data</h5>
              <p class="card-text glass-subtitle small flex-grow-1">
                <strong class="text-danger">Irreversibly deletes all users, portfolios, and data
                  from the system.</strong>
              </p>
              <button :disabled="isLoading" class="btn btn-danger mt-auto"
                      @click="confirmAction('wipeSystem')">
                Wipe System Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {
  downloadSystemBackup,
  getAdminUsers,
  restoreSingleUserBackup,
  restoreSystemBackup,
  wipeSystemData
} from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';

// --- State ---
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// --- User Selection State ---
const allUsers = ref([]);
const selectedUserUuid = ref('');

// --- File Input State ---
const systemRestoreFile = ref(null);
const userRestoreFile = ref(null);
const systemRestoreInput = ref(null);
const userRestoreInput = ref(null);

// --- Confirmation Modal State ---
const confirmModalRef = ref(null);
const actionToConfirm = ref(null);
const confirmMessage = ref('');

// --- Lifecycle ---
onMounted(async () => {
  isLoading.value = true;
  try {
    allUsers.value = await getAdminUsers({size: 1000}); // Fetch a large number of users
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load the list of users.';
  } finally {
    isLoading.value = false;
  }
});

// --- Handlers ---
const handleDownloadSystemBackup = async () => {
  isLoading.value = true;
  try {
    await downloadSystemBackup();
    // No success message needed as the browser handles the download prompt.
  } catch (err) {
    errorMessage.value = err.message || 'Failed to download system backup.';
  } finally {
    isLoading.value = false;
  }
};

const confirmAction = (action) => {
  actionToConfirm.value = action;
  switch (action) {
    case 'restoreSystem':
      confirmMessage.value = 'Are you sure you want to restore the entire system? This will WIPE ALL CURRENT DATA and replace it with the contents of the backup file.';
      break;
    case 'restoreUser':
      confirmMessage.value = `Are you sure you want to restore this user's portfolio? This will WIPE THEIR CURRENT PORTFOLIO DATA.`;
      break;
    case 'wipeSystem':
      confirmMessage.value = 'Are you absolutely sure you want to WIPE THE ENTIRE SYSTEM? This action is irreversible and will delete all users and data.';
      break;
  }
  confirmModalRef.value?.show();
};

const executeConfirmedAction = async () => {
  const action = actionToConfirm.value;
  if (!action) return;

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    switch (action) {
      case 'restoreSystem':
        await handleSystemRestore();
        break;
      case 'restoreUser':
        await handleUserRestore();
        break;
      case 'wipeSystem':
        await handleWipeSystem();
        break;
    }
  } catch (err) {
    errorMessage.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
    actionToConfirm.value = null;
  }
};

const handleSystemRestore = async () => {
  if (!systemRestoreFile.value) throw new Error('No system restore file selected.');
  const formData = new FormData();
  formData.append('file', systemRestoreFile.value);
  await restoreSystemBackup(formData);
  successMessage.value = 'System has been successfully restored.';
  systemRestoreFile.value = null;
  if (systemRestoreInput.value) systemRestoreInput.value.value = '';
};

const handleUserRestore = async () => {
  if (!userRestoreFile.value) throw new Error('No user restore file selected.');
  if (!selectedUserUuid.value) throw new Error('No user selected for restore.');
  const formData = new FormData();
  formData.append('file', userRestoreFile.value);
  await restoreSingleUserBackup(selectedUserUuid.value, formData);
  successMessage.value = 'User portfolio has been successfully restored.';
  userRestoreFile.value = null;
  if (userRestoreInput.value) userRestoreInput.value.value = '';
};

const handleWipeSystem = async () => {
  await wipeSystemData();
  successMessage.value = 'The system has been completely wiped.';
};

</script>

<style scoped>
.admin-system-backup-page .display-5 {
  font-weight: 300;
}

.card-body .display-4 {
  opacity: 0.8;
}

.border-danger {
  border-color: rgba(var(--bs-danger-rgb), 0.5) !important;
}

.border-danger:hover {
  border-color: rgba(var(--bs-danger-rgb), 0.8) !important;
  box-shadow: 0 8px 32px rgba(var(--bs-danger-rgb), 0.3) !important;
}
</style>