<template>
  <div class="admin-stats-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5 animate-fade-in-up">
        <h1 class="display-5 fw-light glass-text">Application Statistics</h1>
        <p class="lead glass-subtitle" style="animation-delay: 0.1s;">
          An overview of site engagement and user activity.
        </p>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>

      <!-- Main Content -->
      <div v-if="stats && !isLoading" class="animate-fade-in-up" style="animation-delay: 0.2s;">
        <!-- Engagement Metrics -->
        <h2 class="h4 mb-3 glass-text">Site Engagement</h2>
        <div class="row g-4">
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.totalVisits" icon="bi-eye-fill" title="Total Visits"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.projectsSectionViews" icon="bi-folder2-open"
                      title="Project Section Views"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.skillsSectionViews" icon="bi-tools"
                      title="Skills Section Views"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.experienceSectionViews" icon="bi-briefcase-fill"
                      title="Experience Section Views"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.qualificationsSectionViews" icon="bi-patch-check-fill"
                      title="Qualifications Views"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.testimonialsSectionViews" icon="bi-chat-quote-fill"
                      title="Testimonials Views"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.contactMessageSubmissions" icon="bi-envelope-fill"
                      title="Contact Submissions"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.pdfDownloads" icon="bi-file-earmark-pdf-fill"
                      title="PDF Downloads"/>
          </div>
        </div>

        <!-- Authentication Metrics -->
        <h2 class="h4 my-4 pt-3 glass-text">Authentication Events</h2>
        <div class="row g-4">
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.loginSuccesses" icon="bi-box-arrow-in-right"
                      title="Successful Logins"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.loginFailures" icon="bi-exclamation-triangle-fill"
                      title="Failed Logins"/>
          </div>
          <div class="col-xl-3 col-md-6">
            <StatCard :value="stats.logoutSuccesses" icon="bi-box-arrow-left"
                      title="Successful Logouts"/>
          </div>
        </div>

        <!-- Project-specific Views -->
        <h2 class="h4 my-4 pt-3 glass-text">Individual Project Views</h2>
        <div class="card glass-card">
          <div class="card-body p-0">
            <div v-if="projectViewStats.length > 0" class="table-responsive">
              <table class="table table-hover glass-table mb-0">
                <thead>
                <tr>
                  <th>Project Name</th>
                  <th class="text-center">Views</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="project in projectViewStats" :key="project.uuid">
                  <td>{{ project.name }}</td>
                  <td class="text-center">{{ project.views }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center p-4">
              <p class="glass-subtitle mb-0">No individual project views have been recorded yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {getAdminProjects, getAdminStats} from '@/services/api/admin.api.js';
import StatCard from '@/components/admin/StatCard.vue';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const stats = ref(null);
const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);

const projectViewStats = computed(() => {
  if (!stats.value || !stats.value.projects || !projects.value || projects.value.length === 0) {
    return [];
  }
  const projectMap = new Map(projects.value.map(p => [p.uuid, p.title]));
  return Object.entries(stats.value.projects)
    .map(([uuid, views]) => ({
      uuid,
      name: projectMap.get(uuid) || `Unknown Project (UUID: ${uuid.substring(0, 8)})`,
      views,
    }))
    .sort((a, b) => b.views - a.views);
});

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const [statsData, projectsData] = await Promise.all([
      getAdminStats(),
      getAdminProjects(),
    ]);

    stats.value = statsData;
    projects.value = projectsData;

  } catch (e) {
    console.error('Failed to load dashboard data:', e);
    error.value = e.message || 'An unexpected error occurred while fetching dashboard data.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.display-5 {
  font-weight: 300;
}

.glass-table {
  color: var(--glass-text);
  --bs-table-hover-color: var(--glass-text);
  --bs-table-hover-bg: var(--glass-bg-hover);
}

.glass-table thead th {
  background-color: rgba(var(--bs-body-color-rgb), 0.05);
  border-bottom: 2px solid var(--glass-border-hover);
  color: var(--glass-text);
  font-weight: 500;
}

.glass-table td, .glass-table th {
  border-color: var(--glass-border);
  vertical-align: middle;
}
</style>
