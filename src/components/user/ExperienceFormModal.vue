<template>
  <div id="experienceModal" ref="modalRef" aria-hidden="true" aria-labelledby="experienceModalLabel"
       class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content glass-modal">
        <div class="modal-header">
          <h5 id="experienceModalLabel" class="modal-title">
            {{ isEditing ? 'Edit Experience' : 'Add New Experience' }}</h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal"
                  type="button"></button>
        </div>
        <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
          <form class="row g-3" @submit.prevent="submitForm">
            <!-- Job Title & Display Order -->
            <div class="row">
              <div class="col-md-8 mb-3">
                <label class="form-label" for="expJobTitle">Job Title</label>
                <input id="expJobTitle" v-model="formState.jobTitle" class="form-control"
                       required type="text">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label" for="expDisplayOrder">Display Order</label>
                <input id="expDisplayOrder" v-model.number="formState.displayOrder"
                       class="form-control"
                       type="number">
              </div>
            </div>
            <!-- Company & Employment Type -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expCompanyName">Company</label>
                <input id="expCompanyName" v-model="formState.companyName" class="form-control"
                       required type="text">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expEmploymentType">Employment Type</label>
                <select id="expEmploymentType" v-model="formState.employmentType"
                        class="form-select">
                  <option v-for="type in EMPLOYMENT_TYPES" :key="type.value" :value="type.value">
                    {{ type.text }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Location & Location Type -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expLocation">Location (e.g., "City, Country")</label>
                <input id="expLocation" v-model="formState.location" class="form-control"
                       type="text">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expLocationType">Location Type</label>
                <select id="expLocationType" v-model="formState.locationType" class="form-select">
                  <option v-for="type in LOCATION_TYPES" :key="type.value" :value="type.value">
                    {{ type.text }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Dates -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expStartDate">Start Date</label>
                <input id="expStartDate" v-model="formState.startDate" class="form-control"
                       required type="date">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expEndDate">End Date</label>
                <input id="expEndDate" v-model="formState.endDate"
                       :disabled="formState.isCurrentJob" class="form-control"
                       type="date">
              </div>
            </div>
            <!-- Current Job Toggle -->
            <div class="form-check form-switch mb-3">
              <input id="isCurrentJob" v-model="formState.isCurrentJob" class="form-check-input"
                     type="checkbox">
              <label class="form-check-label" for="isCurrentJob">I currently work here</label>
            </div>
            <!-- Description & Achievements -->
            <div class="mb-3">
              <label class="form-label" for="expDescription">Description</label>
              <textarea id="expDescription" v-model="formState.description" class="form-control"
                        placeholder="Overview of your role and responsibilities."
                        rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label" for="expAchievements">Achievements (Optional)</label>
              <textarea id="expAchievements" v-model="formState.achievements" class="form-control"
                        placeholder="Key accomplishments or highlights." rows="3"></textarea>
            </div>

            <!-- Use the new SkillTagInput component -->
            <div class="mb-3">
              <label class="form-label">Skills</label>
              <SkillTagInput v-model="formState.skills" :available-skills="availableSkills"/>
            </div>

            <hr class="my-4">
            <h6 class="text-muted mb-3">Optional Links & Media</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expCompanyUrl">Company Website URL</label>
                <input id="expCompanyUrl" v-model="formState.companyUrl" class="form-control"
                       placeholder="https://..." type="url">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="expCompanyLogoUrl">Company Logo URL</label>
                <input id="expCompanyLogoUrl" v-model="formState.companyLogoUrl"
                       class="form-control"
                       placeholder="https://..." type="url">
              </div>
            </div>
            <hr class="my-4">
            <div class="form-check form-switch mb-3">
              <input id="expVisible" v-model="formState.visible" class="form-check-input"
                     role="switch"
                     type="checkbox">
              <label class="form-check-label" for="expVisible">Visible on public portfolio</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
          <button class="btn btn-primary" type="button" @click="submitForm">
            {{ isEditing ? 'Save Changes' : 'Add Experience' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineExpose, reactive, ref, watch} from 'vue';
import SkillTagInput from './SkillTagInput.vue';

// --- Props and Emits ---
const props = defineProps({
  experience: {type: Object, default: null},
  availableSkills: {type: Array, required: true},
});
const emit = defineEmits(['save']);

// --- Constants ---
const EMPLOYMENT_TYPES = [
  {value: 'FULL_TIME', text: 'Full-time'}, {value: 'PART_TIME', text: 'Part-time'},
  {value: 'CONTRACT', text: 'Contract'}, {value: 'FREELANCE', text: 'Freelance'},
  {value: 'INTERNSHIP', text: 'Internship'}, {value: 'APPRENTICESHIP', text: 'Apprenticeship'}
];
const LOCATION_TYPES = [
  {value: 'ON_SITE', text: 'On-site'}, {value: 'HYBRID', text: 'Hybrid'}, {
    value: 'REMOTE',
    text: 'Remote'
  }
];

// --- State ---
const modalRef = ref(null); // This ref is on the modal's root div
const isEditing = ref(false);

const getInitialFormState = () => ({
  uuid: null, jobTitle: '', companyName: '', companyUrl: '', companyLogoUrl: '',
  location: '', locationType: 'ON_SITE', employmentType: 'FULL_TIME',
  startDate: '', endDate: '', description: '', achievements: '',
  displayOrder: 100, skills: [], visible: true, isCurrentJob: false,
});
const formState = reactive(getInitialFormState());

// --- Watchers ---
watch(() => props.experience, (newExp) => {
  if (newExp) {
    isEditing.value = true;
    Object.assign(formState, {
      ...newExp,
      skills: newExp.skills ? newExp.skills.map(skill => skill.name) : [],
      isCurrentJob: !newExp.endDate,
    });
  } else {
    isEditing.value = false;
    Object.assign(formState, getInitialFormState());
  }
}, {deep: true, immediate: true});

watch(() => formState.isCurrentJob, (isCurrent) => {
  if (isCurrent) {
    formState.endDate = '';
  }
});

// --- Methods ---
const buildPayload = () => {
  return {
    ...formState,
    endDate: formState.isCurrentJob ? null : formState.endDate,
  };
};

const submitForm = () => {
  emit('save', buildPayload());
};

// --- THIS IS THE FIX ---
// Expose the modal's ref to the parent component so it can be controlled.
defineExpose({
  modalRef
});
</script>
