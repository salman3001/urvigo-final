<script setup lang="ts">
import { isEmptyObject } from '~/@core/utils/helpers'

defineProps<{
  errors: Record<any, any>
}>()
</script>

<template>
  <VAlert v-if="!isEmptyObject(errors)" variant="tonal" color="error">
    <ul>
      <li v-for="(value, key) in errors" :key="key" class="normalcase">{{ key }} -- {{ value }}</li>
    </ul>
  </VAlert>
</template>
