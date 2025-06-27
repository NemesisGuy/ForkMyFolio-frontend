<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm sticky-top">
    <div class="container-fluid"> <!-- Changed to container-fluid -->
      <router-link class="navbar-brand" to="/">ForkMyFolio</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleNavbar"
        ref="navbarToggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" ref="navbarNavCollapsible">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/" @click="collapseNavbar">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/projects" @click="collapseNavbar">Projects</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/skills" @click="collapseNavbar">Skills</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/contact" @click="collapseNavbar">Contact</router-link>
          </li>

          <template v-if="authService.isAuthenticated.value">
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" active-class="active" to="/admin" @click="collapseNavbar">Admin</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ authService.user.value?.username || authService.user.value?.firstName || 'User' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                <li><router-link class="dropdown-item" to="/profile" @click="collapseNavbar">Profile</router-link></li>
                <li><router-link class="dropdown-item" to="/my-projects" @click="collapseNavbar">My Projects</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="requestLogoutConfirmation">Logout</a></li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/login" @click="collapseNavbar">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-primary btn-sm ms-lg-2" to="/signup" @click="collapseNavbar">Sign Up</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <ConfirmModal
      :visible="showLogoutConfirmModal"
      :title="logoutConfirmTitle"
      :message="logoutConfirmMessage"
      confirmText="Logout"
      cancelText="Cancel"
      @confirm="executeLogout"
      @cancel="cancelLogout"
      @close="cancelLogout"
    />
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService'; // Corrected path
import { Collapse } from 'bootstrap'; // Import Bootstrap Collapse for manual toggling
import ConfirmModal from './common/ConfirmModal.vue';

/**
 * @file src/components/Navbar.vue
 * @description Navigation bar component for the application.
 * Displays main navigation links. Uses Bootstrap for styling.
 * Adapts links based on user authentication status.
 */

const router = useRouter();

/** @type {import('vue').Ref<HTMLElement|null>} */
const navbarToggler = ref(null);
/** @type {import('vue').Ref<HTMLElement|null>} */
const navbarNavCollapsible = ref(null);
let bsCollapse = null;

// Manage Bootstrap collapse instance for programmatic control
import { onMounted, onBeforeUnmount } from 'vue';
onMounted(() => {
  if (navbarNavCollapsible.value) {
    bsCollapse = new Collapse(navbarNavCollapsible.value, { toggle: false });
  }
});
onBeforeUnmount(() => {
  if (bsCollapse) {
    bsCollapse.dispose();
  }
});

/**
 * Programmatically toggles the Bootstrap collapse instance for the navbar.
 */
const toggleNavbar = () => {
  if (bsCollapse) {
    bsCollapse.toggle();
  }
};

/**
 * Programmatically hides the Bootstrap collapse instance for the navbar if it's currently shown.
 * Useful for closing the mobile menu after a navigation link is clicked.
 */
const collapseNavbar = () => {
  if (bsCollapse && navbarNavCollapsible.value && navbarNavCollapsible.value.classList.contains('show')) {
    bsCollapse.hide();
  }
};

/**
 * Computed property to check if the current user is an admin.
 * @returns {boolean} True if the user is authenticated and has the 'ADMIN' role, false otherwise.
 */
const isAdmin = computed(() => {
  return authService.user.value && authService.user.value.roles && authService.user.value.roles.includes('ADMIN');
});

/**
 * Handles the user logout process.
 * Calls the authentication service to log out, then redirects to the login page.
 */
const handleLogout = async () => {
  collapseNavbar(); // Ensure navbar collapses on mobile after clicking logout
  try {
    await authService.logout();
    router.push('/login'); // Navigate to login after logout
  } catch (error) {
    console.error('Error during logout:', error);
    // Handle logout error if necessary, though authService clears state regardless
    // For instance, display a toast message
  }
};

// --- Logout Confirmation Modal State ---
/** @type {import('vue').Ref<boolean>} Controls visibility of the logout confirmation modal. */
const showLogoutConfirmModal = ref(false);
/** @type {string} Title for the logout confirmation modal. */
const logoutConfirmTitle = "Confirm Logout";
/** @type {string} Message for the logout confirmation modal. */
const logoutConfirmMessage = "Are you sure you want to logout?";

/**
 * Initiates the logout confirmation process by displaying the ConfirmModal.
 */
const requestLogoutConfirmation = () => {
  collapseNavbar(); // Ensure navbar collapses on mobile before showing modal
  showLogoutConfirmModal.value = true;
};

/**
 * Executes the actual logout process after user confirmation.
 * Calls the authentication service to log out, then redirects to the login page.
 */
const executeLogout = async () => {
  showLogoutConfirmModal.value = false; // Hide modal first
  try {
    await authService.logout();
    router.push('/login'); // Navigate to login after logout
  } catch (error) {
    console.error('Error during logout:', error);
    // Optionally, show an error modal/toast if logout itself fails critically
    // For now, authService clears state regardless, and redirection happens.
  }
};

/**
 * Cancels the logout process by hiding the ConfirmModal.
 */
const cancelLogout = () => {
  showLogoutConfirmModal.value = false;
};

</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
.nav-link.active {
  font-weight: 500;
}
.dropdown-menu {
  /* Ensure dropdown appears correctly with Vite/Vue setup if any issues */
}
/* Add some padding for the Sign Up button on smaller screens if needed */
@media (max-width: 991.98px) {
  .navbar-nav .btn-primary {
    margin-top: 0.5rem;
    display: block;
    width: fit-content;
  }
}
</style>
