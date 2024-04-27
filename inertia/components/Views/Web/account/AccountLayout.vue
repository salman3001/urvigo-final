<script lang="ts" setup>
import { Link } from '@inertiajs/vue3'
import { VTabs } from 'vuetify/components'
import routes from '~/utils/routes'

defineProps<{
  activeTab: 'Account' | 'Security' | 'Notifications' | 'Wishlist' | 'Settings'
}>()

// tabs
const tabs = [
  { title: 'Account', icon: 'tabler-users', tab: 'profile', href: routes('web.account.profile') },
  { title: 'Security', icon: 'tabler-lock', tab: 'security', href: routes('web.account.security') },
  {
    title: 'Notifications',
    icon: 'tabler-bell',
    tab: 'notification',
    href: routes('web.account.notifications'),
  },
  {
    title: 'Wishlist',
    icon: 'tabler-heart',
    tab: 'wishlist',
    href: routes('web.account.wishlist'),
  },
  { title: 'Settings', icon: 'tabler-settings', tab: 'settings', href: routes('web.account.settings') },
]
</script>

<template>
  <VContainer>
    <br />
    <br />
    <br />
    <br />
    <div>
      <VTabs :model-value="activeTab" class="v-tabs-pill">
        <Link v-for="item in tabs" :key="item.icon" :href="item.href">
        <VTab :value="item.title">
          <VIcon size="20" start :icon="item.icon" />
          {{ item.title }}
        </VTab>
        </Link>
      </VTabs>

      <ClientOnly>
        <VWindow :model-value="activeTab" class="mt-6 disable-tab-transition" :touch="false">
          <!-- Account -->
          <VWindowItem :model-value="activeTab">
            <slot />
          </VWindowItem>
        </VWindow>
      </ClientOnly>
    </div>
  </VContainer>
</template>
