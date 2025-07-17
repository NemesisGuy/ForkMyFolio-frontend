<template>
  <div class="col-xl-3 col-md-6 mb-4">
    <div class="card h-100">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col mr-2">
            <div class="text-xs font-weight-bold text-uppercase mb-1">{{ title }}</div>
            <div class="h5 mb-0 font-weight-bold text-gray-800">{{ value }}</div>
          </div>
          <div v-if="icon" class="col-auto">
            <i :class="`fas fa-${icon} fa-2x text-gray-300`"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: null }, // Font Awesome icon name
});
</script>