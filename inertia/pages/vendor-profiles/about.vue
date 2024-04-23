<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import type User from '#models/user'
import VendorProfileAbout from '~/components/Views/Web/vendor-profile/VendorProfileAbout.vue'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'

defineProps<{
  vendor: User
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" activeTab="profile">
    <VendorProfileAbout :vendor="vendor!" />
  </VendorProfileLayout>
</template>
