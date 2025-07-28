<template>
  <div class="admin-users-page py-5 animated-gradient-background">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-5 mb-1">User Management</h1>
          <p class="lead text-muted mb-0">View and manage all users in the system.</p>
        </div>
        <button class="btn btn-primary interactive-lift">
          <i class="bi bi-plus-circle-fill me-2"></i>Add User
        </button>
      </div>

      <LoadingModal :visible="isLoading" />

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!isLoading && users.length > 0" class="card glass-card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover glass-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Slug</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Actions</th>
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
                <td>
                    <span :class="['badge', user.active ? 'bg-success' : 'bg-danger']">
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else-if="!isLoading" class="text-center p-5 glass-card">
        <p>No users found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAdminUsers } from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    users.value = await getAdminUsers();
  } catch (err) {
    console.error("Failed to fetch users:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.glass-table {
  color: var(--glass-text);
  --bs-table-hover-color: var(--glass-text);
  --bs-table-hover-bg: var(--glass-bg-hover);
}
.glass-table thead th {
  background-color: rgba(var(--bs-body-color-rgb), 0.05);
  border-bottom: 2px solid var(--glass-border-hover);
  color: var(--glass-text);
}
.glass-table td, .glass-table th {
  border-color: var(--glass-border);
  vertical-align: middle;
}
.badge {
  text-transform: capitalize;
}
</style>
