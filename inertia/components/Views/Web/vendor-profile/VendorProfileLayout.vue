<script setup lang="ts">
import type User from '#models/user'
import { Link } from '@inertiajs/vue3'
import VendorProfileHeader from './VendorProfileHeader.vue'
import routes from '~/utils/routes'
import { VTabs } from 'vuetify/components'

defineProps<{
  vendor: User
  activeTab: 'profile' | 'services' | 'reviews'
}>()
</script>

<template>
  <div v-if="vendor">
    <VendorProfileHeader :profile-header-data="vendor" />

    <v-container>
      <VTabs :model-value="activeTab" class="v-tabs-pill my-2">
        <Link :href="routes('web.vendor-profile.about', [vendor.id])">
          <VTab value="profile">
            <VIcon size="20" start icon="tabler-user-check" />
            Profile
          </VTab>
        </Link>
        <Link :href="routes('web.vendor-profile.services', [vendor.id])">
          <VTab value="services">
            <VIcon size="20" start icon="tabler-server" />
            Services
          </VTab>
        </Link>
        <Link :href="routes('web.vendor-profile.reviews', [vendor.id, vendor.id])">
          <VTab value="reviews">
            <VIcon size="20" start icon="tabler-device-desktop-star" />
            Reviews
          </VTab>
        </Link>
      </VTabs>

      <ClientOnly>
        <VWindow :model-value="activeTab" class="disable-tab-transition" :touch="false">
          <!-- Profile -->
          <VWindowItem :value="activeTab">
            <slot />
          </VWindowItem>
        </VWindow>
      </ClientOnly>
    </v-container>
    <br />
  </div>
</template>
