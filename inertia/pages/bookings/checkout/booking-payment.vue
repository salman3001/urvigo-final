<script lang="ts">
import Layout from '~/layouts/default.vue'
import { PaymentMode, PaymentStatus } from '#helpers/enums'
import { useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type { BookingSummary } from '#helpers/types'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'
import CheckoutPayment from '~/components/Views/Web/checkout/CheckoutPayment.vue'

const props = defineProps<{
  summary: BookingSummary
}>()

const form = useForm({
  couponId: props.summary?.bookingDetail?.couponId,
  qty: props.summary?.bookingDetail?.qty,
  serviceVariantId: props.summary?.bookingDetail?.service_variant.id,
  addressDetail: {
    address: props.summary?.addressDetail?.address,
    mapAddress: props.summary?.addressDetail?.mapAddress,
    mobile: props.summary?.addressDetail?.mobile,
    geoLocation: props.summary?.addressDetail?.geoLocation,
  },
  deliveryType: props.summary?.deliveryType,
  paymentDetail: {
    paymentMode: PaymentMode.ONLINE,
    paymentStatus: PaymentStatus.PAID,
  },
  timeslot: props?.summary?.bookingDetail?.service_variant?.service?.timeSlotPlan?.id
    ? {
        timeslotPlanId: props?.summary?.bookingDetail?.service_variant?.service?.timeSlotPlan?.id,
        from: props?.summary?.timeslot?.from,
        to: props?.summary?.timeslot?.to,
      }
    : null,
})

const submit = () => {
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
      {{ props?.summary?.timeslot?.from }}
      <CheckoutPayment :summary="summary" @paid="submit" />
    </CheckoutLayout>
  </VContainer>

  <br />
  <br />
  <br />
</template>
