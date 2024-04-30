<script setup lang="ts">
import type { IWishlist } from '#models/wishlist'
import ServiceCard from '~/components/ServiceCard.vue'

defineProps<{
  wishlist: IWishlist
}>()
</script>

<template>
  <h2>My Wishist</h2>
  <br />
  <VRow>
    <VCol v-if="!wishlist" v-for="s in 10" cols="12" md="6" lg="3">
      <VSkeletonLoader type="card" />
    </VCol>
    <VCol v-else v-for="s in wishlist?.items" cols="12" md="6" lg="3">
      <ServiceCard :service="s" />
    </VCol>
  </VRow>
</template>
