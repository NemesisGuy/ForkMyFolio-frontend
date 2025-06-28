<template>
  <div class="edit-profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <h1 class="display-5 mb-4">Edit Your Profile</h1>

          <form class="needs-validation" novalidate @submit.prevent="handleUpdateProfile">
            <div class="card shadow-sm">
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="form-label" for="firstName">First Name</label>
                  <input id="firstName" v-model="formData.firstName" :class="{'is-invalid': fieldErrors.firstName}"
                         class="form-control" required
                         type="text">
                  <div v-if="fieldErrors.firstName" class="invalid-feedback">
                    {{ fieldErrors.firstName }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="lastName">Last Name</label>
                  <input id="lastName" v-model="formData.lastName" :class="{'is-invalid': fieldErrors.lastName}" class="form-control"
                         required type="text">
                  <div v-if="fieldErrors.lastName" class="invalid-feedback">{{
                      fieldErrors.lastName
                    }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="email">Email</label>
                  <input id="email" v-model="formData.email" :class="{'is-invalid': fieldErrors.email}" class="form-control"
                         required type="email">
                  <div class="form-text">Note: Changing your email might require re-verification.
                  </div>
                  <div v-if="fieldErrors.email" class="invalid-feedback">{{
                      fieldErrors.email
                    }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="profileImageUrl">Profile Image URL</label>
                  <input id="profileImageUrl" v-model="formData.profileImageUrl" :class="{'is-invalid': fieldErrors.profileImageUrl}"
                         class="form-control"
                         type="url">
                  <div v-if="fieldErrors.profileImageUrl" class="invalid-feedback">
                    {{ fieldErrors.profileImageUrl }}
                  </div>

                  <!-- ENHANCEMENT: Live image preview -->
                  <div v-if="formData.profileImageUrl" class="mt-3 text-center">
                    <p class="form-text mb-2">Image Preview:</p>
                    <img v-if="!imageLoadError" :src="formData.profileImageUrl"
                         alt="Profile Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px; object-fit: cover;"
                         @error="onImageError">
                    <p v-if="imageLoadError" class="text-danger small">Could not load image
                      preview.</p>
                  </div>
                </div>

                <div class="mt-4 d-flex justify-content-end">
                  <button class="btn btn-outline-secondary me-2" type="button" @click="cancelEdit">
                    Cancel
                  </button>
                  <button :disabled="isSaving" class="btn btn-primary" type="submit">
                    <span v-if="isSaving" aria-hidden="true"
                          class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- UPDATED: Added v-if="error" to prevent rendering with null data -->
    <ErrorModal
      v-if="error"
      :message="error.message"
      :title="error.title"
      :visible="showErrorModal"
      @close="closeErrorModal"
    />

    <!-- UPDATED: Added v-if="successMessage" to prevent prop validation warning -->
    <SuccessModal
      v-if="successMessage"
      :message="successMessage"
      :visible="showSuccessModal"
      title="Profile Updated"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/EditProfilePage.vue
 * @description Page for users to edit their profile information.
 */
import {onMounted, reactive, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {authService} from '../services/authService';
// UPDATED: Corrected import from 'updateUserProfile' to 'updateProfile'
import {ApiError, updateProfile} from '../services/api';
import ErrorModal from '../components/common/ErrorModal.vue';
import SuccessModal from '../components/common/SuccessModal.vue';

const router = useRouter();

// --- Reactive State ---
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  profileImageUrl: ''
});
const isSaving = ref(false);
const error = ref(null);
const showErrorModal = ref(false);
const successMessage = ref(null);
const showSuccessModal = ref(false);
const fieldErrors = reactive({});
const imageLoadError = ref(false);

// --- Image Preview Logic ---
watch(() => formData.value.profileImageUrl, () => {
  imageLoadError.value = false; // Reset error on new URL
});

const onImageError = () => {
  imageLoadError.value = true;
};

// --- Modal Control ---
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = null;
  router.push('/profile'); // Navigate back to profile after success
};

// --- Lifecycle & Data Loading ---
onMounted(() => {
  const currentUser = authService.user.value;
  if (currentUser) {
    formData.value = {
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      email: currentUser.email || '',
      profileImageUrl: currentUser.profileImageUrl || ''
    };
  } else {
    console.error("EditProfilePage: User data not available.");
    error.value = {
      title: "Authentication Error",
      message: "User data not found. Please log in again."
    };
    showErrorModal.value = true;
    router.push('/login');
  }
});

// --- Form Handling ---
const cancelEdit = () => {
  router.push('/profile');
};

const validateForm = () => {
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
  let isValid = true;

  if (!formData.value.firstName?.trim()) {
    fieldErrors.firstName = "First name is required.";
    isValid = false;
  }
  if (!formData.value.lastName?.trim()) {
    fieldErrors.lastName = "Last name is required.";
    isValid = false;
  }
  if (!formData.value.email?.trim()) {
    fieldErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    fieldErrors.email = "Please enter a valid email address.";
    isValid = false;
  }
  if (formData.value.profileImageUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.value.profileImageUrl)) {
    fieldErrors.profileImageUrl = "Please enter a valid URL.";
    isValid = false;
  }
  return isValid;
};

const handleUpdateProfile = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;
  error.value = null;

  try {
    // UPDATED: Corrected function call
    const updatedUser = await updateProfile(formData.value);
    authService.updateLocalUser(updatedUser);

    successMessage.value = "Your profile has been updated successfully!";
    showSuccessModal.value = true;

  } catch (err) {
    console.error("Failed to update profile:", err);
    const errorDetails = [];
    let errorMessage = "Could not update your profile. Please try again.";

    if (err instanceof ApiError) {
      errorMessage = err.message || errorMessage;
      if (err.errors && err.errors.length > 0) {
        err.errors.forEach(apiErr => {
          errorDetails.push(apiErr.message);
          if (apiErr.field && formData.value.hasOwnProperty(apiErr.field)) {
            fieldErrors[apiErr.field] = apiErr.message;
          }
        });
      }
    }

    error.value = {
      title: 'Update Failed',
      message: errorDetails.length > 0 ? errorDetails : errorMessage,
    };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.edit-profile-page h1 {
  font-weight: 300;
}

.form-label {
  font-weight: 500;
}

.invalid-feedback {
  display: block;
}
</style>
