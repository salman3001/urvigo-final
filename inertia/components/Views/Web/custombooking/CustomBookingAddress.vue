<script setup lang="ts">
import BigNumber from 'bignumber.js'
import type { IServiceRequirement } from '#models/service_requirement'
import type { IBid } from '#models/bid'
import { ref } from 'vue'
import type { IAddress } from '#models/address'
import { useForm } from '@inertiajs/vue3'
import AddressComponent from '~/components/AddressComponent.vue'
import SelectDeliveryType from '~/components/SelectDeliveryType.vue'

interface Props {
  serviceRequirement: IServiceRequirement
  acceptedBid: IBid
  qty: number
}

const initialForm = {
  addressDetail: {
    address: '',
    mapAddress: '',
    mobile: '',
    geoLocation: '',
  },
  deliveryType: '',
}

const selectedAddressCords = ref()
const outOfRadiusError = ref(false)

const emits = defineEmits<{
  (e: 'submit', form: typeof initialForm): void
}>()

defineProps<Props>()

const form = useForm({ ...initialForm })

const setAddress = (ad: IAddress) => {
  selectedAddressCords.value = ad.geoLocation
  form.addressDetail.address = ad.address
  form.addressDetail.mapAddress = ad.mapAddress
  form.addressDetail.mobile = ad.mobile
  // @ts-ignore
  form.addressDetail.geoLocation = `${ad.geoLocation.x},${ad.geoLocation.y}`
}

const submit = () => {
  emits('submit', {
    addressDetail: form.addressDetail,
    deliveryType: form.deliveryType,
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <!-- 👉 Address options -->
      <h6 class="text-h6 mb-4">Select your preferable address</h6>

      <!-- 👉 Address custom input -->
      <AddressComponent required @selected-address="setAddress" />

      <!-- 👉 Delivery options -->
      <h6 class="text-h6 mb-4">Choose Delivery Options</h6>

      <!-- 👉 Delivery options custom input -->
      <!-- 👉 Delivery options custom input -->
      <SelectDeliveryType
        v-model="form.deliveryType"
        v-model:outOfRadiusError="outOfRadiusError"
        :delivery-options="acceptedBid.deliveryOptions"
        required
      />
    </VCol>

    <VCol cols="12" md="4">
      <VCard flat variant="outlined">
        <!-- 👉 Delivery estimate date -->
        <VCardText>
          <h6 class="text-h6 mb-4">Booking Item</h6>

          <VList class="card-list">
            <VListItem>
              <div class="text-body-1">
                {{ serviceRequirement?.title }}
              </div>
              <h6 class="text-h6 text-medium-emphasis">&#x20B9; {{ acceptedBid?.offeredPrice }}</h6>
            </VListItem>
          </VList>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">Price Details</h6>

          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-high-emphasis">Order Total</span>
            <span
              >&#x20B9;{{ new BigNumber(acceptedBid?.offeredPrice).times(qty).toFixed(2) }}</span
            >
          </div>

          <div class="d-flex align-center justify-space-between">
            <span class="text-high-emphasis">Delivery Charges</span>
            <div class="text-end">
              <div class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">&#x20B9;20.00</div>
                <VChip size="small" color="success"> FREE </VChip>
              </div>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex align-center justify-space-between text-high-emphasis">
          <span class="text-base font-weight-medium">Total</span>
          <span class="text-base font-weight-medium">
            &#x20B9;{{ new BigNumber(acceptedBid?.offeredPrice).times(qty).toFixed(2) }}
          </span>
        </VCardText>
      </VCard>

      <VBtn block class="mt-4" @click="submit"> Place Order </VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
