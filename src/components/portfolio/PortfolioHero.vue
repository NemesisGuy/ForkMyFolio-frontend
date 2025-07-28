<template>
  <div class="portfolio-hero text-center py-5 glass-section">
    <div class="container">
      <img
        v-if="user && user.profileImageUrl"
        :src="user.profileImageUrl"
        alt="Profile Picture"
        class="hero-avatar rounded-circle mb-4 shadow-lg"
      />
      <i v-else class="bi bi-person-circle hero-avatar-placeholder mb-4"></i>

      <h1 v-if="user" class="display-4 fw-light">{{ user.firstName }} {{ user.lastName }}</h1>
      <p v-if="user" class="lead text-muted">{{ user.headline }}</p>

      <!--
        You could add social media links here in the future, for example:
        <div class="social-links mt-3">
          <a v-if="user.linkedinUrl" :href="user.linkedinUrl" class="btn btn-outline-secondary rounded-circle mx-1"><i class="bi bi-linkedin"></i></a>
          <a v-if="user.githubUrl" :href="user.githubUrl" class="btn btn-outline-secondary rounded-circle mx-1"><i class="bi bi-github"></i></a>
        </div>
      -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.hero-avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.5);
}

.hero-avatar-placeholder {
  font-size: 150px;
  line-height: 1;
  color: var(--bs-secondary);
}

.glass-section {
  background-color: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
}
</style>
