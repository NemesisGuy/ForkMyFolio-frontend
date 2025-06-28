<template>
  <div class="login-page container mt-5 mb-5" style="max-width: 400px;">
    <div class="card">
      <div class="card-body p-4 p-md-5">
        <h1 class="card-title text-center mb-4 fs-3">Login</h1>

        <!-- This alert is now primarily for client-side validation summary -->
        <div v-if="formMessage.text"
             :class="['alert', formMessage.type === 'success' ? 'alert-success' : 'alert-danger']"
             role="alert">
          {{ formMessage.text }}
          <!-- Detailed errors from API will now go into ErrorModal, so this list is less critical here -->
          <ul v-if="formMessage.errors && formMessage.errors.length > 0" class="mb-0 mt-2">
            <li v-for="(err, index) in formMessage.errors" :key="index">
              {{ err.field ? `${err.field}: ` : '' }}{{ err.message }}
            </li>
          </ul>
        </div>

        <form novalidate @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label" for="email">Email address</label>
            <input id="email" v-model="credentials.email" :class="{'is-invalid': fieldErrors.email}"
                   class="form-control" required type="email">
            <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input id="password" v-model="credentials.password"
                   :class="{'is-invalid': fieldErrors.password}" class="form-control"
                   required type="password">
            <div v-if="fieldErrors.password" class="invalid-feedback">{{
                fieldErrors.password
              }}
            </div>
          </div>
          <button :disabled="isLoading" class="btn btn-primary w-100" type="submit">
            <span v-if="isLoading" aria-hidden="true" class="spinner-border spinner-border-sm"
                  role="status"></span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account?
          <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>
    </div>

    <!-- UPDATED: Added v-if to prevent rendering with null data -->
    <SuccessModal
      v-if="loginSuccessMessage"
      :message="loginSuccessMessage"
      :visible="showLoginSuccessModal"
      title="Login Successful"
      @close="closeLoginSuccessModal"
    />

    <!-- Error Modal for API errors -->
    <ErrorModal
      :message="loginErrorMessage"
      :title="loginErrorTitle"
      :visible="showLoginErrorModal"
      @close="closeLoginErrorModal"
    />
  </div>
</template>

<script setup>
// The script section remains unchanged.
import {onMounted, reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {authService} from '@/services/authService';
import {ApiError} from '@/services/api';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

/**
 * @file src/views/LoginPage.vue
 * @description Login page for user authentication.
 */

const router = useRouter();
const route = useRoute();

const credentials = reactive({
  email: '',
  password: ''
});

const fieldErrors = reactive({email: null, password: null});

const formMessage = reactive({text: null, type: null, errors: []});

const isLoading = ref(false);

// State for SuccessModal
const loginSuccessMessage = ref(null);
const showLoginSuccessModal = ref(false);

// State for ErrorModal
const showLoginErrorModal = ref(false);
const loginErrorTitle = ref('Error');
const loginErrorMessage = ref('');

// This variable will hold the path to redirect to after a successful login.
let redirectPathOnSuccess = '/profile'; // Default to /profile

onMounted(() => {
  if (authService.isAuthenticated.value) {
    router.replace(route.query.redirect || '/');
  }
});

/**
 * Closes the success modal and performs redirection.
 */
const closeLoginSuccessModal = () => {
  showLoginSuccessModal.value = false;
  loginSuccessMessage.value = null;
  // Use the stored path. This respects the ?redirect query param or defaults to /profile.
  router.replace(redirectPathOnSuccess);
};

/**
 * Closes the error modal.
 */
const closeLoginErrorModal = () => {
  showLoginErrorModal.value = false;
  loginErrorTitle.value = 'Error';
  loginErrorMessage.value = '';
};

/**
 * Validates the login form data.
 * @returns {boolean} True if form is valid, false otherwise.
 */
const validateForm = () => {
  fieldErrors.email = null;
  fieldErrors.password = null;
  formMessage.text = null;
  formMessage.type = null;
  formMessage.errors = [];

  let isValid = true;
  if (!credentials.email.trim()) {
    fieldErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
    fieldErrors.email = "Email address is invalid.";
    isValid = false;
  }
  if (!credentials.password) {
    fieldErrors.password = "Password is required.";
    isValid = false;
  }

  if (!isValid) {
    formMessage.text = "Please correct the errors in the form.";
    formMessage.type = "error";
  }
  return isValid;
};

/**
 * Handles login form submission.
 */
const handleLogin = async () => {
  closeLoginErrorModal();

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  formMessage.text = null;
  formMessage.type = null;
  formMessage.errors = [];

  try {
    await authService.login(credentials);

    // Determine the redirect path. Use the query param if it exists, otherwise default to /profile.
    redirectPathOnSuccess = route.query.redirect || '/profile';


    // Update the success message to be more accurate.
    loginSuccessMessage.value = "Login successful! Redirecting...";
    showLoginSuccessModal.value = true;

  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof ApiError) {
      loginErrorTitle.value = 'Login Failed';
      if (error.errors && error.errors.length > 0) {
        loginErrorMessage.value = error.errors.map(err => err.message);
      } else {
        loginErrorMessage.value = error.message || 'An API error occurred during login.';
      }
      error.errors?.forEach(err => {
        if (err.field && fieldErrors.hasOwnProperty(err.field)) {
          fieldErrors[err.field] = err.message;
        }
      });
    } else {
      loginErrorTitle.value = 'Unexpected Error';
      loginErrorMessage.value = 'An unexpected error occurred. Please try again.';
    }
    showLoginErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page .card {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.is-invalid {
  border-color: var(--bs-danger);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: .25rem;
  font-size: .875em;
  color: var(--bs-danger);
}
</style>
