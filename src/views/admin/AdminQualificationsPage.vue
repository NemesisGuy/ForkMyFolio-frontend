<template>
  <div class="admin-qualifications-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Qualifications Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the qualification: '${formState.qualificationName}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
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
import { getPublicQualifications, createQualification, updateQualification, deleteQualification, ApiError } from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const qualifications = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const qualificationToDelete = ref(null);

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

const fetchQualifications = async () => {
  isLoading.value = true;
  try {
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
    if (isEditing.value) {
      await updateQualification(formState.uuid, formState);
    } else {
      await createQualification(formState);
    }
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
  Object.assign(formState, qual); // For the modal message
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  qualificationToDelete.value = null;
  resetForm();
};

const executeDelete = async () => {
  if (!qualificationToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteQualification(qualificationToDelete.value.uuid);
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
