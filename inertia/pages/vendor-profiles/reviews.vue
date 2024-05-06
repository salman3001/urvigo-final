<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IUser } from '#models/user'

export default {
  layout: Layout,
}
</script>

<script lang="ts" setup>
import type { IPaginatedModel } from '#helpers/types'
import type { IReview } from '#models/review'
import VendorProfileLayout from '~/components/Views/Web/vendor-profile/VendorProfileLayout.vue'
import VendorProfileReviews from '~/components/Views/Web/vendor-profile/VendorProfileReviews.vue'

defineProps<{
  vendor: IUser
  reviews: IPaginatedModel<IReview>
}>()
</script>

<template>
  <VendorProfileLayout :vendor="vendor" :active-tab="'reviews'">
    <VendorProfileReviews
      :reviews="reviews"
      :avg_rating="(vendor?.businessProfile?.avgRating as unknown as number) || 0"
      :vendor-id="vendor.id"
      :reviews_count="(vendor.businessProfile as any)?.meta?.reviews_count"
    />
  </VendorProfileLayout>
</template>
