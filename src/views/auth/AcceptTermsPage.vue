<template>
  <div class="accept-terms-page py-5 animated-gradient-background">
    <div class="container text-center">
      <h1 class="text-white mb-3" style="font-weight: 600;">Welcome!</h1>
      <p class="text-white-50">
        Before you can proceed, please review and accept our terms of service.
      </p>
    </div>
    <TermsAgreementModal
      ref="termsModal"
      confirm-button-text="Agree & Continue"
      @confirm="handleTermsAccepted"
      @cancel="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TermsAgreementModal from '@/components/auth/TermsAgreementModal.vue';
import { authService } from '@/services/authService.js';
import { acceptMyTerms } from '@/services/api/user.api.js';
import { notificationService } from '@/services/notificationService.js';

const router = useRouter();
const termsModal = ref(null);

onMounted(() => {
  // Automatically show the modal when the page loads
  termsModal.value?.show();
});

const handleTermsAccepted = async () => {
  try {
    await acceptMyTerms();
    authService.termsHaveBeenAccepted(); // Update local state to prevent re-redirect

    // Let the router guard take over. It will now see that terms are accepted
    // and proceed to the next check (like the force password change).
    const userSlug = authService.user.value?.slug;
    router.push({ name: 'dashboard', params: { slug: userSlug } });

  } catch (err) {
    notificationService.add({
      type: 'error',
      message: err.message || 'Failed to save your agreement. Please try again.',
    });
  }
};

const handleLogout = async () => {
  await authService.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.accept-terms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>