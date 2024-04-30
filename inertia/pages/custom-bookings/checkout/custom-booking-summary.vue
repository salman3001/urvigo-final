<script lang="ts">
import Layout from '~/layouts/default.vue'
import { useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import type { IServiceRequirement } from '#models/service_requirement'
import useApiGet from '~/composables/useApiGet'
import type { IBid } from '#models/bid'
import CustomBookingCart from '~/components/Views/Web/custombooking/CustomBookingCart.vue'
import CheckoutConfirmation from '~/components/Views/Web/checkout/CheckoutConfirmation.vue'
import AppStepper from '~/@core/components/AppStepper.vue'
import CustomBookingAddress from '~/components/Views/Web/custombooking/CustomBookingAddress.vue'
import CustomBookingPayment from '~/components/Views/Web/custombooking/CustomBookingPayment.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import customAddress from '@images/svg/address.svg'
import customCart from '@images/svg/cart.svg'
import customPayment from '@images/svg/payment.svg'
import customTrending from '@images/svg/trending.svg'

const props = defineProps<{
  query: {
    requirementId: number
    acceptedBidId: number
  }
}>()

const currentStep = ref(0)
const isActiveStepValid = ref(true)

const { data: acceptedBid, exec: getAcceptedBid } = useApiGet<Bid>()
const { data: requirement, exec: getRequirement } = useApiGet<IServiceRequirement>()

const form = useForm({
  serviceRequirementId: '' as string | number,
  acceptedBidId: '' as string | number,
  qty: 1,
  paymentdetail: {
    paymentMode: 'online',
    paymentStatus: 'paid',
  },
})

const submit = async () => {
  form.serviceRequirementId = props.query.requirementId
  form.acceptedBidId = props?.query?.acceptedBidId
  form.paymentdetail.paymentMode = 'online'
  form.paymentdetail.paymentStatus = 'paid'
  form.post(routes('web.custom_booking.create'), {
    onSuccess: () => {
      currentStep.value = 3
    },
  })
}

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

onMounted(() => {
  getAcceptedBid(routes('api.bids.show', [props.query.acceptedBidId]))
  getRequirement(routes('api.requirements.show', [props.query.requirementId]))
})
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <VCard>
      <VCardText>
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
            <CustomBookingCart
              v-if="requirement && acceptedBid"
              v-model:qty="form.qty"
              v-model:step="currentStep"
              :service-requirement="requirement"
              :accepted-bid="acceptedBid"
            />
          </VWindowItem>

          <VWindowItem>
            <CustomBookingAddress
              v-if="requirement && acceptedBid"
              :service-requirement="requirement"
              :accepted-bid="acceptedBid"
              :qty="form.qty"
              v-model:step="currentStep"
            />
          </VWindowItem>

          <VWindowItem>
            <CustomBookingPayment
              v-model:step="currentStep"
              :service-requirement="requirement"
              :accepted-bid="acceptedBid"
              :qty="form.qty"
              @paid="submit"
            />
          </VWindowItem>

          <VWindowItem>
            <CheckoutConfirmation />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </VContainer>
  <br />
  <br />
  <br />
</template>
