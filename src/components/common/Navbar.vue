<template>
  <nav :class="[
    'navbar',
    'navbar-expand-lg',
    'glass-nav',
    'sticky-top',
    currentTheme === 'dark' ? 'navbar-dark' : 'navbar-light'
  ]">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img alt="ForkMyFolio Logo" class="d-inline-block align-text-top me-2 rounded-circle" height="45"
             src="../../assets/forkmyfolio_logo_icon.png" width="45">
        ForkMyFolio
      </router-link>

      <button
        ref="navbarToggler"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        class="navbar-toggler"
        data-bs-target="#navbarNav"
        data-bs-toggle="collapse"
        type="button"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarNav" ref="navbarNavCollapsible" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <router-link
              :class="{ 'active': isHomeActive }"
              :to="homeLinkTarget"
              class="nav-link"
              @click="collapseNavbar">
              Home
            </router-link>
          </li>
          <!-- Public portfolio links that appear based on the current context -->
          <li v-if="settingsService.isEnabled.value('portfolio.projects.show') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'projects-public', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Projects
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('portfolio.skills.show') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'skills-public', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Skills
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('portfolio.experience.show') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'experience-public', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Experience
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('portfolio.testimonials.show') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'testimonials-public', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Testimonials
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('portfolio.qualifications.show') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'qualifications-public', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Qualifications
            </router-link>
          </li>
          <li v-if="settingsService.isEnabled.value('portfolio.contact.enabled') && currentSlug"
              class="nav-item">
            <router-link :to="{ name: 'contact', params: { slug: currentSlug } }" active-class="active"
                         class="nav-link"
                         @click="collapseNavbar">
              Contact
            </router-link>
          </li>

          <li class="nav-item d-flex align-items-center ms-lg-2">
            <ThemeToggle/>
          </li>

          <li class="nav-item d-none d-lg-block mx-1">
            <div class="vr"></div>
          </li>

          <template v-if="authService.isAuthenticated.value && authService.user.value">
            <li v-if="isAdmin" class="nav-item">
              <router-link active-class="active" class="nav-link" to="/admin"
                           @click="handleUserMenuClick(authService.user.value.slug)">
                Admin
              </router-link>
            </li>

            <!-- NOTIFICATION ICON -->
            <li class="nav-item">
              <router-link
                :to="{ name: 'user-messages', params: { slug: authService.user.value.slug } }"
                class="nav-link position-relative" title="My Messages" @click="collapseNavbar">
                <i class="bi bi-bell-fill fs-5"></i>
                <!-- Badge now uses the live count from our new service -->
                <span v-if="unreadCount > 0"
                      class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ unreadCount }}
                  <span class="visually-hidden">unread messages</span>
                </span>
              </router-link>
            </li>
            <!-- END OF NOTIFICATION ICON -->

            <li class="nav-item dropdown">
              <a id="navbarUserDropdown" aria-expanded="false"
                 class="nav-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown"
                 href="#" role="button">
                <img v-if="authService.user.value?.profileImageUrl"
                     :src="authService.user.value.profileImageUrl" alt="Avatar"
                     class="navbar-avatar ms-2 me-2">
                <i v-else class="bi bi-person-circle navbar-avatar-placeholder ms-2 me-2"></i>
                {{ authService.user.value?.firstName || 'User' }}
              </a>
              <ul aria-labelledby="navbarUserDropdown"
                  class="dropdown-menu dropdown-menu-end glass-dropdown">
                <li>
                  <router-link :to="{ name: 'dashboard', params: { slug: authService.user.value.slug } }"
                               class="dropdown-item"
                               @click="handleUserMenuClick(authService.user.value.slug)">
                    <i class="bi bi-grid-1x2-fill me-2"></i>My Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'profile', params: { slug: authService.user.value.slug } }"
                               class="dropdown-item"
                               @click="handleUserMenuClick(authService.user.value.slug)">
                    <i class="bi bi-person-badge-fill me-2"></i>My Profile
                  </router-link>
                </li>
                <li v-if="authService.user.value?.slug">
                  <router-link :to="{ name: 'portfolio-home', params: { slug: authService.user.value.slug } }"
                               class="dropdown-item"
                               @click="handleUserMenuClick(authService.user.value.slug)">
                    <i class="bi bi-house-door-fill me-2"></i>My Public Page
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <router-link :to="{ name: 'display-settings', params: { slug: authService.user.value.slug } }"
                               class="dropdown-item"
                               @click="handleUserMenuClick(authService.user.value.slug)">
                    <i class="bi bi-toggles me-2"></i>Display Settings
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'pdf-settings', params: { slug: authService.user.value.slug } }"
                               class="dropdown-item"
                               @click="handleUserMenuClick(authService.user.value.slug)">
                    <i class="bi bi-file-earmark-pdf-fill me-2"></i>PDF Settings
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
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
              <router-link active-class="active" class="nav-link" to="/login"
                           @click="collapseNavbar">
                Login
              </router-link>
            </li>
            <li class="nav-item">
              <router-link active-class="active" class="nav-link" to="/register"
                           @click="collapseNavbar">
                Register
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <ConfirmModal
      :message="logoutConfirmMessage"
      :title="logoutConfirmTitle"
      :visible="showLogoutConfirmModal"
      cancelText="Cancel"
      confirmText="Logout"
      @cancel="cancelLogout"
      @close="cancelLogout"
      @confirm="executeLogout"
    />
  </nav>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {authService} from '@/services/authService.js';
import {useTheme} from '@/services/themeService.js';
import {settingsService} from '@/services/settingsService.js';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import ConfirmModal from './modals/ConfirmModal.vue';
import ThemeToggle from './ThemeToggle.vue';
// Import the new service to make it available
import {messageNotificationService} from '@/services/messageNotificationService.js';

// Use the reactive count from the service, replacing the placeholder
const {unreadCount} = messageNotificationService;

const {currentTheme} = useTheme();
const router = useRouter();
const route = useRoute();
const portfolioStore = usePublicPortfolioStore();
const {currentSlug, fetchPortfolio, clearPortfolio} = portfolioStore;

const navbarToggler = ref(null);
const navbarNavCollapsible = ref(null);

const collapseNavbar = () => {
  if (navbarNavCollapsible.value && navbarNavCollapsible.value.classList.contains('show')) {
    navbarToggler.value.click();
  }
};

const handleUserMenuClick = async (slug) => {
  if (slug) {
    await fetchPortfolio(slug);
  }
  collapseNavbar();
};

// This watcher is the single source of truth for the navigation bar's context.
// It watches both the URL slug and the authenticated user's state.
watch(
  [() => route.params.slug, () => authService.user.value],
  ([routeSlug, authUser]) => {
    // Determine the slug that should define the application's current context.
    // A slug in the URL always takes precedence.
    // If there's no URL slug, but a user is logged in, use their slug.
    const effectiveSlug = routeSlug || authUser?.slug;

    console.log(`[Navbar Context Watcher] Route Slug: ${routeSlug}, Auth User Slug: ${authUser?.slug}, Effective Slug: ${effectiveSlug}`);

    if (effectiveSlug) {
      // If we have a slug to work with, ensure the portfolio for that slug is loaded.
      // The store's internal logic prevents re-fetching if it's already the current context.
      fetchPortfolio(effectiveSlug);
    } else {
      // If there's no slug from the URL and no authenticated user,
      // we are in a public, non-user-specific context (e.g., landing page, /login).
      // We must clear any previous user's portfolio data.
      if (currentSlug.value) { // Only clear if there's something to clear
        console.log(`[Navbar] No effective slug. Clearing portfolio context.`);
        clearPortfolio();
        // Also reset settings to global defaults
        settingsService.initialize('default');
      }
    }
  },
  {
    immediate: true, // This is crucial for it to run on initial page load/refresh.
    deep: true,      // This ensures it reacts to changes within the user object.
  }
);

const homeLinkTarget = computed(() => {
  if (currentSlug.value) {
    return {name: 'portfolio-home', params: {slug: currentSlug.value}};
  }
  return {name: 'home'};
});

const isHomeActive = computed(() => {
  if (currentSlug.value) {
    return route.name === 'portfolio-home';
  }
  return route.name === 'home';
});

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

.nav-link .badge {
  font-size: 0.6em;
  padding: 0.35em 0.55em;
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
