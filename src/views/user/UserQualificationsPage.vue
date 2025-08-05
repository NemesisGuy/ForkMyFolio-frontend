<template>
  <div class="user-qualifications-page py-5 animated-gradient-background">
    <!--suppress HtmlUnknownBooleanAttribute -->
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">Manage My Qualifications</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add New Qualification
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the qualification '${qualificationToDelete?.qualificationName}'?`"
        :visible="!!qualificationToDelete"
        title="Confirm Deletion"
        @close="qualificationToDelete = null"
        @confirm="handleDeleteQualification"
      />

      <!-- Add/Edit Qualification Modal -->
      <div id="qualificationModal" ref="qualificationModalRef" aria-hidden="true"
           aria-labelledby="qualificationModalLabel" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 id="qualificationModalLabel" class="modal-title">
                {{ isEditing ? 'Edit Qualification' : 'Add New Qualification' }}</h5>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal"
                      type="button"></button>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
              <form @submit.prevent="handleFormSubmit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label" for="qualName">Qualification / Degree</label>
                    <input id="qualName" v-model="currentQualification.qualificationName" class="form-control"
                           required type="text">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label" for="qualLevel">Level</label>
                    <select id="qualLevel" v-model="currentQualification.level" class="form-select"
                            required>
                      <option disabled value="">Select a level</option>
                      <option v-for="level in QUALIFICATION_LEVELS" :key="level.value"
                              :value="level.value">{{ level.text }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="qualInstitution">Institution</label>
                  <input id="qualInstitution" v-model="currentQualification.institutionName" class="form-control"
                         required type="text">
                </div>
                <div class="mb-3">
                  <label class="form-label" for="qualFieldOfStudy">Field of Study (Optional)</label>
                  <input id="qualFieldOfStudy" v-model="currentQualification.fieldOfStudy" class="form-control"
                         type="text">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label" for="qualStartYear">Start Year</label>
                    <input id="qualStartYear" v-model.number="currentQualification.startYear" :max="new Date().getFullYear() + 5"
                           :min="1900" class="form-control" required
                           type="number">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label" for="qualCompletionYear">Completion Year</label>
                    <input id="qualCompletionYear" v-model.number="currentQualification.completionYear" :disabled="currentQualification.stillStudying"
                           :max="new Date().getFullYear() + 10"
                           :min="1900" class="form-control"
                           type="number">
                  </div>
                </div>
                <div class="form-check form-switch mb-3">
                  <input id="qualStillStudying" v-model="currentQualification.stillStudying" class="form-check-input"
                         role="switch" type="checkbox">
                  <label class="form-check-label" for="qualStillStudying">I am still studying for
                    this qualification</label>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="qualGrade">Grade / Result (Optional)</label>
                  <input id="qualGrade" v-model="currentQualification.grade" class="form-control"
                         type="text">
                </div>
                <hr class="my-4">
                <h6 class="text-muted mb-3">Optional Links</h6>
                <div class="mb-3">
                  <label class="form-label" for="qualInstitutionLogoUrl">Institution Logo
                    URL</label>
                  <input id="qualInstitutionLogoUrl" v-model="currentQualification.institutionLogoUrl" class="form-control"
                         placeholder="https://..."
                         type="url">
                </div>
                <div class="mb-3">
                  <label class="form-label" for="qualInstitutionWebsite">Institution Website
                    URL</label>
                  <input id="qualInstitutionWebsite" v-model="currentQualification.institutionWebsite" class="form-control"
                         placeholder="https://..."
                         type="url">
                </div>
                <div class="mb-3">
                  <label class="form-label" for="qualCredentialUrl">Credential URL</label>
                  <input id="qualCredentialUrl" v-model="currentQualification.credentialUrl" class="form-control"
                         placeholder="https://..." type="url">
                  <div class="form-text">A link to a digital certificate or verification page.</div>
                </div>
                <hr class="my-4">
                <div class="form-check form-switch mb-3">
                  <input id="qualVisible" v-model="currentQualification.visible" class="form-check-input" role="switch"
                         type="checkbox">
                  <label class="form-check-label" for="qualVisible">Visible on public
                    portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
              <button class="btn btn-primary" type="button" @click="handleFormSubmit">
                {{ isEditing ? 'Save Changes' : 'Add Qualification' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Qualifications List -->
      <div v-if="!isLoading && qualifications.length > 0" class="card glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <ul class="list-group list-group-flush">
          <li v-for="qual in qualifications" :key="qual.uuid"
              class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">{{ qual.qualificationName }}</h5>
              <p class="mb-1 text-primary fw-bold">
                {{ qual.institutionName }}
              </p>
              <small class="d-block text-muted">{{ qual.startYear }} -
                {{ qual.stillStudying ? 'Present' : qual.completionYear }}</small>
              <small v-if="qual.fieldOfStudy" class="d-block text-muted">{{
                  qual.fieldOfStudy
                }}</small>
              <small v-if="qual.grade" class="text-muted">Grade: {{ qual.grade }}</small>
            </div>
            <div class="actions d-flex align-items-center">
              <div class="form-check form-switch me-3" title="Toggle Visibility">
                <input :checked="qual.visible" class="form-check-input" role="switch"
                       type="checkbox" @change="handleVisibilityToggle(qual)">
              </div>
              <button class="btn btn-sm btn-outline-primary me-2" title="Edit Qualification"
                      @click="openEditModal(qual)">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Delete Qualification"
                      @click="qualificationToDelete = qual">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <h4 class="glass-title">No Qualifications Found</h4>
        <p class="glass-subtitle">You haven't added any qualifications yet. Click the button above
          to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {qualificationsApi} from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import {Modal} from 'bootstrap';

const QUALIFICATION_LEVELS = [
  {value: 'DOCTORATE', text: 'Doctorate (PhD)'},
  {value: 'MASTERS', text: 'Master\'s Degree'},
  {value: 'POSTGRADUATE_DIPLOMA', text: 'Postgraduate Diploma'},
  {value: 'BACHELORS', text: 'Bachelor\'s Degree'},
  {value: 'ASSOCIATE_DEGREE', text: 'Associate Degree'},
  {value: 'DIPLOMA', text: 'Diploma'},
  {value: 'CERTIFICATE', text: 'Certificate'},
  {value: 'HIGH_SCHOOL', text: 'High School / Secondary'},
  {value: 'OTHER', text: 'Other'},
];

// --- State ---
const qualifications = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const qualificationToDelete = ref(null);

// For the Add/Edit Modal
const qualificationModalRef = ref(null);
let qualificationModalInstance = null;
const isEditing = ref(false);

const initialQualificationState = () => ({
  uuid: null,
  qualificationName: '',
  institutionName: '',
  institutionLogoUrl: '',
  institutionWebsite: '',
  fieldOfStudy: '',
  level: '',
  startYear: new Date().getFullYear() - 4,
  completionYear: new Date().getFullYear(), // Default, can be nulled
  stillStudying: false,
  grade: '',
  credentialUrl: '',
  visible: true,
});
const currentQualification = reactive(initialQualificationState());

// Watcher to handle the 'stillStudying' case
watch(() => currentQualification.stillStudying, (isStudying) => {
  if (isStudying) {
    currentQualification.completionYear = null;
  } else if (currentQualification.completionYear === null) {
    currentQualification.completionYear = new Date().getFullYear();
  }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchQualifications();
  if (qualificationModalRef.value) {
    qualificationModalInstance = new Modal(qualificationModalRef.value);
  }
});

// --- Data Fetching ---
const fetchQualifications = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetched = await qualificationsApi.getAll();
    qualifications.value = fetched.sort((a, b) => {
      const yearA = a.startYear || 0;
      const yearB = b.startYear || 0;
      return yearB - yearA;
    });
  } catch (err) {
    console.error("Failed to fetch user qualifications:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your qualifications.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  Object.assign(currentQualification, initialQualificationState());
  isEditing.value = false;
  qualificationModalInstance?.show();
};

const openEditModal = (qual) => {
  isEditing.value = true;
  Object.assign(currentQualification, qual);
  qualificationModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  if (isEditing.value) {
    await handleUpdateQualification();
  } else {
    await handleAddQualification();
  }
};

const buildPayload = (qual) => ({
  qualificationName: qual.qualificationName,
  institutionName: qual.institutionName,
  institutionLogoUrl: qual.institutionLogoUrl || null,
  institutionWebsite: qual.institutionWebsite || null,
  fieldOfStudy: qual.fieldOfStudy || null,
  level: qual.level,
  startYear: qual.startYear,
  // Ensure completionYear is null if still studying, otherwise send the value or null
  completionYear: qual.stillStudying ? null : (qual.completionYear || null),
  stillStudying: qual.stillStudying,
  grade: qual.grade || null,
  credentialUrl: qual.credentialUrl || null,
  visible: qual.visible
});

const handleAddQualification = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentQualification);
    await qualificationsApi.create(payload);
    await fetchQualifications();
    successMessage.value = `Qualification '${payload.qualificationName}' was added successfully.`;
    qualificationModalInstance?.hide();
  } catch (err) {
    console.error("Failed to add qualification:", err);
    error.value = err.message || 'An error occurred while adding the qualification.';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateQualification = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentQualification);
    await qualificationsApi.update(currentQualification.uuid, payload);
    await fetchQualifications();
    successMessage.value = `Qualification '${payload.qualificationName}' was updated successfully.`;
    qualificationModalInstance?.hide();
  } catch (err) {
    console.error("Failed to update qualification:", err);
    error.value = err.message || 'An error occurred while updating the qualification.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteQualification = async () => {
  if (!qualificationToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await qualificationsApi.remove(qualificationToDelete.value.uuid);
    await fetchQualifications();
    // CORRECTED: Referenced qualificationName instead of non-existent 'name'
    successMessage.value = `Qualification '${qualificationToDelete.value.qualificationName}' was deleted successfully.`;
  } catch (err) {
    console.error("Failed to delete qualification:", err);
    error.value = err.message || 'An error occurred while deleting the qualification.';
  } finally {
    isLoading.value = false;
    qualificationToDelete.value = null;
  }
};

const handleVisibilityToggle = async (qual) => {
  const originalVisibility = qual.visible;
  qual.visible = !qual.visible;

  try {
    const payload = buildPayload(qual);
    await qualificationsApi.update(qual.uuid, payload);
    successMessage.value = `Visibility for '${qual.qualificationName}' updated.`;
  } catch (err) {
    qual.visible = originalVisibility;
    console.error("Failed to update visibility:", err);
    error.value = err.message || 'An error occurred while updating visibility.';
  }
};
</script>

<style scoped>
.list-group-item {
  background-color: transparent;
  border-bottom: 1px solid var(--glass-border);
  color: var(--glass-text);
  transition: background-color 0.3s ease;
  padding: 1.25rem;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background-color: var(--glass-bg-hover);
}

.list-group-item .actions {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  flex-shrink: 0;
  margin-left: 1rem;
}

.list-group-item:hover .actions {
  opacity: 1;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}

.form-check-input {
  cursor: pointer;
}
</style>
