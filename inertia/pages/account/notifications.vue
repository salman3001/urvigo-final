<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import AccountLayout from '~/components/Views/Web/account/AccountLayout.vue'
// import AccountProfile from '~/components/Views/Web/account/AccountProfile.vue'
</script>

<template>
  <AccountLayout :active-tab="'Notifications'">
    <div>Notifications</div>
    <!-- <AccountProfile /> -->
  </AccountLayout>
</template>
