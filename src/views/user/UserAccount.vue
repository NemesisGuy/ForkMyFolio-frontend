<template>
  <!-- KEY CHANGE: Using global animated background class -->
  <div class="user-account-page py-5 animated-gradient-background">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <LoadingModal :visible="isLoading"/>
          <ErrorModal v-if="error" :visible="true" title="Error Loading Account" :message="error" @close="error = null" />

          <div v-if="!isLoading && user">
            <!-- KEY CHANGE: Added shimmering and interactive classes, and removed padding -->
            <div class="card glass-card shimmering p-0 animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
              <!-- KEY CHANGE: Added card-body for z-index fix and padding -->
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <!-- THIS IS THE FIX: Use the new computed property for the src -->
                  <img v-if="fullProfileImageUrl" :src="fullProfileImageUrl"
                       alt="Profile Picture" class="profile-image img-fluid rounded-circle shadow-lg">
                  <div v-else
                       class="profile-image-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-fill"></i>
                  </div>
                </div>

                <h1 class="card-title mb-4 text-center display-6">My Account</h1>

                <div class="account-details">
                  <div class="detail-item">
                    <strong>Name:</strong>
                    <span>{{ user.firstName }} {{ user.lastName }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Email:</strong>
                    <span>{{ user.email }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Roles:</strong>
                    <div>
                      <span v-for="role in user.roles" :key="role"
                            class="badge me-1">
                        {{ role }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-wrap justify-content-center mt-4 pt-4 border-top border-white border-opacity-10">
                  <!-- KEY CHANGE: Added interactive classes to buttons -->
                  <router-link class="btn btn-primary me-2 mb-2 interactive-lift interactive-shadow-primary" :to="{ name: 'admin-account' }">
                    <i class="bi bi-person-gear me-1"></i> Edit Account Details
                  </router-link>
                  <router-link class="btn btn-outline-secondary mb-2 interactive-lift" :to="{ name: 'admin-portfolio-profile' }">
                    <i class="bi bi-layout-text-sidebar-reverse me-1"></i> Edit Public Profile
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAccount } from '@/services/api/admin.api.js'; // Corrected import path
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);

/**
 * Creates a full, absolute URL for the profile image, resolving issues in production.
 * It checks if the URL from the backend is relative and, if so, prepends the
 * server's root URL derived from the VITE_API_BASE_URL environment variable.
 */
const fullProfileImageUrl = computed(() => {
  const imageUrl = user.value?.profileImageUrl;
  if (!imageUrl) {
    return null; // No image to process
  }

  // If the URL is already absolute (starts with http, https, or //), use it directly.
  if (/^(https?:\/\/|\/\/)/.test(imageUrl)) {
    return imageUrl;
  }

  // Otherwise, it's a relative path. We need to construct the full URL.
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error('VITE_API_BASE_URL is not defined in your .env file. Cannot construct full image URL.');
    return imageUrl; // Fallback to the original relative URL
  }

  try {
    // Create a URL object to safely extract the protocol and host (e.g., 'http://localhost:8080')
    const serverUrl = new URL(apiBaseUrl);
    const serverRoot = `${serverUrl.protocol}//${serverUrl.host}`;

    // Combine the server root with the relative image path, ensuring a single slash
    return `${serverRoot}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  } catch (e) {
    console.error('Invalid VITE_API_BASE_URL:', apiBaseUrl);
    return imageUrl; // Fallback on error
  }
});

onMounted(async () => {
  try {
    isLoading.value = true;
    user.value = await getAccount();
  } catch (err) {
    console.error("Failed to fetch user account data:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your account information.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* --- Page Styling --- */
.user-account-page {
  min-height: calc(100vh - 56px - 1px);
  overflow-x: hidden;
}

.user-account-page .display-6 {
  font-weight: 300;
}

/*
  KEY FIX: This ensures the card's content is clickable by lifting it
  above the decorative ::before pseudo-element.
*/
.card-body {
  position: relative;
  z-index: 1;
}

/* --- Animations --- */
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

/* --- Profile Image --- */
.profile-image,
.profile-image-placeholder {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid var(--bs-body-bg);
  transition: transform 0.3s ease;
}

.profile-image:hover,
.profile-image-placeholder:hover {
  transform: scale(1.05);
}

.profile-image-placeholder {
  background-color: var(--bs-tertiary-bg);
}

.profile-image-placeholder .bi {
  font-size: 5rem;
  color: var(--bs-secondary-color);
}

/* --- Account Details --- */
.account-details {
  max-width: 450px;
  margin: 0 auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item strong {
  color: var(--bs-emphasis-color);
}

.detail-item .badge {
  background-color: rgba(var(--bs-primary-rgb), 0.2) !important;
  color: var(--bs-primary) !important;
  font-weight: 500;
  padding: 0.4em 0.7em;
}
</style>
