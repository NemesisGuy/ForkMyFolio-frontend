<template>
  <div class="contact-page py-5 animated-gradient-background">
    <div class="container" style="max-width: 600px;">
      <div class="text-center mb-4">
        <h1 class="display-4 fw-bold animate-fade-in-up">📧 Get In Touch</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          Have a question or want to work together? Fill out the form below.
        </p>
      </div>

      <!-- The glassmorphic modal will overlay everything while loading -->
      <LoadingModal :visible="isPageLoading" />

      <!-- THIS IS THE FIX: A shimmering skeleton loader that mimics the contact form -->
      <div v-if="isPageLoading"
           class="card glass-card shimmering animate-fade-in-up"
           style="animation-delay: 0.2s;">
        <div class="card-body p-4 p-md-5">
          <div class="skeleton-line skeleton-label mb-2"></div>
          <div class="skeleton-input mb-3"></div>
          <div class="skeleton-line skeleton-label mb-2"></div>
          <div class="skeleton-input mb-3"></div>
          <div class="skeleton-line skeleton-label mb-2"></div>
          <div class="skeleton-textarea mb-3"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>

      <!-- The real form card, now shown with v-else -->
      <div v-else
           class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary"
           style="animation-delay: 0.2s;">
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
            <button :disabled="isSubmitting" class="btn btn-primary w-100 interactive-lift interactive-shadow-primary" type="submit">
              <span v-if="isSubmitting" aria-hidden="true" class="spinner-border spinner-border-sm me-1"
                    role="status"></span>
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
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
import { reactive, ref, onMounted } from 'vue';
import { submitContactMessage, ApiError } from '@/services/api/index.js';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import LoadingModal from '@/components/common/LoadingModal.vue';

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

// THIS IS THE FIX: Separate loading states for page load vs. form submission
const isPageLoading = ref(true);
const isSubmitting = ref(false);

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

  isSubmitting.value = true;
  try {
    await submitContactMessage({ ...form });
    successMessage.value = 'Thank you for your message! I will get back to you shortly.';
    showSuccessModal.value = true;
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
    isSubmitting.value = false;
  }
};

// THIS IS THE FIX: Simulate a page load to allow the skeleton to be visible
onMounted(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 500); // A 500ms delay provides a smooth visual transition
});
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 56px - 1px);
  overflow-x: hidden;
}

.card-body {
  position: relative;
  z-index: 1;
}

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

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

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

/* --- THIS IS THE FIX: Skeleton Placeholder Styles --- */
.skeleton-line, .skeleton-input, .skeleton-textarea, .skeleton-button {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--bs-border-radius);
}
.skeleton-label {
  width: 25%;
  height: 16px;
}
.skeleton-input {
  width: 100%;
  height: 38px; /* Standard Bootstrap input height */
}
.skeleton-textarea {
  width: 100%;
  height: 120px; /* Matches rows="5" */
}
.skeleton-button {
  width: 100%;
  height: 38px; /* Standard Bootstrap button height */
}
</style>
