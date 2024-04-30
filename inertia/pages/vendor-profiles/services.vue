<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IUser } from '#models/user'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import type { IPaginatedModel } from '#helpers/types'
import type { IService } from '#models/service'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'
import VendorProfileServiceList from '~/components/Views/Web/vendor-profile/VendorProfileServiceList.vue'

defineProps<{
  vendor: IUser
  services: IPaginatedModel<IService>
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" :active-tab="'services'">
    <VendorProfileServiceList :services="services" />
  </VendorProfileLayout>
</template>
