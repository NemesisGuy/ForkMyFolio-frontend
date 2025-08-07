<template>
  <div id="qualificationFormModal" ref="modalRef" aria-hidden="true"
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
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="qualName">Qualification / Degree</label>
                <input id="qualName" v-model="formState.qualificationName"
                       class="form-control"
                       required type="text">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="qualLevel">Level</label>
                <select id="qualLevel" v-model="formState.level" class="form-select"
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
              <input id="qualInstitution" v-model="formState.institutionName"
                     class="form-control"
                     required type="text">
            </div>
            <div class="mb-3">
              <label class="form-label" for="qualFieldOfStudy">Field of Study (Optional)</label>
              <input id="qualFieldOfStudy" v-model="formState.fieldOfStudy"
                     class="form-control"
                     type="text">
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="qualStartYear">Start Year</label>
                <input id="qualStartYear" v-model.number="formState.startYear"
                       :max="new Date().getFullYear() + 5"
                       :min="1900" class="form-control" required
                       type="number">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="qualCompletionYear">Completion Year</label>
                <input id="qualCompletionYear"
                       v-model.number="formState.completionYear"
                       :disabled="formState.stillStudying"
                       :max="new Date().getFullYear() + 10"
                       :min="1900" class="form-control"
                       type="number">
              </div>
            </div>
            <div class="form-check form-switch mb-3">
              <input id="qualStillStudying" v-model="formState.stillStudying"
                     class="form-check-input"
                     role="switch" type="checkbox">
              <label class="form-check-label" for="qualStillStudying">I am still studying for
                this qualification</label>
            </div>
            <div class="mb-3">
              <label class="form-label" for="qualGrade">Grade / Result (Optional)</label>
              <input id="qualGrade" v-model="formState.grade" class="form-control"
                     type="text">
            </div>
            <hr class="my-4">
            <h6 class="text-muted mb-3">Optional Links</h6>
            <div class="mb-3">
              <label class="form-label" for="qualInstitutionLogoUrl">Institution Logo
                URL</label>
              <input id="qualInstitutionLogoUrl"
                     v-model="formState.institutionLogoUrl" class="form-control"
                     placeholder="https://..."
                     type="url">
            </div>
            <div class="mb-3">
              <label class="form-label" for="qualInstitutionWebsite">Institution Website
                URL</label>
              <input id="qualInstitutionWebsite"
                     v-model="formState.institutionWebsite" class="form-control"
                     placeholder="https://..."
                     type="url">
            </div>
            <div class="mb-3">
              <label class="form-label" for="qualCredentialUrl">Credential URL</label>
              <input id="qualCredentialUrl" v-model="formState.credentialUrl"
                     class="form-control"
                     placeholder="https://..." type="url">
              <div class="form-text">A link to a digital certificate or verification page.</div>
            </div>
            <hr class="my-4">
            <div class="form-check form-switch mb-3">
              <input id="qualVisible" v-model="formState.visible"
                     class="form-check-input" role="switch"
                     type="checkbox">
              <label class="form-check-label" for="qualVisible">Visible on public
                portfolio</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
          <button class="btn btn-primary" type="button" @click="submitForm">
            {{ isEditing ? 'Save Changes' : 'Add Qualification' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {Modal} from 'bootstrap';

const props = defineProps({
  qualification: {type: Object, default: null},
  isEditing: {type: Boolean, default: false},
});

const emit = defineEmits(['save']);

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

const modalRef = ref(null);
let modalInstance = null;

const getInitialState = () => ({
  uuid: null, qualificationName: '', institutionName: '', institutionLogoUrl: '',
  institutionWebsite: '', fieldOfStudy: '', level: '',
  startYear: new Date().getFullYear() - 4,
  completionYear: new Date().getFullYear(),
  stillStudying: false, grade: '', credentialUrl: '', visible: true,
});

const formState = reactive(getInitialState());

watch(() => props.qualification, (newVal) => {
  if (newVal) {
    Object.assign(formState, JSON.parse(JSON.stringify(newVal)));
  } else {
    Object.assign(formState, getInitialState());
  }
}, {deep: true});

watch(() => formState.stillStudying, (isStudying) => {
  if (isStudying) {
    formState.completionYear = null;
  } else if (formState.completionYear === null) {
    formState.completionYear = new Date().getFullYear();
  }
});

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }
});

const submitForm = () => {
  emit('save', {...formState});
};

defineExpose({
  show: () => modalInstance?.show(),
  hide: () => modalInstance?.hide(),
});
</script>