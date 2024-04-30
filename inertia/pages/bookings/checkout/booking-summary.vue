<script lang="ts">
import Layout from '~/layouts/default.vue'
import type { IWebBookingController } from '#controllers/web/web_bookings_controller'
import type { Prop } from '#helpers/types'
import { router } from '@inertiajs/vue3'
import ModalApplyCoupon from '~/components/modal/ModalApplyCoupon.vue'
import type { ICoupon } from '../../../../app/models/coupon'
import CheckoutCart from '~/components/Views/Web/checkout/CheckoutCart.vue'
import { watch } from 'vue'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'
import routes from '~/utils/routes'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{
  summary: Awaited<Prop<IWebBookingController['summary']>['summary']>
  couponList: ICoupon[]
  query: {
    serviceVariantId: number
    qty: number
    couponId: number
  }
}>()

const applyCouponModal = ref(false)
const queryRef = reactive({
  serviceVariantId: props.query.serviceVariantId,
  qty: props.query.qty || 1,
  couponId: props.query.couponId,
})

watch(queryRef, () => {
  router.reload({
    only: ['summary', 'query'],
    replace: true,
    data: queryRef,
  })
})
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <CheckoutLayout :step="0">
      <CheckoutCart
        :qty="queryRef.qty"
        :summary="summary!"
        @apply-coupon="
          () => {
            router.reload({
              only: ['couponList'],
            })
            applyCouponModal = true
          }
        "
        @increment-qty="queryRef.qty = Number(queryRef.qty) + 1"
        @decrement-qty="
          () => {
            if (Number(queryRef.qty) > 1) {
              queryRef.qty = Number(queryRef.qty) - 1
            }
          }
        "
        @next="router.visit(routes('web.booking.address'))"
      />
    </CheckoutLayout>
    <ModalApplyCoupon
      v-model:is-visible="applyCouponModal"
      :coupon-list="couponList"
      @apply="
        (couponId) => {
          queryRef.couponId = couponId
          applyCouponModal = false
        }
      "
    />
  </VContainer>

  <br />
  <br />
  <br />
</template>
~/utils/routes-old
