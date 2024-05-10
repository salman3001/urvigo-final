<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IUser } from '#models/user'
import VendorReviews from '~/components/VendorReviews.vue'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import type { IPaginatedModel } from '#helpers/types'
import type { IReview } from '#models/review'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'

defineProps<{
  vendor: IUser
  reviews: IPaginatedModel<IReview>
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" :active-tab="'reviews'">
    <VendorReviews :bussiness-profile-id="vendor?.businessProfile?.id" />
  </VendorProfileLayout>
</template>
