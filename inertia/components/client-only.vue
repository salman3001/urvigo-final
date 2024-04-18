<script setup lang="ts">
import { ref, onMounted, Suspense } from 'vue'
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <template v-if="isMounted">
    <Suspense>
      <slot />
    </Suspense>
  </template>
  <template v-else><slot name="placeholder" /></template>
</template>
