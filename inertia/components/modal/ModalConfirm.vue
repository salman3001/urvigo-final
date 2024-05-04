<script setup lang="ts">
import { VBtn } from 'vuetify/components'

const isVisible = defineModel<boolean>('isVisible')

defineProps<{
  title: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'confirmed'): void
  (e: 'cancled'): void
}>()
</script>

<template>
  <VDialog max-width="500" v-model="isVisible">
    <VCard class="text-center py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="my-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium mb-4">
          {{ title }}
        </h6>

        <p>{{ message }}</p>
      </VCardText>

      <VCardText class="d-flex align-center justify-center gap-2">
        <VBtn variant="elevated" @click="$emit('confirmed')"> Confirm </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="
            () => {
              $emit('cancled')
              isVisible = false
            }
          "
        >
          Cancel
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
