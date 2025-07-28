<template>
  <div class="portfolio-contact card glass-card shadow-sm">
    <div class="card-body p-4">
      <h3 class="card-title h5 mb-3">Contact Me</h3>

      <div v-if="formSubmitted" class="alert alert-success">
        <h4 class="alert-heading">Thank You!</h4>
        <p>Your message has been sent successfully.</p>
      </div>

      <form v-else @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="senderName" class="form-label">Your Name</label>
          <input type="text" class="form-control" id="senderName" v-model="formData.senderName" required :disabled="isSubmitting">
        </div>
        <div class="mb-3">
          <label for="senderEmail" class="form-label">Your Email</label>
          <input type="email" class="form-control" id="senderEmail" v-model="formData.senderEmail" required :disabled="isSubmitting">
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">Message</label>
          <textarea class="form-control" id="message" rows="4" v-model="formData.message" required :disabled="isSubmitting"></textarea>
        </div>

        <div v-if="error" class="alert alert-danger small p-2">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { publicApi } from '@/services/api/public.api.js';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const formData = reactive({
  senderName: '',
  senderEmail: '',
  message: '',
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);
const error = ref(null);

const submitForm = async () => {
  isSubmitting.value = true;
  error.value = null;
  try {
    await publicApi.sendContactMessage(props.slug, formData);
    formSubmitted.value = true;
  } catch (err) {
    console.error("Contact form submission failed:", err);
    error.value = err.message || 'An unknown error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.card-title {
  font-weight: 300;
}
</style>
