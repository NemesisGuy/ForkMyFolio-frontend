<template>
  <!-- THIS IS THE FIX: The page now uses the animated background and flexbox for centering -->
  <div class="unauthorized-page py-5 animated-gradient-background d-flex align-items-center">
    <div class="container" style="max-width: 600px;">
      <!-- The content is now wrapped in a beautiful, animated glass card -->
      <div class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
        <div class="card-body text-center p-4 p-md-5">
          <!-- The icon is now a consistent Bootstrap Icon -->
          <i class="bi bi-shield-lock-fill display-1 text-warning mb-3"></i>
          <h1 class="display-5">Access Denied</h1>
          <p class="lead text-muted my-4">
            Sorry, you do not have the necessary permissions to access this page.
          </p>
          <div class="d-flex justify-content-center gap-3">
            <!-- Buttons now have interactive classes -->
            <router-link class="btn btn-outline-secondary btn-lg interactive-lift" to="/">
              Go to Homepage
            </router-link>
            <router-link class="btn btn-primary btn-lg interactive-lift interactive-shadow-primary" to="/login">
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/public/UnauthorizedPage.vue
 * @description An "Access Denied" page for users attempting to access restricted content.
 * Displays a 401-like message and links to homepage or login.
 */

// No specific script logic needed for this simple static page.
</script>

<style scoped>
/* THIS IS THE FIX: The page now takes up the full viewport height for better vertical centering */
.unauthorized-page {
  min-height: calc(100vh - 56px - 1px); /* Full height minus navbar and its border */
  overflow-x: hidden;
}

.card-body {
  position: relative;
  z-index: 1;
}

h1 {
  font-weight: 300;
}

/* THIS IS THE FIX: Adds the fade-in animation */
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

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}
</style>
