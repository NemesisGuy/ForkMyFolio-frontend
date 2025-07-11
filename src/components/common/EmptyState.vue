<template>
  <div class="empty-state-container text-center py-5">
    <div class="py-5">
      <i v-if="iconClass" :class="iconClasses"></i>
      <h2 class="display-6">{{ title }}</h2>
      <p class="lead text-muted">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  /**
   * The main title to display.
   */
  title: {
    type: String,
    required: true,
    default: 'Nothing to see here yet!'
  },
  /**
   * The descriptive message below the title.
   */
  message: {
    type: String,
    required: true,
    default: 'Please check back later.'
  },
  /**
   * The Bootstrap Icon class to use (e.g., 'bi-person-workspace').
   */
  iconClass: {
    type: String,
    required: false,
    default: ''
  }
});

// Computes the full list of classes for the icon element
const iconClasses = computed(() => {
  return `${props.iconClass} display-1 text-muted mb-3`;
});
</script>

<style scoped>
.empty-state-container h2 {
  font-weight: 300;
}
</style>
