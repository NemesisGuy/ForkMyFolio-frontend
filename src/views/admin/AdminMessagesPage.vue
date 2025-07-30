<template>
  <div class="admin-messages-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <div>
          <h1 class="display-5 mb-1 glass-text">All Contact Messages</h1>
          <p class="lead glass-subtitle mb-0">View and manage messages sent to all users.</p>
        </div>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading" />
      <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
      <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="successMessage = null" />
      <ConfirmModal
        :visible="!!messageToDelete"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the message from ${messageToDelete?.senderName}? This action cannot be undone.`"
        type="danger"
        @confirm="handleDelete"
        @close="messageToDelete = null"
      />

      <!-- Messages Table -->
      <div v-if="!isLoading && messages.length > 0" class="card glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover glass-table mb-0">
              <thead>
              <tr>
                <th>To User</th>
                <th>From</th>
                <th>Message Preview</th>
                <th>Received</th>
                <th class="text-end">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="message in messages" :key="message.uuid">
                <td>
                  <div class="fw-bold">{{ message.portfolioOwnerName }}</div>
                  <small class="text-muted">/{{ message.portfolioOwnerSlug }}</small>
                </td>
                <td>
                  <div class="fw-bold">{{ message.senderName }}</div>
                  <small class="text-muted">{{ message.senderEmail }}</small>
                </td>
                <td class="message-preview">{{ message.message }}</td>
                <td>{{ formatDateTime(message.createdAt) }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="viewMessage(message)" title="View Message">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(message)" title="Delete Message">
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
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-envelope-open-fill"></i>
        </div>
        <h4 class="glass-title">No Messages Yet</h4>
        <p class="glass-subtitle">There are currently no messages in the system.</p>
      </div>

      <!-- View Message Modal -->
      <div class="modal fade" id="viewMessageModal" tabindex="-1" aria-labelledby="viewMessageModalLabel" aria-hidden="true" ref="viewModalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="viewMessageModalLabel">Message from: {{ selectedMessage?.senderName }}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedMessage">
              <p><strong>To:</strong> {{ selectedMessage.portfolioOwnerName }}</p>
              <p><strong>From:</strong> {{ selectedMessage.senderName }} &lt;{{ selectedMessage.senderEmail }}&gt;</p>
              <hr>
              <p class="message-body-text">{{ selectedMessage.message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getContactMessages, deleteContactMessage } from '@/services/api/admin.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

const messages = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const selectedMessage = ref(null);
const messageToDelete = ref(null);

const viewModalRef = ref(null);
let viewModalInstance = null;

const fetchMessages = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    messages.value = await getContactMessages() || [];
  } catch (err) {
    console.error("Failed to fetch contact messages:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMessages();
  if (viewModalRef.value) {
    viewModalInstance = new Modal(viewModalRef.value);
  }
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
  viewModalInstance?.show();
};

const confirmDelete = (message) => {
  messageToDelete.value = message;
};

const handleDelete = async () => {
  if (!messageToDelete.value) return;
  isLoading.value = true;
  try {
    await deleteContactMessage(messageToDelete.value.uuid);
    successMessage.value = 'Message deleted successfully.';
    await fetchMessages(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete message:", err);
    error.value = err.message || 'Could not delete the message.';
  } finally {
    isLoading.value = false;
    messageToDelete.value = null;
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
.message-preview {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--glass-text-secondary);
}
.message-body-text {
  white-space: pre-wrap;
  font-size: 1.1rem;
  line-height: 1.6;
}
.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}
</style>
