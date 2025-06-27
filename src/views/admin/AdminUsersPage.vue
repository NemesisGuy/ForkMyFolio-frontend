<template>
  <div class="admin-users-page py-4">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5">Manage Users</h1>
        <!-- Placeholder for future "Add User" button if needed -->
        <!-- <button class="btn btn-success">Add New User</button> -->
      </div>
      <p class="lead mb-4">View and manage user accounts in the system.</p>

      <div v-if="isLoading" class="loading-spinner-container">
        <LoadingSpinner />
      </div>

      <div v-else-if="usersList && usersList.length > 0" class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Roles</th>
              <th scope="col" style="min-width: 120px;">Joined At</th>
              <th scope="col" style="min-width: 180px;" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersList" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span v-for="role in user.roles" :key="role" class="badge me-1" :class="getRoleBadgeClass(role)">
                  {{ role }}
                </span>
              </td>
              <td>{{ user.createdAt ? formatDate(user.createdAt) : 'N/A' }}</td>
              <td class="text-end table-actions">
                <button class="btn btn-sm btn-outline-secondary" disabled>
                  <i class="bi bi-pencil-square"></i> Edit Roles
                </button>
                <button class="btn btn-sm btn-outline-warning" disabled>
                  <i class="bi bi-person-slash"></i> Deactivate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!isLoading && !showErrorModal" class="alert alert-info text-center" role="alert">
        <h4 class="alert-heading">No Users Found</h4>
        <p>There are currently no users in the system.</p>
      </div>

      <ErrorModal
        v-if="error"
        :visible="showErrorModal"
        :title="error.title"
        :message="error.message"
        @close="closeErrorModal"
      />
      <!-- Other modals for actions like Confirm/Success can be added later -->
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/admin/AdminUsersPage.vue
 * @description Admin page for managing all user accounts.
 */
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router'; // For navigation if actions are added
import { getAllUsers, ApiError } from '../../services/apiService';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import ErrorModal from '../../components/common/ErrorModal.vue';
// import ConfirmModal from '../../components/common/ConfirmModal.vue'; // For future actions like deactivate
// import SuccessModal from '../../components/common/SuccessModal.vue'; // For feedback on actions
import { formatDate } from '../../utils'; // If needed for dates like 'createdAt'

// const router = useRouter(); // Uncomment if needed

// --- Reactive State ---
/** @type {import('vue').Ref<Array<object>>} List of all UserDto. */
const usersList = ref([]);
/** @type {import('vue').Ref<boolean>} Loading state for fetching users. */
const isLoading = ref(true);

// Error Modal State
/** @type {import('vue').Ref<{title: string, message: string|string[]}|null>} Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

// State for other modals (e.g., confirm, success for actions) can be added later

// --- Modal Control Methods ---
/** Closes the error modal. */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

// --- Lifecycle Hooks & Fetch Logic ---
/**
 * Fetches all users from the API.
 */
const fetchAllUsers = async () => {
  isLoading.value = true;
  error.value = null;
  showErrorModal.value = false;
  try {
    const usersData = await getAllUsers();
    usersList.value = usersData || [];
  } catch (err) {
    console.error("Failed to load users:", err);
    let errorMessage = "Could not fetch users. Please try again later.";
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0];
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Failed to Load Users',
      message: errorMessage,
    };
    showErrorModal.value = true;
    usersList.value = []; // Clear users list on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllUsers();
});

// --- Utility Functions for Display ---
/**
 * Determines the Bootstrap badge class based on user role.
 * @param {string} role - The user role (e.g., 'USER', 'ADMIN').
 * @returns {string} The Bootstrap background color class.
 */
const getRoleBadgeClass = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-primary';
    case 'USER':
      return 'bg-secondary';
    default:
      return 'bg-light text-dark';
  }
};

// --- Action Handlers (To be implemented for future actions like edit roles, deactivate) ---

</script>

<style scoped>
.admin-users-page h1, .admin-users-page .display-5 {
  font-weight: 300;
}
.table-actions .btn {
  margin-right: 0.5rem;
}
.table-actions .btn:last-child {
  margin-right: 0;
}
.loading-spinner-container {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* More styles for table responsiveness if needed */
</style>
