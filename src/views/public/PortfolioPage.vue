<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="loading-container d-flex justify-content-center align-items-center vh-100">
    <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container py-5 text-center">
    <div class="alert alert-danger">
      <h2>{{ error.status === 404 ? 'Portfolio Not Found' : 'An Error Occurred' }}</h2>
      <p>{{ error.message }}</p>
      <router-link to="/" class="btn btn-primary">Go to Homepage</router-link>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else-if="portfolio" class="portfolio-page">
    <!-- These components are assumed to exist for displaying portfolio sections -->
    <PortfolioHero :user="portfolio.user" />

    <div class="container py-5">
      <div class="row g-5">
        <!-- Main Content Column -->
        <div class="col-lg-8">
          <PortfolioAbout v-if="portfolio.user.about" :about="portfolio.user.about" class="mb-5" />

          <!-- Conditionally render sections based on settings -->
          <PortfolioExperience
            v-if="settingsService.isEnabled.value('SHOW_EXPERIENCE') && portfolio.experiences?.length"
            :experiences="portfolio.experiences"
            class="mb-5"
          />
          <PortfolioEducation
            v-if="settingsService.isEnabled.value('SHOW_EDUCATION') && portfolio.qualifications?.length"
            :qualifications="portfolio.qualifications"
            class="mb-5"
          />
          <PortfolioProjects
            v-if="settingsService.isEnabled.value('SHOW_PROJECTS') && portfolio.projects?.length"
            :projects="portfolio.projects"
          />
        </div>

        <!-- Sidebar Column -->
        <div class="col-lg-4">
          <div class="sidebar-sticky">
            <PortfolioSkills
              v-if="settingsService.isEnabled.value('SHOW_SKILLS') && portfolio.skills?.length"
              :skills="portfolio.skills"
              class="mb-5"
            />
            <PortfolioTestimonials
              v-if="settingsService.isEnabled.value('SHOW_TESTIMONIALS') && portfolio.testimonials?.length"
              :testimonials="portfolio.testimonials"
              class="mb-5"
            />
            <PortfolioContact
              v-if="settingsService.isEnabled.value('SHOW_CONTACT_FORM')"
              :slug="slug"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { publicApi } from '@/services/api/public.api.js';
import { settingsService } from '@/services/settingsService.js';
import { ApiError } from '@/services/api/index.js';

// Assuming these sub-components exist to render the data
import PortfolioHero from '@/components/portfolio/PortfolioHero.vue';
import PortfolioAbout from '@/components/portfolio/PortfolioAbout.vue';
import PortfolioExperience from '@/components/portfolio/PortfolioExperience.vue';
import PortfolioEducation from '@/components/portfolio/PortfolioEducation.vue';
import PortfolioProjects from '@/components/portfolio/PortfolioProjects.vue';
import PortfolioSkills from '@/components/portfolio/PortfolioSkills.vue';
import PortfolioTestimonials from '@/components/portfolio/PortfolioTestimonials.vue';
import PortfolioContact from '@/components/portfolio/PortfolioContact.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const portfolio = ref(null);
const isLoading = ref(true);
const error = ref(null);

/**
 * Fetches all necessary data for the portfolio page, including the portfolio
 * content itself and the specific display settings for that user.
 * @param {string} slug - The user's public portfolio slug.
 */
const fetchPortfolioData = async (slug) => {
  isLoading.value = true;
  error.value = null;
  portfolio.value = null;

  try {
    // Settings are now initialized globally by the router guard.
    // We only need to fetch the portfolio content itself.
    const portfolioData = await publicApi.getPortfolioBySlug(slug);
    portfolio.value = portfolioData;
  } catch (err) {
    console.error(`Failed to fetch portfolio for slug "${slug}":`, err);
    if (err instanceof ApiError) {
      error.value = { status: err.status, message: err.message };
    } else {
      error.value = { status: 500, message: 'An unexpected error occurred.' };
    }
  } finally {
    isLoading.value = false;
  }
};

// Fetch data when the component is first mounted
onMounted(() => {
  fetchPortfolioData(props.slug);
});

// And watch for changes to the slug prop (e.g., navigating between portfolios)
watch(() => props.slug, (newSlug) => {
  if (newSlug) {
    fetchPortfolioData(newSlug);
  }
});
</script>

<style scoped>
.sidebar-sticky {
  position: sticky;
  top: 100px; /* Adjust based on your navbar's height */
}
</style>
