<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref<null | HTMLFormElement>(null)
const emit = defineEmits<{
  (e: 'submit', resetForm: () => void, resetValidation: () => void): void
}>()

const resetForm = () => {
  formRef.value?.reset()
}

const resetValidations = () => {
  formRef.value?.resetValidation()
}

const submit = async () => {
  const { valid } = await formRef.value?.validate()
  console.log(formRef.value)
  if (valid) {
    emit('submit', resetForm, resetValidations)
  }
}
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submit">
    <slot :reset-form="resetForm" :reset-validations="resetValidations" />
  </VForm>
</template>
