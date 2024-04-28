<script lang="ts" setup>
import { useSkins } from '~/@core/composable/useSkins'
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
      <slot />
    </div>
  </BaseAppLayout>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
