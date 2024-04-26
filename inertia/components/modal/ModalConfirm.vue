<script setup lang="ts">
import { VBtn } from 'vuetify/components';
import ModalBase from './ModalBase.vue'

const isVisible = defineModel<boolean>('isVisible')

defineProps<{
    title: string
    message: string
}>()

const emit = defineEmits<{
    (e: 'confirmed'): void
    (e: 'cancled'): void
}>()

</script>

<template>
    <ModalBase v-model:is-visible="isVisible" :title="title" :subtitle="message">
        <br>
        <div class="d-flex gap-2 justify-end">
            <VBtn variant="outline" @click="() => { $emit('cancled'); isVisible = false }">Cancle</VBtn>
            <VBtn @click="$emit('confirmed')">Confrim</VBtn>
        </div>
    </ModalBase>
</template>
