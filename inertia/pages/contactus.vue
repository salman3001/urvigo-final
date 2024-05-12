<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>
<script setup lang="ts">
import webHomeContactUs from '~/components/Views/Web/home/web-home-contact-us.vue'
</script>

<template>
  <div class="landing-page-wrapper">
    <!-- 👉 Contact Us  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <webHomeContactUs ref="refContact" />
    </div>
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
