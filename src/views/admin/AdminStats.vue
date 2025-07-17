<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">Portfolio Dashboard</h1>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="stats && !isLoading">
      <!-- Engagement Metrics -->
      <h2 class="h5 mb-3">Site Engagement</h2>
      <div class="row">
        <StatCard title="Total Visits" :value="stats.totalVisits" icon="eye" />
        <StatCard title="Project Section Views" :value="stats.projectsSectionViews" icon="folder-open" />
        <StatCard title="Skills Section Views" :value="stats.skillsSectionViews" icon="cogs" />
        <StatCard title="Experience Section Views" :value="stats.experienceSectionViews" icon="briefcase" />
        <StatCard title="Qualifications Views" :value="stats.qualificationsSectionViews" icon="graduation-cap" />
        <StatCard title="Testimonials Views" :value="stats.testimonialsSectionViews" icon="comments" />
        <StatCard title="Contact Submissions" :value="stats.contactMessageSubmissions" icon="envelope" />
        <StatCard title="PDF Downloads" :value="stats.pdfDownloads" icon="file-pdf" />
      </div>

      <!-- Authentication Metrics -->
      <h2 class="h5 my-3">Authentication Events</h2>
      <div class="row">
        <StatCard title="Successful Logins" :value="stats.loginSuccesses" icon="sign-in-alt" />
        <StatCard title="Failed Logins" :value="stats.loginFailures" icon="exclamation-triangle" />
        <StatCard title="Successful Logouts" :value="stats.logoutSuccesses" icon="sign-out-alt" />
      </div>

      <!-- Project-specific Views -->
      <h2 class="h5 my-3">Individual Project Views</h2>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Project View Counts</h6>
        </div>
        <div class="card-body">
          <div v-if="projectViewStats.length > 0" class="table-responsive">
            <table class="table table-bordered" width="100%" cellspacing="0">
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
          <div v-else class="text-center">
            <p>No individual project views have been recorded yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAdminStats, getAdminProjects } from '@/services/api/admin.api'; // Import from unified file
import StatCard from '@/components/admin/StatCard.vue';

const stats = ref(null);
const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);

/**
 * Creates a computed property that merges project view counts from stats
 * with project names, and sorts them by the most viewed.
 */
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
    .sort((a, b) => b.views - a.views); // Sort by most views
});

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch stats and the list of all projects concurrently
    const [statsData, projectsData] = await Promise.all([
      getAdminStats(),
      getAdminProjects(), // Used to map project UUIDs to names
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