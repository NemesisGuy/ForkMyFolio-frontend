<template>
  <div class="admin-testimonials-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Testimonial Management</h1>

      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error.message" :message="error.message" :title="error.title"
                  :visible="showErrorModal" @close="closeErrorModal"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the testimonial from '${testimonialToDelete?.authorName}'?`"
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
                  isEditing ? 'Edit Testimonial' : 'Add New Testimonial'
                }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label" for="quote">Quote</label>
                    <textarea id="quote" v-model="formState.quote" class="form-control" required
                              rows="5"></textarea>
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="authorName">Author's Name</label>
                    <input id="authorName" v-model="formState.authorName" class="form-control"
                           required type="text">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="authorTitle">Author's Title / Company</label>
                    <input id="authorTitle" v-model="formState.authorTitle" class="form-control"
                           required type="text">
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button v-if="isEditing" class="btn btn-secondary me-2" type="button"
                          @click="resetForm">Cancel Edit
                  </button>
                  <button :disabled="isSaving" class="btn btn-primary" type="submit">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditing ? 'Save Changes' : 'Add Testimonial' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Testimonials List -->
        <div class="col-lg-7">
          <div v-if="!isLoading && testimonials.length > 0">
            <div v-for="testimonial in testimonials" :key="testimonial.id"
                 class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <blockquote class="blockquote mb-2">
                      <p>"{{ testimonial.quote }}"</p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                      {{ testimonial.authorName }}, <cite
                      :title="testimonial.authorTitle">{{ testimonial.authorTitle }}</cite>
                    </figcaption>
                  </div>
                  <div class="flex-shrink-0 ms-3">
                    <button class="btn btn-sm btn-outline-secondary me-2"
                            title="Edit" @click="selectForEdit(testimonial)"><i
                      class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger"
                            title="Delete" @click="requestDelete(testimonial)"><i
                      class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isLoading && !error.message" class="text-center py-5">
            <p class="lead text-muted">No testimonials added yet. Use the form to get started!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {
  createTestimonial,
  deleteTestimonial,
  getPublicTestimonials,
  updateTestimonial
} from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const testimonials = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({title: '', message: ''});
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const testimonialToDelete = ref(null);

const initialFormState = {
  id: null,
  quote: '',
  authorName: '',
  authorTitle: '',
};

const formState = reactive({...initialFormState});

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = {title: '', message: ''};
};

const fetchTestimonials = async () => {
  isLoading.value = true;
  try {
    testimonials.value = await getPublicTestimonials();
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
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
  try {
    if (isEditing.value) {
      await updateTestimonial(formState.id, formState);
    } else {
      await createTestimonial(formState);
    }
    resetForm();
    await fetchTestimonials();
  } catch (err) {
    console.error("Failed to save testimonial:", err);
    error.value = {title: 'Save Failed', message: err.message || 'Could not save the entry.'};
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (testimonial) => {
  Object.assign(formState, testimonial);
  isEditing.value = true;
  window.scrollTo({top: 0, behavior: 'smooth'});
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (testimonial) => {
  testimonialToDelete.value = testimonial;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  testimonialToDelete.value = null;
};

const executeDelete = async () => {
  if (!testimonialToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteTestimonial(testimonialToDelete.value.id);
    await fetchTestimonials();
    if (isEditing.value && formState.id === testimonialToDelete.value.id) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete testimonial:", err);
    error.value = {title: 'Deletion Failed', message: err.message || 'Could not delete the entry.'};
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchTestimonials);
</script>
