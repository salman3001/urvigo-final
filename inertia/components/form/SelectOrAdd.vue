<script setup lang="ts">
import { ref } from 'vue'
import AppAutocomplete from '~/@core/components/app-form-elements/AppAutocomplete.vue'

const props = defineProps<{
  items: string[]
}>()
const model = defineModel<string[] | string>({ required: true })

const itemOptions = ref(props.items)
const search = ref('')

const update = (v: any) => {
  search.value = v
}

const addToOption = () => {
  itemOptions.value.push(search.value)
  // Array.isArray(model) ? model.push(search) : (model = search);
  search.value = ''
}
</script>

<template>
  <AppAutocomplete v-model="model" :items="itemOptions" @update:search="update">
    <template #no-data>
      <v-btn @click="addToOption"> Add Item: {{ search }}</v-btn>
    </template>
  </AppAutocomplete>
</template>
