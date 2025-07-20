<template>
  <!-- The template is already correctly using the new global classes. No changes needed here. -->
  <div class="contact-page py-4 animated-gradient-background">
    <div class="container" style="max-width: 600px;">
      <div class="text-center mb-4">
        <h1 class="display-4 fw-bold animate-fade-in-up">📧 Get In Touch</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          Have a question or want to work together? Fill out the form below.
        </p>
      </div>

      <!-- The card has the correct interactive classes -->
      <div class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary" style="animation-delay: 0.2s;">
        <div class="card-body p-4 p-md-5">
          <form novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="name">Name</label>
              <input id="name" v-model="form.name" :class="{'is-invalid': fieldErrors.name}" class="form-control"
                     required type="text">
              <div v-if="fieldErrors.name" class="invalid-feedback">{{ fieldErrors.name }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="email">Email address</label>
              <input id="email" v-model="form.email" :class="{'is-invalid': fieldErrors.email}" class="form-control"
                     required type="email">
              <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="message">Message</label>
              <textarea id="message" v-model="form.message" :class="{'is-invalid': fieldErrors.message}"
                        class="form-control" required rows="5"></textarea>
              <div v-if="fieldErrors.message" class="invalid-feedback">{{ fieldErrors.message }}</div>
            </div>
            <button :disabled="isLoading" class="btn btn-primary w-100 interactive-lift interactive-shadow-primary" type="submit">
              <span v-if="isLoading" aria-hidden="true" class="spinner-border spinner-border-sm me-1"
                    role="status"></span>
              {{ isLoading ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modals for feedback -->
    <SuccessModal
      :visible="showSuccessModal"
      title="Message Sent!"
      :message="successMessage"
      @close="closeSuccessModal"
    />
    <ErrorModal
      :visible="showErrorModal"
      :title="error.title"
      :message="error.message"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { submitContactMessage, ApiError } from '@/services/api/index.js';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

/**
 * @file src/views/ContactPage.vue
 * @description A sexy, modern contact page with form submission and feedback.
 */

const form = reactive({
  name: '',
  email: '',
  message: ''
});

const fieldErrors = reactive({
  name: null,
  email: null,
  message: null
});

const isLoading = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const successMessage = ref('');
const showSuccessModal = ref(false);

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

const validateForm = () => {
  // Clear previous errors
  for (const key in fieldErrors) {
    fieldErrors[key] = null;
  }

  let isValid = true;
  if (!form.name.trim()) {
    fieldErrors.name = "Name is required.";
    isValid = false;
  }
  if (!form.email.trim()) {
    fieldErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    fieldErrors.email = "Email address is invalid.";
    isValid = false;
  }
  if (!form.message.trim()) {
    fieldErrors.message = "Message is required.";
    isValid = false;
  }
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    await submitContactMessage({ ...form });
    successMessage.value = 'Thank you for your message! I will get back to you shortly.';
    showSuccessModal.value = true;
    // Reset form
    form.name = '';
    form.email = '';
    form.message = '';
  } catch (err) {
    console.error("Failed to send message:", err);
    error.value = {
      title: 'Submission Failed',
      message: err instanceof ApiError ? err.message : 'Could not send the message. Please try again later.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 56px - 1px);
  /* REMOVED: background, background-size, and animation properties.
     These are now handled by the `.animated-gradient-background` class. */
  overflow-x: hidden;
}

/*
  KEY FIX: This ensures the card's content is clickable by lifting it
  above the decorative ::before pseudo-element.
*/
.card-body {
  position: relative;
  z-index: 1;
}

/* Animations are page-specific and should remain. */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* REMOVED: @keyframes animated-gradient. Handled by `.animated-gradient-background`. */

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* REMOVED: .card styling. Handled by `.glass-card` and `.shimmering`. */

/* Form-specific styles are correctly kept here as they are scoped to this component. */
.form-control {
  background-color: rgba(var(--bs-body-bg-rgb), 0.5);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  color: var(--bs-body-color);
  transition: all 0.3s ease;
}
.form-control:focus {
  background-color: rgba(var(--bs-body-bg-rgb), 0.7);
  color: var(--bs-body-color);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
.form-control.is-invalid {
  border-color: var(--bs-danger);
  background-color: rgba(var(--bs-danger-rgb), 0.1);
}
.invalid-feedback {
  color: var(--bs-danger);
  font-weight: 500;
}

/* REMOVED: .btn-primary and .btn-primary:hover styling.
   Handled by `.interactive-lift` and `.interactive-shadow-primary`. */
</style>
