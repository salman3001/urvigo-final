<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  title: string
  message?: string
}>()
</script>
<template>
  <VDialog v-model="model" max-width="500">
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn
          icon
          variant="outlined"
          color="success"
          class="my-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none"
        >
          <VIcon icon="tabler-check" size="38" />
        </VBtn>

        <h1 class="text-h4 mb-4">
          {{ title }}
        </h1>

        <p>{{ message }}</p>

        <VBtn color="success" @click="model = false"> Ok </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
