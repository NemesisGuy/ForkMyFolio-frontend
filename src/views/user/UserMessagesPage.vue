<template>
  <div class="user-messages-page py-5 animated-gradient-background">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">My Messages</h2>
        <!-- FEATURE: Toggle between Inbox and Archived views -->
        <div aria-label="Message view toggle" class="btn-group" role="group">
          <button :class="!showArchived ? 'btn-primary' : 'btn-outline-primary'" class="btn"
                  type="button"
                  @click="showArchived = false">Inbox
          </button>
          <button :class="showArchived ? 'btn-primary' : 'btn-outline-primary'" class="btn"
                  type="button"
                  @click="showArchived = true">Archived
          </button>
        </div>
      </div>

      <LoadingModal :visible="isLoading"/>

      <div v-if="error" class="alert alert-danger glass-card-dark animate-fade-in-up">
        <strong>Error:</strong> {{ error.message || 'Could not load your messages.' }}
      </div>

      <div v-else-if="!isLoading && messages.length > 0" class="card glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover glass-table mb-0">
              <thead>
              <tr>
                <th class="status-col"></th>
                <th>From</th>
                <th>Message Preview</th>
                <th>Priority</th>
                <th>Received</th>
                <th class="text-end">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="message in messages" :key="message.uuid"
                  :class="{ 'unread-message': !message.isRead, 'replied-message': message.isReplied }"
                  class="message-row"
                  @click="viewMessage(message)">
                <td class="status-col text-center">
                  <span v-if="!message.isRead" class="unread-dot" title="Unread"></span>
                </td>
                <td>
                  <div class="fw-bold">{{ message.name }}</div>
                  <small class="text-muted">{{ message.email }}</small>
                </td>
                <td class="message-preview">{{ message.message }}</td>
                <td>
                  <span :class="priorityClass(message.priority)" class="badge">
                    {{ message.priority }}
                  </span>
                </td>
                <td>{{ formatDateTime(message.createdAt) }}</td>
                <td class="text-end">
                  <div aria-label="Message Actions" class="btn-group" role="group">
                    <!-- TOGGLE READ/UNREAD -->
                    <button v-if="message.isRead" class="btn btn-sm btn-outline-secondary"
                            title="Mark as Unread" @click.stop="toggleReadStatus(message)"><i
                      class="bi bi-envelope-open-fill"></i></button>
                    <button v-else class="btn btn-sm btn-outline-success"
                            title="Mark as Read" @click.stop="toggleReadStatus(message)"><i
                      class="bi bi-envelope-fill"></i></button>

                    <!-- TOGGLE REPLIED -->
                    <button v-if="message.isReplied" class="btn btn-sm btn-outline-secondary"
                            title="Mark as Not Replied" @click.stop="toggleRepliedStatus(message)">
                      <i class="bi bi-check-circle-fill"></i></button>
                    <button v-else class="btn btn-sm btn-outline-info"
                            title="Mark as Replied" @click.stop="toggleRepliedStatus(message)"><i
                      class="bi bi-check-circle"></i></button>

                    <!-- PRIORITY DROPDOWN -->
                    <div class="btn-group" role="group">
                      <button aria-expanded="false"
                              class="btn btn-sm btn-outline-primary dropdown-toggle"
                              data-bs-toggle="dropdown" title="Set Priority" type="button"
                              @click.stop>
                        <i class="bi bi-flag-fill"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-dark">
                        <!-- BUG FIX: Added .stop to prevent event bubbling to the table row -->
                        <li><a class="dropdown-item" href="#"
                               @click.prevent.stop="changePriority(message, 'HIGH')">High</a></li>
                        <li><a class="dropdown-item" href="#"
                               @click.prevent.stop="changePriority(message, 'MEDIUM')">Medium</a>
                        </li>
                        <li><a class="dropdown-item" href="#"
                               @click.prevent.stop="changePriority(message, 'LOW')">Low</a></li>
                      </ul>
                    </div>

                    <!-- ARCHIVE/UNARCHIVE BUTTON -->
                    <button v-if="!message.isArchived" class="btn btn-sm btn-outline-warning"
                            title="Archive Message" @click.stop="archiveMessage(message, true)">
                      <i class="bi bi-archive-fill"></i>
                    </button>
                    <button v-else class="btn btn-sm btn-outline-info"
                            title="Move to Inbox" @click.stop="archiveMessage(message, false)">
                      <i class="bi bi-box-arrow-in-up"></i>
                    </button>

                    <!-- DELETE BUTTON -->
                    <button class="btn btn-sm btn-outline-danger"
                            title="Delete Message" @click.stop="confirmDelete(message)">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-archive-fill"></i>
        </div>
        <h4 class="glass-title">{{
            showArchived ? 'No Archived Messages' : 'Your Inbox is Empty'
          }}</h4>
        <p class="glass-subtitle">{{
            showArchived ? 'Messages you archive will appear here.' : 'Messages from your public contact form will appear here.'
          }}</p>
      </div>

      <!-- View Message Modal -->
      <div id="viewMessageModal" ref="viewModalRef" aria-hidden="true"
           aria-labelledby="viewMessageModalLabel" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 id="viewMessageModalLabel" class="modal-title">Message from:
                {{ selectedMessage?.name }}</h5>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal"
                      type="button"></button>
            </div>
            <div v-if="selectedMessage" class="modal-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Email:</strong>
                  <a :href="`mailto:${selectedMessage.email}`"
                     class="ms-2 text-decoration-underline">{{ selectedMessage.email }}</a>
                </div>
                <a :href="`mailto:${selectedMessage.email}`" class="btn btn-sm btn-primary">
                  <i class="bi bi-reply-fill me-2"></i>Reply
                </a>
              </div>
              <hr class="my-3">
              <p class="message-body-text">{{ selectedMessage.message }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <ConfirmModal
        :message="`Are you sure you want to delete the message from ${messageToDelete?.name}? This action cannot be undone.`"
        :visible="!!messageToDelete"
        title="Confirm Deletion"
        type="danger"
        @close="messageToDelete = null"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {
  deleteMyContactMessage,
  getMyContactMessages,
  updateMyContactMessage,
} from '@/services/api/user.api.js';
import {messageNotificationService} from '@/services/messageNotificationService.js';
import {notificationService} from '@/services/notificationService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import {Modal} from 'bootstrap';

const allMessages = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedMessage = ref(null);
const messageToDelete = ref(null);
const showArchived = ref(false); // State for the new toggle

// Computed property now filters based on the showArchived state
const messages = computed(() => allMessages.value.filter(m => m.isArchived === showArchived.value));

let viewModalInstance = null;
const viewModalRef = ref(null);

const mapMessage = (backendMessage) => {
  if (!backendMessage) return null;
  return {
    ...backendMessage,
    isRead: backendMessage.read,
    isReplied: backendMessage.replied,
    isArchived: backendMessage.archived,
  };
};

onMounted(async () => {
  try {
    const rawMessages = await getMyContactMessages() || [];
    allMessages.value = rawMessages.map(mapMessage);
  } catch (err) {
    console.error("Failed to fetch contact messages:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }

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

const priorityClass = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'text-bg-danger';
    case 'MEDIUM':
      return 'text-bg-warning';
    case 'LOW':
      return 'text-bg-info';
    default:
      return 'text-bg-secondary';
  }
};

const viewMessage = async (message) => {
  selectedMessage.value = message;
  viewModalInstance?.show();

  if (!message.isRead) {
    message.isRead = true;
    messageNotificationService.decrementUnreadCount();
    try {
      const updatedMessageFromServer = await updateMyContactMessage(message.uuid, {read: true});
      Object.assign(message, mapMessage(updatedMessageFromServer));
    } catch (err) {
      console.error("Failed to mark message as read:", err);
      message.isRead = false;
      messageNotificationService.incrementUnreadCount();
      notificationService.add({type: 'error', message: 'Could not update message status.'});
    }
  }
};

const toggleReadStatus = async (message) => {
  const originalState = {...message};
  const newStatus = !message.isRead;
  message.isRead = newStatus;

  try {
    const updatedMessageFromServer = await updateMyContactMessage(message.uuid, {read: newStatus});
    Object.assign(message, mapMessage(updatedMessageFromServer));

    if (newStatus) {
      messageNotificationService.decrementUnreadCount();
      notificationService.add({type: 'info', message: 'Message marked as read.'});
    } else {
      messageNotificationService.incrementUnreadCount();
      notificationService.add({type: 'info', message: 'Message marked as unread.'});
    }
  } catch (err) {
    Object.assign(message, originalState);
    notificationService.add({type: 'error', message: 'Could not update message status.'});
  }
};

const toggleRepliedStatus = async (message) => {
  const originalState = {...message};
  const newStatus = !message.isReplied;
  message.isReplied = newStatus;

  try {
    const updatedMessageFromServer = await updateMyContactMessage(message.uuid, {replied: newStatus});
    Object.assign(message, mapMessage(updatedMessageFromServer));
    notificationService.add({
      type: 'info',
      message: `Message marked as ${newStatus ? 'replied' : 'not replied'}.`
    });
  } catch (err) {
    Object.assign(message, originalState);
    notificationService.add({type: 'error', message: 'Could not update replied status.'});
  }
};

const changePriority = async (message, priority) => {
  const originalState = {...message};
  message.priority = priority;

  try {
    const updatedMessageFromServer = await updateMyContactMessage(message.uuid, {priority});
    Object.assign(message, mapMessage(updatedMessageFromServer));
    notificationService.add({type: 'info', message: `Priority set to ${priority}.`});
  } catch (err) {
    Object.assign(message, originalState);
    notificationService.add({type: 'error', message: 'Could not update priority.'});
  }
};

const archiveMessage = async (message, archive = true) => {
  const originalState = {...message};
  message.isArchived = archive; // Optimistic update removes it from the current view

  if (!originalState.isRead) {
    archive ? messageNotificationService.decrementUnreadCount() : messageNotificationService.incrementUnreadCount();
  }

  try {
    await updateMyContactMessage(message.uuid, {archived: archive});
    notificationService.add({
      type: 'success',
      message: `Message ${archive ? 'archived' : 'moved to inbox'}.`
    });
  } catch (err) {
    // Revert all changes on failure
    const messageInList = allMessages.value.find(m => m.uuid === message.uuid);
    if (messageInList) {
      Object.assign(messageInList, originalState);
    }
    if (!originalState.isRead) {
      archive ? messageNotificationService.incrementUnreadCount() : messageNotificationService.decrementUnreadCount();
    }
    notificationService.add({
      type: 'error',
      message: `Could not ${archive ? 'archive' : 'unarchive'} message.`
    });
  }
};


const confirmDelete = (message) => {
  messageToDelete.value = message;
};

const handleDelete = async () => {
  if (!messageToDelete.value) return;
  const messageToDeleteRef = messageToDelete.value;

  try {
    await deleteMyContactMessage(messageToDeleteRef.uuid);
    allMessages.value = allMessages.value.filter(m => m.uuid !== messageToDeleteRef.uuid);

    if (!messageToDeleteRef.isRead) {
      await messageNotificationService.fetchUnreadCount();
    }

    notificationService.add({
      message: `Message from '${messageToDeleteRef.name}' was deleted.`,
      type: 'success'
    });
  } catch (err) {
    notificationService.add({
      message: err.message || 'Could not delete the message.',
      type: 'error'
    });
  } finally {
    messageToDelete.value = null;
  }
};
</script>

<style scoped>
/* Styles remain the same */
.status-col {
  width: 30px;
}

.unread-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: var(--bs-primary);
  border-radius: 50%;
}

.unread-message {
  font-weight: bold;
  --bs-table-hover-bg: rgba(var(--bs-primary-rgb), 0.15);
}

.replied-message td:not(.text-end) {
  color: var(--glass-text-secondary) !important;
  opacity: 0.7;
}

.message-row {
  cursor: pointer;
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
  padding: 1rem;
}

.glass-table td, .glass-table th {
  border-color: var(--glass-border);
  vertical-align: middle;
  padding: 1rem;
}

.message-row {
  transition: all 0.2s ease-in-out;
}

.message-row:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 25px var(--glass-shadow);
  z-index: 2;
  position: relative;
}

.message-preview {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* --- FIXES FOR MODAL THEME --- */

.glass-modal {
  /* Use theme variables for background and text color */
  background-color: var(--glass-bg-modal);
  color: var(--glass-text);
  border: 1px solid var(--glass-border);
}

.glass-modal .modal-header,
.glass-modal .modal-footer {
  /* Ensure borders also use theme variables */
  border-color: var(--glass-border-hover);
}

/* FIX: Target only links that are NOT buttons to prevent color override */
.modal-body a:not(.btn) {
  color: var(--bs-primary);
  text-decoration: none;
}

.modal-body a:not(.btn):hover {
  text-decoration: underline;
}
</style>
