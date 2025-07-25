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
                <!-- The v-for loop now correctly handles the 'value' property -->
                <div v-for="setting in settings" :key="setting.uuid"
                     class="form-check form-switch form-switch-lg mb-3">
                  <!--
                    --- KEY CHANGE #1: The v-model now binds to `setting.value` ---
                    We use `true-value` and `false-value` to tell Vue to treat
                    the string values "true" and "false" as the checked/unchecked states.
                  -->
                  <input
                    :id="`switch-${setting.name}`"
                    v-model="setting.value"
                    class="form-check-input"
                    role="switch"
                    type="checkbox"
                    true-value="true"
                    false-value="false"
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
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
// Import from the main barrel file for consistency
import {getAdminSettings, updateAdminSettings, ApiError} from '@/services/api/index.js';
import {settingsService} from '@/services/settingsService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const settings = ref([]);
const originalSettings = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const isDirty = ref(false);

const showSuccessModal = ref(false);
const successMessage = ref('');
const showErrorModal = ref(false);
const errorMessage = ref('');

const copySettings = (source) => {
  if (!Array.isArray(source)) return [];
  return source.map(setting => ({ ...setting }));
};

onMounted(async () => {
  try {
    // This correctly fetches settings with a `value` property
    const fetchedSettings = await getAdminSettings() || [];
    settings.value = copySettings(fetchedSettings);
    originalSettings.value = copySettings(fetchedSettings);
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    error.value = err instanceof ApiError ? err : { message: 'An unexpected error occurred.' };
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
    // --- KEY CHANGE #2: The payload now sends a `value` property ---
    // This creates the exact JSON array the backend is expecting.
    const payload = settings.value.map((s) => ({ uuid: s.uuid, value: s.value }));
    const updatedSettings = await updateAdminSettings(payload);

    settingsService.updateSettings(updatedSettings);

    settings.value = copySettings(updatedSettings);
    originalSettings.value = copySettings(updatedSettings);
    isDirty.value = false;

    successMessage.value = 'Your site visibility settings have been updated successfully.';
    showSuccessModal.value = true;
    setTimeout(() => {
      showSuccessModal.value = false;
    }, 2000);

  } catch (err) {
    console.error('Failed to save settings:', err);
    errorMessage.value = err.message || 'An unexpected error occurred. Please try again.';
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const resetChanges = () => {
  settings.value = copySettings(originalSettings.value);
  isDirty.value = false;
};

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
  vertical-align: -0.125em;
}

.form-switch-lg {
  padding-left: 3.5rem;
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
