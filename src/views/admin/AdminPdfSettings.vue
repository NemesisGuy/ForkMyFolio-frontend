<template>
  <!-- Use v-if on LoadingModal to fully remove from DOM when done -->
  <LoadingModal v-if="isLoading" />

  <div class="admin-pdf-settings-page py-5" v-show="!isLoading">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <h1 class="display-5 mb-4">PDF Export Settings</h1>

          <!-- Error State -->
          <div v-if="error" class="alert alert-danger">
            <h4 class="alert-heading">🚫 Error</h4>
            <p>Could not load PDF settings. Please try again later.</p>
            <pre class="small">{{ error.message }}</pre>
          </div>

          <!-- Settings Form -->
          <form v-else @submit.prevent="handleSaveSettings">
            <div class="card glass-card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">Default PDF Template</h5>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label for="defaultPdfTemplate" class="form-label">
                    Homepage Download Template
                  </label>
                  <p class="form-text text-muted mt-0 mb-2">
                    Select the template that will be used when visitors click the download button on your homepage.
                  </p>
                  <select
                    id="defaultPdfTemplate"
                    v-model="selectedTemplate"
                    class="form-select"
                    :disabled="isSaving"
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
                type="button"
                class="btn btn-secondary me-2"
                :disabled="!isDirty || isSaving"
                @click="resetChanges"
              >
                Reset
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!isDirty || isSaving"
              >
                <span
                  v-if="isSaving"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
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
      title="Settings Saved"
      message="Your PDF settings have been updated successfully."
      @close="showSuccessModal = false"
    />
    <ErrorModal
      :visible="showErrorModal"
      title="Save Failed"
      :message="errorMessage"
      @close="showErrorModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import {
  getAdminSettings,
  updateAdminSettings,
  getAvailablePdfTemplates,
} from '@/services/api/admin.api.js';
import { settingsService } from '@/services/settingsService.js';
import { ApiError } from '@/services/api/index.js';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

// State
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

// Computed with getter/setter for two-way binding + dirty tracking
const selectedTemplate = computed({
  get: () => pdfSetting.value?.value || '',
  set: (val) => {
    if (pdfSetting.value && pdfSetting.value.value !== val) {
      pdfSetting.value.value = val;
      isDirty.value = true;
    }
  },
});

// Sleep helper to guarantee minimum modal visible time
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  const minDelay = sleep(500);

  try {
    const [settings, templates] = await Promise.all([
      getAdminSettings(),
      getAvailablePdfTemplates(),
    ]);

    const defaultSetting = settings.find(
      (s) => s.name === 'DEFAULT_PDF_TEMPLATE'
    );

    if (!defaultSetting) {
      throw new Error(
        "The 'DEFAULT_PDF_TEMPLATE' setting was not found in backend."
      );
    }

    pdfSetting.value = defaultSetting;
    originalTemplateValue.value = defaultSetting.value;
    availableTemplates.value = templates;
  } catch (err) {
    console.error('Error loading settings:', err);
    error.value = err instanceof ApiError ? err : { message: err.message || 'Unexpected error.' };
  } finally {
    await minDelay;
    isLoading.value = false;
    await nextTick(); // ensure DOM updates for immediate interactivity
  }
});

const handleSaveSettings = async () => {
  if (!isDirty.value || !pdfSetting.value) return;
  isSaving.value = true;

  try {
    const payload = [
      {
        uuid: pdfSetting.value.uuid,
        value: selectedTemplate.value,
      },
    ];

    const updatedSettings = await updateAdminSettings(payload);
    settingsService.updateSettings(updatedSettings);

    originalTemplateValue.value = selectedTemplate.value;
    isDirty.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    console.error('Save failed:', err);
    errorMessage.value = err.message || 'Failed to save settings. Try again.';
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const resetChanges = () => {
  if (!pdfSetting.value) return;
  selectedTemplate.value = originalTemplateValue.value;
  isDirty.value = false;
};

// Helper to make human readable template names
const formatTemplateName = (key) => {
  if (!key) return '';
  return key
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};
</script>

<style scoped>
.admin-pdf-settings-page h1 {
  font-weight: 300;
}
.form-text {
  font-size: 0.9rem;
}
</style>
