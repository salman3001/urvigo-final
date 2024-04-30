<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IUser } from '#models/user'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import AccountLayout from '~/components/Views/Web/account/AccountLayout.vue'
import AccountProfile from '~/components/Views/Web/account/AccountProfile.vue'

defineProps<{
  user: IUser
}>()
</script>

<template>
  <AccountLayout :active-tab="'Account'">
    <AccountProfile :user="user" />
  </AccountLayout>
</template>
