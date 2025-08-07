<template>
  <!-- The modal is conditionally rendered based on the presence of the qualification prop -->
  <div v-if="qualification"
       class="modal fade show d-block"
       style="background: rgba(0,0,0,0.5);"
       @click.self="$emit('close')">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content glass-modal border-0">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title text-white">
            {{ qualification.qualificationName }}
          </h5>
          <button aria-label="Close" class="btn-close btn-close-white"
                  type="button"
                  @click="$emit('close')">
          </button>
        </div>
        <div class="modal-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h6 class="text-light opacity-75 mb-1">
                {{ qualification.institutionName }}
              </h6>
              <p v-if="qualification.fieldOfStudy" class="text-info mb-3">
                {{ qualification.fieldOfStudy }}
              </p>
              <p v-if="qualification.grade"
                 class="text-light mb-2">
                <strong>Grade:</strong> {{ qualification.grade }}
              </p>
              <p v-if="qualification.level" class="text-light mb-2">
                <strong>Level:</strong> {{
                  qualification.level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                }}
              </p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <div class="year-badge-large mb-3">
                <span
                  v-if="qualification.stillStudying">{{ qualification.startYear }} - Present</span>
                <span v-else>{{
                    qualification.startYear
                  }} - {{ qualification.completionYear }}</span>
              </div>
            </div>
          </div>
          <div
            class="mt-3 pt-3 border-top border-white border-opacity-10 d-flex justify-content-end gap-2 flex-wrap">
            <a v-if="qualification.institutionWebsite"
               :href="qualification.institutionWebsite"
               class="btn btn-outline-secondary" rel="noopener noreferrer"
               target="_blank">
              <i class="bi bi-globe me-2"></i> Institution Website
            </a>
            <a v-if="qualification.credentialUrl"
               :href="qualification.credentialUrl"
               class="btn btn-primary" rel="noopener noreferrer"
               target="_blank">
              <i class="bi bi-patch-check-fill me-2"></i> View Credential
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  qualification: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);
</script>

<style scoped>
.modal.show {
  backdrop-filter: blur(10px);
}

.year-badge-large {
  font-size: 2rem;
  font-weight: 800;
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.1);
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 2px solid rgba(var(--bs-primary-rgb), 0.2);
  text-align: center;
  box-shadow: 0 8px 30px rgba(var(--bs-primary-rgb), 0.15);
}
</style>