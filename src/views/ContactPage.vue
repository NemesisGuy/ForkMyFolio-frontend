<template>
  <div class="contact-page container mt-4" style="max-width: 600px;">
    <h1 class="mb-4 text-center">Contact Us</h1>
    <p class="lead mb-4 text-center">Have a question or want to work together? Fill out the form
      below.</p>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label" for="name">Name</label>
        <input id="name" v-model="form.name" class="form-control" required type="text">
      </div>
      <div class="mb-3">
        <label class="form-label" for="email">Email address</label>
        <input id="email" v-model="form.email" class="form-control" required type="email">
      </div>
      <div class="mb-3">
        <label class="form-label" for="message">Message</label>
        <textarea id="message" v-model="form.message" class="form-control" required
                  rows="5"></textarea>
      </div>
      <button class="btn btn-primary w-100" type="submit">Send Message (Placeholder)</button>
    </form>
  </div>
</template>

<script setup>
import {reactive} from 'vue';

// JSDoc for the component
/**
 * @file src/views/ContactPage.vue
 * @description Page containing a contact form.
 * Will handle form submission to the backend.
 */

/**
 * Reactive form state.
 * @type {object}
 * @property {string} name - User's name.
 * @property {string} email - User's email.
 * @property {string} message - User's message.
 */
const form = reactive({
  name: '',
  email: '',
  message: ''
});

/**
 * Handles form submission.
 * (Placeholder logic for now)
 */
const handleSubmit = () => {
  // TODO: Implement actual form submission logic (e.g., API call)
  // TODO: Add validation and user feedback (loading/error/success states)
  console.log('Form submitted (placeholder):', {...form});
  alert('Message sent (placeholder)! Thank you.');
  // Reset form
  form.name = '';
  form.email = '';
  form.message = '';
};
</script>

<style scoped>
.contact-page h1 {
  font-weight: 300;
}
</style>
