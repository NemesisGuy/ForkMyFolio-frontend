<template>
  <div class="user-experience-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">Manage My Experience</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add New Experience
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading" />
      <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
      <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="successMessage = null" />
      <ConfirmModal
        :visible="!!experienceToDelete"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the entry for '${experienceToDelete?.jobTitle} at ${experienceToDelete?.companyName}'?`"
        @confirm="handleDeleteExperience"
        @close="experienceToDelete = null"
      />

      <!-- Add/Edit Experience Modal -->
      <div class="modal fade" id="experienceModal" tabindex="-1" aria-labelledby="experienceModalLabel" aria-hidden="true" ref="experienceModalRef">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="experienceModalLabel">{{ isEditing ? 'Edit Experience' : 'Add New Experience' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleFormSubmit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expJobTitle" class="form-label">Job Title</label>
                    <input type="text" class="form-control" id="expJobTitle" v-model="currentExperience.jobTitle" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expCompanyName" class="form-label">Company</label>
                    <input type="text" class="form-control" id="expCompanyName" v-model="currentExperience.companyName" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="expLocation" class="form-label">Location (e.g., "Remote" or "City, Country")</label>
                  <input type="text" class="form-control" id="expLocation" v-model="currentExperience.location">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expStartDate" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="expStartDate" v-model="currentExperience.startDate" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expEndDate" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="expEndDate" v-model="currentExperience.endDate" :disabled="currentExperience.isCurrentJob">
                    <div class="form-check mt-2">
                      <input class="form-check-input" type="checkbox" id="isCurrentJob" v-model="currentExperience.isCurrentJob">
                      <label class="form-check-label" for="isCurrentJob">I currently work here</label>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="expDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="expDescription" v-model="currentExperience.description" rows="4"></textarea>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="expVisible" v-model="currentExperience.visible">
                  <label class="form-check-label" for="expVisible">Visible on public portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="handleFormSubmit">{{ isEditing ? 'Save Changes' : 'Add Experience' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience List -->
      <div v-if="!isLoading && experiences.length > 0" class="card glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <ul class="list-group list-group-flush">
          <li v-for="exp in experiences" :key="exp.uuid" class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="mb-1">{{ exp.jobTitle }}</h5>
                <p class="mb-1 text-primary fw-bold">
                  {{ exp.companyName }}
                  <span v-if="exp.location" class="text-muted fw-normal ms-2"><i class="bi bi-geo-alt-fill me-1"></i>{{ exp.location }}</span>
                </p>
                <small class="text-muted">{{ formatDate(exp.startDate) }} - {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}</small>
              </div>
              <div class="actions d-flex align-items-center">
                <div class="form-check form-switch me-3" title="Toggle Visibility">
                  <input class="form-check-input" type="checkbox" role="switch" :checked="exp.visible" @change="handleVisibilityToggle(exp)">
                </div>
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(exp)" title="Edit Experience">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="experienceToDelete = exp" title="Delete Experience">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
            <p v-if="exp.description" class="mt-2 mb-0 description-text">{{ exp.description }}</p>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-briefcase-fill"></i>
        </div>
        <h4 class="glass-title">No Experience Found</h4>
        <p class="glass-subtitle">You haven't added any work experience yet. Click the button above to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { experiencesApi } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

// --- State ---
const experiences = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const experienceToDelete = ref(null);

// For the Add/Edit Modal
const experienceModalRef = ref(null);
let experienceModalInstance = null;
const isEditing = ref(false);
const initialExperienceState = () => ({
  uuid: null,
  jobTitle: '',
  companyName: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  visible: true,
  isCurrentJob: false,
});
const currentExperience = reactive(initialExperienceState());

// --- Lifecycle & Watchers ---
onMounted(async () => {
  await fetchExperiences();
  if (experienceModalRef.value) {
    experienceModalInstance = new Modal(experienceModalRef.value);
  }
});

watch(() => currentExperience.isCurrentJob, (isCurrent) => {
  if (isCurrent) {
    currentExperience.endDate = '';
  }
});

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  // Add a day to the date to avoid timezone issues where it might show the previous day.
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  const options = { year: 'numeric', month: 'long', timeZone: 'UTC' };
  return date.toLocaleDateString(undefined, options);
};

// --- Data Fetching ---
const fetchExperiences = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetchedExperiences = await experiencesApi.getAll();
    experiences.value = fetchedExperiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  } catch (err) {
    console.error("Failed to fetch user experience:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your experience.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  Object.assign(currentExperience, initialExperienceState());
  isEditing.value = false;
  experienceModalInstance?.show();
};

const openEditModal = (exp) => {
  isEditing.value = true;
  // Map all fields from the entity to the form state
  currentExperience.uuid = exp.uuid;
  currentExperience.jobTitle = exp.jobTitle;
  currentExperience.companyName = exp.companyName;
  currentExperience.location = exp.location;
  currentExperience.startDate = exp.startDate;
  currentExperience.endDate = exp.endDate;
  currentExperience.description = exp.description;
  currentExperience.visible = exp.visible;
  currentExperience.isCurrentJob = !exp.endDate;
  experienceModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  if (isEditing.value) {
    await handleUpdateExperience();
  } else {
    await handleAddExperience();
  }
};

const buildPayload = () => {
  // Construct the payload to match the backend DTO
  const payload = {
    jobTitle: currentExperience.jobTitle,
    companyName: currentExperience.companyName,
    location: currentExperience.location,
    startDate: currentExperience.startDate,
    endDate: currentExperience.isCurrentJob ? null : currentExperience.endDate,
    description: currentExperience.description,
    visible: currentExperience.visible,
  };
  return payload;
};

const handleAddExperience = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload();
    await experiencesApi.create(payload);
    await fetchExperiences(); // Re-fetch to get the sorted list
    successMessage.value = `Experience at '${payload.companyName}' was added successfully.`;
    experienceModalInstance?.hide();
  } catch (err) {
    console.error("Failed to add experience:", err);
    error.value = err.message || 'An error occurred while adding the experience.';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateExperience = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload();
    await experiencesApi.update(currentExperience.uuid, payload);
    await fetchExperiences(); // Re-fetch to get the sorted list
    successMessage.value = `Experience at '${payload.companyName}' was updated successfully.`;
    experienceModalInstance?.hide();
  } catch (err) {
    console.error("Failed to update experience:", err);
    error.value = err.message || 'An error occurred while updating the experience.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteExperience = async () => {
  if (!experienceToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await experiencesApi.remove(experienceToDelete.value.uuid);
    await fetchExperiences(); // Re-fetch to get the sorted list
    successMessage.value = `Experience at '${experienceToDelete.value.companyName}' was deleted successfully.`;
  } catch (err) {
    console.error("Failed to delete experience:", err);
    error.value = err.message || 'An error occurred while deleting the experience.';
  } finally {
    isLoading.value = false;
    experienceToDelete.value = null;
  }
};

// --- THIS IS THE FIX ---
// The function now correctly builds the full payload and uses the standard update endpoint.
const handleVisibilityToggle = async (exp) => {
  const originalVisibility = exp.visible;
  // Optimistically update the UI to feel responsive
  exp.visible = !exp.visible;

  try {
    // Construct the full payload, as expected by the backend's update endpoint.
    const payload = {
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      visible: exp.visible, // Use the new, toggled value
    };

    // Use the existing 'update' API call, not a non-existent 'updateVisibility' one.
    await experiencesApi.update(exp.uuid, payload);
    successMessage.value = `Visibility for '${exp.jobTitle}' updated.`;
    // No need to refetch, the optimistic update is now confirmed.
  } catch (err) {
    // If the API call fails, revert the UI change to its original state.
    exp.visible = originalVisibility;
    console.error("Failed to update visibility:", err);
    error.value = err.message || 'An error occurred while updating visibility.';
  }
};
</script>

<style scoped>
.list-group-item {
  background-color: transparent;
  border-bottom: 1px solid var(--glass-border);
  color: var(--glass-text);
  transition: background-color 0.3s ease;
  padding: 1.25rem;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background-color: var(--glass-bg-hover);
}

.list-group-item .actions {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  flex-shrink: 0; /* Prevent buttons from wrapping */
  margin-left: 1rem;
}

.list-group-item:hover .actions {
  opacity: 1;
}

.description-text {
  white-space: pre-wrap; /* Respect newlines in the description */
  font-size: 0.95em;
  color: var(--glass-text-secondary);
}

.form-check-input {
  cursor: pointer;
}
</style>
