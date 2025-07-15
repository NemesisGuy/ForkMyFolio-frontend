<template>
  <div class="admin-messages-page container-fluid p-4">
    <h1 class="h3 mb-4 text-body-emphasis">Contact Form Messages</h1>

    <LoadingSpinner v-if="isLoading"/>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <strong>Error:</strong> {{ error.message || 'Could not load contact messages.' }}
    </div>

    <div v-else-if="messages.length > 0" class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
            <tr>
              <th scope="col">From</th>
              <th scope="col">Subject</th>
              <th scope="col">Received</th>
              <th scope="col" class="text-end">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="message in messages" :key="message.uuid">
              <td>
                <div class="fw-bold">{{ message.name }}</div>
                <small class="text-muted">{{ message.email }}</small>
              </td>
              <td>{{ message.subject }}</td>
              <td>{{ formatDateTime(message.createdAt) }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" @click="viewMessage(message)">
                  <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(message)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-envelope-open display-3 text-muted"></i>
      <h2 class="mt-3">No Messages</h2>
      <p class="lead text-muted">Your inbox is currently empty.</p>
    </div>

    <!-- View Message Modal -->
    <div class="modal fade" id="viewMessageModal" tabindex="-1" aria-labelledby="viewMessageModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewMessageModalLabel">Message from: {{ selectedMessage?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedMessage">
            <p><strong>Email:</strong> {{ selectedMessage.email }}</p>
            <p><strong>Subject:</strong> {{ selectedMessage.subject }}</p>
            <hr>
            <p style="white-space: pre-wrap;">{{ selectedMessage.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmModalLabel">Confirm Deletion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedMessage">
            Are you sure you want to delete the message from <strong>{{ selectedMessage.name }}</strong>? This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="handleDelete">Delete Message</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getContactMessages, deleteContactMessage } from '@/services/api/admin.api.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { Modal } from 'bootstrap';

const messages = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedMessage = ref(null);

let viewModalInstance = null;
let deleteModalInstance = null;

onMounted(async () => {
  try {
    messages.value = await getContactMessages() || [];
  } catch (err) {
    console.error("Failed to fetch contact messages:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }

  viewModalInstance = new Modal(document.getElementById('viewMessageModal'));
  deleteModalInstance = new Modal(document.getElementById('deleteConfirmModal'));
});

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const viewMessage = (message) => {
  selectedMessage.value = message;
  viewModalInstance.show();
};

const confirmDelete = (message) => {
  selectedMessage.value = message;
  deleteModalInstance.show();
};

const handleDelete = async () => {
  if (!selectedMessage.value) return;

  try {
    await deleteContactMessage(selectedMessage.value.uuid);
    // Remove the message from the local array for immediate UI update
    messages.value = messages.value.filter(m => m.uuid !== selectedMessage.value.uuid);
    deleteModalInstance.hide();
  } catch (err) {
    console.error("Failed to delete message:", err);
    // You could add a toast notification here for better UX
    alert(`Error: ${err.message || 'Could not delete the message.'}`);
  }
};
</script>

<style scoped>
.table-hover tbody tr {
  cursor: default;
}
</style>
