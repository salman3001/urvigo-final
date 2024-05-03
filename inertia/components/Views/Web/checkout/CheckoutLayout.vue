<script setup lang="ts">
import AppStepper from '~/@core/components/AppStepper.vue'
import customAddress from '~/assets/images/svg/address.svg'
import customCart from '~/assets/images/svg/cart.svg'
import customPayment from '~/assets/images/svg/payment.svg'
import customTrending from '~/assets/images/svg/trending.svg'

defineProps<{
  step: number
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
</script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        :current-step="step"
        class="checkout-stepper"
        :items="checkoutSteps"
        :direction="$vuetify.display.mdAndUp ? 'horizontal' : 'vertical'"
        :is-active-step-valid="true"
        align="center"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VWindow :model-value="0" class="disable-tab-transition" :touch="false">
        <VWindowItem>
          <slot />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
