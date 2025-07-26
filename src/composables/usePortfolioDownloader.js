import {ref} from 'vue';
import {downloadPortfolioAsPdf} from '@/services/api/index.js';
import {settingsService} from '@/services/settingsService.js';

/**
 * @description A Vue Composable for handling portfolio PDF downloads.
 * Encapsulates all related state and logic for a clean, reusable implementation.
 * @param {import('vue').ComputedRef<string>} fullName - A computed ref containing the user's full name for the filename.
 * @returns {{
 *   isDownloadingPdf: import('vue').Ref<boolean>,
 *   showSuccessModal: import('vue').Ref<boolean>,
 *   successModalMessage: import('vue').Ref<string>,
 *   showErrorModal: import('vue').Ref<boolean>,
 *   errorModalMessage: import('vue').Ref<string>,
 *   handleDownloadPdf: () => Promise<void>
 * }}
 */
export function usePortfolioDownloader(fullName) {
  // --- Reactive State ---
  const isDownloadingPdf = ref(false);
  const showSuccessModal = ref(false);
  const successModalMessage = ref('');
  const showErrorModal = ref(false);
  const errorModalMessage = ref('');

  // --- Handler Function ---
  const handleDownloadPdf = async () => {
    const templateName = settingsService.settings.value['DEFAULT_PDF_TEMPLATE'];

    if (!templateName) {
      errorModalMessage.value = 'A default PDF template has not been configured by the site owner.';
      showErrorModal.value = true;
      return;
    }

    isDownloadingPdf.value = true;
    try {
      const pdfBlob = await downloadPortfolioAsPdf(templateName);

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const userName = fullName.value ? fullName.value.replace(/\s/g, '') : 'Portfolio';
      const today = new Date().toISOString().slice(0, 10);
      a.download = `${userName}-Resume-${today}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.requestAnimationFrame(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });

      successModalMessage.value = 'Your portfolio PDF has started downloading.';
      showSuccessModal.value = true;

    } catch (err) {
      console.error("Failed to download portfolio PDF:", err);
      errorModalMessage.value = err.message || 'An unknown error occurred while preparing the download. Please try again.';
      showErrorModal.value = true;
    } finally {
      isDownloadingPdf.value = false;
    }
  };

  // --- Expose state and methods ---
  return {
    isDownloadingPdf,
    showSuccessModal,
    successModalMessage,
    showErrorModal,
    errorModalMessage,
    handleDownloadPdf,
  };
}
