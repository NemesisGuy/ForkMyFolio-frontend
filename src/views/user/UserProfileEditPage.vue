<template>
  <div class="user-profile-edit-page py-5 animated-gradient-background">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <LoadingModal :visible="isLoading"/>
          <SuccessModal :visible="showSuccess" title="Success" message="Your public profile has been updated." @close="closeSuccessModal" />
          <ErrorModal v-if="error" :visible="true" title="Update Failed" :message="error" @close="error = null" />

          <div v-if="!isLoading && profileData" class="card glass-card p-0 animate-fade-in-up">
            <div class="card-body p-4 p-md-5">
              <h1 class="card-title mb-4 text-center display-6">Edit Public Profile</h1>
              <p class="text-center text-muted mb-4">This information is visible on your public portfolio page. Your profile picture is managed on the 'Edit Account' page.</p>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <!-- CORRECTED: The file upload section has been removed. -->

                  <div class="col-12">
                    <label for="headline" class="form-label">Headline</label>
                    <input type="text" class="form-control" id="headline" v-model="profileData.headline" placeholder="e.g., Full-Stack Java Developer">
                  </div>

                  <div class="col-12">
                    <label for="summary" class="form-label">Summary / Bio</label>
                    <textarea class="form-control" id="summary" rows="5" v-model="profileData.summary" placeholder="A brief summary about yourself..."></textarea>
                  </div>

                  <div class="col-md-6">
                    <label for="publicEmail" class="form-label">Public Email</label>
                    <input type="email" class="form-control" id="publicEmail" v-model="profileData.publicEmail" placeholder="contact@example.com">
                  </div>

                  <div class="col-md-6">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" v-model="profileData.location" placeholder="e.g., San Francisco, CA">
                  </div>

                  <h5 class="mt-4 pt-2 fs-6 text-muted">Social & Professional Links</h5>
                  <div class="col-md-6">
                    <label for="websiteUrl" class="form-label">Website URL</label>
                    <input type="url" class="form-control" id="websiteUrl" v-model="profileData.websiteUrl" placeholder="https://your-website.com">
                  </div>
                  <div class="col-md-6">
                    <label for="linkedinUrl" class="form-label">LinkedIn URL</label>
                    <input type="url" class="form-control" id="linkedinUrl" v-model="profileData.linkedinUrl" placeholder="https://linkedin.com/in/your-profile">
                  </div>
                  <div class="col-md-6">
                    <label for="githubUrl" class="form-label">GitHub URL</label>
                    <input type="url" class="form-control" id="githubUrl" v-model="profileData.githubUrl" placeholder="https://github.com/your-username">
                  </div>

                  <h5 class="mt-4 pt-2 fs-6 text-muted">Resume & Cover Letter</h5>
                  <div class="col-md-6">
                    <label for="resumeUrl" class="form-label">Resume URL</label>
                    <input type="url" class="form-control" id="resumeUrl" v-model="profileData.resumeUrl" placeholder="URL to your hosted PDF resume">
                  </div>
                  <div class="col-md-6">
                    <label for="resumeImageUrl" class="form-label">Resume Preview Image URL</label>
                    <input type="url" class="form-control" id="resumeImageUrl" v-model="profileData.resumeImageUrl" placeholder="URL to an image of your resume">
                  </div>
                  <div class="col-12">
                    <label for="coverLetterTemplate" class="form-label">Cover Letter Template</label>
                    <textarea class="form-control" id="coverLetterTemplate" rows="8" v-model="profileData.coverLetterTemplate" placeholder="A generic cover letter template you can reuse."></textarea>
                  </div>

                </div>

                <div class="d-flex justify-content-end mt-4 pt-4 border-top border-white border-opacity-10">
                  <button type="button" class="btn btn-outline-secondary me-2" @click="cancel">Cancel</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getMyPublicProfile, updateMyPublicProfile } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const router = useRouter();
const profileData = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const showSuccess = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const data = await getMyPublicProfile();
    profileData.value = reactive({ ...data });
  } catch (err) {
    console.error("Failed to fetch public profile data:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    // CORRECTED: Create a payload that exactly matches the backend's
    // UpdatePortfolioProfileRequest DTO. This prevents sending extra fields
    // like firstName, lastName, etc., which were causing the error.
    const payload = {
      headline: profileData.value.headline,
      summary: profileData.value.summary,
      publicEmail: profileData.value.publicEmail,
      location: profileData.value.location,
      websiteUrl: profileData.value.websiteUrl,
      linkedinUrl: profileData.value.linkedinUrl,
      githubUrl: profileData.value.githubUrl,
      resumeUrl: profileData.value.resumeUrl,
      resumeImageUrl: profileData.value.resumeImageUrl,
      coverLetterTemplate: profileData.value.coverLetterTemplate,
    };
    await updateMyPublicProfile(payload);
    showSuccess.value = true;
  } catch (err) {
    console.error("Failed to update public profile:", err);
    error.value = err.message || 'Could not save your changes.';
  } finally {
    isSaving.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccess.value = false;
  router.push({ name: 'profile' });
};

const cancel = () => {
  router.back();
};
</script>

<style scoped>
.user-profile-edit-page .display-6 {
  font-weight: 300;
}
</style>
