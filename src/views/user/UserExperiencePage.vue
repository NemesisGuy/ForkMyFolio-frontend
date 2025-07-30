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
            <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
              <form @submit.prevent="handleFormSubmit" class="row g-3">
                <div class="row">
                  <div class="col-md-8 mb-3">
                    <label for="expJobTitle" class="form-label">Job Title</label>
                    <input type="text" class="form-control" id="expJobTitle" v-model="currentExperience.jobTitle" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="expDisplayOrder" class="form-label">Display Order</label>
                    <input type="number" class="form-control" id="expDisplayOrder" v-model.number="currentExperience.displayOrder">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expCompanyName" class="form-label">Company</label>
                    <input type="text" class="form-control" id="expCompanyName" v-model="currentExperience.companyName" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expEmploymentType" class="form-label">Employment Type</label>
                    <select class="form-select" id="expEmploymentType" v-model="currentExperience.employmentType">
                      <option v-for="type in EMPLOYMENT_TYPES" :key="type.value" :value="type.value">{{ type.text }}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expLocation" class="form-label">Location (e.g., "City, Country")</label>
                    <input type="text" class="form-control" id="expLocation" v-model="currentExperience.location">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expLocationType" class="form-label">Location Type</label>
                    <select class="form-select" id="expLocationType" v-model="currentExperience.locationType">
                      <option v-for="type in LOCATION_TYPES" :key="type.value" :value="type.value">{{ type.text }}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expStartDate" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="expStartDate" v-model="currentExperience.startDate" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expEndDate" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="expEndDate" v-model="currentExperience.endDate" :disabled="currentExperience.isCurrentJob">
                  </div>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="isCurrentJob" v-model="currentExperience.isCurrentJob">
                  <label class="form-check-label" for="isCurrentJob">I currently work here</label>
                </div>
                <div class="mb-3">
                  <label for="expDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="expDescription" v-model="currentExperience.description" rows="3" placeholder="Overview of your role and responsibilities."></textarea>
                </div>
                <div class="mb-3">
                  <label for="expAchievements" class="form-label">Achievements (Optional)</label>
                  <textarea class="form-control" id="expAchievements" v-model="currentExperience.achievements" rows="3" placeholder="Key accomplishments or highlights."></textarea>
                </div>
                <div class="mb-3">
                  <label for="expSkills" class="form-label">Associated Skills (Optional)</label>
                  <select id="expSkills" class="form-select" multiple v-model="currentExperience.skillUuids">
                    <option v-for="skill in userSkills" :key="skill.uuid" :value="skill.uuid">{{ skill.name }}</option>
                  </select>
                  <div class="form-text">Select skills from your skills list that you used in this role.</div>
                </div>
                <hr class="my-4">
                <h6 class="text-muted mb-3">Optional Links & Media</h6>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="expCompanyUrl" class="form-label">Company Website URL</label>
                    <input type="url" class="form-control" id="expCompanyUrl" v-model="currentExperience.companyUrl" placeholder="https://...">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="expCompanyLogoUrl" class="form-label">Company Logo URL</label>
                    <input type="url" class="form-control" id="expCompanyLogoUrl" v-model="currentExperience.companyLogoUrl" placeholder="https://...">
                  </div>
                </div>
                <hr class="my-4">
                <div class="form-check form-switch mb-3">
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

      <!-- Experience Timeline -->
      <div v-if="!isLoading && experiences.length > 0" class="timeline">
        <div v-for="(exp, index) in experiences" :key="exp.uuid"
             class="timeline-item animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.15) + 's' }">
          <div class="timeline-content card glass-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="card-title glass-title">{{ exp.jobTitle }}</h5>
                  <h6 class="card-subtitle mb-2 glass-subtitle">{{ exp.companyName }}</h6>
                  <p class="card-text glass-text-secondary small mb-3">
                    <i class="bi bi-calendar-event me-1"></i>
                    {{ formatDate(exp.startDate) }} -
                    {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}
                    <br>
                    <i class="bi bi-geo-alt-fill me-1"></i>
                    {{ exp.location }}
                  </p>
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
              <p v-if="exp.description" class="card-text glass-description description-text mt-2 mb-0" v-html="exp.description"></p>
            </div>
          </div>
        </div>
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
import { experiencesApi, skillsApi } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

// --- Constants ---
const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', text: 'Full-time' }, { value: 'PART_TIME', text: 'Part-time' },
  { value: 'CONTRACT', text: 'Contract' }, { value: 'FREELANCE', text: 'Freelance' },
  { value: 'INTERNSHIP', text: 'Internship' }, { value: 'APPRENTICESHIP', text: 'Apprenticeship' }
];

const LOCATION_TYPES = [
  { value: 'ON_SITE', text: 'On-site' },
  { value: 'HYBRID', text: 'Hybrid' },
  { value: 'REMOTE', text: 'Remote' }
];

// --- State ---
const userSkills = ref([]);
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
  companyUrl: '',
  companyLogoUrl: '',
  location: '',
  locationType: 'ON_SITE',
  employmentType: 'FULL_TIME',
  startDate: '',
  endDate: '',
  description: '',
  achievements: '',
  displayOrder: 100,
  skillUuids: [],
  visible: true,
  isCurrentJob: false,
});
const currentExperience = reactive(initialExperienceState());

// --- Lifecycle & Watchers ---
onMounted(async () => {
  // Fetch skills in parallel for the multi-select dropdown
  skillsApi.getAll().then(skills => userSkills.value = skills).catch(e => console.error("Failed to load skills for dropdown", e));
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
    experiences.value = fetchedExperiences.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  } catch (err) {
    console.error("Failed to fetch user experience:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your experience.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  isEditing.value = false;
  Object.assign(currentExperience, initialExperienceState());
  experienceModalInstance?.show();
};

const openEditModal = (exp) => {
  isEditing.value = true;
  // --- THIS IS THE FIX ---
  // 1. Reset the form to its default state to clear out any old data.
  Object.assign(currentExperience, initialExperienceState());

  // 2. Safely merge the data from the selected experience into the clean form object.
  // This ensures that if a field is null/undefined in `exp`, it will be reset to the
  // default from `initialExperienceState` instead of retaining a value from a previous edit.
  Object.assign(currentExperience, exp);

  // 3. Explicitly handle derived/complex state after the merge.
  currentExperience.isCurrentJob = !exp.endDate;
  // The backend sends a `skills` array of objects, but the form needs an array of UUIDs.
  currentExperience.skillUuids = exp.skills ? exp.skills.map(s => s.uuid) : [];

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

const buildPayload = (exp) => {
  // Construct the payload to match the backend DTO
  return {
    jobTitle: exp.jobTitle,
    companyName: exp.companyName,
    companyUrl: exp.companyUrl || null,
    companyLogoUrl: exp.companyLogoUrl || null,
    location: exp.location,
    locationType: exp.locationType,
    employmentType: exp.employmentType,
    startDate: exp.startDate,
    endDate: exp.isCurrentJob ? null : exp.endDate,
    description: exp.description,
    achievements: exp.achievements,
    displayOrder: exp.displayOrder,
    skillUuids: exp.skillUuids,
    visible: exp.visible,
  };
};

const handleAddExperience = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentExperience);
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
    const payload = buildPayload(currentExperience);
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

const handleVisibilityToggle = async (exp) => {
  const originalVisibility = exp.visible;
  // Optimistically update the UI to feel responsive
  exp.visible = !exp.visible;

  try {
    // Construct the full payload, as expected by the backend's update endpoint.
    const payload = { ...buildPayload(exp), endDate: exp.endDate }; // Ensure endDate is preserved for toggle

    // Use the existing 'update' API call.
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
.description-text {
  white-space: pre-wrap;
  font-size: 0.95em;
  color: var(--glass-text-secondary);
}

.form-check-input {
  cursor: pointer;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}

/* --- Timeline Styling --- */
.timeline {
  position: relative;
  padding: 20px 0;
  max-width: 900px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background-image: linear-gradient(to bottom, transparent, var(--glass-border-hover), transparent);
  transform: translateX(-50%);
  border-radius: 3px;
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 10px 40px;
  margin-bottom: 20px;
}

.timeline-item:nth-child(odd) {
  left: 0;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -12.5px;
  background-color: var(--glass-bg);
  border: 4px solid var(--bs-primary);
  top: 15px;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 15px rgba(var(--bs-primary-rgb), 0.5);
  transition: all 0.3s ease;
}

.timeline-item:hover::after {
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(var(--bs-primary-rgb), 0.7);
}

.timeline-item:nth-child(even)::after {
  left: -12.5px;
}

.timeline-content {
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.timeline-item:hover .timeline-content {
  transform: translateY(-5px);
  box-shadow: 0 1rem 2rem var(--glass-shadow);
}

.timeline-item .actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-item:hover .actions {
  opacity: 1;
}

/* The little arrow pointing from the card to the timeline */
.timeline-item::before {
  content: '';
  position: absolute;
  top: 28px;
  width: 15px;
  height: 15px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateY(-50%) rotate(45deg);
  z-index: 0;
}

.timeline-item:nth-child(odd)::before {
  right: 32.5px;
  border-top: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border);
  border-left: none;
  border-bottom: none;
}

.timeline-item:nth-child(even)::before {
  left: 32.5px;
  border-left: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  border-top: none;
  border-right: none;
}

/* --- Responsive Adjustments --- */
@media (max-width: 767.98px) {
  .timeline::before {
    left: 15px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }

  .timeline-item:nth-child(odd),
  .timeline-item:nth-child(even) {
    left: 0;
  }

  .timeline-item::after {
    left: 2.5px;
  }

  .timeline-item::before {
    left: 62.5px;
    right: auto;
    border-left: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
    border-top: none;
    border-right: none;
  }

  .timeline-item .actions {
    opacity: 1; /* Always show actions on mobile */
    flex-direction: column;
    align-items: flex-end !important;
    gap: 0.5rem;
  }

  .timeline-item .actions .form-check {
    margin-right: 0 !important;
  }
}
</style>
