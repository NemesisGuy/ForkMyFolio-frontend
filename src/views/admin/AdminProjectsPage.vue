<template>
  <div class="admin-projects-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Project Management</h1>

      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error.message" :message="error.message" :title="error.title"
                  :visible="showErrorModal" @close="closeErrorModal"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the project: '${formState.name}'?`"
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        @cancel="cancelDelete"
        @confirm="executeDelete"
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
                    <label class="form-label" for="projectName">Project Name</label>
                    <input id="projectName" v-model="formState.name" class="form-control"
                           required type="text">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" v-model="formState.description" class="form-control"
                              required rows="4"></textarea>
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="imageUrl">Image URL</label>
                    <input id="imageUrl" v-model="formState.imageUrl" class="form-control"
                           placeholder="https://example.com/image.png" type="url">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="repoUrl">Repository URL (GitHub, etc.)</label>
                    <input id="repoUrl" v-model="formState.repoUrl" class="form-control" type="url">
                  </div>
                  <div class="col-12">
                    <label class="form-label" for="liveUrl">Live Demo URL</label>
                    <input id="liveUrl" v-model="formState.liveUrl" class="form-control" type="url">
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input id="isPublished" v-model="formState.published" class="form-check-input" role="switch"
                             type="checkbox">
                      <label class="form-check-label" for="isPublished">Published</label>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <button v-if="isEditing" class="btn btn-secondary me-2" type="button"
                          @click="resetForm">Cancel Edit
                  </button>
                  <button :disabled="isSaving" class="btn btn-primary" type="submit">
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
            <div v-for="project in projects" :key="project.id" class="card shadow-sm mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title mb-1">{{ project.name }}</h5>
                    <span :class="project.published ? 'bg-success' : 'bg-secondary'" class="badge">
                      {{ project.published ? 'Published' : 'Draft' }}
                    </span>
                  </div>
                  <div class="flex-shrink-0">
                    <button class="btn btn-sm btn-outline-secondary me-2"
                            title="Edit" @click="selectForEdit(project)"><i
                      class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete"
                            @click="requestDelete(project)"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isLoading && !error.message" class="text-center py-5">
            <p class="lead text-muted">No projects added yet. Use the form to get started!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {createProject, deleteProject, getPublicProjects, updateProject} from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const projects = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const error = ref({title: '', message: ''});
const showErrorModal = ref(false);
const showDeleteConfirmModal = ref(false);
const projectToDelete = ref(null);

const initialFormState = {
  id: null,
  name: '',
  description: '',
  imageUrl: '',
  repoUrl: '',
  liveUrl: '',
  published: true,
};

const formState = reactive({...initialFormState});

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = {title: '', message: ''};
};

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const data = await getPublicProjects();
    projects.value = data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    error.value = {
      title: 'Failed to Load Data',
      message: err.message || 'An unexpected error occurred.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await updateProject(formState.id, formState);
    } else {
      await createProject(formState);
    }
    resetForm();
    await fetchProjects();
  } catch (err) {
    console.error("Failed to save project:", err);
    error.value = {title: 'Save Failed', message: err.message || 'Could not save the project.'};
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const selectForEdit = (project) => {
  Object.assign(formState, project);
  isEditing.value = true;
  window.scrollTo({top: 0, behavior: 'smooth'});
};

const resetForm = () => {
  Object.assign(formState, initialFormState);
  isEditing.value = false;
};

const requestDelete = (project) => {
  // Use the full project object for the confirmation message, but store only the ID for deletion.
  Object.assign(formState, project);
  projectToDelete.value = project.id;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  projectToDelete.value = null;
  resetForm();
};

const executeDelete = async () => {
  if (!projectToDelete.value) return;
  isSaving.value = true;
  try {
    await deleteProject(projectToDelete.value);
    await fetchProjects();
    if (isEditing.value && formState.id === projectToDelete.value) {
      resetForm();
    }
  } catch (err) {
    console.error("Failed to delete project:", err);
    error.value = {
      title: 'Deletion Failed',
      message: err.message || 'Could not delete the project.'
    };
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
