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
              <label class="form-label">Tech Stack</label>
              <TagInput v-model="form.techStack" placeholder="Add skills and press Enter..." />
              <div class="form-text">Enter a skill and press Enter or comma to add it.</div>
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
import TagInput from '@/components/forms/TagInput.vue';

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

const form = ref({});

const isEditing = computed(() => !!props.project?.uuid);

watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = {
      ...newProject,
      techStack: newProject.techStack || [],
    };
  } else {
    form.value = {
      title: '',
      description: '',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
      visible: true,
    };
  }
}, { immediate: true, deep: true });

const closeModal = () => {
  emit('close');
};

const submitForm = () => {
  if (!form.value.title) {
    return;
  }
  // The techStack is already an array thanks to the TagInput component.
  emit('save', { ...form.value });
};
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
