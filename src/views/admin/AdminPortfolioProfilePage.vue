<template>
  <div class="edit-profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 mb-4">Edit Portfolio Profile</h1>

          <LoadingModal :visible="isLoading" />
          <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />

          <div v-if="!isLoading" class="card shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="handleSave">
                <!-- Main Info Section -->
                <h5 class="mb-3">Main Information</h5>
                <div class="row g-3">
                  <div class="col-12">
                    <label for="headline" class="form-label">Headline</label>
                    <input type="text" class="form-control" id="headline" v-model="formState.headline" placeholder="e.g., Full-Stack Software Engineer" required>
                  </div>
                  <div class="col-12">
                    <label for="summary" class="form-label">Summary / Bio</label>
                    <textarea class="form-control" id="summary" v-model="formState.summary" rows="6" placeholder="A passionate developer with experience in..."></textarea>
                  </div>
                  <div class="col-md-6">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" v-model="formState.location" placeholder="e.g., San Francisco, CA">
                  </div>
                </div>

                <hr class="my-4">

                <!-- Links Section -->
                <h5 class="mb-3">Contact & Links</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="publicEmail" class="form-label">Public Email</label>
                    <input type="email" class="form-control" id="publicEmail" v-model="formState.publicEmail" placeholder="contact.jane@example.com">
                  </div>
                  <div class="col-md-6">
                    <label for="websiteUrl" class="form-label">Website URL</label>
                    <input type="url" class="form-control" id="websiteUrl" v-model="formState.websiteUrl" placeholder="https://your-portfolio.com">
                  </div>
                  <div class="col-md-6">
                    <label for="linkedinUrl" class="form-label">LinkedIn URL</label>
                    <input type="url" class="form-control" id="linkedinUrl" v-model="formState.linkedinUrl" placeholder="https://linkedin.com/in/your-profile">
                  </div>
                  <div class="col-md-6">
                    <label for="githubUrl" class="form-label">GitHub URL</label>
                    <input type="url" class="form-control" id="githubUrl" v-model="formState.githubUrl" placeholder="https://github.com/your-username">
                  </div>
                  <div class="col-md-6">
                    <label for="resumeUrl" class="form-label">Resume URL</label>
                    <input type="url" class="form-control" id="resumeUrl" v-model="formState.resumeUrl" placeholder="Link to your canonical PDF resume">
                  </div>
                  <div class="col-md-6">
                    <label for="profileImageUrl" class="form-label">Profile Image URL</label>
                    <input type="url" class="form-control" id="profileImageUrl" v-model="formState.profileImageUrl" placeholder="Link to a hosted image">
                  </div>
                </div>

                <hr class="my-4">

                <!-- Cover Letter Section -->
                <h5 class="mb-3">Cover Letter Template</h5>
                <div class="row g-3">
                  <div class="col-12">
                    <label for="coverLetterTemplate" class="form-label">Default Cover Letter</label>
                    <textarea class="form-control" id="coverLetterTemplate" v-model="formState.coverLetterTemplate" rows="8" placeholder="Dear Hiring Manager, I am writing to express my keen interest in..."></textarea>
                    <div class="form-text">This can be displayed on your home page as a template for visitors.</div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isSaving ? 'Saving...' : 'Save Profile' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getPublicProfile, updatePortfolioProfile, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);

const initialFormState = {
  headline: '',
  summary: '',
  profileImageUrl: '',
  location: '',
  publicEmail: '',
  websiteUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  resumeUrl: '',
  coverLetterTemplate: ''
};

const formState = reactive({ ...initialFormState });

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

onMounted(async () => {
  try {
    const existingProfile = await getPublicProfile();
    if (existingProfile) {
      Object.assign(formState, existingProfile);
    }
  } catch (err) {
    if (err instanceof ApiError && err.httpStatus === 404) {
      console.log("No existing profile found. Ready to create a new one.");
    } else {
      console.error("Failed to fetch profile:", err);
      error.value = { title: 'Failed to Load Data', message: err.message || 'Could not load your profile data.' };
      showErrorModal.value = true;
    }
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    await updatePortfolioProfile(formState);
    // Optionally, show a success toast/message here
  } catch (err) {
    console.error("Failed to update profile:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save your profile.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.edit-profile-page h1, .edit-profile-page h5 {
  font-weight: 300;
}
</style>
