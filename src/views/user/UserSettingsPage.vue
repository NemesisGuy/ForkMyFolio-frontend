<template>
  <LoadingModal v-if="isLoading" />

  <div class="user-settings-page py-5" v-show="!isLoading">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <h1 class="display-5 mb-4">Display Settings</h1>
          <p class="lead text-muted mb-5">
            Control which sections are visible on your public portfolio page.
          </p>

          <!-- Error State -->
          <div v-if="error" class="alert alert-danger">
            <h4 class="alert-heading">🚫 Error</h4>
            <p>Could not load your display settings. Please try again later.</p>
            <pre class="small">{{ error.message }}</pre>
          </div>

          <!-- Settings Form -->
          <form v-else @submit.prevent="handleSaveSettings">
            <div class="card glass-card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">Section Visibility</h5>
              </div>
              <div class="card-body p-4">
                <ul class="list-group list-group-flush">
                  <li v-for="setting in displaySettings" :key="setting.name" class="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-0">{{ setting.label }}</h6>
                      <small class="text-muted">{{ setting.description }}</small>
                    </div>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :id="`switch-${setting.name}`"
                        v-model="setting.value"
                        @change="isDirty = true"
                        :disabled="isSaving"
                      >
                    </div>
                  </li>
                </ul>
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
      message="Your display settings have been updated successfully."
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
import { ref, onMounted, nextTick } from 'vue';
import { settingsApi } from '@/services/api/user.api.js';
import { publicApi } from '@/services/api/public.api.js';
import { settingsService } from '@/services/settingsService.js';
import { ApiError } from '@/services/api/index.js';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

// --- State ---
const displaySettings = ref([]);
const originalSettings = ref({});

const isLoading = ref(true);
const isSaving = ref(false);
const isDirty = ref(false);
const error = ref(null);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

// Defines the settings we want the user to be able to control.
const settingDefinitions = [
  { name: 'SHOW_PROJECTS', label: 'Projects Section', description: 'Display your project showcase.' },
  { name: 'SHOW_SKILLS', label: 'Skills Section', description: 'Display your list of skills.' },
  { name: 'SHOW_EXPERIENCE', label: 'Experience Section', description: 'Display your work experience.' },
  { name: 'SHOW_EDUCATION', label: 'Education Section', description: 'Display your education history.' },
  { name: 'SHOW_QUALIFICATIONS', label: 'Qualifications Section', description: 'Display your qualifications and certifications.' },
  { name: 'SHOW_TESTIMONIALS', label: 'Testimonials Section', description: 'Display testimonials from clients or colleagues.' },
  { name: 'SHOW_CONTACT_FORM', label: 'Contact Form', description: 'Allow visitors to send you messages.' },
];

// Sleep helper to guarantee minimum modal visible time
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  const minDelay = sleep(500);

  try {
    // Fetch both the user's specific settings and the global defaults
    const [userSettings, globalSettings] = await Promise.all([
      settingsApi.getAll(),
      publicApi.getGlobalSettings(),
    ]);

    // Create maps for quick lookups
    const userSettingsMap = new Map(userSettings.map(s => [s.name, s]));
    const globalSettingsMap = new Map(globalSettings.map(s => [s.name, s.value]));

    // Build the reactive array for the UI
    displaySettings.value = settingDefinitions.map(def => {
      const userSetting = userSettingsMap.get(def.name);
      const globalValue = globalSettingsMap.get(def.name) === 'true';
      const currentValue = userSetting ? userSetting.value === 'true' : globalValue;

      return {
        ...def,
        value: currentValue,
        uuid: userSetting?.uuid || null, // Keep track of existing UUIDs
      };
    });

    // Store the initial state for the "Reset" functionality
    originalSettings.value = Object.fromEntries(
      displaySettings.value.map(s => [s.name, s.value])
    );

  } catch (err) {
    console.error('Error loading display settings:', err);
    error.value = err instanceof ApiError ? err : { message: err.message || 'Unexpected error.' };
  } finally {
    await minDelay;
    isLoading.value = false;
    await nextTick();
  }
});

const handleSaveSettings = async () => {
  if (!isDirty.value) return;
  isSaving.value = true;

  // Create the payload of settings that have actually changed
  const payload = displaySettings.value
    .filter(setting => setting.value !== originalSettings.value[setting.name])
    .map(setting => ({
      uuid: setting.uuid, // Will be null for new user settings
      name: setting.name,
      value: String(setting.value), // Convert boolean to string for the API
    }));

  if (payload.length === 0) {
    isSaving.value = false;
    isDirty.value = false;
    return;
  }

  try {
    const updatedSettings = await settingsApi.update(payload);
    settingsService.updateSettings(updatedSettings);

    // Update local state with new UUIDs and original values
    updatedSettings.forEach(updated => {
      const settingInUI = displaySettings.value.find(s => s.name === updated.name);
      if (settingInUI) {
        settingInUI.uuid = updated.uuid;
        originalSettings.value[updated.name] = settingInUI.value;
      }
    });

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

const resetChanges = () => {
  displaySettings.value.forEach(setting => {
    setting.value = originalSettings.value[setting.name];
  });
  isDirty.value = false;
};
</script>

<style scoped>
.user-settings-page h1 {
  font-weight: 300;
}
.list-group-item {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-border);
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.list-group-item:last-child {
  border-bottom: none;
}
.form-check-input {
  width: 3em;
  height: 1.5em;
  cursor: pointer;
}
</style>
