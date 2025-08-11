<template>
  <!-- REFACTOR: This modal now uses the standard Bootstrap JS-controlled structure,
       and the backdrop blur is handled globally in glass.css -->
  <div ref="modalRef" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <!-- v-if prevents rendering errors when the prop is null during transitions -->
      <div v-if="qualification" class="modal-content glass-modal border-0">
        <div class="modal-header border-0 pb-0">
          <!-- FIX: Removed text-white to allow theme-adaptive color from glass.css -->
          <h5 class="modal-title">
            {{ qualification.qualificationName }}
          </h5>
          <!-- FIX: Removed btn-close-white to allow Bootstrap to handle theme-adaptive color -->
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <!-- FIX: Replaced text-light with theme-aware text-muted -->
              <h6 class="text-muted mb-1">
                {{ qualification.institutionName }}
              </h6>
              <p v-if="qualification.fieldOfStudy" class="text-info mb-3">
                {{ qualification.fieldOfStudy }}
              </p>
              <!-- FIX: Removed text-light to inherit correct color -->
              <p v-if="qualification.grade" class="mb-2">
                <strong>Grade:</strong> {{ qualification.grade }}
              </p>
              <!-- FIX: Removed text-light to inherit correct color -->
              <p v-if="qualification.level" class="mb-2">
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
import {onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';

const props = defineProps(/** @props */ {
  /**
   * The qualification object to display. The modal is shown when this prop is not null.
   * @type {object|null}
   */
  qualification: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(/** @emits */ {
  'close': null, // Emitted when the modal is closed, signaling the parent to nullify the prop.
});

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
    // FIX: Use 'hide.bs.modal' to fire the close event earlier, preventing a focus race condition.
    modalRef.value.addEventListener('hide.bs.modal', () => emit('close'));
  }
});

watch(() => props.qualification, (newQual) => {
  if (newQual) {
    modalInstance?.show();
  } else {
    modalInstance?.hide();
  }
});
</script>

<style scoped>
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