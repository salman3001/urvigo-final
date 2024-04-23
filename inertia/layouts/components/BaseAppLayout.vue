<script setup lang="ts">
import { IPageProps } from '#helpers/types'
import { usePage } from '@inertiajs/vue3'
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import ScrollToTop from '~/@core/components/ScrollToTop.vue'
import initCore from '~/@core/initCore'
import { initConfigStore, useConfigStore } from '~/@core/stores/config'
import { hexToRgb } from '~/@layouts/utils'
import wishlistStore from '~/stores/wishlistStore'

const { global } = useTheme()
const wishlist = wishlistStore()
const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

onMounted(() => {
  if (user) {
    wishlist.fetchWishlist({})
  }
})
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <slot />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
