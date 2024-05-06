<script lang="ts" setup>
import { useSkins } from '~/@core/composable/useSkins'
import WebFooter from '~/components/Views/Web/WebFooter.vue'
import WebNavbar from '~/components/Views/Web/WebNavbar.vue'
import BaseAppLayout from './components/BaseAppLayout.vue'
import useInjectToast from '~/composables/useInjectToast'

const { injectSkinClasses } = useSkins()

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()

useInjectToast()
</script>

<template>
  <BaseAppLayout>
    <div class="layout-wrapper layout-blank">
      <WebNavbar />
      <div class="main-wrapper">
        <slot />
      </div>
      <WebFooter />
    </div>
  </BaseAppLayout>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
  gap: 3rem;
}

.main-wrapper {
  min-height: 90vh;
}
</style>
