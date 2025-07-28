<template>
  <div class="user-qualifications-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">Manage My Qualifications</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add New Qualification
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading" />
      <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
      <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="successMessage = null" />
      <ConfirmModal
        :visible="!!qualificationToDelete"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the qualification '${qualificationToDelete?.qualificationName}'?`"
        @confirm="handleDeleteQualification"
        @close="qualificationToDelete = null"
      />

      <!-- Add/Edit Qualification Modal -->
      <div class="modal fade" id="qualificationModal" tabindex="-1" aria-labelledby="qualificationModalLabel" aria-hidden="true" ref="qualificationModalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="qualificationModalLabel">{{ isEditing ? 'Edit Qualification' : 'Add New Qualification' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleFormSubmit">
                <div class="mb-3">
                  <label for="qualName" class="form-label">Qualification / Degree</label>
                  <input type="text" class="form-control" id="qualName" v-model="currentQualification.qualificationName" required>
                </div>
                <div class="mb-3">
                  <label for="qualInstitution" class="form-label">Institution</label>
                  <input type="text" class="form-control" id="qualInstitution" v-model="currentQualification.institutionName" required>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="qualYear" class="form-label">Year of Completion</label>
                    <input type="number" class="form-control" id="qualYear" v-model.number="currentQualification.completionYear" required :min="1900" :max="new Date().getFullYear() + 5">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="qualGrade" class="form-label">Grade / Result (Optional)</label>
                    <input type="text" class="form-control" id="qualGrade" v-model="currentQualification.grade">
                  </div>
                </div>
                <!-- Visibility toggle added back to the modal form -->
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="qualVisible" v-model="currentQualification.visible">
                  <label class="form-check-label" for="qualVisible">Visible on public portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="handleFormSubmit">{{ isEditing ? 'Save Changes' : 'Add Qualification' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Qualifications List -->
      <div v-if="!isLoading && qualifications.length > 0" class="card glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <ul class="list-group list-group-flush">
          <li v-for="qual in qualifications" :key="qual.uuid" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">{{ qual.qualificationName }}</h5>
              <p class="mb-0 text-primary fw-bold">
                {{ qual.institutionName }} - <span class="text-muted fw-normal">{{ qual.completionYear }}</span>
              </p>
              <small v-if="qual.grade" class="text-muted">Grade: {{ qual.grade }}</small>
            </div>
            <div class="actions d-flex align-items-center">
              <!-- Visibility toggle added back to the list item -->
              <div class="form-check form-switch me-3" title="Toggle Visibility">
                <input class="form-check-input" type="checkbox" role="switch" :checked="qual.visible" @change="handleVisibilityToggle(qual)">
              </div>
              <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(qual)" title="Edit Qualification">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="qualificationToDelete = qual" title="Delete Qualification">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <h4 class="glass-title">No Qualifications Found</h4>
        <p class="glass-subtitle">You haven't added any qualifications yet. Click the button above to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { qualificationsApi } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

// --- State ---
const qualifications = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const qualificationToDelete = ref(null);

// For the Add/Edit Modal
const qualificationModalRef = ref(null);
let qualificationModalInstance = null;
const isEditing = ref(false);

// Updated to match the backend DTO, now including 'visible'
const initialQualificationState = () => ({
  uuid: null,
  qualificationName: '',
  institutionName: '',
  completionYear: new Date().getFullYear(),
  grade: '',
  visible: true,
});
const currentQualification = reactive(initialQualificationState());

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchQualifications();
  if (qualificationModalRef.value) {
    qualificationModalInstance = new Modal(qualificationModalRef.value);
  }
});

// --- Data Fetching ---
const fetchQualifications = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetched = await qualificationsApi.getAll();
    // Sort by year, descending
    qualifications.value = fetched.sort((a, b) => b.completionYear - a.completionYear);
  } catch (err) {
    console.error("Failed to fetch user qualifications:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your qualifications.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  Object.assign(currentQualification, initialQualificationState());
  isEditing.value = false;
  qualificationModalInstance?.show();
};

const openEditModal = (qual) => {
  isEditing.value = true;
  // Map the DTO fields to the form state
  currentQualification.uuid = qual.uuid;
  currentQualification.qualificationName = qual.qualificationName;
  currentQualification.institutionName = qual.institutionName;
  currentQualification.completionYear = qual.completionYear;
  currentQualification.grade = qual.grade;
  currentQualification.visible = qual.visible; // 'visible' is now included
  qualificationModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  if (isEditing.value) {
    await handleUpdateQualification();
  } else {
    await handleAddQualification();
  }
};

// This function now builds a payload that matches the backend DTO, including 'visible'
const buildPayload = (qual) => {
  return {
    qualificationName: qual.qualificationName,
    institutionName: qual.institutionName,
    completionYear: qual.completionYear,
    grade: qual.grade || null, // Send null if grade is empty
    visible: qual.visible,
  };
};

const handleAddQualification = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentQualification);
    await qualificationsApi.create(payload);
    await fetchQualifications(); // Re-fetch to get the sorted list
    successMessage.value = `Qualification '${payload.qualificationName}' was added successfully.`;
    qualificationModalInstance?.hide();
  } catch (err) {
    console.error("Failed to add qualification:", err);
    error.value = err.message || 'An error occurred while adding the qualification.';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateQualification = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentQualification);
    await qualificationsApi.update(currentQualification.uuid, payload);
    await fetchQualifications(); // Re-fetch to get the sorted list
    successMessage.value = `Qualification '${payload.qualificationName}' was updated successfully.`;
    qualificationModalInstance?.hide();
  } catch (err) {
    console.error("Failed to update qualification:", err);
    error.value = err.message || 'An error occurred while updating the qualification.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteQualification = async () => {
  if (!qualificationToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await qualificationsApi.remove(qualificationToDelete.value.uuid);
    await fetchQualifications(); // Re-fetch to get the sorted list
    successMessage.value = `Qualification '${qualificationToDelete.value.qualificationName}' was deleted successfully.`;
  } catch (err)
  {
    console.error("Failed to delete qualification:", err);
    error.value = err.message || 'An error occurred while deleting the qualification.';
  } finally {
    isLoading.value = false;
    qualificationToDelete.value = null;
  }
};

// This function handles the visibility toggle switch on each list item.
const handleVisibilityToggle = async (qual) => {
  const originalVisibility = qual.visible;
  qual.visible = !qual.visible; // Optimistic update for instant UI feedback

  try {
    // Build the full payload, as the backend update endpoint expects it
    const payload = buildPayload(qual);
    await qualificationsApi.update(qual.uuid, payload);
    successMessage.value = `Visibility for '${qual.qualificationName}' updated.`;
  } catch (err) {
    qual.visible = originalVisibility; // Revert the change on API error
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
  flex-shrink: 0;
  margin-left: 1rem;
}

.list-group-item:hover .actions {
  opacity: 1;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}

.form-check-input {
  cursor: pointer;
}
</style>
