<template>
  <div class="qualifications-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-4 text-center mb-5" style="font-weight: 300;">Qualifications</h1>

          <LoadingSpinner v-if="isLoading" />

          <div v-else-if="error" class="alert alert-danger">
            Could not load qualifications data. Please try again later.
          </div>

          <div v-else-if="qualifications.length > 0">
            <div v-for="qual in qualifications" :key="qual.uuid" class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="card-title mb-1">{{ qual.qualificationName }}</h5>
                    <h6 class="card-subtitle text-muted">{{ qual.institutionName }}</h6>
                  </div>
                  <span class="badge bg-primary flex-shrink-0 ms-3">{{ qual.completionYear }}</span>
                </div>
                <p v-if="qual.grade" class="card-text mt-2 mb-0">
                  <small><strong>Grade:</strong> {{ qual.grade }}</small>
                </p>
              </div>
            </div>
          </div>

          <!-- Show an empty state if no qualifications exist -->
          <EmptyState
            v-else
            title="Qualifications Coming Soon"
            message="The owner is currently updating their degrees and certifications. Please check back later."
            icon-class="bi-patch-check-fill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublicQualifications, ApiError } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const qualifications = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await getPublicQualifications();
    // Sort by completion year, most recent first
    qualifications.value = data.sort((a, b) => b.completionYear - a.completionYear);
  } catch (err) {
    console.error("Failed to fetch qualifications data:", err);
    // Only show a user-facing error for critical failures, not for 404s
    if (!(err instanceof ApiError && err.httpStatus === 404)) {
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.card-title {
  color: var(--bs-primary);
}
</style>
