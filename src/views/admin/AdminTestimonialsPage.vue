<template>
  <div class="admin-testimonials-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Testimonials Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the testimonial from '${formState.authorName}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />

      <div class="row g-5">
        <!-- Add/Edit Form -->
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">{{ isEditing ? 'Edit Testimonial' : 'Add New Testimonial' }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="authorName" class="form-label">Author's Name</label>
                    <input type="text" class="form-control" id="authorName" v-model="formState.authorName" required>
                  </div>
                  <div class="col-12">
                    <label for="authorTitle" class="form-label">Author's Title / Company</label>
                    <input type="text" class="form-control" id="authorTitle" v-model="formState.authorTitle" required>
                  </div>
                  <div class="col-12">
                    <label for="quote" class="form-label">Quote</label>
                    <textarea class="form-control" id="quote" rows="6" v-model="formState.quote" required></textarea>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button type="button" v-if="isEditing" class="btn btn-secondary me-2" @click="resetForm">Cancel Edit</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
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
            <div v-for="testimonial in testimonials" :key="testimonial.uuid" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <i class="bi bi-person-circle" style="font-size: 2.5rem; color: #6c757d;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <blockquote class="blockquote mb-2">
                      <p class="mb-2 fst-italic">"{{ testimonial.quote }}"</p>
                      <footer class="blockquote-footer">{{ testimonial.authorName }}, <cite :title="testimonial.authorTitle">{{ testimonial.authorTitle }}</cite></footer>
                    </blockquote>
                  </div>
                  <div class="flex-shrink-0 ms-2">
                    <button class="btn btn-sm btn-outline-secondary d-block mb-2" @click="selectForEdit(testimonial)" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger d-block" @click="requestDelete(testimonial)" title="Delete"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else-if="!isLoading && !error.message"
            title="No Testimonials Found"
            message="Add a new testimonial using the form to get started."
            icon-class="bi-chat-quote-fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getPublicTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, ApiError } from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const testimonials = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const testimonialToDelete = ref(null);

const initialFormState = {
  uuid: null,
  quote: '',
  authorName: '',
  authorTitle: '',
};

const formState = reactive({ ...initialFormState });

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const fetchTestimonials = async () => {
  isLoading.value = true;
  try {
    testimonials.value = await getPublicTestimonials();
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
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
      await updateTestimonial(formState.uuid, formState);
    } else {
      await createTestimonial(formState);
    }
    resetForm();
    await fetchTestimonials();
  } catch (err) {
    console.error("Failed to save testimonial:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save the testimonial.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (testimonial) => {
  Object.assign(formState, testimonial);
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (testimonial) => {
  testimonialToDelete.value = testimonial;
  Object.assign(formState, testimonial); // For the modal message
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  testimonialToDelete.value = null;
  resetForm();
};

const executeDelete = async () => {
  if (!testimonialToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteTestimonial(testimonialToDelete.value.uuid);
    await fetchTestimonials();
    if (isEditing.value && formState.uuid === testimonialToDelete.value.uuid) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete testimonial:", err);
    error.value = { title: 'Deletion Failed', message: err.message || 'Could not delete the testimonial.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchTestimonials);
</script>

<style scoped>
.admin-testimonials-page h1 {
  font-weight: 300;
}
.blockquote-footer {
  font-size: 0.9em;
}
</style>
