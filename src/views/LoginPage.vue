<template>
  <div class="login-page container mt-5" style="max-width: 400px;">
    <div class="card">
      <div class="card-body p-4 p-md-5">
        <h1 class="card-title text-center mb-4 fs-3">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" v-model="credentials.email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="credentials.password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Login (Placeholder)</button>
        </form>
        <p class="mt-3 text-center">
          Don't have an account? <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
// import { useRouter } from 'vue-router';
// import { useAuthStore } from '@/stores/auth'; // If using Pinia later

// JSDoc for the component
/**
 * @file src/views/LoginPage.vue
 * @description Login page for user authentication.
 */

// const router = useRouter();
// const authStore = useAuthStore(); // If using Pinia

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
 * Handles login form submission.
 * (Placeholder logic for now)
 */
const handleLogin = async () => {
  // TODO: Implement actual login logic (API call, JWT handling, state update)
  // TODO: Add validation, loading/error states, user feedback
  console.log('Login attempt (placeholder):', { ...credentials });
  alert('Login attempt (placeholder). Check console.');
  // Example after successful login:
  // await authStore.login(credentials.email, credentials.password);
  // router.push('/');
};
</script>

<style scoped>
.login-page .card {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
