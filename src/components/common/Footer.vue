<template>
  <!--
    The footer remains theme-aware using Bootstrap's utility classes.
  -->
  <footer class="footer mt-auto py-3 bg-body-tertiary border-top">
    <div class="container-fluid text-center">
      <!-- REFACTORED: Using flexbox for better spacing and alignment -->
      <div
        class="text-body-secondary d-flex flex-wrap justify-content-center align-items-center gap-1 gap-sm-3">
        <span>
          © {{ formatDate(new Date(), {month: 'long', year: 'numeric'}) }} ForkMyFolio
        </span>

        <span class="d-none d-sm-inline">|</span>

        <span>
          Built by
          <a
            class="text-body-secondary fw-semibold"
            href="https://github.com/NemesisGuy"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i class="bi bi-github me-1"></i>NemesisGuy
          </a>
        </span>

        <span class="d-none d-sm-inline">|</span>

        <span>
          Powered by
          <a
            class="text-body-secondary fw-semibold"
            href="https://nemesisnet.co.za"
            rel="noopener noreferrer"
            target="_blank"
          >
            Nemesisnet.co.za
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {formatDate} from '@/utils/index.js'; // <-- Import the utility

/**
 * @file src/components/Footer.vue
 * @description The main footer component for the application.
 * It is theme-aware and includes copyright and external links.
 */

// No other script logic is needed for this component.
</script>

<style scoped>
.footer {
  font-size: 0.9rem;
  /* Add a subtle transition for the background color change */
  transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.footer a {
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline !important;
  color: var(--bs-primary) !important;
}

/* On extra small screens, stack the items for better readability */
@media (max-width: 575.98px) {
  .footer .d-flex {
    flex-direction: column;
    gap: 0.25rem !important;
  }
}
</style>
