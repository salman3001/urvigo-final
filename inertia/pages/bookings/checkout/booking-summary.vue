<script lang="ts">
import Layout from '~/layouts/default.vue'
import { InferPageProps, InferXPassedProps } from '@adonisjs/inertia/types'
import WebBookingsController from '#controllers/web/web_bookings_controller'
import { InferProp, AwaitedInfer } from '#helpers/types'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import customAddress from '~/assets/images/svg/address.svg'
import customCart from '~/assets/images/svg/cart.svg'
import customPayment from '~/assets/images/svg/payment.svg'
import customTrending from '~/assets/images/svg/trending.svg'
import { ref } from 'vue'

const applyCouponModal = ref(false)

const currentStep = ref(0)
const isActiveStepValid = ref(true)

defineProps<{
  summary: AwaitedInfer<InferProp<WebBookingsController['summary']>['summary']>
  meta: InferProp<WebBookingsController['summary']>['meta']
}>()

const checkoutSteps = [
  {
    title: 'Cart',
    icon: customCart,
  },
  {
    title: 'Address',
    icon: customAddress,
  },
  {
    title: 'Payment',
    icon: customPayment,
  },
  {
    title: 'Confirmation',
    icon: customTrending,
  },
]

const submit = async () => {
  bookingForm.couponId = form.couponId
  bookingForm.qty = form.qty as unknown as string
  bookingForm.serviceVariantId = route.params.variantId
  bookingForm.paymentdetail.paymentMode = 'online'
  bookingForm.paymentdetail.paymentStatus = 'paid'

  const res = await creatBooking()

  if (res?.success == true) {
    currentStep.value += 1
  }
}
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <VCard>
      <VCardText>
        {{ bookingSummary.bookingDetail }}
        <!-- 👉 Stepper -->
        <AppStepper
          v-model:current-step="currentStep"
          class="checkout-stepper"
          :items="checkoutSteps"
          :direction="$vuetify.display.mdAndUp ? 'horizontal' : 'vertical'"
          :is-active-step-valid="isActiveStepValid"
          align="center"
        />
      </VCardText>

      <VDivider />

      <VCardText>
        <!-- 👉 stepper content -->
        <VWindow v-model="currentStep" class="disable-tab-transition" :touch="false">
          <VWindowItem>
            <ViewsWebCheckoutCart
              v-model:qty="form.qty"
              v-model:step="currentStep"
              :summary="summary!"
              @apply-coupon="() => (applyCouponModal = true)"
            />
          </VWindowItem>

          <VWindowItem>
            <ViewsWebCheckoutAddress :summary="summary!" v-model:step="currentStep" />
          </VWindowItem>

          <VWindowItem>
            <ViewsWebCheckoutPayment
              v-model:step="currentStep"
              :summary="summary!"
              @paid="submit"
            />
          </VWindowItem>

          <VWindowItem>
            <ViewsWebCheckoutConfirmation />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
    <ModalApplyCoupon
      v-model:is-visible="applyCouponModal"
      :variant-id="route.params?.variantId"
      @apply="
        (couponId) => {
          form.couponId = couponId as unknown as string
          refresh()
          applyCouponModal = false
        }
      "
    />
  </VContainer>

  <br />
  <br />
  <br />
</template>
