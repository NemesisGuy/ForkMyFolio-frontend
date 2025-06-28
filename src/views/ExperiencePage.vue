<template>
  <div class="experience-page py-5">
    <div class="container">
      <h1 class="display-5 mb-4 text-center">Work Experience</h1>
      <p class="lead text-center text-muted mb-5">A timeline of my professional journey and
        accomplishments.</p>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger">
        Could not load experience data. Please try again later.
      </div>

      <div v-else-if="experiences.length > 0" class="timeline">
        <div v-for="(exp, index) in experiences" :key="exp.id" :class="{ 'timeline-item-right': index % 2 !== 0 }"
             class="timeline-item">
          <div class="timeline-content card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ exp.jobTitle }}</h5>
              <h6 class="card-subtitle mb-2 text-primary">{{ exp.companyName }}</h6>
              <p class="card-text text-muted small">
                <i class="bi bi-calendar-event me-1"></i>
                {{ formatDate(exp.startDate) }} -
                {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}
                <br>
                <i class="bi bi-geo-alt-fill me-1"></i>
                {{ exp.location }}
              </p>
              <p class="card-text">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-briefcase display-1 text-muted mb-3"></i>
        <h2 class="display-6">Experience Coming Soon!</h2>
        <p class="lead text-muted">Work history has not been added yet. Please check back later.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getPublicExperience} from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const experiences = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {year: 'numeric', month: 'long'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(async () => {
  try {
    const data = await getPublicExperience();
    // Sort by end date descending (most recent first)
    experiences.value = data.sort((a, b) => new Date(b.endDate || new Date()) - new Date(a.endDate || new Date()));
  } catch (err) {
    console.error("Failed to fetch experience data:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.experience-page h1 {
  font-weight: 300;
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background-color: #e9ecef;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 10px 40px;
  margin-bottom: 20px;
}

.timeline-item:nth-child(odd) {
  left: 0;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -12.5px;
  background-color: white;
  border: 4px solid #0d6efd;
  top: 15px;
  border-radius: 50%;
  z-index: 1;
}

.timeline-item:nth-child(even)::after {
  left: -12.5px;
}

.timeline-content {
  position: relative;
}
</style>
