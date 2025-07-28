<template>
  <nav :class="[
    'navbar',
    'navbar-expand-lg',
    'glass-nav', // This class provides the glassmorphic effect
    'sticky-top',
    currentTheme === 'dark' ? 'navbar-dark' : 'navbar-light' // For correct text/icon colors
  ]">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="../../assets/forkmyfolio_logo_icon.png" alt="ForkMyFolio Logo" width="45" height="45" class="d-inline-block align-text-top me-2 rounded-circle">
        ForkMyFolio
      </router-link>

      <button
        ref="navbarToggler"
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarNav" ref="navbarNavCollapsible" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <!-- This link now consistently points to the main homepage -->
            <router-link class="nav-link" active-class="active" to="/" @click="collapseNavbar">
              Home
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_PROJECTS')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/projects" @click="collapseNavbar">
              Projects
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_SKILLS')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/skills" @click="collapseNavbar">
              Skills
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_EXPERIENCE')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/experience" @click="collapseNavbar">
              Experience
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_TESTIMONIALS')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/testimonials" @click="collapseNavbar">
              Testimonials
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_QUALIFICATIONS')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/qualifications" @click="collapseNavbar">
              Qualifications
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('SHOW_CONTACT_FORM')" class="nav-item">
            <router-link class="nav-link" active-class="active" to="/contact" @click="collapseNavbar">
              Contact
            </router-link>
          </li>

          <li class="nav-item d-flex align-items-center ms-lg-2">
            <ThemeToggle/>
          </li>

          <li class="nav-item d-none d-lg-block mx-1">
            <div class="vr"></div>
          </li>

          <template v-if="authService.isAuthenticated.value">
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" active-class="active" to="/admin" @click="collapseNavbar">
                Admin
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a id="navbarUserDropdown" class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">
                <img v-if="authService.user.value?.profileImageUrl" :src="authService.user.value.profileImageUrl" alt="Avatar" class="navbar-avatar me-2">
                <i v-else class="bi bi-person-circle navbar-avatar-placeholder me-2"></i>
                {{ authService.user.value?.firstName || 'User' }}
              </a>
              <!-- The dropdown menu is now cleaner and links to the correct routes. -->
              <ul class="dropdown-menu dropdown-menu-end glass-dropdown" aria-labelledby="navbarUserDropdown">
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'dashboard' }" @click="collapseNavbar">
                    <i class="bi bi-grid-1x2-fill me-2"></i>My Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'profile' }" @click="collapseNavbar">
                    <i class="bi bi-person-badge-fill me-2"></i>My Profile
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'display-settings' }" @click="collapseNavbar">
                    <i class="bi bi-toggles me-2"></i>Display Settings
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'pdf-settings' }" @click="collapseNavbar">
                    <i class="bi bi-file-earmark-pdf-fill me-2"></i>PDF Settings
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="requestLogoutConfirmation">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/login" @click="collapseNavbar">
                Login
              </router-link>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService.js';
import { useTheme } from '@/services/themeService.js';
import { settingsService } from '@/services/settingsService.js';
import ConfirmModal from './modals/ConfirmModal.vue';
import ThemeToggle from './ThemeToggle.vue';

const { currentTheme } = useTheme();
const router = useRouter();

const navbarToggler = ref(null);
const navbarNavCollapsible = ref(null);

const collapseNavbar = () => {
  if (navbarNavCollapsible.value && navbarNavCollapsible.value.classList.contains('show')) {
    navbarToggler.value.click();
  }
};

// The dynamic homeLinkTarget computed property is no longer needed,
// as the "Home" link now always points to the root path "/".

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
    await router.push('/login');
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

.navbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.navbar-avatar-placeholder {
  font-size: 1.75rem; /* ~28px */
  line-height: 1;
  vertical-align: middle;
}

.dropdown-item i {
  width: 1.25em; /* Aligns text for items with and without icons */
}

@media (max-width: 991.98px) {
  .navbar-nav .btn-primary {
    margin-top: 0.5rem;
    display: block;
    width: fit-content;
  }

  .navbar-nav .nav-item:has(.theme-switch) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.vr {
  height: 25px;
}
</style>
