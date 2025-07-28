<template>
  <div class="portfolio-projects">
    <h2 class="h4 mb-4 section-title">Projects</h2>
    <div class="row g-4">
      <div v-for="project in projects" :key="project.uuid" class="col-md-6">
        <div class="card h-100 glass-card shadow-sm">
          <img v-if="project.imageUrl" :src="project.imageUrl" class="card-img-top" alt="Project image">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ project.name }}</h5>
            <p class="card-text text-muted small flex-grow-1">{{ project.description }}</p>
            <div class="mt-3">
              <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn btn-sm btn-primary me-2">
                <i class="bi bi-box-arrow-up-right me-1"></i> Live Demo
              </a>
              <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-github me-1"></i> Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  projects: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.section-title {
  font-weight: 300;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 0.5rem;
}
.card-img-top {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
</style>
