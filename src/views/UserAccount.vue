<template>
  <div class="user-account-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <LoadingModal :visible="isLoading"/>
          <ErrorModal v-if="error" :visible="true" title="Error Loading Account" :message="error" @close="error = null" />

          <div v-if="!isLoading && user">
            <!-- KEY CHANGE: Added animation and glass-card class -->
            <div class="card glass-card p-4 p-md-5 animate-fade-in-up">

              <div class="text-center mb-4">
                <img v-if="user.profileImageUrl" :src="user.profileImageUrl"
                     alt="Profile Picture" class="profile-image img-fluid rounded-circle shadow-lg">
                <div v-else
                     class="profile-image-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center">
                  <i class="bi bi-person-fill"></i>
                </div>
              </div>

              <h1 class="card-title mb-4 text-center display-6">My Account</h1>

              <!-- KEY CHANGE: Wrapper for details with improved styling -->
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
                <router-link class="btn btn-primary me-2 mb-2" to="/admin/account">
                  <i class="bi bi-person-gear me-1"></i> Edit Account Details
                </router-link>
                <router-link class="btn btn-outline-secondary mb-2" to="/admin/portfolio-profile">
                  <i class="bi bi-layout-text-sidebar-reverse me-1"></i> Edit Public Profile
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getAccount } from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);

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
  /* KEY CHANGE: Removed flex properties that caused vertical centering */
}

.user-account-page .display-6 {
  font-weight: 300;
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

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

/* --- Buttons --- */
.btn {
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: var(--glass-card-hover-transform);
  box-shadow: var(--glass-card-hover-box-shadow);
}

.btn-outline-secondary:hover {
  transform: var(--glass-card-hover-transform);
}
</style>
