<template>
  <div class="admin-projects-page py-4">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5">Manage All Projects</h1>
        <router-link to="/projects/create" class="btn btn-success">
          <i class="bi bi-plus-circle me-2"></i>Create New Project
        </router-link>
      </div>
      <p class="lead mb-4">View, edit, or delete any project in the system.</p>

      <div v-if="isLoading" class="loading-spinner-container">
        <LoadingSpinner />
      </div>

      <div v-else-if="allProjects && allProjects.length > 0" class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Tech Stack</th>
              <th scope="col" style="min-width: 120px;">Created At</th>
              <th scope="col" style="min-width: 150px;" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in allProjects" :key="project.id">
              <td>{{ project.title }}</td>
              <td>{{ project.description ? truncateText(project.description, 75) : 'N/A' }}</td>
              <td>
                <span v-if="project.techStack && project.techStack.length">
                  {{ project.techStack.join(', ') }}
                </span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td>{{ project.createdAt ? formatDate(project.createdAt) : 'N/A' }}</td>
              <td class="text-end table-actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="editProject(project.id)">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="requestDeleteProject(project)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!isLoading && !showErrorModal" class="alert alert-info text-center" role="alert">
        <h4 class="alert-heading">No Projects Found</h4>
        <p>There are currently no projects in the system. Start by creating one!</p>
      </div>

    </div>

    <ErrorModal
      v-if="error"
      :visible="showErrorModal"
      :title="error.title"
      :message="error.message"
      @close="closeErrorModal"
    />

    <ConfirmModal
      :visible="showConfirmDeleteModal"
      title="Confirm Delete Project"
      :message="`Are you sure you want to delete the project: ${projectToDelete?.title}? This action cannot be undone.`"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="handleConfirmDelete"
      @cancel="cancelDelete"
      @close="cancelDelete"
    />

    <SuccessModal
      v-if="successDeleteMessage"
      :visible="showSuccessDeleteModal"
      title="Project Deleted"
      :message="successDeleteMessage"
      @close="closeSuccessDeleteModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/admin/AdminProjectsPage.vue
 * @description Admin page for managing all projects in the system.
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // For navigation
import { getProjects, deleteProject, ApiError } from '../../services/apiService'; // Note: Using getProjects (public)
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import ErrorModal from '../../components/common/ErrorModal.vue';
import SuccessModal from '../../components/common/SuccessModal.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import { formatDate } from '../../utils'; // Assuming this utility exists

const router = useRouter();

// --- Reactive State ---
/** @type {import('vue').Ref<Array<object>>} List of all ProjectDto. */
const allProjects = ref([]);
/** @type {import('vue').Ref<boolean>} Loading state for fetching projects. */
const isLoading = ref(true);

// Error Modal State
/** @type {import('vue').Ref<{title: string, message: string|string[]}|null>} Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

// Confirm Delete Modal State
/** @type {import('vue').Ref<object|null>} Project object to be deleted. */
const projectToDelete = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ConfirmDeleteModal. */
const showConfirmDeleteModal = ref(false);

// Success Modal State (for delete operation)
/** @type {import('vue').Ref<string|null>} Success message for SuccessModal. */
const successDeleteMessage = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the SuccessModal after delete. */
const showSuccessDeleteModal = ref(false);


// --- Modal Control Methods ---
/** Closes the error modal. */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

// --- Lifecycle Hooks & Fetch Logic ---
/**
 * Fetches all projects from the API.
 */
const fetchAllProjects = async () => {
  isLoading.value = true;
  error.value = null;
  showErrorModal.value = false;
  try {
    const projectsData = await getProjects(); // Uses the public getProjects endpoint
    allProjects.value = projectsData || [];
  } catch (err) {
    console.error("Failed to load all projects:", err);
    let errorMessage = "Could not fetch projects. Please try again later.";
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0];
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Failed to Load Projects',
      message: errorMessage,
    };
    showErrorModal.value = true;
    allProjects.value = []; // Clear projects on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllProjects();
});

// --- Utility Functions ---
/**
 * Truncates text to a specified length and adds an ellipsis.
 * @param {string} text - The text to truncate.
 * @param {number} length - The maximum length before truncating.
 * @returns {string} The truncated text or original text if shorter.
 */
const truncateText = (text, length = 100) => {
  if (text && text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

// --- Navigation & Action Handlers ---
/**
 * Navigates to the edit page for a given project ID.
 * @param {number|string} projectId - The ID of the project to edit.
 */
const editProject = (projectId) => {
  router.push(`/my-projects/${projectId}/edit`); // Using the existing user-facing edit page for now
};

/**
 * Sets up the project for deletion confirmation.
 * @param {object} project - The project object to be deleted.
 */
const requestDeleteProject = (project) => {
  projectToDelete.value = project;
  showConfirmDeleteModal.value = true;
  // Actual deletion logic will be in handleConfirmDelete
};

// --- Delete Logic & Modal Controls for Delete ---
/**
 * Closes the success modal shown after deletion.
 */
const closeSuccessDeleteModal = () => {
  showSuccessDeleteModal.value = false;
  successDeleteMessage.value = null;
};

/**
 * Cancels the delete operation and hides the confirmation modal.
 */
const cancelDelete = () => {
  showConfirmDeleteModal.value = false;
  projectToDelete.value = null;
};

/**
 * Handles the actual project deletion after confirmation.
 */
const handleConfirmDelete = async () => {
  if (!projectToDelete.value) return;

  isLoading.value = true; // Can use a more specific loading state like isDeleting if preferred
  showConfirmDeleteModal.value = false;
  error.value = null; // Clear previous general errors
  showErrorModal.value = false;

  try {
    await deleteProject(projectToDelete.value.id);
    successDeleteMessage.value = `Project "${projectToDelete.value.title}" deleted successfully.`;
    showSuccessDeleteModal.value = true;
    projectToDelete.value = null; // Clear selection
    fetchAllProjects(); // Refresh the project list
  } catch (err) {
    console.error("Failed to delete project:", err);
    let errorMessage = "Could not delete project. Please try again later.";
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0];
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Delete Failed',
      message: errorMessage,
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false; // Reset general loading state
    // If using isDeleting, set isDeleting = false;
    projectToDelete.value = null; // Ensure it's cleared even on error
  }
};

</script>

<style scoped>
.admin-projects-page h1, .admin-projects-page .display-5 {
  font-weight: 300;
}
.table-actions .btn {
  margin-right: 0.5rem;
}
.table-actions .btn:last-child {
  margin-right: 0;
}
.loading-spinner-container {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* More styles for table responsiveness if needed */
</style>
