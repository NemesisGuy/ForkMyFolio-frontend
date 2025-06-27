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

      <form v-else-if="project" @submit.prevent="handleUpdateProject" class="mt-3 needs-validation" novalidate>
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="mb-3">
              <label for="projectTitle" class="form-label">Title</label>
              <input type="text" class="form-control" id="projectTitle" v-model="project.title" required :class="{'is-invalid': fieldErrors.title}">
              <div v-if="fieldErrors.title" class="invalid-feedback">{{ fieldErrors.title }}</div>
            </div>

            <div class="mb-3">
              <label for="projectDescription" class="form-label">Description</label>
              <textarea class="form-control" id="projectDescription" v-model="project.description" rows="5" required :class="{'is-invalid': fieldErrors.description}"></textarea>
              <div v-if="fieldErrors.description" class="invalid-feedback">{{ fieldErrors.description }}</div>
            </div>

            <div class="mb-3">
              <label for="projectTechStack" class="form-label">Tech Stack (comma-separated)</label>
              <input type="text" class="form-control" id="projectTechStack" v-model="techStackString" :class="{'is-invalid': fieldErrors.techStack}">
              <div class="form-text">Enter technologies separated by commas (e.g., Vue, Node.js, PostgreSQL).</div>
              <div v-if="fieldErrors.techStack" class="invalid-feedback">{{ fieldErrors.techStack }}</div>
            </div>

            <div class="mb-3">
              <label for="projectImageUrl" class="form-label">Image URL</label>
              <input type="url" class="form-control" id="projectImageUrl" v-model="project.imageUrl" :class="{'is-invalid': fieldErrors.imageUrl}">
               <div v-if="fieldErrors.imageUrl" class="invalid-feedback">{{ fieldErrors.imageUrl }}</div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="projectRepoUrl" class="form-label">Repository URL</label>
                <input type="url" class="form-control" id="projectRepoUrl" v-model="project.repoUrl" :class="{'is-invalid': fieldErrors.repoUrl}">
                <div v-if="fieldErrors.repoUrl" class="invalid-feedback">{{ fieldErrors.repoUrl }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="projectLiveUrl" class="form-label">Live URL</label>
                <input type="url" class="form-control" id="projectLiveUrl" v-model="project.liveUrl" :class="{'is-invalid': fieldErrors.liveUrl}">
                <div v-if="fieldErrors.liveUrl" class="invalid-feedback">{{ fieldErrors.liveUrl }}</div>
              </div>
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

      <div v-else-if="!isLoading && !showErrorModal" class="alert alert-warning text-center" role="alert">
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
import { getProjectById, updateProject, ApiError } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import ErrorModal from '../components/common/ErrorModal.vue';
import SuccessModal from '../components/common/SuccessModal.vue';

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

// --- Computed Properties for Form Handling ---
/**
 * Computed property to get/set techStack as a comma-separated string.
 * @type {import('vue').ComputedRef<string>}
 */
const techStackString = computed({
  get: () => (project.value && Array.isArray(project.value.techStack) ? project.value.techStack.join(', ') : ''),
  set: (value) => {
    if (project.value) {
      project.value.techStack = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    }
  },
});

// --- Form Handling & Navigation ---

/**
 * Validates the project form data.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = () => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach(key => fieldErrors[key] = null);
  let isValid = true;

  if (!project.value.title?.trim()) {
    fieldErrors.title = "Title is required.";
    isValid = false;
  }
  if (!project.value.description?.trim()) {
    fieldErrors.description = "Description is required.";
    isValid = false;
  }
  // Add more validation as needed (e.g., URL formats for imageUrl, repoUrl, liveUrl)
  // For simplicity, we'll keep it to required fields for now.

  // Example URL validation (optional, can be expanded)
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (project.value.imageUrl && !urlPattern.test(project.value.imageUrl)) {
    fieldErrors.imageUrl = "Please enter a valid URL for the image.";
    isValid = false;
  }
  if (project.value.repoUrl && !urlPattern.test(project.value.repoUrl)) {
    fieldErrors.repoUrl = "Please enter a valid URL for the repository.";
    isValid = false;
  }
  if (project.value.liveUrl && !urlPattern.test(project.value.liveUrl)) {
    fieldErrors.liveUrl = "Please enter a valid URL for the live demo.";
    isValid = false;
  }

  return isValid;
};

/**
 * Handles the submission of the updated project data.
 */
const handleUpdateProject = async () => {
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
    const projectId = route.params.id;
    // Ensure techStack is correctly formatted if it was stringified for the input
    // The computed techStackString handles conversion back to array.
    // The project.value should already have techStack as an array.
    const updatedData = { ...project.value };

    await updateProject(projectId, updatedData);

    successMessage.value = "Project updated successfully!";
    showSuccessModal.value = true;
    // Optionally, fetch fresh project details or navigate away after success modal is closed
    // For now, we'll just show the success message.
    // fetchProjectDetails(projectId); // Re-fetch to show updated data if staying on page
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
