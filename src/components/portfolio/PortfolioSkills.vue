<template>
  <div class="portfolio-skills card glass-card shadow-sm">
    <div class="card-body p-4">
      <h3 class="card-title h5 mb-3">Skills</h3>
      <div class="d-flex flex-wrap gap-2">
        <span v-for="skill in skills" :key="skill.uuid" class="badge rounded-pill text-bg-primary fw-normal fs-6">
          {{ skill.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  skills: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.card-title {
  font-weight: 300;
}
.badge {
  padding: 0.5em 1em;
}
</style>
