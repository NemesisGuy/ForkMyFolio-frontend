<template>
  <div class="user-account-edit-page py-5 animated-gradient-background">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <LoadingModal :visible="isLoading"/>
          <SuccessModal :visible="showSuccess" title="Success" message="Your account details have been updated." @close="closeSuccessModal" />
          <ErrorModal v-if="error" :visible="true" title="Update Failed" :message="error" @close="error = null" />

          <div v-if="!isLoading && accountData" class="card glass-card p-0 animate-fade-in-up">
            <div class="card-body p-4 p-md-5">
              <h1 class="card-title mb-4 text-center display-6">Edit Account Details</h1>
              <form @submit.prevent="handleSave">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" v-model="accountData.firstName" required>
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" v-model="accountData.lastName" required>
                  </div>
                  <!-- CORRECTED: Added profileImageUrl field to match the DTO -->
                  <div class="col-12">
                    <label for="profileImageUrl" class="form-label">Profile Image URL</label>
                    <input type="url" class="form-control" id="profileImageUrl" v-model="accountData.profileImageUrl" placeholder="https://example.com/path/to/image.jpg">
                    <div class="form-text">Provide a direct URL to your profile picture. This is not a file upload.</div>
                  </div>
                </div>

                <div class="d-flex justify-content-end mt-4 pt-4 border-top border-white border-opacity-10">
                  <button type="button" class="btn btn-outline-secondary me-2" @click="cancel">Cancel</button>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getMyAccount, updateMyAccount } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const accountData = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const showSuccess = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const data = await getMyAccount();
    accountData.value = reactive({ ...data });
  } catch (err) {
    console.error("Failed to fetch user account data:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    // The DTO expects firstName, lastName, and profileImageUrl.
    // We create a payload to ensure we only send the fields the backend expects.
    const payload = {
      firstName: accountData.value.firstName,
      lastName: accountData.value.lastName,
      profileImageUrl: accountData.value.profileImageUrl,
    };
    await updateMyAccount(payload);
    showSuccess.value = true;
  } catch (err) {
    console.error("Failed to update account:", err);
    error.value = err.message || 'Could not save your changes.';
  } finally {
    isSaving.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccess.value = false;
  router.push({ name: 'profile', params: { slug: props.slug } });
};

const cancel = () => {
  router.push({ name: 'profile', params: { slug: props.slug } });
};
</script>

<style scoped>
.user-account-edit-page .display-6 {
  font-weight: 300;
}
</style>
