import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
// CORRECTED: Import the authService from its actual location.
import {authService} from '@/services/authService.js';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- KEY CHANGE: Initialize Auth State Before App Mount ---
// We use an async IIFE (Immediately Invoked Function Expression)
// to ensure the auth check completes before we mount the app.
(async () => {
  try {
    // This now correctly calls initAuth() on the real authService instance.
    await authService.initAuth();
  } catch (e) {
    console.error("Critical error during application initialization:", e);
  }

  // Now that the auth state is resolved, create and mount the app.
  const app = createApp(App);

  app.use(router);

  app.mount('#app');
})();
