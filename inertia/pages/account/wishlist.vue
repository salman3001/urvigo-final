<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type Wishlist from '#models/wishlist'
import AccountLayout from '~/components/Views/Web/account/AccountLayout.vue'
import AccountWishlist from '~/components/Views/Web/account/AccountWishlist.vue'

defineProps<{
  wishlist: Wishlist
}>()
</script>

<template>
  <AccountLayout :active-tab="'Wishlist'">
    <AccountWishlist :wishlist="wishlist" />
  </AccountLayout>
</template>
