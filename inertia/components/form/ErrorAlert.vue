<script setup lang="ts">
defineProps<{
  errors?: Record<any, any>
}>()
</script>

<template>
  <VAlert variant="tonal" color="error" v-if="errors">
    <ul>
      <li v-for="(value, key) in errors" :key="key" class="normalcase">{{ key }} -- {{ value }}</li>
    </ul>
  </VAlert>
</template>
