<template>
  <div class="signup-page container mt-5" style="max-width: 450px;">
    <div class="card">
      <div class="card-body p-4 p-md-5">
        <h1 class="card-title text-center mb-4 fs-3">Create Account</h1>
        <form @submit.prevent="handleSignup">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" v-model="formData.username" required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="formData.password" required>
          </div>
           <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="confirmPassword" v-model="formData.confirmPassword" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign Up (Placeholder)</button>
        </form>
        <p class="mt-3 text-center">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
// import { useRouter } from 'vue-router';

// JSDoc for the component
/**
 * @file src/views/SignupPage.vue
 * @description Signup page for new user registration.
 */

// const router = useRouter();

/**
 * Reactive form data state for signup.
 * @type {object}
 * @property {string} username - Desired username.
 * @property {string} email - User's email.
 * @property {string} password - User's chosen password.
 * @property {string} confirmPassword - Password confirmation.
 */
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

/**
 * Handles signup form submission.
 * (Placeholder logic for now)
 */
const handleSignup = () => {
  // TODO: Implement actual signup logic (validation, API call, user feedback)
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match! (Placeholder validation)");
    return;
  }
  console.log('Signup attempt (placeholder):', { ...formData });
  alert('Signup attempt (placeholder). Check console.');
  // Example after successful signup:
  // router.push('/login');
};
</script>

<style scoped>
.signup-page .card {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
