<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
// import WebHomeTopServices from '~/components/Views/Web/home/web-home-top-services.vue'
// defineProps<{
//   topServices: IPaginatedModel<Service[]>
//   categories: ServiceCategory[]
// }>()
</script>

<template>
  <div class="landing-page-wrapper">
    <!-- 👉 Hero Section  -->
    <WebHomeHeroSection ref="refHome" />

    <!-- top services -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <WebHomeTopServices :topServices="topServices.data" /> -->
    </div>

    <!-- 👉 Startup as Vendor  -->
    <!-- <WebHomeBanner /> -->

    <!-- 👉 Vendor features  -->

    <!-- <WebHomeFeatures ref="refFeatures" /> -->

    <!-- 👉 Customer Review -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <CustomersReview /> -->
    </div>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <WebHomeOurTeam ref="refTeam" /> -->
    </div>

    <!-- 👉 Pricing Plans -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
            <PricingPlans />
        </div> -->

    <!-- 👉 FAQ Section -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <WebHomeFaqSection ref="refFaq" /> -->
    </div>

    <!-- 👉 Contact Us  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <!-- <WebHomeContactUs ref="refContact" /> -->
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
