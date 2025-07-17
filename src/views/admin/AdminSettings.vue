<template>
  <div class="admin-settings-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">

          <h1 class="display-5 mb-4">Site Visibility Settings</h1>

          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">Public Section Visibility</h5>
              <small class="text-muted">Enable or disable sections on your public portfolio site.</small>
            </div>
            <div class="card-body p-4">
              <LoadingSpinner v-if="isLoading"/>

              <div v-else-if="error" class="alert alert-danger" role="alert">
                <strong>Error:</strong> {{ error.message || 'Could not load settings.' }}
              </div>

              <form v-else @submit.prevent="handleSave">
                <div v-for="setting in settings" :key="setting.name"
                     class="form-check form-switch form-switch-lg mb-3">
                  <input
                    :id="`switch-${setting.name}`"
                    v-model="setting.enabled"
                    class="form-check-input"
                    role="switch"
                    type="checkbox"
                    @change="markAsDirty"
                  >
                  <label :for="`switch-${setting.name}`" class="form-check-label">
                    <span class="fw-bold">{{ formatSettingName(setting.name) }}</span>
                    <p class="small text-muted mb-0">{{ setting.description }}</p>
                  </label>
                </div>

                <hr class="my-4">

                <div class="d-flex justify-content-end mt-3">
                  <button class="btn btn-secondary me-2" :disabled="!isDirty || isSaving" type="button"
                          @click="resetChanges">
                    Reset
                  </button>
                  <button class="btn btn-primary" :disabled="!isDirty || isSaving" type="submit">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals for loading, success, and error feedback -->
    <LoadingModal :visible="isSaving"/>
    <SuccessModal
      :visible="showSuccessModal"
      title="Settings Saved"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
    <ErrorModal
      :message="errorMessage"
      :visible="showErrorModal"
      title="Save Failed"
      @close="showErrorModal = false"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getAdminSettings, updateAdminSettings} from '@/services/api/admin.api.js';
import {settingsService} from '@/services/settingsService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LoadingModal from '@/components/common/LoadingModal.vue';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

const settings = ref([]);
const originalSettings = ref([]); // To store the initial state for reset functionality
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const isDirty = ref(false); // Tracks if changes have been made

// State for the feedback modals
const showSuccessModal = ref(false);
const successMessage = ref('');
const showErrorModal = ref(false);
const errorMessage = ref('');

/**
 * Creates a clean, shallow copy of the settings array.
 * @param {Array} source - The source settings array.
 * @returns {Array} A new, independent copy of the array.
 */
const copySettings = (source) => {
  if (!Array.isArray(source)) return [];
  return source.map(setting => ({ ...setting }));
};

onMounted(async () => {
  try {
    const fetchedSettings = await getAdminSettings() || [];
    settings.value = copySettings(fetchedSettings);
    originalSettings.value = copySettings(fetchedSettings);
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
});

const markAsDirty = () => {
  isDirty.value = true;
};

const handleSave = async () => {
  if (!isDirty.value) return;
  isSaving.value = true;

  try {
    // The backend DTO requires the name property for validation, so we must include it.
    // We only map the properties needed for the update to avoid sending unnecessary data.
    const payload = settings.value.map((s) => ({ uuid: s.uuid, name: s.name, enabled: s.enabled }));
    const updatedSettings = await updateAdminSettings(payload);

    // Update the global settings service with the new values so the navbar updates instantly.
    settingsService.updateSettings(updatedSettings);

    settings.value = copySettings(updatedSettings);
    originalSettings.value = copySettings(updatedSettings);
    isDirty.value = false;

    // Show success modal
    successMessage.value = 'Your site visibility settings have been updated successfully.';
    showSuccessModal.value = true;
    // Auto-close after a short delay for better UX
    setTimeout(() => {
      showSuccessModal.value = false;
    }, 2000);

  } catch (err) {
    console.error('Failed to save settings:', err);
    // Show error modal
    errorMessage.value = err.message || 'An unexpected error occurred. Please try again.';
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const resetChanges = () => {
  settings.value = copySettings(originalSettings.value);
  isDirty.value = false;
  showErrorModal.value = false;
};

// Helper function to make setting names more readable
const formatSettingName = (name) => {
  if (!name) return '';
  return name
    .replace('SHOW_', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
</script>

<style scoped>
.admin-settings-page h1 {
  font-weight: 300;
}

.btn .spinner-border {
  vertical-align: -0.125em; /* Aligns spinner nicely with text */
}

.form-switch-lg {
  padding-left: 3.5rem; /* More space for the larger switch */
}

.form-switch-lg .form-check-input {
  width: 3rem;
  height: 1.5rem;
  margin-left: -3.5rem;
}

.form-check-label {
  padding-top: 0.15rem;
}
</style>
