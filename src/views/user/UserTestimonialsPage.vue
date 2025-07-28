<template>
  <div class="user-testimonials-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">Manage My Testimonials</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add New Testimonial
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading" />
      <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
      <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="successMessage = null" />
      <ConfirmModal
        :visible="!!testimonialToDelete"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the testimonial from '${testimonialToDelete?.authorName}'?`"
        @confirm="handleDeleteTestimonial"
        @close="testimonialToDelete = null"
      />

      <!-- Add/Edit Testimonial Modal -->
      <div class="modal fade" id="testimonialModal" tabindex="-1" aria-labelledby="testimonialModalLabel" aria-hidden="true" ref="testimonialModalRef">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="testimonialModalLabel">{{ isEditing ? 'Edit Testimonial' : 'Add New Testimonial' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleFormSubmit">
                <div class="mb-3">
                  <label for="testimonialQuote" class="form-label">Quote</label>
                  <textarea class="form-control" id="testimonialQuote" v-model="currentTestimonial.quote" rows="4" required></textarea>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="testimonialAuthorName" class="form-label">Author's Name</label>
                    <input type="text" class="form-control" id="testimonialAuthorName" v-model="currentTestimonial.authorName" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="testimonialAuthorTitle" class="form-label">Author's Title (e.g., "CEO at Company")</label>
                    <input type="text" class="form-control" id="testimonialAuthorTitle" v-model="currentTestimonial.authorTitle">
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="testimonialVisible" v-model="currentTestimonial.visible">
                  <label class="form-check-label" for="testimonialVisible">Visible on public portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="handleFormSubmit">{{ isEditing ? 'Save Changes' : 'Add Testimonial' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials List -->
      <div v-if="!isLoading && testimonials.length > 0" class="card glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <ul class="list-group list-group-flush">
          <li v-for="testimonial in testimonials" :key="testimonial.uuid" class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <blockquote class="blockquote mb-0">
                <p class="quote-text">“{{ testimonial.quote }}”</p>
                <footer class="blockquote-footer mt-2">{{ testimonial.authorName }} <cite v-if="testimonial.authorTitle" :title="testimonial.authorTitle">{{ testimonial.authorTitle }}</cite></footer>
              </blockquote>
              <div class="actions d-flex align-items-center">
                <div class="form-check form-switch me-3" title="Toggle Visibility">
                  <input class="form-check-input" type="checkbox" role="switch" :checked="testimonial.visible" @change="handleVisibilityToggle(testimonial)">
                </div>
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(testimonial)" title="Edit Testimonial">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="testimonialToDelete = testimonial" title="Delete Testimonial">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-chat-right-quote-fill"></i>
        </div>
        <h4 class="glass-title">No Testimonials Found</h4>
        <p class="glass-subtitle">You haven't added any testimonials yet. Click the button above to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { testimonialsApi } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

// --- State ---
const testimonials = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const testimonialToDelete = ref(null);

// For the Add/Edit Modal
const testimonialModalRef = ref(null);
let testimonialModalInstance = null;
const isEditing = ref(false);
const initialTestimonialState = () => ({
  uuid: null,
  quote: '',
  authorName: '',
  authorTitle: '',
  visible: true,
});
const currentTestimonial = reactive(initialTestimonialState());

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchTestimonials();
  if (testimonialModalRef.value) {
    testimonialModalInstance = new Modal(testimonialModalRef.value);
  }
});

// --- Data Fetching ---
const fetchTestimonials = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    testimonials.value = await testimonialsApi.getAll();
  } catch (err) {
    console.error("Failed to fetch user testimonials:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your testimonials.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  Object.assign(currentTestimonial, initialTestimonialState());
  isEditing.value = false;
  testimonialModalInstance?.show();
};

const openEditModal = (testimonial) => {
  isEditing.value = true;
  currentTestimonial.uuid = testimonial.uuid;
  currentTestimonial.quote = testimonial.quote;
  currentTestimonial.authorName = testimonial.authorName;
  currentTestimonial.authorTitle = testimonial.authorTitle;
  currentTestimonial.visible = testimonial.visible;
  testimonialModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  if (isEditing.value) {
    await handleUpdateTestimonial();
  } else {
    await handleAddTestimonial();
  }
};

const buildPayload = (testimonial) => {
  return {
    quote: testimonial.quote,
    authorName: testimonial.authorName,
    authorTitle: testimonial.authorTitle || null,
    visible: testimonial.visible,
  };
};

const handleAddTestimonial = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentTestimonial);
    await testimonialsApi.create(payload);
    await fetchTestimonials();
    successMessage.value = `Testimonial from '${payload.authorName}' was added successfully.`;
    testimonialModalInstance?.hide();
  } catch (err) {
    console.error("Failed to add testimonial:", err);
    error.value = err.message || 'An error occurred while adding the testimonial.';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateTestimonial = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentTestimonial);
    await testimonialsApi.update(currentTestimonial.uuid, payload);
    await fetchTestimonials();
    successMessage.value = `Testimonial from '${payload.authorName}' was updated successfully.`;
    testimonialModalInstance?.hide();
  } catch (err) {
    console.error("Failed to update testimonial:", err);
    error.value = err.message || 'An error occurred while updating the testimonial.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteTestimonial = async () => {
  if (!testimonialToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await testimonialsApi.remove(testimonialToDelete.value.uuid);
    await fetchTestimonials();
    successMessage.value = `Testimonial from '${testimonialToDelete.value.authorName}' was deleted successfully.`;
  } catch (err) {
    console.error("Failed to delete testimonial:", err);
    error.value = err.message || 'An error occurred while deleting the testimonial.';
  } finally {
    isLoading.value = false;
    testimonialToDelete.value = null;
  }
};

const handleVisibilityToggle = async (testimonial) => {
  const originalVisibility = testimonial.visible;
  testimonial.visible = !testimonial.visible; // Optimistic update

  try {
    const payload = buildPayload(testimonial);
    await testimonialsApi.update(testimonial.uuid, payload);
    successMessage.value = `Visibility for testimonial from '${testimonial.authorName}' updated.`;
  } catch (err) {
    testimonial.visible = originalVisibility; // Revert on error
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
  padding: 1.5rem;
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
  margin-left: 1.5rem;
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

.blockquote {
  flex-grow: 1;
}

.quote-text {
  font-style: italic;
  font-size: 1.1rem;
  color: var(--glass-text);
  margin-bottom: 0.5rem;
}

.blockquote-footer {
  color: var(--glass-text-secondary);
}

.blockquote-footer cite {
  color: var(--glass-text-secondary);
  font-style: normal;
}
</style>
