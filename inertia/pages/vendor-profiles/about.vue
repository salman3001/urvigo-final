<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IUser } from '#models/user'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import VendorProfileAbout from '~/components/Views/Web/vendor-profile/VendorProfileAbout.vue'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'

defineProps<{
  vendor: IUser
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" activeTab="profile">
    <VendorProfileAbout :vendor="vendor!" />
  </VendorProfileLayout>
</template>
