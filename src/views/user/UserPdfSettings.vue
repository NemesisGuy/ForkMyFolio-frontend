<template>
  <!-- Use v-if on LoadingModal to fully remove from DOM when done -->
  <LoadingModal v-if="isLoading"/>

  <div v-show="!isLoading" class="user-pdf-settings-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <h1 class="display-5 mb-4">My PDF Settings</h1>
          <p class="lead text-muted mb-5">
            Customize the default template used when your portfolio is downloaded as a PDF.
          </p>

          <!-- Error State -->
          <div v-if="error" class="alert alert-danger">
            <h4 class="alert-heading">🚫 Error</h4>
            <p>Could not load your PDF settings. Please try again later.</p>
            <pre class="small">{{ error.message }}</pre>
          </div>

          <!-- Settings Form -->
          <form v-else @submit.prevent="handleSaveSettings">
            <div class="card glass-card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">My Default PDF Template</h5>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="form-label" for="defaultPdfTemplate">
                    Portfolio Download Template
                  </label>
                  <p class="form-text text-muted mt-0 mb-2">
                    Select the template that will be used when visitors click the download button on
                    your portfolio.
                  </p>
                  <select
                    id="defaultPdfTemplate"
                    v-model="selectedTemplate"
                    :disabled="isSaving"
                    class="form-select"
                  >
                    <option disabled value="">Please select a template</option>
                    <option
                      v-for="template in availableTemplates"
                      :key="template"
                      :value="template"
                    >
                      {{ formatTemplateName(template) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-4 text-end">
              <button
                :disabled="!isDirty || isSaving"
                class="btn btn-secondary me-2"
                type="button"
                @click="resetChanges"
              >
                Reset
              </button>
              <button
                :disabled="!isDirty || isSaving"
                class="btn btn-primary"
                type="submit"
              >
                <span
                  v-if="isSaving"
                  aria-hidden="true"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <SuccessModal
      :visible="showSuccessModal"
      message="Your PDF settings have been updated successfully."
      title="Settings Saved"
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
import {computed, nextTick, onMounted, ref} from 'vue';
// --- THIS IS THE FIX ---
// Import from the correct API modules for better separation of concerns.
import {settingsApi} from '@/services/api/user.api.js';
import {publicApi} from '@/services/api/public.api.js';
import {settingsService} from '@/services/settingsService.js';
import {ApiError} from '@/services/api/index.js';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

// --- State ---
const pdfSetting = ref(null);
const originalTemplateValue = ref('');
const availableTemplates = ref([]);

const isLoading = ref(true);
const isSaving = ref(false);
const isDirty = ref(false);
const error = ref(null);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

/**
 * A computed property with a getter/setter for two-way binding to the select input.
 * This pattern allows us to track if the value has been changed by the user.
 */
const selectedTemplate = computed({
  get: () => pdfSetting.value?.value || '',
  set: (val) => {
    // If the setting doesn't exist yet for the user, create a temporary object to hold the new value.
    if (!pdfSetting.value) {
      pdfSetting.value = {name: 'DEFAULT_PDF_TEMPLATE', value: ''};
    }

    if (pdfSetting.value.value !== val) {
      pdfSetting.value.value = val;
      isDirty.value = true;
    }
  },
});

// Sleep helper to guarantee minimum modal visible time, preventing UI flicker.
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  const minDelay = sleep(500);

  try {
    // Fetch user settings and available templates in parallel for efficiency.
    const [userSettings, templates] = await Promise.all([
      settingsApi.getAll(),
      publicApi.getAvailablePdfTemplates(), // Use the public API now
    ]);

    // Find the user's specific PDF template setting.
    const defaultSetting = userSettings.find(
      (s) => s.name === 'DEFAULT_PDF_TEMPLATE'
    );

    // It's okay if the user doesn't have this setting yet.
    if (defaultSetting) {
      pdfSetting.value = defaultSetting;
      originalTemplateValue.value = defaultSetting.value;
    } else {
      // If no setting exists, we start with a clean slate.
      originalTemplateValue.value = '';
    }

    availableTemplates.value = templates;
  } catch (err) {
    console.error('Error loading user settings:', err);
    error.value = err instanceof ApiError ? err : {message: err.message || 'Unexpected error.'};
  } finally {
    await minDelay;
    isLoading.value = false;
    await nextTick(); // ensure DOM updates for immediate interactivity
  }
});

/**
 * Saves the user's selected PDF template setting to the backend.
 */
const handleSaveSettings = async () => {
  if (!isDirty.value || !pdfSetting.value) return;
  isSaving.value = true;

  try {
    // The payload for the user settings update API.
    const payload = [
      {
        // If the setting is new, it won't have a UUID. The backend handles this.
        uuid: pdfSetting.value.uuid || null,
        name: pdfSetting.value.name,
        value: selectedTemplate.value,
      },
    ];

    const updatedSettings = await settingsApi.update(payload);
    // Update the central settings service so the whole app is aware.
    settingsService.updateSettings(updatedSettings);

    // After a successful save, find the newly saved setting to get its UUID and update local state.
    const newPdfSetting = updatedSettings.find(s => s.name === 'DEFAULT_PDF_TEMPLATE');
    if (newPdfSetting) {
      pdfSetting.value = newPdfSetting;
      originalTemplateValue.value = newPdfSetting.value;
    }

    isDirty.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    console.error('Save failed:', err);
    errorMessage.value = err.message || 'Failed to save your settings. Please try again.';
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

/**
 * Resets the selection back to its original value.
 */
const resetChanges = () => {
  if (!pdfSetting.value && originalTemplateValue.value === '') return;
  selectedTemplate.value = originalTemplateValue.value;
  // We need to re-check if the value is dirty after reset.
  isDirty.value = pdfSetting.value?.value !== originalTemplateValue.value;
};

/**
 * Formats a template key like 'classic-condensed' into a more readable 'Classic Condensed'.
 * @param {string} key The raw template name.
 * @returns {string} The formatted name.
 */
const formatTemplateName = (key) => {
  if (!key) return '';
  return key
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};
</script>

<style scoped>
.user-pdf-settings-page h1 {
  font-weight: 300;
}

.form-text {
  font-size: 0.9rem;
}
</style>
