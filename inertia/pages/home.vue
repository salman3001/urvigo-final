<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

defineProps()
</script>

<template>
  <Head title="Homepage" />

  <div class="container">
    <div class="title">AdonisJS 6 x Inertia x Vue.js</div>

    <span>
      Learn more about AdonisJS and Inertia.js by visiting the
      <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
      <VBtn color="primary">salman</VBtn>
    </span>
  </div>
</template>
