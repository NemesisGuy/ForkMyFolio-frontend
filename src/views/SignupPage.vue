<template>
  <div class="signup-page container mt-4 mb-5" style="max-width: 500px;">
    <div class="card">
      <div class="card-body p-4 p-md-5">
        <h1 class="card-title text-center mb-4 fs-3">Create Account</h1>

        <!-- This alert is now primarily for client-side validation summary -->
        <div v-if="formMessage.text" :class="['alert', formMessage.type === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
          {{ formMessage.text }}
          <!-- Detailed errors from API will now go into ErrorModal, so this list is less critical here -->
          <!-- Keeping it for consistency if formMessage is ever used for detailed client-side errors -->
          <ul v-if="formMessage.errors && formMessage.errors.length > 0" class="mb-0 mt-2">
            <li v-for="(err, index) in formMessage.errors" :key="index">
              {{ err.field ? `${err.field}: ` : '' }}{{ err.message }}
            </li>
          </ul>
        </div>

        <form @submit.prevent="handleSignup" novalidate>
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control" :class="{'is-invalid': fieldErrors.firstName}" id="firstName" v-model="formData.firstName" required>
            <div v-if="fieldErrors.firstName" class="invalid-feedback">{{ fieldErrors.firstName }}</div>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control" :class="{'is-invalid': fieldErrors.lastName}" id="lastName" v-model="formData.lastName" required>
            <div v-if="fieldErrors.lastName" class="invalid-feedback">{{ fieldErrors.lastName }}</div>
          </div>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" :class="{'is-invalid': fieldErrors.username}" id="username" v-model="formData.username" required>
            <div v-if="fieldErrors.username" class="invalid-feedback">{{ fieldErrors.username }}</div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" :class="{'is-invalid': fieldErrors.email}" id="email" v-model="formData.email" required>
            <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" :class="{'is-invalid': fieldErrors.password}" id="password" v-model="formData.password" required>
            <div v-if="fieldErrors.password" class="invalid-feedback">{{ fieldErrors.password }}</div>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" :class="{'is-invalid': fieldErrors.confirmPassword}" id="confirmPassword" v-model="formData.confirmPassword" required>
            <div v-if="fieldErrors.confirmPassword" class="invalid-feedback">{{ fieldErrors.confirmPassword }}</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        <p class="mt-4 text-center">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>

    <!-- UPDATED: Added v-if to prevent rendering with null data -->
    <SuccessModal
      v-if="signupSuccessMessage"
      :visible="showSignupSuccessModal"
      title="Registration Successful"
      :message="signupSuccessMessage"
      @close="closeSignupSuccessModal"
    />

    <!-- Error Modal for API errors -->
    <ErrorModal
      :visible="showSignupErrorModal"
      :title="signupErrorTitle"
      :message="signupErrorMessage"
      @close="closeSignupErrorModal"
    />
  </div>
</template>

<script setup>
// The script section remains unchanged.
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import { ApiError } from '@/services/api';
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
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const fieldErrors = reactive({
  firstName: null,
  lastName: null,
  username: null,
  email: null,
  password: null,
  confirmPassword: null
});

const formMessage = reactive({ text: null, type: null, errors: [] });

const isLoading = ref(false);

// State for SuccessModal
const signupSuccessMessage = ref(null);
const showSignupSuccessModal = ref(false);

// State for ErrorModal
const showSignupErrorModal = ref(false);
const signupErrorTitle = ref('Error');
const signupErrorMessage = ref('');

/**
 * Closes the success modal and redirects to the user's profile.
 */
const closeSignupSuccessModal = () => {
  showSignupSuccessModal.value = false;
  signupSuccessMessage.value = null;
  // Since authService.register logs the user in, we can go straight to the profile.
  router.push('/profile');
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
  if (!formData.username.trim()) {
    fieldErrors.username = "Username is required.";
    isValid = false;
  } else if (formData.username.trim().length < 3) {
    fieldErrors.username = "Username must be at least 3 characters.";
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
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    await authService.register(apiData);

    signupSuccessMessage.value = 'Registration successful! Redirecting to your profile...';
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
.signup-page .card {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
.is-invalid {
  border-color: var(--bs-danger);
}
.invalid-feedback {
  display: block; /* Bootstrap default is none, make it visible */
  width: 100%;
  margin-top: .25rem;
  font-size: .875em;
  color: var(--bs-danger);
}
</style>
