<template>
  <div class="login-page animated-gradient-background">
    <div class="container" style="max-width: 400px;">
      <!-- The interactive classes are correct -->
      <div class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
        <div class="card-body p-4 p-md-5">
          <h1 class="card-title text-center mb-4 fs-3">Login</h1>

          <div v-if="formMessage.text"
               :class="['alert', formMessage.type === 'success' ? 'alert-success' : 'alert-danger']"
               role="alert">
            {{ formMessage.text }}
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
            <button :disabled="isLoading" class="btn btn-primary w-100 interactive-lift interactive-shadow-primary" type="submit">
              <span v-if="isLoading" aria-hidden="true" class="spinner-border spinner-border-sm"
                    role="status"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
<!--          <p class="mt-4 text-center">
            Don't have an account?
            <router-link to="/signup">Sign Up</router-link>
          </p>-->
        </div>
      </div>

      <SuccessModal
        v-if="loginSuccessMessage"
        :message="loginSuccessMessage"
        :visible="showLoginSuccessModal"
        title="Login Successful"
        @close="closeLoginSuccessModal"
      />

      <ErrorModal
        :message="loginErrorMessage"
        :title="loginErrorTitle"
        :visible="showLoginErrorModal"
        @close="closeLoginErrorModal"
      />
    </div>
  </div>
</template>

<script setup>
// The script section remains unchanged.
import {onMounted, reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {authService} from '@/services/authService.js';
import {ApiError} from '@/services/api/index.js';
import SuccessModal from '@/components/common/SuccessModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

const router = useRouter();
const route = useRoute();

const credentials = reactive({
  email: '',
  password: ''
});

const fieldErrors = reactive({email: null, password: null});

const formMessage = reactive({text: null, type: null, errors: []});

const isLoading = ref(false);

const loginSuccessMessage = ref(null);
const showLoginSuccessModal = ref(false);

const showLoginErrorModal = ref(false);
const loginErrorTitle = ref('Error');
const loginErrorMessage = ref('');

let redirectPathOnSuccess = '/account';

onMounted(() => {
  if (authService.isAuthenticated.value) {
    router.replace(route.query.redirect || '/');
  }
});

const closeLoginSuccessModal = () => {
  showLoginSuccessModal.value = false;
  loginSuccessMessage.value = null;
  router.replace(redirectPathOnSuccess);
};

const closeLoginErrorModal = () => {
  showLoginErrorModal.value = false;
  loginErrorTitle.value = 'Error';
  loginErrorMessage.value = '';
};

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
    redirectPathOnSuccess = route.query.redirect || '/account';
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
.login-page {
  min-height: calc(100vh - 56px - 1px); /* Full viewport height minus navbar */
  display: flex;
  align-items: center;
  padding: 2rem 0;
  /* REMOVED: background, background-size, animation. Handled by .animated-gradient-background */
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

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Form inputs on glass (remains page-specific) */
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
</style>
