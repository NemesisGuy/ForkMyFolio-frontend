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

      <!-- Common Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the entry for '${experienceToDelete?.jobTitle} at ${experienceToDelete?.companyName}'?`"
        :visible="!!experienceToDelete"
        title="Confirm Deletion"
        @close="experienceToDelete = null"
        @confirm="handleDeleteExperience"
      />

      <!-- The new, self-contained form modal component -->
      <ExperienceFormModal
        ref="experienceFormModalRef"
        :available-skills="userSkills"
        :experience="currentExperience"
        @save="handleSaveExperience"
      />

      <!-- Experience Timeline -->
      <div v-if="!isLoading && experiences.length > 0" class="timeline">
        <div v-for="(exp, index) in experiences" :key="exp.uuid"
             :style="{ 'animation-delay': (index * 0.15) + 's' }"
             class="timeline-item animate-fade-in-up">
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
                    <input :checked="exp.visible" class="form-check-input" role="switch"
                           type="checkbox" @change="handleVisibilityToggle(exp)">
                  </div>
                  <button class="btn btn-sm btn-outline-primary me-2" title="Edit Experience"
                          @click="openEditModal(exp)">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Delete Experience"
                          @click="experienceToDelete = exp">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
              <p v-if="exp.description"
                 class="card-text glass-description description-text mt-2 mb-0"
                 v-html="exp.description"></p>
              <div v-if="exp.skills && exp.skills.length > 0" class="mt-3 pt-3 border-top-glass">
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="skill in exp.skills" :key="skill.uuid"
                        class="badge skill-badge-small">
                    <i :class="getIconClass(skill)" class="me-1"></i>
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4"><i class="bi bi-briefcase-fill"></i></div>
        <h4 class="glass-title">No Experience Found</h4>
        <p class="glass-subtitle">You haven't added any work experience yet. Click the button above
          to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {experiencesApi, skillsApi} from '@/services/api/user.api.js';
import {getIconClass} from '@/services/iconService.js';
import {Modal} from 'bootstrap';

// Import all child components
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import ExperienceFormModal from '@/components/user/ExperienceFormModal.vue'; // The new modal component

// --- State for this page ---
const experiences = ref([]);
const userSkills = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const experienceToDelete = ref(null);
const currentExperience = ref(null); // For editing

// --- Modal Instances ---
const experienceFormModalRef = ref(null);
let formModalInstance = null;

// --- Lifecycle ---
onMounted(async () => {
  skillsApi.getAll().then(skills => userSkills.value = skills).catch(e => console.error("Failed to load skills", e));
  await fetchExperiences();
  // We need to get the instance from the child component's ref, which is named 'modalRef' inside that component
  if (experienceFormModalRef.value?.modalRef) {
    formModalInstance = new Modal(experienceFormModalRef.value.modalRef);
  }
});

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  const options = {year: 'numeric', month: 'long', timeZone: 'UTC'};
  return date.toLocaleDateString(undefined, options);
};

// --- Data Fetching ---
const fetchExperiences = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetched = await experiencesApi.getAll();
    experiences.value = fetched.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  currentExperience.value = null;
  formModalInstance?.show();
};

const openEditModal = (exp) => {
  currentExperience.value = exp;
  formModalInstance?.show();
};

// --- CRUD Operations ---
const handleSaveExperience = async (payload) => {
  isLoading.value = true;
  formModalInstance?.hide();
  try {
    if (payload.uuid) {
      await experiencesApi.update(payload.uuid, payload);
      successMessage.value = `Experience at '${payload.companyName}' was updated.`;
    } else {
      await experiencesApi.create(payload);
      successMessage.value = `Experience at '${payload.companyName}' was added.`;
    }
    await fetchExperiences();
  } catch (err) {
    error.value = err.message || 'Failed to save experience.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteExperience = async () => {
  if (!experienceToDelete.value) return;
  isLoading.value = true;
  try {
    await experiencesApi.remove(experienceToDelete.value.uuid);
    await fetchExperiences();
    successMessage.value = `Experience at '${experienceToDelete.value.companyName}' was deleted.`;
  } catch (err) {
    error.value = err.message || 'Failed to delete experience.';
  } finally {
    isLoading.value = false;
    experienceToDelete.value = null;
  }
};

const handleVisibilityToggle = async (exp) => {
  const originalVisibility = exp.visible;
  exp.visible = !exp.visible; // Optimistic update
  try {
    const payload = {...exp, skills: exp.skills ? exp.skills.map(s => s.name) : []};
    await experiencesApi.update(exp.uuid, payload);
    successMessage.value = `Visibility for '${exp.jobTitle}' updated.`;
  } catch (err) {
    exp.visible = originalVisibility; // Revert on error
    error.value = err.message || 'Failed to update visibility.';
  }
};
</script>

<style scoped>
/* The page-specific styles remain, but all modal-related styles are now gone! */
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

.border-top-glass {
  border-top: 1px solid var(--glass-border);
}

.skill-badge-small {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
  font-weight: 500;
  padding: 0.3em 0.6em;
  font-size: 0.8em;
}

.skill-badge-small i {
  font-size: 1em;
  line-height: 1;
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
