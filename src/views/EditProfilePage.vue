<template>
  <div class="edit-profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <h1 class="display-5 mb-4">Edit Your Profile</h1>

          <form @submit.prevent="handleUpdateProfile" class="needs-validation" novalidate>
            <div class="card shadow-sm">
              <div class="card-body p-4">
                <div class="mb-3">
                  <label for="firstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="firstName" v-model="formData.firstName" required :class="{'is-invalid': fieldErrors.firstName}">
                  <div v-if="fieldErrors.firstName" class="invalid-feedback">{{ fieldErrors.firstName }}</div>
                </div>

                <div class="mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="lastName" v-model="formData.lastName" required :class="{'is-invalid': fieldErrors.lastName}">
                  <div v-if="fieldErrors.lastName" class="invalid-feedback">{{ fieldErrors.lastName }}</div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="formData.email" required :class="{'is-invalid': fieldErrors.email}">
                  <div class="form-text">Note: Changing your email might require re-verification depending on system setup.</div>
                  <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
                </div>

                <div class="mb-3">
                  <label for="profileImageUrl" class="form-label">Profile Image URL</label>
                  <input type="url" class="form-control" id="profileImageUrl" v-model="formData.profileImageUrl" :class="{'is-invalid': fieldErrors.profileImageUrl}">
                  <div v-if="fieldErrors.profileImageUrl" class="invalid-feedback">{{ fieldErrors.profileImageUrl }}</div>
                </div>

                <div class="mt-4 d-flex justify-content-end">
                  <button type="button" class="btn btn-outline-secondary me-2" @click="cancelEdit">Cancel</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <!-- Modals will be integrated below the form or at root of component template -->
        </div>
      </div>
    </div>
     <ErrorModal
      v-if="error"
      :visible="showErrorModal"
      :title="error.title"
      :message="error.message"
      @close="closeErrorModal"
    />

    <SuccessModal
      v-if="successMessage"
      :visible="showSuccessModal"
      title="Profile Updated"
      :message="successMessage"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/EditProfilePage.vue
 * @description Page for users to edit their profile information.
 */
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { updateUserProfile, ApiError } from '../services/apiService';
// import LoadingSpinner from '../components/common/LoadingSpinner.vue'; // No initial page load spinner if pre-filling from authService.user
import ErrorModal from '../components/common/ErrorModal.vue';
import SuccessModal from '../components/common/SuccessModal.vue';

const router = useRouter();

// --- Reactive State for Form Data & Page ---
/** @type {import('vue').Ref<object>} Form data for user profile. */
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  profileImageUrl: ''
});

/** @type {import('vue').Ref<boolean>} Saving state for when the form is submitted. */
const isSaving = ref(false);

/** @type {import('vue').Ref<{title: string, message: string|string[]}|null>} Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

/** @type {import('vue').Ref<string|null>} Success message for SuccessModal. */
const successMessage = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the SuccessModal. */
const showSuccessModal = ref(false);

/** @type {Reactive<object>} Object to hold field-specific validation errors. */
const fieldErrors = reactive({});

// --- Modal Control Methods ---
/** Closes the error modal. */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

/** Closes the success modal. */
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = null;
  // Optionally, navigate away or refresh data if needed after profile update
  // For now, just closes the modal.
};

// --- Lifecycle Hooks & Form Pre-fill ---
onMounted(() => {
  const currentUser = authService.user.value;
  if (currentUser) {
    formData.value = {
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      email: currentUser.email || '', // Email might not be editable, depending on backend rules
      profileImageUrl: currentUser.profileImageUrl || ''
    };
  } else {
    // This case should ideally not happen if the page is protected by requiresAuth
    // and authService correctly populates user on login.
    console.error("EditProfilePage: Current user data not available from authService.");
    error.value = {
      title: "Error",
      message: "User data not available. Please try logging in again."
    };
    showErrorModal.value = true;
    // Optionally redirect to login if user data is critical and missing
    // router.push('/login');
  }
});

// --- Methods (Form handling, validation - To be implemented) ---
/**
 * Handles cancelling the edit operation.
 * Navigates back to the profile page.
 */
const cancelEdit = () => {
  router.push('/profile');
};

/**
 * Validates the profile form data.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = () => {
  Object.keys(fieldErrors).forEach(key => fieldErrors[key] = null);
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
    fieldErrors.profileImageUrl = "Please enter a valid URL for the profile image.";
    isValid = false;
  }
  return isValid;
};

/**
 * Handles the submission of the updated user profile data.
 */
const handleUpdateProfile = async () => {
  if (!validateForm()) {
    error.value = { title: "Validation Error", message: "Please correct the errors in the form." };
    showErrorModal.value = true;
    return;
  }

  isSaving.value = true;
  error.value = null;
  showErrorModal.value = false;
  successMessage.value = null;
  showSuccessModal.value = false;

  try {
    // Only send fields that are meant to be updated by this form
    const profileDataToUpdate = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      profileImageUrl: formData.value.profileImageUrl,
    };

    const updatedUser = await updateUserProfile(profileDataToUpdate);

    // Crucially, update the user state in authService
    authService.updateLocalUser(updatedUser); // Assumes/Requires this method in authService

    successMessage.value = "Profile updated successfully!";
    showSuccessModal.value = true;

    // Re-populate form with potentially transformed data from backend (already done by authService update if it sets the same ref)
    // Or, if authService.user is a different ref, update formData directly:
    formData.value = {
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email || '',
        profileImageUrl: updatedUser.profileImageUrl || ''
    };

  } catch (err) {
    console.error("Failed to update profile:", err);
    let errorMessage = "Could not update profile. Please try again later.";
    const errorDetails = [];

    if (err instanceof ApiError) {
      errorMessage = err.message || errorMessage;
      if (err.errors && err.errors.length > 0) {
        err.errors.forEach(apiErr => {
          errorDetails.push(apiErr.message);
          if (apiErr.field && fieldErrors.hasOwnProperty(apiErr.field)) {
            fieldErrors[apiErr.field] = apiErr.message;
          }
        });
      }
    } else if (err.message) {
      errorMessage = err.message;
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
.edit-profile-page h1, .edit-profile-page .display-5 {
  font-weight: 300;
}
.form-label {
  font-weight: 500;
}
</style>
