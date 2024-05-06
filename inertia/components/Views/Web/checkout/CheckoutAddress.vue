<script setup lang="ts">
import useGetImageUrl from '~/composables/useGetImageUrl'
import type { Prop } from '../../../../../app/helpers/types'
import type { IWebBookingController } from '#controllers/web/web_bookings_controller'
import AddressComponent from '~/components/AddressComponent.vue'
import type { IAddress } from '#models/address'
import CustomForm from '~/components/form/CustomForm.vue'
import SelectDeliveryType from '~/components/SelectDeliveryType.vue'
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'

interface Props {
  summary: Awaited<Prop<IWebBookingController['summary']>['summary']>
}

const getImageUrl = useGetImageUrl()
const outOfRadiusError = ref(false)
const selectedAddressCords = ref()

defineProps<Props>()

const form = useForm({
  addressDetail: {
    address: '',
    mapAddress: '',
    mobile: '',
    geoLocation: '',
  },
  deliveryType: '',
})

const setAddress = (ad: IAddress) => {
  selectedAddressCords.value = ad.geoLocation
  form.addressDetail.address = ad.address
  form.addressDetail.mapAddress = ad.mapAddress
  form.addressDetail.mobile = ad.mobile
  // @ts-ignore
  form.addressDetail.geoLocation = `${ad.geoLocation.x},${ad.geoLocation.y}`
}

const submit = () => {
  if (outOfRadiusError.value) {
    alert(
      'Oops! Vendor dont serve at this location! Please choose other delivery option if available'
    )
    return
  }
  form.post(routes('web.booking.address.post'))
}
</script>

<template>
  <CustomForm @submit="submit">
    <VRow>
      <VCol cols="12" md="8">
        <VAlert v-if="outOfRadiusError" variant="tonal" color="error">
          Oops! Vendor dont serve at this location! Please choose walkin in option if available
        </VAlert>
        <!-- 👉 Address options -->
        <h6 class="text-h6 mb-4">Select your preferable address</h6>

        <!-- 👉 Address custom input -->
        <AddressComponent required @selected-address="setAddress" />

        <!-- 👉 Delivery options -->
        <h6 class="text-h6 mb-4">Choose Delivery Options</h6>

        <!-- 👉 Delivery options custom input -->
        <SelectDeliveryType
          v-model="form.deliveryType"
          v-model:outOfRadiusError="outOfRadiusError"
          :service="summary?.bookingDetail?.service_variant?.service"
          :selected-address-cords="selectedAddressCords"
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
                <template #prepend>
                  <img
                    height="70"
                    width="60"
                    :src="getImageUrl(summary?.bookingDetail.service_variant?.image?.thumbnailUrl)"
                    class="me-4"
                  />
                </template>

                <div class="text-body-1">
                  {{ summary?.bookingDetail?.service_variant?.name }}
                </div>
                <h6 class="text-h6 text-medium-emphasis">
                  &#x20B9; {{ summary?.bookingDetail?.service_variant?.price }}
                </h6>
              </VListItem>
            </VList>
          </VCardText>

          <VDivider />

          <!-- 👉 Price details -->
          <VCardText>
            <h6 class="text-h6 mb-4">Price Details</h6>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-high-emphasis">Qty</span>
              <span>{{ summary?.bookingDetail?.qty }}</span>
            </div>

            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-high-emphasis">Order Total</span>
              <span>&#x20B9;{{ summary?.bookingDetail?.grandTotal }}</span>
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
              &#x20B9;{{ summary?.bookingDetail?.grandTotal }}
            </span>
          </VCardText>
        </VCard>

        <VBtn block type="submit" class="mt-4"> Place Order </VBtn>
      </VCol>
    </VRow>
  </CustomForm>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
