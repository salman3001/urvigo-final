<script lang="ts">
import Layout from '~/layouts/blank.vue'
export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import misc404 from '~/assets/images/pages/404.png'
import miscMaskDark from '~/assets/images/pages/misc-mask-dark.png'
import miscMaskLight from '~/assets/images/pages/misc-mask-light.png'
import ErrorHeader from '~/components/ErrorHeader.vue';
import routes from '~/utils/routes';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader status-code="404" title="Page Not Found ⚠️"
      description="We couldn't find the page you are looking for." />

    <Link :href="routes('web.home')">
    <VBtn class="mb-11">
      Back to Home
    </VBtn>
    </Link>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="misc404" alt="error 404" :max-height="$vuetify.display.smAndDown ? 350 : 500" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
