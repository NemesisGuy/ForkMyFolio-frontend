<template>
  <div class="data-exports-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5 animate-fade-in-up">
        <h2 class="display-5 glass-text">Data & Exports</h2>
        <p class="lead glass-subtitle" style="animation-delay: 0.1s;">
          Download your portfolio in various formats.
        </p>
      </div>

      <!-- Modals for feedback -->
      <SuccessModal :visible="showSuccessModal" title="Download Started" :message="successModalMessage" @close="showSuccessModal = false" />
      <ErrorModal :visible="showErrorModal" title="Download Failed" :message="errorModalMessage" @close="showErrorModal = false" />

      <div class="row g-4 justify-content-center">
        <!-- PDF Card -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-file-earmark-pdf-fill display-4 text-danger"></i></div>
              <h5 class="card-title glass-title">PDF Portfolio</h5>
              <p class="card-text glass-subtitle small flex-grow-1">A professional, print-ready PDF version of your portfolio.</p>
              <button class="btn btn-danger mt-auto interactive-lift" @click="handleDownloadPdf" :disabled="isDownloadingPdf">
                <span v-if="isDownloadingPdf" class="spinner-border spinner-border-sm me-2"></span>
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <!-- Markdown Card -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-markdown-fill display-4 text-info"></i></div>
              <h5 class="card-title glass-title">Markdown File</h5>
              <p class="card-text glass-subtitle small flex-grow-1">A plain-text Markdown file, perfect for version control or static site generators.</p>
              <button class="btn btn-info mt-auto interactive-lift" @click="handleDownloadMd" :disabled="isDownloadingMd">
                <span v-if="isDownloadingMd" class="spinner-border spinner-border-sm me-2"></span>
                Download .md
              </button>
            </div>
          </div>
        </div>

        <!-- vCard Card -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.4s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column text-center p-4">
              <div class="mb-3"><i class="bi bi-person-vcard-fill display-4 text-success"></i></div>
              <h5 class="card-title glass-title">vCard Contact</h5>
              <p class="card-text glass-subtitle small flex-grow-1">A standard vCard (.vcf) file that can be easily imported into contact applications.</p>
              <button class="btn btn-success mt-auto interactive-lift" @click="handleDownloadVcf" :disabled="isDownloadingVcf">
                <span v-if="isDownloadingVcf" class="spinner-border spinner-border-sm me-2"></span>
                Download .vcf
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { authService } from '@/services/authService.js';
import { downloadPublicPortfolioBySlug, downloadMarkdownBySlug, downloadVCardBySlug } from '@/services/api';
import { triggerDownload, getFilenameFromResponse } from '@/utils/downloadUtils';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const currentSlug = computed(() => authService.user.value?.slug);

// State for modals
const showSuccessModal = ref(false);
const successModalMessage = ref('');
const showErrorModal = ref(false);
const errorModalMessage = ref('');

// Individual loading states for each button
const isDownloadingPdf = ref(false);
const isDownloadingMd = ref(false);
const isDownloadingVcf = ref(false);

const createDownloadHandler = (downloadFunc, fileType, extension) => async () => {
  if (!currentSlug.value) return;

  const loadingRef = fileType === 'pdf' ? isDownloadingPdf : (fileType === 'md' ? isDownloadingMd : isDownloadingVcf);
  loadingRef.value = true;

  try {
    const response = await downloadFunc(currentSlug.value);
    const blob = await response.blob();
    const filename = getFilenameFromResponse(response, `${currentSlug.value}-portfolio.${extension}`);
    triggerDownload(blob, filename);
    successModalMessage.value = `${fileType.toUpperCase()} download has started.`;
    showSuccessModal.value = true;
  } catch (err) {
    console.error(`${fileType} download failed:`, err);
    errorModalMessage.value = err.message || `An unexpected error occurred while downloading the ${fileType.toUpperCase()} file.`;
    showErrorModal.value = true;
  } finally {
    loadingRef.value = false;
  }
};

const handleDownloadPdf = createDownloadHandler(downloadPublicPortfolioBySlug, 'pdf', 'pdf');
const handleDownloadMd = createDownloadHandler(downloadMarkdownBySlug, 'md', 'md');
const handleDownloadVcf = createDownloadHandler(downloadVCardBySlug, 'vcf', 'vcf');
</script>

<style scoped>
.data-exports-page .display-5 {
  font-weight: 300;
}
.card-title i {
  vertical-align: -0.125em;
}
</style>
