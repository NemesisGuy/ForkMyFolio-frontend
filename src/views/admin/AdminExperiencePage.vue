<template>
  <div class="admin-experience-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Experience Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the entry: '${formState.jobTitle} at ${formState.companyName}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />

      <div class="row g-5">
        <!-- Add/Edit Form -->
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">{{ isEditing ? 'Edit Experience' : 'Add New Experience' }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="jobTitle" class="form-label">Job Title</label>
                    <input type="text" class="form-control" id="jobTitle" v-model="formState.jobTitle" required>
                  </div>
                  <div class="col-12">
                    <label for="companyName" class="form-label">Company Name</label>
                    <input type="text" class="form-control" id="companyName" v-model="formState.companyName" required>
                  </div>
                  <div class="col-12">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" v-model="formState.location" placeholder="e.g., New York, NY">
                  </div>
                  <div class="col-md-6">
                    <label for="startDate" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="startDate" v-model="formState.startDate" required>
                  </div>
                  <div class="col-md-6">
                    <label for="endDate" class="form-label">End Date (optional)</label>
                    <input type="date" class="form-control" id="endDate" v-model="formState.endDate">
                  </div>
                  <div class="col-12">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="5" v-model="formState.description" required></textarea>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button type="button" v-if="isEditing" class="btn btn-secondary me-2" @click="resetForm">Cancel Edit</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditing ? 'Save Changes' : 'Add Experience' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Experience List -->
        <div class="col-lg-7">
          <div v-if="!isLoading && experiences.length > 0">
            <div v-for="exp in experiences" :key="exp.uuid" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title mb-1">{{ exp.jobTitle }}</h5>
                    <p class="card-subtitle text-muted">{{ exp.companyName }} &middot; {{ formatDateRange(exp.startDate, exp.endDate) }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="selectForEdit(exp)" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger" @click="requestDelete(exp)" title="Delete"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else-if="!isLoading && !error.message"
            title="No Experience Found"
            message="Add a new work experience entry using the form to get started."
            icon-class="bi-briefcase-fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getPublicExperience, createExperience, updateExperience, deleteExperience, ApiError } from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const experiences = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const experienceToDelete = ref(null);

const initialFormState = {
  uuid: null,
  jobTitle: '',
  companyName: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
};

const formState = reactive({ ...initialFormState });

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const fetchExperiences = async () => {
  isLoading.value = true;
  try {
    const data = await getPublicExperience();
    // Sort by start date, most recent first
    experiences.value = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    error.value = { title: 'Failed to Load Data', message: err.message || 'An unexpected error occurred.' };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    // Ensure endDate is null if empty string, as backend expects
    const payload = { ...formState, endDate: formState.endDate || null };
    if (isEditing.value) {
      await updateExperience(payload.uuid, payload);
    } else {
      await createExperience(payload);
    }
    resetForm();
    await fetchExperiences();
  } catch (err) {
    console.error("Failed to save experience:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save the experience entry.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (exp) => {
  Object.assign(formState, exp);
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (exp) => {
  experienceToDelete.value = exp;
  Object.assign(formState, exp); // For the modal message
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  experienceToDelete.value = null;
  resetForm();
};

const executeDelete = async () => {
  if (!experienceToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteExperience(experienceToDelete.value.uuid);
    await fetchExperiences();
    if (isEditing.value && formState.uuid === experienceToDelete.value.uuid) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete experience:", err);
    error.value = { title: 'Deletion Failed', message: err.message || 'Could not delete the experience entry.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

// Helper to format date ranges for display
const formatDateRange = (start, end) => {
  const options = { year: 'numeric', month: 'short' };
  const startDate = new Date(start).toLocaleDateString(undefined, options);
  if (!end) return `${startDate} - Present`;
  const endDate = new Date(end).toLocaleDateString(undefined, options);
  return `${startDate} - ${endDate}`;
};

onMounted(fetchExperiences);
</script>

<style scoped>
.admin-experience-page h1 {
  font-weight: 300;
}
</style>
