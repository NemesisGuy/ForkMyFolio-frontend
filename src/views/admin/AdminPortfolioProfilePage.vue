<template>
  <div class="admin-portfolio-profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 mb-4">Manage Portfolio Profile</h1>

          <LoadingModal :visible="isLoading" />
          <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message"
                      @close="closeErrorModal" />
          <SuccessModal :visible="showSuccessModal" title="Update Successful" :message="successMessage"
                        @close="closeSuccessModal" />

          <div v-if="!isLoading" class="card shadow-sm">
            <div class="card-body p-4">

              <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Picture"
                     class="profile-image rounded-circle me-3">
                <div v-else
                     class="profile-image-placeholder rounded-circle me-3 d-flex align-items-center justify-content-center">
                  <i class="bi bi-person-fill"></i>
                </div>
                <div>
                  <h5 class="mb-0">{{ fullName }}</h5>
                  <p class="text-muted small mb-0">
                    To change your name or profile image, please visit the
                    <router-link to="/admin/account">Account Settings</router-link> page.
                  </p>
                </div>
              </div>

              <form @submit.prevent="handleSave">
                <!-- Main Info Section -->
                <h5 class="mb-3">Main Information</h5>
                <div class="row g-3">
                  <div class="col-12">
                    <label for="headline" class="form-label">Headline</label>
                    <input type="text" class="form-control" id="headline" v-model="formState.headline"
                           placeholder="e.g., Full-Stack Software Engineer" required>
                  </div>
                  <div class="col-12">
                    <label for="summary" class="form-label">Summary / Bio</label>
                    <textarea class="form-control" id="summary" v-model="formState.summary" rows="6"
                              placeholder="A passionate developer with experience in..."></textarea>
                  </div>
                  <div class="col-md-6">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" v-model="formState.location"
                           placeholder="e.g., San Francisco, CA">
                  </div>
                </div>

                <hr class="my-4">

                <!-- Links Section -->
                <h5 class="mb-3">Contact & Links</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="publicEmail" class="form-label">Public Email</label>
                    <input type="email" class="form-control" id="publicEmail" v-model="formState.publicEmail"
                           placeholder="contact.jane@example.com">
                  </div>
                  <div class="col-md-6">
                    <label for="websiteUrl" class="form-label">Website URL</label>
                    <input type="url" class="form-control" id="websiteUrl" v-model="formState.websiteUrl"
                           placeholder="https://your-portfolio.com">
                  </div>
                  <div class="col-md-6">
                    <label for="linkedinUrl" class="form-label">LinkedIn URL</label>
                    <input type="url" class="form-control" id="linkedinUrl" v-model="formState.linkedinUrl"
                           placeholder="https://linkedin.com/in/your-profile">
                  </div>
                  <div class="col-md-6">
                    <label for="githubUrl" class="form-label">GitHub URL</label>
                    <input type="url" class="form-control" id="githubUrl" v-model="formState.githubUrl"
                           placeholder="https://github.com/your-username">
                  </div>
                  <div class="col-md-6">
                    <label for="resumeUrl" class="form-label">Resume URL</label>
                    <input type="url" class="form-control" id="resumeUrl" v-model="formState.resumeUrl"
                           placeholder="Link to your canonical PDF resume">
                  </div>
                  <div class="col-md-6">
                    <label for="resumeImageUrl" class="form-label">Resume Preview Image URL</label>
                    <input type="url" class="form-control" id="resumeImageUrl" v-model="formState.resumeImageUrl"
                           placeholder="Link to a preview image of the resume">
                  </div>
                </div>

                <hr class="my-4">

                <!-- Cover Letter Section -->
                <h5 class="mb-3">Cover Letter Template</h5>
                <div class="row g-3">
                  <div class="col-12">
                    <label for="coverLetterTemplate" class="form-label">Default Cover Letter</label>
                    <textarea class="form-control" id="coverLetterTemplate"
                              v-model="formState.coverLetterTemplate" rows="8"
                              placeholder="Dear Hiring Manager, I am writing to express my keen interest in..."></textarea>
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
import { ref, reactive, onMounted, computed } from 'vue';
import {
  // CORRECTED: Import all the necessary functions
  getAccount,
  getPortfolioProfile,
  createPortfolioProfile,
  updatePortfolioProfile,
  ApiError
} from '@/services/api';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const isLoading = ref(true);
const isSaving = ref(false);
const profileExists = ref(false); // This flag determines whether to CREATE or UPDATE

const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);

const showSuccessModal = ref(false);
const successMessage = ref('');

// Data for display only (from the User Account)
const profileImageUrl = ref('');
const firstName = ref('');
const lastName = ref('');
const fullName = computed(() => `${firstName.value} ${lastName.value}`.trim());

// Data for the form (from the Portfolio Profile)
const formState = reactive({
  headline: '',
  summary: '',
  location: '',
  publicEmail: '',
  websiteUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  resumeUrl: '',
  resumeImageUrl: '',
  coverLetterTemplate: ''
});

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

onMounted(async () => {
  isLoading.value = true;
  try {
    // --- STEP 1: Fetch account data for display ---
    // This should always succeed for a logged-in admin.
    const accountData = await getAccount();
    profileImageUrl.value = accountData.profileImageUrl;
    firstName.value = accountData.firstName;
    lastName.value = accountData.lastName;

    // --- STEP 2: Try to fetch the editable portfolio profile data ---
    try {
      const profileData = await getPortfolioProfile();
      // If this succeeds, a profile exists. Populate the form.
      Object.assign(formState, profileData);
      profileExists.value = true;
    } catch (profileError) {
      if (profileError instanceof ApiError && profileError.httpStatus === 404) {
        // This is an expected "error": no profile exists yet. The user will create one.
        console.log("No existing profile found. User will create a new one.");
        profileExists.value = false;
      } else {
        // This is a real, unexpected error (e.g., network, server issue)
        throw profileError;
      }
    }

  } catch (err) {
    // This catches errors from either getAccount() or non-404 errors from getPortfolioProfile()
    console.error("Failed to load page data:", err);
    error.value = { title: 'Failed to Load Data', message: err.message || 'Could not load your page data.' };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    // CORRECTED LOGIC: Check the flag to decide which API endpoint to call.
    if (profileExists.value) {
      // If a profile exists, we UPDATE it.
      await updatePortfolioProfile(formState);
    } else {
      // If no profile exists, we CREATE it.
      await createPortfolioProfile(formState);
      // IMPORTANT: After creating, it now exists for the next save.
      profileExists.value = true;
    }
    successMessage.value = 'Your portfolio profile has been saved successfully.';
    showSuccessModal.value = true;
  } catch (err) {
    console.error("Failed to save profile:", err);
    error.value = { title: 'Save Failed', message: err.message || `Could not save your profile. Error: ${err.message}` };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.admin-portfolio-profile-page h1,
.admin-portfolio-profile-page h5 {
  font-weight: 300;
}

.profile-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.profile-image-placeholder {
  width: 60px;
  height: 60px;
  background-color: #e9ecef;
}

.profile-image-placeholder .bi {
  font-size: 2rem;
  color: #adb5bd;
}
</style>
