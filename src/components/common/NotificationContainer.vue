<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <TransitionGroup name="toast-fade">
      <div
        v-for="notification in notificationService.notifications"
        :key="notification.id"
        :class="toastClass(notification.type)"
        aria-atomic="true"
        aria-live="assertive"
        class="toast show"
        role="alert"
      >
        <div class="toast-header">
          <i :class="['me-2', iconClass(notification.type)]"></i>
          <strong class="me-auto">{{ title(notification.type) }}</strong>
          <button
            aria-label="Close"
            class="btn-close"
            type="button"
            @click="notificationService.remove(notification.id)"
          ></button>
        </div>
        <div class="toast-body">
          {{ notification.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import {notificationService} from '@/services/notificationService.js';

const toastClass = (type) => {
  switch (type) {
    case 'success':
      return 'text-bg-success';
    case 'error':
      return 'text-bg-danger';
    case 'warning':
      return 'text-bg-warning';
    default:
      return 'text-bg-info';
  }
};

const iconClass = (type) => {
  switch (type) {
    case 'success':
      return 'bi bi-check-circle-fill';
    case 'error':
      return 'bi bi-exclamation-triangle-fill';
    case 'warning':
      return 'bi bi-exclamation-triangle-fill';
    default:
      return 'bi bi-info-circle-fill';
  }
};

const title = (type) => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    default:
      return 'Information';
  }
};
</script>

<style scoped>
.toast-container {
  z-index: 2000; /* Ensure it's above modals */
  pointer-events: none; /* THIS IS THE FIX: The container is now click-through. */
}

.toast {
  pointer-events: auto; /* THIS IS THE FIX: The toasts inside are clickable again. */
  transition: all 0.5s ease;
  border: none;
}

.toast-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Vue Transition styles */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
