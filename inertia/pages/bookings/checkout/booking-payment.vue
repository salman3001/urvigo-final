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
import type { IWebBookingController } from '#controllers/web/web_bookings_controller'
import type { Prop } from '../../../../app/helpers/types'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'
import CheckoutPayment from '~/components/Views/Web/checkout/CheckoutPayment.vue'

const props = defineProps<{
  summary: Awaited<Prop<IWebBookingController['summary']>['summary']>
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
      <CheckoutPayment :summary="summary" @paid="submit" />
    </CheckoutLayout>
  </VContainer>

  <br />
  <br />
  <br />
</template>
