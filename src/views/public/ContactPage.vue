<template>
  <div class="contact-page py-5 animated-gradient-background">
    <div class="container" style="max-width: 600px;">
      <div class="text-center mb-4">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">📧 Get In Touch</h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          Have a question or want to work together? Fill out the form below.
        </p>
      </div>

      <!-- Enhanced glassmorphic modal -->
      <LoadingModal :visible="isPageLoading" class="glass-modal" />

      <!-- Enhanced skeleton loader with glassmorphic styling -->
      <div v-if="isPageLoading"
           class="card glass-card shimmering glass-card-floating animate-fade-in-up"
           style="animation-delay: 0.2s;">
        <div class="card-body p-4 p-md-5">
          <div class="mb-3">
            <div class="skeleton-line skeleton-label mb-2"></div>
            <div class="skeleton-input"></div>
          </div>
          <div class="mb-3">
            <div class="skeleton-line skeleton-label mb-2"></div>
            <div class="skeleton-input"></div>
          </div>
          <div class="mb-3">
            <div class="skeleton-line skeleton-label mb-2"></div>
            <div class="skeleton-textarea"></div>
          </div>
          <div class="skeleton-button"></div>
        </div>
      </div>

      <!-- Enhanced glassmorphic contact form -->
      <div v-else
           class="card glass-card shimmering glass-card-floating animate-fade-in-up interactive-card-lift interactive-card-shadow-primary"
           style="animation-delay: 0.2s;">
        <div class="card-body p-4 p-md-5">
          <form novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label glass-label" for="name">
                <i class="bi bi-person-fill me-2"></i>Name
              </label>
              <input id="name"
                     v-model="form.name"
                     :class="{'is-invalid': fieldErrors.name}"
                     class="form-control glass-input"
                     required
                     type="text"
                     placeholder="Enter your full name">
              <div v-if="fieldErrors.name" class="invalid-feedback glass-error">
                <i class="bi bi-exclamation-circle me-1"></i>{{ fieldErrors.name }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label glass-label" for="email">
                <i class="bi bi-envelope-fill me-2"></i>Email address
              </label>
              <input id="email"
                     v-model="form.email"
                     :class="{'is-invalid': fieldErrors.email}"
                     class="form-control glass-input"
                     required
                     type="email"
                     placeholder="your.email@example.com">
              <div v-if="fieldErrors.email" class="invalid-feedback glass-error">
                <i class="bi bi-exclamation-circle me-1"></i>{{ fieldErrors.email }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label glass-label" for="message">
                <i class="bi bi-chat-dots-fill me-2"></i>Message
              </label>
              <textarea id="message"
                        v-model="form.message"
                        :class="{'is-invalid': fieldErrors.message}"
                        class="form-control glass-input glass-textarea"
                        required
                        rows="5"
                        placeholder="Tell me about your project or ask any questions..."></textarea>
              <div v-if="fieldErrors.message" class="invalid-feedback glass-error">
                <i class="bi bi-exclamation-circle me-1"></i>{{ fieldErrors.message }}
              </div>
            </div>

            <button :disabled="isSubmitting"
                    class="btn glass-btn-primary w-100 interactive-lift interactive-shadow-primary"
                    type="submit">
              <span v-if="isSubmitting"
                    aria-hidden="true"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"></span>
              <i v-else class="bi bi-send-fill me-2"></i>
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>

          <!-- Contact info cards -->
          <div class="row mt-4 g-3">
            <div class="col-md-6">
              <div class="glass-info-card text-center p-3">
                <i class="bi bi-clock-fill text-primary mb-2" style="font-size: 1.5rem;"></i>
                <div class="glass-subtitle small">Response Time</div>
                <div class="glass-text small fw-semibold">Within 24 hours</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="glass-info-card text-center p-3">
                <i class="bi bi-shield-check-fill text-success mb-2" style="font-size: 1.5rem;"></i>
                <div class="glass-subtitle small">Privacy</div>
                <div class="glass-text small fw-semibold">100% Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced modals with glassmorphic styling -->
    <SuccessModal
      :visible="showSuccessModal"
      title="Message Sent!"
      :message="successMessage"
      @close="closeSuccessModal"
      class="glass-modal"
    />
    <ErrorModal
      :visible="showErrorModal"
      :title="error.title"
      :message="error.message"
      @close="closeErrorModal"
      class="glass-modal"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { submitContactMessage, ApiError } from '@/services/api/index.js';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

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
  // Clear previous errors
  for (const key in fieldErrors) {
    fieldErrors[key] = null;
  }

  let isValid = true;

  if (!form.name.trim()) {
    fieldErrors.name = "Name is required.";
    isValid = false;
  } else if (form.name.trim().length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
    isValid = false;
  }

  if (!form.email.trim()) {
    fieldErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    fieldErrors.email = "Please enter a valid email address.";
    isValid = false;
  }

  if (!form.message.trim()) {
    fieldErrors.message = "Message is required.";
    isValid = false;
  } else if (form.message.trim().length < 10) {
    fieldErrors.message = "Message must be at least 10 characters.";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    // Add shake animation to form on validation error
    const form = document.querySelector('.glass-card');
    form?.classList.add('shake-animation');
    setTimeout(() => form?.classList.remove('shake-animation'), 600);
    return;
  }

  isSubmitting.value = true;
  try {
    await submitContactMessage({ ...form });
    successMessage.value = 'Thank you for your message! I will get back to you shortly.';
    showSuccessModal.value = true;

    // Reset form
    form.name = '';
    form.email = '';
    form.message = '';

    // Add success animation
    const formCard = document.querySelector('.glass-card');
    formCard?.classList.add('success-pulse');
    setTimeout(() => formCard?.classList.remove('success-pulse'), 1000);

  } catch (err) {
    console.error("Failed to send message:", err);
    error.value = {
      title: 'Submission Failed',
      message: err instanceof ApiError ? err.message : 'Could not send the message. Please try again later.'
    };
    showErrorModal.value = true;

    // Add error shake animation
    const formCard = document.querySelector('.glass-card');
    formCard?.classList.add('error-shake');
    setTimeout(() => formCard?.classList.remove('error-shake'), 600);
  } finally {
    isSubmitting.value = false;
  }
};

// Simulate page load with smooth transition
onMounted(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 800); // Slightly longer for better visual effect
});
</script>

<style scoped>
/* ==========================================================================
   Enhanced Glassmorphic Contact Form Styles
   ========================================================================== */

.contact-page {
  min-height: calc(100vh - 56px - 1px);
  overflow-x: hidden;
}

/* --- Enhanced Form Controls --- */
.glass-input {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  color: var(--glass-text);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  font-weight: 500;
}

.glass-input::placeholder {
  color: var(--glass-text-secondary);
  opacity: 0.7;
}

.glass-input:focus {
  background: var(--glass-bg-hover);
  border-color: rgba(var(--bs-primary-rgb), 0.5);
  box-shadow:
    0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15),
    0 8px 25px rgba(var(--bs-primary-rgb), 0.1);
  transform: translateY(-2px);
}

.glass-input.is-invalid {
  border-color: rgba(var(--bs-danger-rgb), 0.5);
  background: rgba(var(--bs-danger-rgb), 0.05);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.15);
}

.glass-textarea {
  resize: vertical;
  min-height: 120px;
}

/* --- Labels and Text --- */
.glass-label {
  color: var(--glass-text);
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.glass-label i {
  color: var(--bs-primary);
  opacity: 0.8;
}

.glass-error {
  color: var(--bs-danger);
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(var(--bs-danger-rgb), 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

/* --- Enhanced Primary Button --- */
.glass-btn-primary {
  background: linear-gradient(135deg,
  rgba(var(--bs-primary-rgb), 0.8),
  rgba(var(--bs-primary-rgb), 0.9)
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.3);
  color: white;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.glass-btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.2),
  transparent
  );
  transition: left 0.6s ease;
}

.glass-btn-primary:hover::before {
  left: 100%;
}

.glass-btn-primary:hover {
  background: linear-gradient(135deg,
  rgba(var(--bs-primary-rgb), 0.9),
  rgba(var(--bs-primary-rgb), 1)
  );
  transform: translateY(-3px);
  box-shadow:
    0 12px 35px rgba(var(--bs-primary-rgb), 0.4),
    0 4px 15px rgba(var(--bs-primary-rgb), 0.2);
  border-color: rgba(var(--bs-primary-rgb), 0.5);
}

.glass-btn-primary:active {
  transform: translateY(-1px);
}

.glass-btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* --- Info Cards --- */
.glass-info-card {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.glass-info-card:hover {
  background: var(--glass-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--glass-shadow);
}

/* --- Animation Classes --- */
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s ease-out forwards;
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

/* --- Interaction Feedback Animations --- */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes successPulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--bs-success-rgb), 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(var(--bs-success-rgb), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--bs-success-rgb), 0); }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.shake-animation {
  animation: shake 0.6s ease-in-out;
}

.success-pulse {
  animation: successPulse 1s ease-out;
}

.error-shake {
  animation: errorShake 0.6s ease-in-out;
}

/* --- Skeleton Loaders --- */
.skeleton-line,
.skeleton-input,
.skeleton-textarea,
.skeleton-button {
  background: linear-gradient(90deg,
  var(--glass-bg),
  var(--glass-bg-hover),
  var(--glass-bg)
  );
  background-size: 200% 100%;
  animation: glassShimmer 2s ease-in-out infinite;
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.skeleton-label {
  width: 30%;
  height: 20px;
  margin-bottom: 0.5rem;
}

.skeleton-input {
  width: 100%;
  height: 48px;
}

.skeleton-textarea {
  width: 100%;
  height: 120px;
}

.skeleton-button {
  width: 100%;
  height: 52px;
}

@keyframes glassShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* --- Responsive Design --- */
@media (max-width: 768px) {
  .glass-input {
    padding: 0.625rem 0.875rem;
  }

  .glass-btn-primary {
    padding: 0.75rem 1.5rem;
  }

  .contact-page .container {
    max-width: 90% !important;
  }
}

/* --- Focus States for Accessibility --- */
.glass-input:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.glass-btn-primary:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

/* --- High Contrast Mode Support --- */
@media (prefers-contrast: high) {
  .glass-input {
    border-width: 2px;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .glass-btn-primary {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--bs-primary);
  }
}

/* --- Reduced Motion Support --- */
@media (prefers-reduced-motion: reduce) {
  .glass-input,
  .glass-btn-primary,
  .glass-info-card,
  .skeleton-line,
  .skeleton-input,
  .skeleton-textarea,
  .skeleton-button {
    animation: none;
    transition: none;
  }

  .glass-btn-primary::before {
    display: none;
  }
}
</style>
