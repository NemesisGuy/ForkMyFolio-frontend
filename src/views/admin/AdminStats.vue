<template>
  <div class="admin-stats-page py-5 animated-gradient-background">
    <div class="container">
      <h2 class="mb-4 glass-text">Admin Dashboard</h2>
      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error" :message="error" :visible="true" @close="error = null"/>
      <div v-if="!isLoading && stats" class="row g-4">
        <!-- Total Users -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Total Users</h5>
              <p class="display-4">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>
        <!-- Total Projects -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Total Projects</h5>
              <p class="display-4">{{ totalProjects }}</p>
            </div>
          </div>
        </div>
        <!-- Total Logins (24h) -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Total Logins (24h)</h5>
              <p class="display-4">{{ stats.totalLoginsLast24Hours }}</p>
            </div>
          </div>
        </div>
        <!-- Total Public Portfolios -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Public Portfolios</h5>
              <p class="display-4">{{ stats.totalPublicPortfolios }}</p>
            </div>
          </div>
        </div>
        <!-- Total Private Portfolios -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Private Portfolios</h5>
              <p class="display-4">{{ stats.totalPrivatePortfolios }}</p>
            </div>
          </div>
        </div>
        <!-- Total Messages -->
        <div class="col-md-4">
          <div class="card glass-card text-center">
            <div class="card-body">
              <h5 class="card-title">Total Messages</h5>
              <p class="display-4">{{ stats.totalMessages }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
// FIX: Import the correctly named functions from the admin API file.
import {getAdminStats, getAdminProjects} from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const stats = ref(null);
const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);

const totalProjects = computed(() => projects.value.length);

onMounted(async () => {
  try {
    // Fetch stats and projects in parallel for faster loading
    const [statsData, projectsData] = await Promise.all([
      getAdminStats(),
      getAdminProjects()
    ]);
    stats.value = statsData;
    projects.value = projectsData;
  } catch (err) {
    error.value = err.message || 'Failed to load dashboard data.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.card-title {
  font-weight: 300;
  color: var(--glass-text-secondary);
}
.display-4 {
  font-weight: 600;
  color: var(--glass-text);
}
</style>