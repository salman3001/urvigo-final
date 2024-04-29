<script lang="ts">
import Layout from '~/layouts/default.vue'
export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import CheckoutConfirmation from '~/components/Views/Web/checkout/CheckoutConfirmation.vue'
import type WebBookingsController from '../../../../app/controllers/web/web_bookings_controller'
import type { Prop } from '../../../../app/helpers/types'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'

defineProps<{
  summary: Awaited<Prop<WebBookingsController['summary']>['summary']>
}>()
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <CheckoutLayout :step="3">
      <CheckoutConfirmation :summary="summary" />
    </CheckoutLayout>
  </VContainer>

  <br />
  <br />
  <br />
</template>
