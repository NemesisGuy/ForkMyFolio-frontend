<template>
  <div class="landing-page animated-gradient-background">
    <div class="container text-center py-5">
      <div class="animate-fade-in-up">
        <img src="@/assets/forkmyfolio_logo_icon.png" alt="ForkMyFolio Logo" width="120" height="120" class="mb-4 rounded-circle shadow-lg">
        <h1 class="display-3 fw-bold text-gradient">Welcome to ForkMyFolio</h1>
        <p class="lead glass-subtitle my-4 mx-auto" style="max-width: 700px;">
          The simplest way to create, manage, and share a professional developer portfolio. No coding required.
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <router-link :to="{ name: 'register' }" class="btn btn-primary btn-lg interactive-lift">Get Started for Free</router-link>
          <router-link :to="{ name: 'login' }" class="btn btn-outline-light btn-lg interactive-lift">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic is needed for this simple static page.
</script>

<style scoped>
.landing-page {
  min-height: calc(100vh - 56px - 1px); /* Full viewport height minus navbar */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
}

.text-gradient {
  background: linear-gradient(45deg, var(--bs-primary), var(--bs-info));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  color: var(--bs-primary);
  padding-bottom: 0.15em;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
