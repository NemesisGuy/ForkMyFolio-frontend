<template>
  <div class="form-check form-switch" title="Toggle Visibility">
    <input
      :checked="visible"
      :disabled="isLoading"
      class="form-check-input"
      role="switch"
      type="checkbox"
      @change.stop="$emit('toggle')"
    >
    <label v-if="isLoading" class="form-check-label">
      <span aria-hidden="true" class="spinner-border spinner-border-sm" role="status"></span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggle']);
</script>

<style scoped>
.form-check-input {
  cursor: pointer;
}
</style>