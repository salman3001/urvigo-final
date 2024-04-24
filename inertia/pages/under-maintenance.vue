<script lang="ts">
import Layout from '~/layouts/blank.vue'
import routes from '~/utils/routes'
export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import miscUnderMaintenance from '@images/pages/misc-under-maintenance.png'
import { Link } from '@inertiajs/vue3'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

</script>

<template>
  <div class="misc-wrapper">
    <div class="text-center mb-15">
      <!-- 👉 Title and subtitle -->
      <h4 class="text-h4 font-weight-medium mb-2">
        Under Maintenance! 🚧
      </h4>
      <p class="text-body-1 mb-6">
        Sorry for the inconvenience but we're performing some maintenance at the moment
      </p>

      <Link :href="routes('web.home')">
      <VBtn class="mb-11">
        Back to Home
      </VBtn>
      </Link>
    </div>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="miscUnderMaintenance" alt="Under Maintenance" :max-width="550" :min-height="300" class="mx-auto" />
    </div>

    <img class="misc-footer-img d-none d-md-block" :src="authThemeMask" alt="misc-footer-img" height="320">
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/misc.scss";
</style>
