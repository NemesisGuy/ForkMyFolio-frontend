<template>
  <div class="admin-users-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <div>
          <h1 class="display-5 mb-1 glass-text">User Management</h1>
          <p class="lead glass-subtitle mb-0">View, create, edit, and manage all system users.</p>
        </div>
        <router-link :to="{ name: 'admin-user-create' }" class="btn btn-primary interactive-lift">
          <i class="bi bi-plus-circle-fill me-2"></i>Add New User
        </router-link>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the user '${userToDelete?.firstName} ${userToDelete?.lastName}' (ID: ${userToDelete?.id})? This action cannot be undone.`"
        :visible="!!userToDelete"
        title="Confirm Deletion"
        type="danger"
        @close="userToDelete = null"
        @confirm="handleDelete"
      />

      <!-- User List Table -->
      <div v-if="!isLoading && users.length > 0" class="card glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover glass-table mb-0">
              <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Slug</th>
                <th>Roles</th>
                <th class="text-center">Status</th>
                <th class="text-end">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>/{{ user.slug }}</td>
                <td>
                    <span v-for="role in user.roles" :key="role" class="badge bg-primary me-1">
                      {{ role.replace('ROLE_', '') }}
                    </span>
                </td>
                <td class="text-center">
                    <span :class="['badge', user.active ? 'bg-success' : 'bg-danger']">
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-2" title="Edit User"
                          @click="editUser(user.id)">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Delete User"
                          @click="confirmDelete(user)">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-people"></i>
        </div>
        <h4 class="glass-title">No Users Found</h4>
        <p class="glass-subtitle">There are currently no other users in the system.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {deleteAdminUser, getAdminUsers} from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';

const router = useRouter();
const users = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const userToDelete = ref(null);

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    users.value = await getAdminUsers();
  } catch (err) {
    console.error("Failed to fetch users:", err);
    error.value = err.message || 'An unexpected error occurred while fetching users.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUsers);

const editUser = (userId) => {
  // --- DIAGNOSTIC LOG ---
  // Log the ID and its type the moment the button is clicked.
  console.log(`[AdminUsersPage] Edit button clicked. Attempting to navigate with user ID: ${userId} (Type: ${typeof userId})`);
  if (!userId && userId !== 0) { // Robust check for null/undefined, but allows ID 0.
    console.error("[AdminUsersPage] NAVIGATION BLOCKED: The provided user ID is invalid.", userId);
    error.value = "Could not open the edit page because the user's ID is missing. Please refresh and try again.";
    return;
  }
  router.push({name: 'admin-user-edit', params: {id: userId}});
};

const confirmDelete = (user) => {
  userToDelete.value = user;
};

const handleDelete = async () => {
  if (!userToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await deleteAdminUser(userToDelete.value.id);
    successMessage.value = `User '${userToDelete.value.firstName} ${userToDelete.value.lastName}' has been deleted.`;
    await fetchUsers(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete user:", err);
    error.value = err.message || 'An error occurred during deletion.';
  } finally {
    isLoading.value = false;
    userToDelete.value = null;
  }
};
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

.badge {
  text-transform: capitalize;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}
</style>
