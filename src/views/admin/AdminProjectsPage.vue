<template>
  <div class="admin-projects-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Project Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the project: '${projectToDelete?.title}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />
      <SuccessModal
        :visible="showSuccessModal"
        title="Success"
        :message="successMessage"
        @close="closeSuccessModal"
      />

      <div class="row g-5">
        <!-- Add/Edit Form -->
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h5>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="projectTitle" class="form-label">Project Title</label>
                    <input type="text" class="form-control" id="projectTitle" v-model="formState.title" required>
                  </div>
                  <div class="col-12">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="4" v-model="formState.description" required></textarea>
                  </div>
                  <!-- KEY CHANGE: Added Tech Stack input -->
                  <div class="col-12">
                    <label for="techStack" class="form-label">Tech Stack</label>
                    <input type="text" class="form-control" id="techStack" v-model="techStackInput" placeholder="e.g., Vue.js, Spring Boot, MySQL">
                    <div class="form-text">Enter technologies separated by commas.</div>
                  </div>
                  <div class="col-12">
                    <label for="imageUrl" class="form-label">Image URL</label>
                    <input type="url" class="form-control" id="imageUrl" v-model="formState.imageUrl" placeholder="https://example.com/image.png">
                  </div>
                  <div class="col-12">
                    <label for="repoUrl" class="form-label">Repository URL (GitHub, etc.)</label>
                    <input type="url" class="form-control" id="repoUrl" v-model="formState.repoUrl">
                  </div>
                  <div class="col-12">
                    <label for="liveUrl" class="form-label">Live Demo URL</label>
                    <input type="url" class="form-control" id="liveUrl" v-model="formState.liveUrl">
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" id="isPublished" v-model="formState.published">
                      <label class="form-check-label" for="isPublished">Published</label>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button type="button" v-if="isEditing" class="btn btn-secondary me-2" @click="resetForm">Cancel Edit</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditing ? 'Save Changes' : 'Add Project' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Projects List -->
        <div class="col-lg-7">
          <div v-if="!isLoading && projects.length > 0">
            <div v-for="project in projects" :key="project.uuid" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title mb-1">{{ project.title }}</h5>
                    <span class="badge" :class="project.published ? 'bg-success' : 'bg-secondary'">
                      {{ project.published ? 'Published' : 'Draft' }}
                    </span>
                  </div>
                  <div class="flex-shrink-0">
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="selectForEdit(project)" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger" @click="requestDelete(project)" title="Delete"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
                <!-- KEY CHANGE: Display tech stack badges -->
                <div v-if="project.techStack && project.techStack.length" class="mt-2">
                  <span v-for="tech in project.techStack" :key="tech" class="badge bg-info text-dark me-1 mb-1 fw-normal">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
          <EmptyState
            v-else-if="!isLoading && !error.message"
            title="No Projects Found"
            message="Add a new project using the form to get started."
            icon-class="bi-kanban-fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { getAdminProjects, createProject, updateProject, deleteProject } from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const projects = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);

// Modal states
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const projectToDelete = ref(null);
const showSuccessModal = ref(false);
const successMessage = ref('');

// KEY CHANGE: Added techStack to the initial state
const initialFormState = {
  uuid: null,
  title: '',
  description: '',
  imageUrl: '',
  repoUrl: '',
  liveUrl: '',
  published: true,
  techStack: [],
};

const formState = reactive({ ...initialFormState });

// KEY CHANGE: Added a computed property to manage the techStack input
/**
 * A computed property that acts as a bridge between the form's text input
 * and the `formState.techStack` array.
 * - `get`: Joins the array into a comma-separated string for display.
 * - `set`: Parses a comma-separated string back into an array.
 */
const techStackInput = computed({
  get() {
    return formState.techStack ? formState.techStack.join(', ') : '';
  },
  set(value) {
    if (typeof value === 'string') {
      formState.techStack = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else {
      formState.techStack = [];
    }
  }
});


const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    // Using getAdminProjects to ensure we get all data, including drafts
    const data = await getAdminProjects();
    projects.value = data.sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    error.value = { title: 'Failed to Load Data', message: err.message || 'An unexpected error occurred.' };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    const savedProjectTitle = formState.title;
    if (isEditing.value) {
      if (!formState.uuid) {
        throw new Error("Cannot update project: The record is missing a unique identifier (UUID).");
      }
      await updateProject(formState.uuid, formState);
      successMessage.value = `Project '${savedProjectTitle}' has been updated successfully.`;
    } else {
      await createProject(formState);
      successMessage.value = `Project '${savedProjectTitle}' has been created successfully.`;
    }
    showSuccessModal.value = true;
    resetForm();
    await fetchProjects();
  } catch (err) {
    console.error("Failed to save project:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save the project.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (project) => {
  // Ensure the project object has a techStack property to avoid errors
  const projectData = { ...initialFormState, ...project };
  Object.assign(formState, projectData);
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (project) => {
  projectToDelete.value = project;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  projectToDelete.value = null;
};

const executeDelete = async () => {
  if (!projectToDelete.value) return;
  isSaving.value = true;
  const deletedProjectTitle = projectToDelete.value.title;
  try {
    if (!projectToDelete.value.uuid) {
      throw new Error("Cannot delete project: The record is missing a unique identifier (UUID).");
    }
    await deleteProject(projectToDelete.value.uuid);
    successMessage.value = `Project '${deletedProjectTitle}' has been deleted successfully.`;
    showSuccessModal.value = true;
    await fetchProjects();
    if (isEditing.value && formState.uuid === projectToDelete.value.uuid) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete project:", err);
    error.value = { title: 'Deletion Failed', message: err.message || 'Could not delete the project.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchProjects);
</script>

<style scoped>
.admin-projects-page h1 {
  font-weight: 300;
}
</style>
