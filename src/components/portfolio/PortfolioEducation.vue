<template>
  <div class="portfolio-education">
    <h2 class="h4 mb-4 section-title">Education</h2>
    <div v-for="edu in educationHistory" :key="edu.uuid" class="education-item card glass-card shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="card-title mb-0">{{ edu.name }}</h5>
            <h6 class="card-subtitle text-primary fw-normal">{{ edu.institution }}</h6>
          </div>
          <div class="text-muted text-end small flex-shrink-0 ms-3">
            {{ edu.issueDate ? new Date(edu.issueDate).getFullYear() : '' }}
          </div>
        </div>
        <p v-if="edu.description" class="card-text mt-3 text-muted description-text">
          {{ edu.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  qualifications: {
    type: Array,
    required: true,
  },
});

// Filter the qualifications to only show items of type 'EDUCATION'
const educationHistory = computed(() => {
  return props.qualifications.filter(q => q.type === 'EDUCATION');
});
</script>

<style scoped>
.section-title {
  font-weight: 300;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 0.5rem;
}
.description-text {
  white-space: pre-wrap;
  line-height: 1.7;
}
</style>
