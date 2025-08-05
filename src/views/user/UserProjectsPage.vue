<template>
  <div class="user-projects-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header with Add Button -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">My Projects</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add Project
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ProjectFormModal
        :project="currentProject"
        :visible="isFormModalVisible"
        @close="closeFormModal"
        @save="handleSaveProject"
      />
      <ConfirmModal
        :visible="isConfirmModalVisible"
        message="Are you sure you want to delete this project? This action cannot be undone."
        title="Confirm Deletion"
        type="danger"
        @close="closeConfirmModal"
        @confirm="handleDeleteProject"
      />

      <!-- Projects Grid -->
      <div v-if="!isLoading && projects.length > 0" class="row g-4">
        <div v-for="(project, index) in projects" :key="project.uuid"
             :style="{ 'animation-delay': (index * 0.05) + 's' }"
             class="col-md-6 col-lg-4 animate-fade-in-up">
          <div class="card h-100 glass-card interactive-lift">
            <!-- Project Image -->
            <div class="card-img-container">
              <img v-if="project.imageUrl" :alt="project.title" :src="project.imageUrl"
                   class="card-img-top">
              <div v-else class="card-img-top project-image-placeholder">
                <i class="bi bi-code-slash"></i>
              </div>
            </div>
            <!-- Project Details -->
            <div class="card-body d-flex flex-column">
              <h5 class="card-title glass-text">{{ project.title }}</h5>
              <p class="card-text glass-description flex-grow-1">
                {{ project.description || 'No description provided.' }}</p>
              <!-- Tech Stack & Visibility -->
              <div class="mt-auto pt-3">
                <div v-if="project.skills && project.skills.length" class="mb-2">
                  <!-- THIS IS THE FIX: Use the centralized getIconClass function -->
                  <span v-for="skill in project.skills" :key="skill.uuid"
                        class="badge tech-badge me-1 mb-1">
                    <i :class="getIconClass(skill)" class="me-1"></i>{{ skill.name }}
                  </span>
                </div>
                <span :class="['badge', project.visible ? 'bg-success' : 'bg-secondary']">
                  {{ project.visible ? 'Visible' : 'Hidden' }}
                </span>
              </div>
            </div>
            <!-- Actions & Links -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <div>
                <a v-if="project.liveUrl" :href="project.liveUrl" class="btn btn-sm btn-outline-light me-1"
                   target="_blank" title="Live Demo">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
                <a v-if="project.repoUrl" :href="project.repoUrl" class="btn btn-sm btn-outline-light"
                   target="_blank" title="Source Code">
                  <i class="bi bi-github"></i>
                </a>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-primary me-1" title="Edit Project"
                        @click="openEditModal(project)">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Delete Project"
                        @click="openDeleteConfirm(project)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up">
        <div class="empty-state-icon mb-4"><i class="bi bi-kanban"></i></div>
        <h4 class="glass-title">No Projects Yet</h4>
        <p class="glass-subtitle">Click the "Add Project" button to get started.</p>
        <button class="btn btn-primary mt-3 interactive-lift" @click="openAddModal">Add Your First
          Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {projectsApi} from '@/services/api/user.api.js';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import {authService} from '@/services/authService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import ProjectFormModal from '@/components/user/ProjectFormModal.vue';
// THIS IS THE FIX: Import the centralized icon service
import {getIconClass} from '@/services/iconService.js';

// --- Component State ---
const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);

const isFormModalVisible = ref(false);
const isConfirmModalVisible = ref(false);
const currentProject = ref(null); // For editing or adding
const projectToDelete = ref(null); // For deletion confirmation

// --- Store and Services ---
const portfolioStore = usePublicPortfolioStore();

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchProjects();
});

// --- API Functions ---
const fetchProjects = async () => {
  try {
    isLoading.value = true;
    const fetchedProjects = await projectsApi.getAll();
    projects.value = fetchedProjects.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    error.value = err.message || 'An unexpected error occurred while fetching projects.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Forces a refresh of the public portfolio data in the store.
 * This ensures that any changes made here (add, edit, delete) are
 * immediately reflected on the public-facing pages.
 */
const refreshPublicData = async () => {
  const userSlug = authService.user.value?.slug;
  if (userSlug) {
    // The 'true' forces a refetch, bypassing the cache.
    await portfolioStore.fetchPortfolio(userSlug, true);
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  currentProject.value = null; // Clear for a new project
  isFormModalVisible.value = true;
};

const openEditModal = (project) => {
  currentProject.value = {...project}; // Pass a copy to avoid direct mutation
  isFormModalVisible.value = true;
};

const closeFormModal = () => {
  isFormModalVisible.value = false;
  currentProject.value = null;
};

const openDeleteConfirm = (project) => {
  projectToDelete.value = project;
  isConfirmModalVisible.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalVisible.value = false;
  projectToDelete.value = null;
};

// --- CRUD Operations ---
const handleSaveProject = async (projectData) => {
  isLoading.value = true;
  closeFormModal();
  try {
    if (projectData.uuid) {
      // Update existing project
      await projectsApi.update(projectData.uuid, projectData);
      successMessage.value = 'Project updated successfully!';
    } else {
      // Create new project
      await projectsApi.create(projectData);
      successMessage.value = 'Project created successfully!';
    }
    await fetchProjects(); // Refresh the list in the management view
    await refreshPublicData(); // Refresh the public data store
  } catch (err) {
    console.error("Failed to save project:", err);
    error.value = err.message || 'An error occurred while saving the project.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteProject = async () => {
  if (!projectToDelete.value) return;
  isLoading.value = true;
  closeConfirmModal();
  try {
    await projectsApi.remove(projectToDelete.value.uuid);
    successMessage.value = 'Project deleted successfully.';
    // Optimistically remove from the local array for a faster UI response
    projects.value = projects.value.filter(p => p.uuid !== projectToDelete.value.uuid);
    await refreshPublicData(); // Refresh the public data store
  } catch (err) {
    console.error("Failed to delete project:", err);
    error.value = err.message || 'An error occurred while deleting the project.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}

.card-img-container {
  height: 180px;
  overflow: hidden;
  position: relative;
  border-top-left-radius: var(--bs-card-inner-border-radius);
  border-top-right-radius: var(--bs-card-inner-border-radius);
  background-color: rgba(255, 255, 255, 0.05);
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--glass-text-secondary);
  font-size: 3rem;
}

.tech-badge {
  font-weight: 500;
  padding: 0.4em 0.7em;
  background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
  color: var(--bs-primary) !important;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
