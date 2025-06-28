<template>
  <div class="admin-experience-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Experience Management</h1>

      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error.message" :message="error.message" :title="error.title"
                  :visible="showErrorModal" @close="closeErrorModal"/>
      <ConfirmModal
        :message="`Are you sure you want to delete this experience entry: '${formState.jobTitle} at ${formState.companyName}'?`"
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        @cancel="cancelDelete"
        @confirm="executeDelete"
      />

      <div class="row g-5">
        <!-- Add/Edit Form -->
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">{{
                  isEditing ? 'Edit Experience' : 'Add New Experience'
                }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label" for="jobTitle">Job Title</label>
                    <input id="jobTitle" v-model="formState.jobTitle" class="form-control"
                           required type="text">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="companyName">Company Name</label>
                    <input id="companyName" v-model="formState.companyName" class="form-control"
                           required type="text">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="location">Location</label>
                    <input id="location" v-model="formState.location" class="form-control"
                           type="text">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="startDate">Start Date</label>
                    <input id="startDate" v-model="formState.startDate" class="form-control"
                           required type="date">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="endDate">End Date</label>
                    <input id="endDate" v-model="formState.endDate" :disabled="formState.isCurrent" class="form-control"
                           type="date">
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input id="isCurrent" v-model="formState.isCurrent" class="form-check-input"
                             type="checkbox">
                      <label class="form-check-label" for="isCurrent">
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" v-model="formState.description" class="form-control"
                              rows="4"></textarea>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button v-if="isEditing" class="btn btn-secondary me-2" type="button"
                          @click="resetForm">Cancel Edit
                  </button>
                  <button :disabled="isSaving" class="btn btn-primary" type="submit">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditing ? 'Save Changes' : 'Add Experience' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Experiences List -->
        <div class="col-lg-7">
          <div v-if="!isLoading && experiences.length > 0">
            <div v-for="exp in experiences" :key="exp.id" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title mb-1">{{ exp.jobTitle }}</h5>
                    <h6 class="card-subtitle text-primary">{{ exp.companyName }}</h6>
                  </div>
                  <div class="flex-shrink-0">
                    <button class="btn btn-sm btn-outline-secondary me-2"
                            title="Edit" @click="selectForEdit(exp)"><i
                      class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete"
                            @click="requestDelete(exp)"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isLoading && !error.message" class="text-center py-5">
            <p class="lead text-muted">No work experience added yet. Use the form to get
              started!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {
  createExperience,
  deleteExperience,
  getPublicExperience,
  updateExperience
} from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const experiences = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({title: '', message: ''});
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const experienceToDelete = ref(null);

const initialFormState = {
  id: null,
  jobTitle: '',
  companyName: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  isCurrent: false,
};

const formState = reactive({...initialFormState});

// If "I currently work here" is checked, clear the end date.
watch(() => formState.isCurrent, (isCurrent) => {
  if (isCurrent) {
    formState.endDate = '';
  }
});

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = {title: '', message: ''};
};

const fetchExperiences = async () => {
  isLoading.value = true;
  try {
    const data = await getPublicExperience();
    experiences.value = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    error.value = {
      title: 'Failed to Load Data',
      message: err.message || 'An unexpected error occurred.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  const payload = {...formState};
  if (payload.isCurrent) {
    payload.endDate = null;
  }
  delete payload.isCurrent; // Don't send this to the backend

  try {
    if (isEditing.value) {
      await updateExperience(payload.id, payload);
    } else {
      await createExperience(payload);
    }
    resetForm();
    await fetchExperiences();
  } catch (err) {
    console.error("Failed to save experience:", err);
    error.value = {title: 'Save Failed', message: err.message || 'Could not save the entry.'};
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (exp) => {
  Object.assign(formState, exp);
  formState.isCurrent = !exp.endDate;
  // Dates need to be in YYYY-MM-DD format for the input[type=date]
  formState.startDate = exp.startDate ? exp.startDate.split('T')[0] : '';
  formState.endDate = exp.endDate ? exp.endDate.split('T')[0] : '';
  isEditing.value = true;
  window.scrollTo({top: 0, behavior: 'smooth'});
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (exp) => {
  experienceToDelete.value = exp;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  experienceToDelete.value = null;
};

const executeDelete = async () => {
  if (!experienceToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteExperience(experienceToDelete.value.id);
    await fetchExperiences();
    if (isEditing.value && formState.id === experienceToDelete.value.id) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete experience:", err);
    error.value = {title: 'Deletion Failed', message: err.message || 'Could not delete the entry.'};
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchExperiences);
</script>
