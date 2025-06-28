<template>
  <div class="edit-project-page py-4">
    <div class="container">
      <div v-if="project && !isLoading">
        <h1 class="display-5 mb-4">Edit Project: {{ project.title }}</h1>
      </div>
      <div v-else-if="isLoading">
        <h1 class="display-5 mb-4">Loading Project...</h1>
      </div>
      <div v-else>
        <h1 class="display-5 mb-4">Edit Project</h1>
      </div>

      <div v-if="isLoading" class="loading-spinner-container d-flex justify-content-center align-items-center py-5">
        <LoadingSpinner />
      </div>

      <ProjectForm
        v-if="project && !isLoading"
        :initial-data="project"
        :is-saving="isSaving"
        :field-errors="fieldErrors"
        submit-text="Save Changes"
        saving-text="Saving..."
        @submit-form="handleUpdateProject"
        @cancel="cancelEdit"
        class="mt-3"
      />

      <div v-else-if="!isLoading && !project && !showErrorModal" class="alert alert-warning text-center" role="alert">
        Project data could not be loaded, or the project does not exist.
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
      title="Project Updated"
      :message="successMessage"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/EditProjectPage.vue
 * @description Page for editing an existing project.
 */
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProjectById, updateProject, ApiError } from '@/services/api';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import ErrorModal from '../components/common/ErrorModal.vue';
import SuccessModal from '../components/common/SuccessModal.vue';
import ProjectForm from '../components/forms/ProjectForm.vue';

const route = useRoute();
const router = useRouter();

// --- Reactive State ---
/** @type {import('vue').Ref<object|null>} Project data for the form. Follows ProjectDto structure. */
const project = ref(null); // Will be pre-filled from fetched data

/** @type {import('vue').Ref<boolean>} Loading state for fetching initial project data. */
const isLoading = ref(true);
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
const fieldErrors = reactive({}); // Will be populated by validation logic

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
  // Optionally navigate away after success, e.g., back to My Projects
  // router.push('/my-projects');
};

// --- Data Fetching ---
/**
 * Fetches the project details for editing.
 * @param {string} projectId The ID of the project to fetch.
 */
const fetchProjectDetails = async (projectId) => {
  isLoading.value = true;
  error.value = null;
  showErrorModal.value = false;
  try {
    const data = await getProjectById(projectId);
    if (data) {
      // Ensure techStack is an array for easier v-model binding if needed,
      // or for consistent data structure. Default to empty array if not present.
      project.value = { ...data, techStack: data.techStack || [] };
    } else {
      throw new Error('Project data not found.'); // Or handle as a specific type of error
    }
  } catch (err) {
    console.error(`Failed to load project details for ID ${projectId}:`, err);
    let errorMessage = `Could not fetch project details. Please try again later.`;
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0];
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Error Loading Project',
      message: errorMessage,
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const projectId = route.params.id;
  if (projectId) {
    fetchProjectDetails(projectId);
  } else {
    // Handle case where ID is missing, though route should ensure it's present
    isLoading.value = false;
    error.value = {
      title: 'Error',
      message: 'Project ID is missing. Cannot load project details.',
    };
    showErrorModal.value = true;
    console.error('EditProjectPage: Project ID missing from route parameters.');
  }
});

// --- Form Handling & Navigation ---

/**
 * Validates the project form data.
 * @param {object} dataToValidate - The project data object to validate.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = (dataToValidate) => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach(key => fieldErrors[key] = null);
  let isValid = true;

  if (!dataToValidate.title?.trim()) {
    fieldErrors.title = "Title is required.";
    isValid = false;
  }
  if (!dataToValidate.description?.trim()) {
    fieldErrors.description = "Description is required.";
    isValid = false;
  }
  // Add more validation as needed (e.g., URL formats for imageUrl, repoUrl, liveUrl)

  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (dataToValidate.imageUrl && !urlPattern.test(dataToValidate.imageUrl)) {
    fieldErrors.imageUrl = "Please enter a valid URL for the image.";
    isValid = false;
  }
  if (dataToValidate.repoUrl && !urlPattern.test(dataToValidate.repoUrl)) {
    fieldErrors.repoUrl = "Please enter a valid URL for the repository.";
    isValid = false;
  }
  if (dataToValidate.liveUrl && !urlPattern.test(dataToValidate.liveUrl)) {
    fieldErrors.liveUrl = "Please enter a valid URL for the live demo.";
    isValid = false;
  }
  // Note: techStack validation (e.g., if it's required or format) can be added here if needed.
  // The ProjectForm component now ensures techStack is an array.

  return isValid;
};

/**
 * Handles the submission of the updated project data, received from ProjectForm.
 * @param {object} formDataFromEvent - The project data emitted from ProjectForm.
 */
const handleUpdateProject = async (formDataFromEvent) => {
  // project.value should be updated by the form's local data management if two-way binding was fully set up.
  // However, ProjectForm emits the data. So, we use formDataFromEvent.
  // We also need to ensure our local 'project' ref is updated if we want the title to reflect changes immediately
  // without a re-fetch, or if validation relies on it.
  // For now, validation will use formDataFromEvent.

  if (!validateForm(formDataFromEvent)) {
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
    const projectId = route.params.id;
    // The formDataFromEvent is the source of truth for what was submitted.
    const updatedData = formDataFromEvent;

    await updateProject(projectId, updatedData);

    successMessage.value = "Project updated successfully!";
    showSuccessModal.value = true;
    // Re-fetch project details to ensure form and page title reflect any backend transformations or successful save.
    // This also updates the `project.value` which is passed as `initialData` to ProjectForm.
    fetchProjectDetails(projectId);
  } catch (err) {
    console.error(`Failed to update project ID ${route.params.id}:`, err);
    let errorMessage = "Could not update project. Please try again later.";
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

/**
 * Handles cancelling the edit operation.
 * Navigates back to the previous page or a default page.
 */
const cancelEdit = () => {
  // router.back(); // Simple back navigation
  router.push('/my-projects'); // Or navigate to a specific page like My Projects
};

</script>

<style scoped>
.edit-project-page h1, .edit-project-page .display-5 {
  font-weight: 300;
}
.form-label {
  font-weight: 500;
}
.loading-spinner-container {
  min-height: 200px; /* Ensure container has height for centering */
}
/* Add more styles as needed */
</style>
