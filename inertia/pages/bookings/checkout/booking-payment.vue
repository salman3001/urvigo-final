<script lang="ts">
import Layout from '~/layouts/default.vue'
export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import type WebBookingsController from '../../../../app/controllers/web/web_bookings_controller'
import type { Prop } from '../../../../app/helpers/types'
import routes from '~/utils/routes'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'
import CheckoutPayment from '~/components/Views/Web/checkout/CheckoutPayment.vue'

const props = defineProps<{
  summary: Awaited<Prop<WebBookingsController['summary']>['summary']>
}>()

const form = useForm({
  couponId: props.summary.bookingDetail.couponId,
  qty: props.summary.bookingDetail.qty,
  serviceVariantId: props.summary.bookingDetail.service_variant.id,
  paymentdetail: {
    paymentMode: 'online',
    paymentStatus: 'paid',
  },
})

const submit = async () => {
  form.post(routes('web.booking.create'))
}
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <CheckoutLayout :step="2">
      <CheckoutPayment :summary="summary" @paid="submit" />
    </CheckoutLayout>
  </VContainer>

  <br />
  <br />
  <br />
</template>
~/utils/routes-old
