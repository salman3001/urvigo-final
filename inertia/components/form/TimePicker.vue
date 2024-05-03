<script setup lang="ts">
import { ref } from 'vue'
import { VMenu } from 'vuetify/components'
import { VTimePicker } from 'vuetify/labs/components'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
defineProps<{
  min?: string
  max?: string
  format?: 'ampm' | '24hr'
}>()

const model = defineModel<string>({ required: true })
const menu = ref(false)
</script>

<template>
  <AppTextField v-model="model" :active="menu" :focus="menu" prepend-icon="tabler-alarm" readonly>
    <VMenu
      v-model="menu"
      :close-on-content-click="false"
      activator="parent"
      transition="scale-transition"
    >
      <VTimePicker
        v-if="menu"
        v-model="model"
        full-width
        :min="min"
        :max="max"
        :format="format"
      ></VTimePicker>
    </VMenu>
  </AppTextField>
</template>
