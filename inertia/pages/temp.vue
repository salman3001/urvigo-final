<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  file: null,
})

function submit() {
  form.post('/temp-post')
}
</script>

<template>
  <input type="file" name="file" @input="form.file = $event.target!.files[0]" />
  <button type="submit" @click="submit">submit</button>
</template>
