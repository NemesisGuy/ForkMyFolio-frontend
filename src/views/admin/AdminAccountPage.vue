<template>
  <div class="admin-account-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-5 mb-4">Manage Account</h1>

          <LoadingModal :visible="isLoading" />
          <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message"
                      @close="closeErrorModal" />

          <div v-if="!isLoading" class="card shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="handleSave">
                <h5 class="mb-3">Account Details</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" v-model="formState.firstName" required>
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" v-model="formState.lastName" required>
                  </div>
                  <div class="col-12">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" v-model="formState.email" required>
                    <div class="form-text">This is the email you use to log in.</div>
                  </div>
                </div>

                <hr class="my-4">
                <p class="text-muted small">Note: Password changes should be handled through a separate, dedicated
                  "Change Password" feature for security.</p>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isSaving ? 'Saving...' : 'Save Account Details' }}
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
import { ref, reactive, onMounted } from 'vue';
import { getAccount, updateAccount, ApiError } from '@/services/api';
import { authService } from '@/services/authService';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);

const formState = reactive({
  firstName: '',
  lastName: '',
  email: ''
});

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

onMounted(async () => {
  try {
    const accountData = await getAccount();
    if (accountData) {
      Object.assign(formState, accountData);
    }
  } catch (err) {
    console.error("Failed to fetch account data:", err);
    error.value = { title: 'Failed to Load Data', message: err.message || 'Could not load your account data.' };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    const updateData = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email
    };
    const updatedUser = await updateAccount(updateData);

    // --- KEY CHANGE: Update the authService's reactive user object correctly ---
    // This will reflect the new name/email everywhere in the UI immediately.
    authService.user.value = updatedUser;
    // --- END KEY CHANGE ---

    // Optionally, show a success toast/message here
  } catch (err) {
    console.error("Failed to update account:", err);
    error.value = { title: 'Save Failed', message: err.message || 'Could not save your account details.' };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.admin-account-page h1, .admin-account-page h5 {
  font-weight: 300;
}
</style>
