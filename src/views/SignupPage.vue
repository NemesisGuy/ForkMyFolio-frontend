<template>
  <div class="signup-page">
    <div class="container" style="max-width: 500px;">
      <div class="card animate-fade-in-up">
        <div class="card-body p-4 p-md-5">
          <h1 class="card-title text-center mb-4 fs-3">Create Account</h1>

          <!-- This alert is now primarily for client-side validation summary -->
          <div v-if="formMessage.text"
               :class="['alert', formMessage.type === 'success' ? 'alert-success' : 'alert-danger']"
               role="alert">
            {{ formMessage.text }}
            <!-- Detailed errors from API will now go into ErrorModal, so this list is less critical here -->
            <!-- Keeping it for consistency if formMessage is ever used for detailed client-side errors -->
            <ul v-if="formMessage.errors && formMessage.errors.length > 0" class="mb-0 mt-2">
              <li v-for="(err, index) in formMessage.errors" :key="index">
                {{ err.field ? `${err.field}: ` : '' }}{{ err.message }}
              </li>
            </ul>
          </div>

          <form novalidate @submit.prevent="handleSignup">
            <div class="mb-3">
              <label class="form-label" for="firstName">First Name</label>
              <input id="firstName" v-model="formData.firstName" :class="{'is-invalid': fieldErrors.firstName}"
                     class="form-control" required type="text">
              <div v-if="fieldErrors.firstName" class="invalid-feedback">{{
                  fieldErrors.firstName
                }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="lastName">Last Name</label>
              <input id="lastName" v-model="formData.lastName" :class="{'is-invalid': fieldErrors.lastName}"
                     class="form-control" required type="text">
              <div v-if="fieldErrors.lastName" class="invalid-feedback">{{
                  fieldErrors.lastName
                }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="email">Email address</label>
              <input id="email" v-model="formData.email" :class="{'is-invalid': fieldErrors.email}"
                     class="form-control" required type="email">
              <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <input id="password" v-model="formData.password"
                     :class="{'is-invalid': fieldErrors.password}" class="form-control"
                     required type="password">
              <div v-if="fieldErrors.password" class="invalid-feedback">{{
                  fieldErrors.password
                }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" v-model="formData.confirmPassword"
                     :class="{'is-invalid': fieldErrors.confirmPassword}" class="form-control"
                     required type="password">
              <div v-if="fieldErrors.confirmPassword" class="invalid-feedback">
                {{ fieldErrors.confirmPassword }}
              </div>
            </div>
            <button :disabled="isLoading" class="btn btn-primary w-100" type="submit">
              <span v-if="isLoading" aria-hidden="true" class="spinner-border spinner-border-sm"
                    role="status"></span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          <p class="mt-4 text-center">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </div>
      </div>

      <!-- UPDATED: Added v-if to prevent rendering with null data -->
      <SuccessModal
        v-if="signupSuccessMessage"
        :message="signupSuccessMessage"
        :visible="showSignupSuccessModal"
        title="Registration Successful"
        @close="closeSignupSuccessModal"
      />

      <!-- Error Modal for API errors -->
      <ErrorModal
        :message="signupErrorMessage"
        :title="signupErrorTitle"
        :visible="showSignupErrorModal"
        @close="closeSignupErrorModal"
      />
    </div>
  </div>
</template>

<script setup>
// The script section remains unchanged.
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {authService} from '@/services/authService';
import {ApiError} from '@/services/api';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

/**
 * @file src/views/SignupPage.vue
 * @description Signup page for new user registration.
 */

const router = useRouter();

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const fieldErrors = reactive({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null
});

const formMessage = reactive({text: null, type: null, errors: []});

const isLoading = ref(false);

// State for SuccessModal
const signupSuccessMessage = ref(null);
const showSignupSuccessModal = ref(false);

// State for ErrorModal
const showSignupErrorModal = ref(false);
const signupErrorTitle = ref('Error');
const signupErrorMessage = ref('');

/**
 * Closes the success modal and redirects to the user's account page.
 */
const closeSignupSuccessModal = () => {
  showSignupSuccessModal.value = false;
  signupSuccessMessage.value = null;
  // Since authService.register logs the user in, we can go straight to their account.
  router.push('/account');
};

/**
 * Closes the error modal.
 */
const closeSignupErrorModal = () => {
  showSignupErrorModal.value = false;
  signupErrorTitle.value = 'Error';
  signupErrorMessage.value = '';
};

/**
 * Validates the signup form data.
 * @returns {boolean} True if form is valid, false otherwise.
 */
const validateForm = () => {
  // Clear previous errors
  for (const key in fieldErrors) {
    fieldErrors[key] = null;
  }
  formMessage.text = null;
  formMessage.type = null;
  formMessage.errors = [];

  let isValid = true;
  if (!formData.firstName.trim()) {
    fieldErrors.firstName = "First name is required.";
    isValid = false;
  }
  if (!formData.lastName.trim()) {
    fieldErrors.lastName = "Last name is required.";
    isValid = false;
  }
  if (!formData.email.trim()) {
    fieldErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    fieldErrors.email = "Email address is invalid.";
    isValid = false;
  }
  if (!formData.password) {
    fieldErrors.password = "Password is required.";
    isValid = false;
  } else if (formData.password.length < 6) { // Example: min 6 chars
    fieldErrors.password = "Password must be at least 6 characters.";
    isValid = false;
  }
  if (formData.password !== formData.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) {
    formMessage.text = "Please correct the errors in the form.";
    formMessage.type = "error";
  }
  return isValid;
};

/**
 * Handles signup form submission.
 */
const handleSignup = async () => {
  closeSignupErrorModal();

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  formMessage.text = null;
  formMessage.type = null;
  formMessage.errors = [];

  try {
    const apiData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };
    await authService.register(apiData);

    signupSuccessMessage.value = 'Registration successful! Redirecting to your account...';
    showSignupSuccessModal.value = true;

    Object.keys(formData).forEach(key => formData[key] = '');

  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof ApiError) {
      signupErrorTitle.value = 'Registration Failed';
      if (error.errors && error.errors.length > 0) {
        signupErrorMessage.value = error.errors.map(err => err.message);
      } else {
        signupErrorMessage.value = error.message || 'An API error occurred during registration.';
      }
      error.errors?.forEach(err => {
        if (err.field && fieldErrors.hasOwnProperty(err.field)) {
          fieldErrors[err.field] = err.message;
        }
      });
    } else {
      signupErrorTitle.value = 'Unexpected Error';
      signupErrorMessage.value = 'An unexpected error occurred. Please try again.';
    }
    showSignupErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.signup-page {
  min-height: calc(100vh - 56px - 1px); /* Full viewport height minus navbar */
  display: flex;
  align-items: center;
  padding: 2rem 0;
  overflow-x: hidden;
}

/* Animations */
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

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Form inputs on glass */
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

.btn-primary {
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: var(--glass-card-hover-transform);
  box-shadow: var(--glass-card-hover-box-shadow);
}
</style>
