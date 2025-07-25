<template>
  <div class="admin-qualifications-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Qualifications Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the qualification: '${qualificationToDelete?.qualificationName}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />
      <!-- ADDED: Success Modal for positive feedback -->
      <SuccessModal
        :visible="showSuccessModal"
        title="Success"
        :message="successMessage"
        @close="closeSuccessModal"
      />

      <div class="row g-5">
        <!-- Add/Edit Form -->
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">{{ isEditing ? 'Edit Qualification' : 'Add New Qualification' }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="qualificationName" class="form-label">Qualification Name</label>
                    <input type="text" class="form-control" id="qualificationName" v-model="formState.qualificationName" required placeholder="e.g., B.S. in Computer Science">
                  </div>
                  <div class="col-12">
                    <label for="institutionName" class="form-label">Institution Name</label>
                    <input type="text" class="form-control" id="institutionName" v-model="formState.institutionName" required placeholder="e.g., University of Technology">
                  </div>
                  <div class="col-md-6">
                    <label for="completionYear" class="form-label">Completion Year</label>
                    <input type="number" class="form-control" id="completionYear" v-model.number="formState.completionYear" required placeholder="e.g., 2022">
                  </div>
                  <div class="col-md-6">
                    <label for="grade" class="form-label">Grade / Score (optional)</label>
                    <input type="text" class="form-control" id="grade" v-model="formState.grade" placeholder="e.g., GPA: 3.9/4.0">
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button type="button" v-if="isEditing" class="btn btn-secondary me-2" @click="resetForm">Cancel Edit</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditing ? 'Save Changes' : 'Add Qualification' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Qualifications List -->
        <div class="col-lg-7">
          <div v-if="!isLoading && qualifications.length > 0">
            <div v-for="qual in qualifications" :key="qual.uuid" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title mb-1">{{ qual.qualificationName }}</h5>
                    <p class="card-subtitle text-muted">{{ qual.institutionName }} &mdash; {{ qual.completionYear }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="selectForEdit(qual)" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger" @click="requestDelete(qual)" title="Delete"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else-if="!isLoading && !error.message"
            title="No Qualifications Found"
            message="Add a new qualification, degree, or certification using the form to get started."
            icon-class="bi-patch-check-fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
// UPDATED: Import admin-specific functions
import { getPublicQualifications, createQualification, updateQualification, deleteQualification, ApiError } from '@/services/api';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
// ADDED: Import SuccessModal
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const qualifications = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);

// Modal states
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const qualificationToDelete = ref(null);
const showSuccessModal = ref(false);
const successMessage = ref('');

const initialFormState = {
  uuid: null,
  qualificationName: '',
  institutionName: '',
  completionYear: new Date().getFullYear(),
  grade: '',
};

const formState = reactive({ ...initialFormState });

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

// ADDED: Function to close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

const fetchQualifications = async () => {
  isLoading.value = true;
  try {
    // UPDATED: Use the correct admin endpoint
    const data = await getPublicQualifications();
    qualifications.value = data.sort((a, b) => b.completionYear - a.completionYear);
  } catch (err) {
    console.error("Failed to fetch qualifications:", err);
    error.value = { title: 'Failed to Load Data', message: err.message || 'An unexpected error occurred.' };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    const savedQualName = formState.qualificationName;
    if (isEditing.value) {
      await updateQualification(formState.uuid, formState);
      successMessage.value = `Qualification '${savedQualName}' has been updated successfully.`;
    } else {
      await createQualification(formState);
      successMessage.value = `Qualification '${savedQualName}' has been created successfully.`;
    }
    showSuccessModal.value = true;
    resetForm();
    await fetchQualifications();
  } catch (err) {
    console.error("Failed to save qualification:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save the qualification.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (qual) => {
  Object.assign(formState, qual);
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (qual) => {
  qualificationToDelete.value = qual;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  qualificationToDelete.value = null;
};

const executeDelete = async () => {
  if (!qualificationToDelete.value) return;
  isSaving.value = true;
  const deletedQualName = qualificationToDelete.value.qualificationName;
  try {
    await deleteQualification(qualificationToDelete.value.uuid);
    successMessage.value = `Qualification '${deletedQualName}' has been deleted successfully.`;
    showSuccessModal.value = true;
    await fetchQualifications();
    if (isEditing.value && formState.uuid === qualificationToDelete.value.uuid) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete qualification:", err);
    error.value = { title: 'Deletion Failed', message: err.message || 'Could not delete the qualification.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchQualifications);
</script>

<style scoped>
.admin-qualifications-page h1 {
  font-weight: 300;
}
</style>
