<script setup lang="ts">
import type { IService } from '#models/service'
import { Link } from '@inertiajs/vue3'
import ServiceCard from '~/components/ServiceCard.vue'
import routes from '~/utils/routes'

defineProps<{
  topServices: IService[]
}>()
</script>

<template>
  <VContainer id="features" class="py-10">
    <div class="headers d-flex justify-center flex-column align-center">
      <VChip label color="primary" class="mb-4" size="small">Top Services </VChip>

      <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
        <div class="position-relative me-2">
          <div class="section-title">Explore excellence</div>
        </div>
      </h4>

      <p class="text-center text-body-1 mb-1">Discover Our Permier Selction of Services</p>
      <Link :href="routes('web.services')"><VBtn>View All Services</VBtn></Link>
    </div>
    <br />
    <br />
    <div v-if="topServices">
      <VRow class="">
        <VCol v-for="s in topServices" :key="s" cols="12" md="6" lg="3">
          <ServiceCard :service="s" />
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>
