<script setup lang="ts">
defineProps<{
  urls: string[]
  width?: number
}>()

defineEmits<{
  (e: 'emit'): void
}>()
</script>

<template>
  <div class="full-width">
    <div style="display: flex;gap:1rem;flex-wrap: wrap;align-items: center;">
      <div v-for="(u, i) in urls" :key="i" style="position: relative;">
        <VImg :width="width || 300" aspect-ratio="16/9" cover :src="u"></VImg>
        <IconBtn color="error" content="9+" @click="$emit('delete', i)"
          style="position: absolute;top: 1px ;right: 1px;">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </div>
      <slot />
    </div>

  </div>
</template>
