<template>
  <!-- THIS IS THE FIX: The component is now a full-fledged, animated glass card -->
  <div class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
    <div class="card-body text-center p-5">
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
    // A prop with a default value is not required.
    default: 'Nothing to see here yet!'
  },
  /**
   * The descriptive message below the title.
   */
  message: {
    type: String,
    // A prop with a default value is not required.
    default: 'Please check back later.'
  },
  /**
   * The Bootstrap Icon class to use (e.g., 'bi-person-workspace').
   */
  iconClass: {
    type: String,
    default: ''
  }
});

// Computes the full list of classes for the icon element
const iconClasses = computed(() => {
  return `${props.iconClass} display-1 text-muted mb-3`;
});
</script>

<style scoped>
/*
  THIS IS THE FIX: Lifts the card's content above the shimmering
  pseudo-element, making it fully visible.
*/
.card-body {
  position: relative;
  z-index: 1;
}

h2 {
  font-weight: 300;
}

/* THIS IS THE FIX: Adds the fade-in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}
</style>
