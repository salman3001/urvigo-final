<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type User from '#models/user'
import AccountLayout from '~/components/Views/Web/account/AccountLayout.vue'
import AccountProfile from '~/components/Views/Web/account/AccountProfile.vue'

defineProps<{
  user: User
}>()
</script>

<template>
  <AccountLayout :active-tab="'Account'">
    <div>Profile</div>
    <AccountProfile :user="user" />
  </AccountLayout>
</template>
