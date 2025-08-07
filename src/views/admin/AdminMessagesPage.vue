<template>
  <div class="admin-messages-page py-5 animated-gradient-background">
    <div class="container">
      <h2 class="mb-4 glass-text">All Contact Messages</h2>
      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error" :message="error" :visible="true" @close="error = null"/>
      <div v-if="!isLoading && messages.length > 0" class="card glass-card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover glass-table mb-0">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To User</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="message in messages" :key="message.uuid">
                  <td>{{ message.name }} <br> <small class="text-muted">{{ message.email }}</small></td>
                  <td>{{ message.user.firstName }} {{ message.user.lastName }} <br> <small class="text-muted">{{ message.user.slug }}</small></td>
                  <td class="message-preview">{{ message.message }}</td>
                  <td>{{ formatDateTime(message.createdAt) }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" @click="handleDelete(message)">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else-if="!isLoading" class="text-center p-5 glass-card">
        <h4 class="glass-title">No messages found.</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// FIX: Import the correctly named functions from the admin API file.
import { getAdminContactMessages, deleteAdminContactMessage } from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';

const messages = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // FIX: Call the correctly named function.
    messages.value = await getAdminContactMessages();
  } catch (err) {
    error.value = err.message || 'Failed to load messages.';
  } finally {
    isLoading.value = false;
  }
});

const handleDelete = async (message) => {
  if (!confirm(`Are you sure you want to delete the message from ${message.name}?`)) return;
  try {
    // FIX: Call the correctly named function.
    await deleteAdminContactMessage(message.uuid);
    messages.value = messages.value.filter(m => m.uuid !== message.uuid);
  } catch (err) {
    error.value = err.message || 'Failed to delete message.';
  }
};

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString();
};
</script>

<style scoped>
.message-preview {
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
}
.glass-table td, .glass-table th {
  border-color: var(--glass-border);
  vertical-align: middle;
}
</style>