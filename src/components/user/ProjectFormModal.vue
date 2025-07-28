<template>
  <div class="modal fade" :class="{ 'show d-block': visible }" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content glass-card">
        <div class="modal-header">
          <h5 class="modal-title glass-text">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Title -->
            <div class="mb-3">
              <label for="projectTitle" class="form-label">Title</label>
              <input type="text" class="form-control" id="projectTitle" v-model="form.title" required>
            </div>
            <!-- Description -->
            <div class="mb-3">
              <label for="projectDescription" class="form-label">Description</label>
              <textarea class="form-control" id="projectDescription" rows="3" v-model="form.description"></textarea>
            </div>
            <!-- Tech Stack -->
            <div class="mb-3">
              <label for="projectTechStack" class="form-label">Tech Stack</label>
              <input type="text" class="form-control" id="projectTechStack" v-model="form.techStack" placeholder="e.g., Vue, Spring Boot, PostgreSQL">
              <div class="form-text">Enter technologies separated by commas.</div>
            </div>
            <!-- URLs -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="projectLiveUrl" class="form-label">Live URL</label>
                <input type="url" class="form-control" id="projectLiveUrl" v-model="form.liveUrl">
              </div>
              <div class="col-md-6 mb-3">
                <label for="projectRepoUrl" class="form-label">Repository URL</label>
                <input type="url" class="form-control" id="projectRepoUrl" v-model="form.repoUrl">
              </div>
            </div>
            <!-- Image URL -->
            <div class="mb-3">
              <label for="projectImageUrl" class="form-label">Image URL</label>
              <input type="url" class="form-control" id="projectImageUrl" v-model="form.imageUrl">
            </div>
            <!-- Visibility -->
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="projectVisible" v-model="form.visible">
              <label class="form-check-label" for="projectVisible">Visible on public portfolio</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="submitForm" :disabled="!form.title">
            {{ isEditing ? 'Save Changes' : 'Create Project' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="visible" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  project: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

// The form model now includes all the necessary fields.
// techStack is managed as a string for easy input.
const form = ref({});

const isEditing = computed(() => !!props.project?.uuid);

// Watch for the project prop to change, and populate the form
watch(() => props.project, (newProject) => {
  if (newProject) {
    // Editing an existing project
    form.value = {
      ...newProject,
      // Convert techStack array to a comma-separated string for the input field
      techStack: (newProject.techStack || []).join(', '),
    };
  } else {
    // Creating a new project, reset to defaults
    form.value = {
      title: '',
      description: '',
      techStack: '', // Stored as a string
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
      visible: true,
    };
  }
}, { immediate: true });

const closeModal = () => {
  emit('close');
};

const submitForm = () => {
  // Basic validation
  if (!form.value.title) {
    return;
  }

  // Prepare the payload to be emitted
  const payload = {
    ...form.value,
    // Convert the techStack string back into an array of strings.
    // This splits by comma, trims whitespace from each item, and filters out any empty strings.
    techStack: form.value.techStack
      ? form.value.techStack.split(',').map(tech => tech.trim()).filter(tech => tech)
      : [],
  };

  emit('save', payload);
};
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
