<template>
  <!-- The nav classes are already dynamic, which is perfect. -->
  <nav :class="[
    'navbar',
    'navbar-expand-lg',
    'border-bottom',
    'shadow-sm',
    'sticky-top',
    themeService.theme.current === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
  ]">
    <div class="container-fluid">
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

          <!-- THEME TOGGLE SWITCH START -->
          <li class="nav-item d-flex align-items-center ms-lg-2">
            <ThemeToggle />
          </li>
          <!-- THEME TOGGLE SWITCH END -->

          <li class="nav-item d-none d-lg-block mx-1">
            <div class="vr"></div>
          </li>

          <template v-if="authService.isAuthenticated.value">
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" active-class="active" to="/admin" @click="collapseNavbar">Admin</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ authService.user.value?.firstName || 'User' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                <!--
                  KEY CHANGE:
                  - "View Profile" now correctly links to the Home page ('/').
                  - "Edit Profile" is added, linking to the correct editor page.
                -->
                <li><router-link class="dropdown-item" to="/" @click="collapseNavbar">View Profile</router-link></li>
                <li><router-link class="dropdown-item" to="/profile/edit" @click="collapseNavbar">Edit Profile</router-link></li>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { themeService } from '../services/themeService';
import ConfirmModal from './common/ConfirmModal.vue';
import ThemeToggle from './common/ThemeToggle.vue';

const router = useRouter();
const navbarToggler = ref(null);
const navbarNavCollapsible = ref(null);
const bsCollapse = ref(null);

onMounted(() => {
  const navbarCollapseEl = document.getElementById('navbarNav');
  if (navbarCollapseEl && window.bootstrap) {
    bsCollapse.value = new window.bootstrap.Collapse(navbarCollapseEl, {
      toggle: false,
    });
  }
});

onBeforeUnmount(() => {
  if (bsCollapse.value) {
    bsCollapse.value.dispose();
  }
});

const toggleNavbar = () => {
  if (bsCollapse.value) {
    bsCollapse.value.toggle();
  }
};

const collapseNavbar = () => {
  if (
    bsCollapse.value &&
    navbarNavCollapsible.value &&
    navbarNavCollapsible.value.classList.contains('show')
  ) {
    bsCollapse.value.hide();
  }
};

const isAdmin = computed(() => {
  return (
    authService.user.value &&
    authService.user.value.roles &&
    authService.user.value.roles.includes('ADMIN')
  );
});

const showLogoutConfirmModal = ref(false);
const logoutConfirmTitle = 'Confirm Logout';
const logoutConfirmMessage = 'Are you sure you want to logout?';

const requestLogoutConfirmation = () => {
  collapseNavbar();
  showLogoutConfirmModal.value = true;
};

const executeLogout = async () => {
  showLogoutConfirmModal.value = false;
  try {
    await authService.logout();
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

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
@media (max-width: 991.98px) {
  .navbar-nav .btn-primary {
    margin-top: 0.5rem;
    display: block;
    width: fit-content;
  }
  /* Updated: Target the new theme switch for better mobile layout */
  .navbar-nav .nav-item:has(.theme-switch) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
.vr {
  height: 25px;
}
</style>
