import {ref} from 'vue';

// This is a self-contained reactive state module, following your project's service pattern.
const notifications = ref([]);

/**
 * Adds a new notification to the list.
 * @param {object} notification - The notification object.
 * @param {string} notification.message - The message to display.
 * @param {string} [notification.type='info'] - The type of notification ('success', 'error', 'info', 'warning').
 * @param {number} [notification.duration=5000] - Duration in ms before auto-closing.
 */
const add = ({message, type = 'info', duration = 5000}) => {
  const id = Date.now() + Math.random();
  notifications.value.push({id, message, type});

  // Automatically remove the notification after the duration
  setTimeout(() => {
    remove(id);
  }, duration);
};

/**
 * Removes a notification from the list by its ID.
 * @param {number} id - The ID of the notification to remove.
 */
const remove = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

// Export the service as a single object, consistent with your architecture.
export const notificationService = {
  notifications,
  add,
  remove,
};
