<script setup lang="ts">
import BigNumber from 'bignumber.js'
import useGetImageUrl from '~/composables/useGetImageUrl'
import { Prop } from '../../../../../app/helpers/types';
import WebBookingsController from '../../../../../app/controllers/web/web_bookings_controller';


const emits = defineEmits<{
  (e: 'apply-coupon'): void
  (e: 'next'): void
  (e: 'incrementQty'): void
  (e: 'decrementQty'): void
}>()

defineProps<{
  summary: Awaited<Prop<WebBookingsController['summary']>['summary']>
  qty: number
}>()
const getImageUrl = useGetImageUrl()

const nextStep = () => {
  emits('next')
}

const incrementQty = () => {
  emits('incrementQty')
}

const decrementQty = () => {
  emits('decrementQty')
}
</script>

<template>
  <VRow>
    <VCol cols="12" lg="8">
      <!-- 👉 Offers alert -->
      <VAlert type="success" variant="tonal" icon="tabler-percentage" title="Available Offer" closable>
        <template #text>
          <p class="mb-0">
            - 0% Instant Discount on Bank of America Corp Bank Debit and Credit cards
            <br />
            - 50% Cashback Voucher of up to $60 on first ever PayPal transaction. TCA
          </p>
        </template>
      </VAlert>

      <h5 class="text-h5 my-4">My Shopping Bag 1 Items</h5>

      <!-- 👉 Cart items -->
      <div class="border rounded" v-if="summary">
        <div class="d-flex align-center gap-4 pa-6 position-relative flex-column flex-sm-row flex-grow-1">
          <IconBtn class="checkout-item-remove-btn" @click="() => { }">
            <VIcon size="18" icon="tabler-x" class="text-disabled" />
          </IconBtn>

          <div>
            <VImg width="140"
              :src="getImageUrl(summary?.bookingDetail?.service_variant?.image?.breakpoints?.thumbnail?.url)" />
          </div>

          <div class="d-flex w-100 flex-column flex-md-row flex-grow-1">
            <div class="d-flex flex-column gap-y-2">
              <h6 class="text-h6">
                {{ summary?.bookingDetail?.service_variant?.name }}
              </h6>
              <div class="d-flex align-center text-no-wrap gap-4 text-body-1">
                <div class="text-disabled">
                  Category
                  <span class="d-inline-block text-primary">
                    {{ summary?.bookingDetail?.service_variant?.service?.name }}</span>
                </div>
              </div>
              <div>
                <VChip :color="'success'" label size="small"> Avilable </VChip>
              </div>

              <VRating density="compact" :model-value="summary?.bookingDetail?.service_variant?.service?.avgRating"
                size="24" readonly />
              <div>
                <IconBtn color="secondary" icon="tabler-minus" @click="decrementQty" />
                {{ qty }}
                <IconBtn color="secondary" icon="tabler-plus" @click="incrementQty" />
              </div>
            </div>

            <VSpacer />

            <div class="d-flex flex-column mt-5 text-start text-md-end"
              :class="$vuetify.display.mdAndDown ? 'gap-2' : 'gap-4'">
              <div class="d-flex text-base align-self-md-end">
                <div class="text-primary">&#x20B9;{{ summary?.bookingDetail?.totalAfterDiscount }}</div>
                <div v-if="new BigNumber(summary?.bookingDetail?.vendorDiscount).gt(0)"
                  class="text-decoration-line-through">
                  &#x20B9;{{ summary?.bookingDetail?.totalWithoutDiscount }}
                </div>
              </div>

              <div>
                <VBtn variant="tonal" size="small"> add to wishlist </VBtn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 👉 Empty Cart -->
      <VSkeletonLoader v-else type="list-item" />
    </VCol>

    <VCol cols="12" lg="4">
      <VCard flat variant="outlined">
        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">Price Details</h6>

          <div class="text-high-emphasis" v-if="summary">
            <div class="d-flex justify-space-between mb-2">
              <span>Bag Total</span>
              <span class="text-medium-emphasis">&#x20B9;{{ summary?.bookingDetail?.totalWithoutDiscount }}</span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Discount</span>
              &#x20B9;{{ summary?.bookingDetail?.vendorDiscount }}
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Coupon Discount</span>
              <span v-if="new BigNumber(summary?.bookingDetail?.couponDiscount).gt(0)">{{
        summary?.bookingDetail?.couponDiscount
      }}</span>
              <a href="#" v-else @click.prevent="$emit('apply-coupon')">Apply Coupon</a>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Order Total</span>
              <span class="text-medium-emphasis">&#x20B9;{{ summary?.bookingDetail?.grandTotal }}</span>
            </div>

            <div class="d-flex justify-space-between">
              <span>Delivery Charges</span>

              <div class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">&#x20B9;5.00</div>
                <VChip size="small" color="success"> FREE </VChip>
              </div>
            </div>
          </div>
          <VSkeletonLoader v-else type="list-item" />
        </VCardText>

        <VDivider />

        <!-- <VCardText class="d-flex justify-space-between pa-6">
          <h6 class="text-h6">Total</h6>
          <h6 class="text-h6">${{ totalCost }}.00</h6>
        </VCardText> -->
      </VCard>

      <VBtn block class="mt-4" @click="nextStep">Proceed</VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-end: 14px;
}
</style>
