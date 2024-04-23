<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import type { IPaginatedModel } from '#helpers/types'
import type Service from '#models/service'
import type User from '#models/user'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'
import VendorProfileServiceList from '~/components/Views/Web/vendor-profile/VendorProfileServiceList.vue'

defineProps<{
  vendor: User
  services: IPaginatedModel<Service>
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" :active-tab="'services'">
    <VendorProfileServiceList :services="services" />
  </VendorProfileLayout>
</template>
