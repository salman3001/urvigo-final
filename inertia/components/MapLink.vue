<script setup lang="ts">
defineProps<{
  x: string | number
  y: string | number
}>()
</script>
<template>
  <a :href="`https://www.google.com/maps?q=${y},${x}`" target="_blank">
    <slot />
  </a>
</template>
