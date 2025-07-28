<template>
  <div class="portfolio-experience">
    <h2 class="h4 mb-4 section-title">Work Experience</h2>
    <div v-for="(experience, index) in experiences" :key="experience.uuid" class="experience-item card glass-card shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="card-title mb-0">{{ experience.jobTitle }}</h5>
            <h6 class="card-subtitle text-primary fw-normal">{{ experience.companyName }}</h6>
          </div>
          <div class="text-muted text-end small flex-shrink-0 ms-3">
            {{ formatDate(experience.startDate) }} - {{ experience.endDate ? formatDate(experience.endDate) : 'Present' }}
          </div>
        </div>
        <p class="card-text mt-3 text-muted description-text">
          {{ experience.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  experiences: {
    type: Array,
    required: true,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
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
