<script setup lang="ts">
import { IPaginatedModel } from '#helpers/types'
import Service from '#models/service'
import ServiceCategory from '#models/service_category'
import WebHomeBanner from '~/components/Views/Web/home/web-home-banner.vue'
import WebHomeContactUs from '~/components/Views/Web/home/web-home-contact-us.vue'
import WebHomeCustomersReview from '~/components/Views/Web/home/web-home-customers-review.vue'
import WebHomeFaqSection from '~/components/Views/Web/home/web-home-faq-section.vue'
import WebHomeFeatures from '~/components/Views/Web/home/web-home-features.vue'
import WebHomeHeroSection from '~/components/Views/Web/home/web-home-hero-section.vue'
import WebHomeOurTeam from '~/components/Views/Web/home/web-home-our-team.vue'
import WebHomePricingPlans from '~/components/Views/Web/home/web-home-pricing-plans.vue'
import WebHomeTopServices from '~/components/Views/Web/home/web-home-top-services.vue'

defineProps<{
  topServices: IPaginatedModel<Service[]>
}>()
</script>

<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<template>
  <div class="landing-page-wrapper">
    <!-- 👉 Hero Section  -->
    <WebHomeHeroSection ref="refHome" />

    <!-- top services -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomeTopServices :topServices="topServices?.data" />
    </div>

    <!-- 👉 Startup as Vendor  -->
    <WebHomeBanner />

    <!-- 👉 Vendor features  -->

    <WebHomeFeatures ref="refFeatures" />

    <!-- 👉 Customer Review -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomeCustomersReview />
    </div>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomeOurTeam ref="refTeam" />
    </div>

    <!-- 👉 Pricing Plans -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomePricingPlans />
    </div>

    <!-- 👉 FAQ Section -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomeFaqSection ref="refFaq" />
    </div>

    <!-- 👉 Contact Us  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <WebHomeContactUs ref="refContact" />
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
