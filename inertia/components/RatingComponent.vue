<script setup lang="ts">
import { VRating } from 'vuetify/components'

defineProps<{
  size?: 'x-small' | 'small' | 'x-small' | 'large' | 'x-large'
  rating: number | string
}>()
</script>
<template>
  <VRating readonly density="compact" class="me-3" :size="size" :model-value="rating" />
</template>
