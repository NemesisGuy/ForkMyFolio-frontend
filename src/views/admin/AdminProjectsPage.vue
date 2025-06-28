<template>
  <div class="admin-projects-page py-4">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5">Project Management</h1>
        <router-link to="/projects/create" class="btn btn-primary">
          <i class="bi bi-plus-circle-fill me-2"></i>Create New Project
        </router-link>
      </div>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the project: '${projectToDelete?.title}'? This action cannot be undone.`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />

      <div v-if="!isLoading && projects.length > 0" class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover table-striped mb-0">
            <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Last Updated</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>{{ project.id }}</td>
              <td>{{ project.title }}</td>
              <td>{{ formatDate(project.lastUpdatedAt) }}</td>
              <td class="text-center">
                <router-link :to="`/my-projects/${project.id}/edit`" class="btn btn-sm btn-outline-secondary me-2" title="Edit Project">
                  <i class="bi bi-pencil-square"></i>
                </router-link>
                <button class="btn btn-sm btn-outline-danger" title="Delete Project" @click="requestDelete(project)">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="!isLoading && !error.message" class="text-center py-5">
        <p class="lead text-muted">No projects found. <router-link to="/projects/create">Create one now!</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllProjects, deleteProject, ApiError } from '@/services/api';
import { formatDate } from '@/utils';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const projects = ref([]);
const isLoading = ref(true);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);

const showDeleteConfirmModal = ref(false);
const projectToDelete = ref(null);

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    projects.value = await getAllProjects();
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    error.value = {
      title: 'Failed to Load Projects',
      message: err instanceof ApiError ? err.message : 'An unexpected error occurred.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
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
  isLoading.value = true;
  try {
    await deleteProject(projectToDelete.value.id);
    // Refresh the list after deletion
    await fetchProjects();
  } catch (err) {
    console.error("Failed to delete project:", err);
    error.value = {
      title: 'Deletion Failed',
      message: err instanceof ApiError ? err.message : 'Could not delete the project.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
    cancelDelete();
  }
};

onMounted(fetchProjects);
</script>

<style scoped>
.admin-projects-page h1 {
  font-weight: 300;
}
.table-hover tbody tr:hover {
  background-color: rgba(0,0,0,.05);
}
</style>
