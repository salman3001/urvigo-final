<script lang="ts">
import Layout from '~/layouts/blank.vue'
import routes from '~/utils/routes';
import { Link } from '@inertiajs/vue3';
export default {
  layout: Layout,
}
</script>


<script setup lang="ts">
import pages401 from '~/assets/images/pages/401.png'
import miscMaskDark from '~/assets/images/pages/misc-mask-dark.png'
import miscMaskLight from '~/assets/images/pages/misc-mask-light.png'

import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import ErrorHeader from '~/components/ErrorHeader.vue';


const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader status-code="401" title="You are not authorized! 🔐"
      description="You don’t have permission to access this page. Go Home!." />

    <Link :href="routes('web.home')">
    <VBtn class="mb-11">
      Back to Home
    </VBtn>
    </Link>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="pages401" alt="not autorized" :max-height="$vuetify.display.smAndDown ? 350 : 500" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
