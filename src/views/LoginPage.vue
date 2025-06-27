<template>
  <div class="login-page container mt-5 mb-5" style="max-width: 400px;">
    <div class="card">
      <div class="card-body p-4 p-md-5">
        <h1 class="card-title text-center mb-4 fs-3">Login</h1>

        <div v-if="formMessage.text" :class="['alert', formMessage.type === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
          {{ formMessage.text }}
           <ul v-if="formMessage.errors && formMessage.errors.length > 0" class="mb-0 mt-2">
            <li v-for="(err, index) in formMessage.errors" :key="index">
              {{ err.field ? `${err.field}: ` : '' }}{{ err.message }}
            </li>
          </ul>
        </div>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" :class="{'is-invalid': fieldErrors.email}" id="email" v-model="credentials.email" required>
            <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" :class="{'is-invalid': fieldErrors.password}" id="password" v-model="credentials.password" required>
            <div v-if="fieldErrors.password" class="invalid-feedback">{{ fieldErrors.password }}</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account? <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>
    </div>

    <SuccessModal
      v-if="loginSuccessMessage"
      :visible="showLoginSuccessModal"
      title="Login Successful"
      :message="loginSuccessMessage"
      @close="closeLoginSuccessModal"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '../../services/authService'; // Corrected path
import { ApiError } from '../../services/apiService'; // Corrected path
import SuccessModal from '../../components/common/SuccessModal.vue';

/**
 * @file src/views/LoginPage.vue
 * @description Login page for user authentication.
 */

const router = useRouter();
const route = useRoute();

/**
 * Reactive credentials state.
 * @type {object}
 * @property {string} email - User's email.
 * @property {string} password - User's password.
 */
const credentials = reactive({
  email: '',
  password: ''
});

/**
 * @typedef {object} FieldErrorsLogin
 * @property {string|null} email
 * @property {string|null} password
 */

/** @type {FieldErrorsLogin} */
const fieldErrors = reactive({ email: null, password: null });

/**
 * @typedef {object} FormMessageLogin
 * @property {string|null} text - The message text.
 * @property {"success"|"error"|null} type - The type of message (for styling).
 * @property {Array<{field?: string, message: string}>} [errors] - Detailed errors from API.
 */

/** @type {FormMessageLogin} */
const formMessage = reactive({ text: null, type: null, errors: [] });

/** @type {import('vue').Ref<boolean>} */
const isLoading = ref(false);
/** @type {import('vue').Ref<string|null>} */
const loginSuccessMessage = ref(null);
/** @type {import('vue').Ref<boolean>} */
const showLoginSuccessModal = ref(false);

let redirectPathOnSuccess = '/'; // Store redirect path

// Redirect if already logged in
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
  router.replace(redirectPathOnSuccess); // Use stored redirect path
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
  return isValid;
};

/**
 * Handles login form submission.
 */
const handleLogin = async () => {
  if (!validateForm()) {
    formMessage.text = "Please correct the errors in the form.";
    formMessage.type = "error";
    return;
  }

  isLoading.value = true;
  formMessage.text = null;
  formMessage.type = null;
  formMessage.errors = [];

  try {
    await authService.login(credentials);

    loginSuccessMessage.value = "Login successful! Redirecting to your dashboard...";
    showLoginSuccessModal.value = true;
    redirectPathOnSuccess = route.query.redirect || '/'; // Store the intended path

    // Redirection will now happen when the SuccessModal is closed by the user
    // or after a timeout if we implement auto-close later.
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof ApiError) {
      formMessage.text = error.message || 'Login failed. Please check your credentials.';
      formMessage.errors = error.errors || [{ message: 'An unknown API error occurred.' }];
      error.errors?.forEach(err => {
        if (err.field && fieldErrors.hasOwnProperty(err.field)) {
          fieldErrors[err.field] = err.message;
        }
      });
    } else {
      formMessage.text = 'An unexpected error occurred. Please try again.';
    }
    formMessage.type = 'error';
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
