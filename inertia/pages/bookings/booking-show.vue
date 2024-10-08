<script lang="ts">
import Layout from '~/layouts/default.vue'
import { VDataTable } from 'vuetify/components'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import product21 from '@images/ecommerce-images/product-21.png'
import product22 from '@images/ecommerce-images/product-22.png'
import product23 from '@images/ecommerce-images/product-23.png'
import product24 from '@images/ecommerce-images/product-24.png'
import useGetImageUrl from '~/composables/useGetImageUrl'
import Booking from '../../../app/models/booking'
import { computed } from 'vue'

// const isConfirmDialogVisible = ref(false);
// const isUserInfoEditDialogVisible = ref(false);
// const isEditAddressDialogVisible = ref(false);
const getImagesUrl = useGetImageUrl()

const props = defineProps<{
  booking: Booking
}>()

const bookingData = computed(() => (props.booking ? [props.booking] : []))

const headers = [
  { title: 'Service', key: 'service_variant' },
  { title: 'Price', key: 'variant_price' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Discount', key: 'vendorDiscount' },
  { title: 'Coupon Discount', key: 'couponDiscount' },
  { title: 'Total', key: 'grandTotal' },
]
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <div>
      <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
        <div>
          <div class="d-flex gap-2 align-center mb-2 flex-wrap">
            <h5 class="text-h5">Order #{{ booking?.id }}</h5>
            <div class="d-flex gap-x-2 normalcase">
              <VChip variant="tonal" color="success" label size="small">
                {{ booking?.status }}
              </VChip>
              <VChip variant="tonal" color="info" label size="small">
                Payment {{ booking?.paymentDetail?.paymentStatus }}
              </VChip>
            </div>
          </div>
          <div class="text-body-1">
            {{ new Date(booking?.createdAt as unknown as string).toDateString() }}
          </div>
        </div>

        <!-- <VBtn
          variant="tonal"
          color="error"
          @click="isConfirmDialogVisible = !isConfirmDialogVisible"
        >
          Cancle Booking
        </VBtn> -->
      </div>

      <VRow>
        <VCol cols="12" md="8">
          <!-- 👉 Order Details -->
          <VCard class="mb-6">
            <VCardItem>
              <template #title>
                <h5 class="text-h5">Booking Details</h5>
              </template>

              <template #append>
                <div class="text-base font-weight-medium text-primary cursor-pointer"></div>
              </template>
            </VCardItem>

            <VDivider />
            <VDataTable
              :headers="headers"
              :items="bookingData"
              item-value="productName"
              show-select
              class="text-no-wrap"
            >
              <template #item.service_variant="{ item }">
                <div class="d-flex gap-x-3 align-center">
                  <VAvatar
                    size="34"
                    :image="getImagesUrl(booking?.bookingDetail?.service_variant?.image?.url)"
                    :rounded="0"
                  />

                  <div class="d-flex flex-column align-start">
                    <h6 class="text-h6">
                      {{ item?.bookingDetail?.service_variant.name }}
                    </h6>

                    <span class="text-body-2">
                      {{ item.bookingDetail?.service_variant?.service.name }}
                    </span>
                  </div>
                </div>
              </template>

              <template #item.variant_price="{ item }">
                <div class="text-body-1">
                  &#x20B9;{{ item?.bookingDetail?.service_variant.price }}
                </div>
              </template>

              <template #item.quantity="{ item }">
                <div class="text-body-1">
                  {{ item?.bookingDetail?.qty }}
                </div>
              </template>

              <template #item.vendorDiscount="{ item }">
                <div class="text-body-1">&#x20B9;{{ item?.bookingDetail?.vendorDiscount }}</div>
              </template>

              <template #item.couponDiscount="{ item }">
                <div class="text-body-1">&#x20B9;{{ item?.bookingDetail?.couponDiscount }}</div>
              </template>

              <template #item.grandTotal="{ item }">
                <div class="text-body-1">&#x20B9;{{ item.bookingDetail.grandTotal }}</div>
              </template>

              <template #bottom />
            </VDataTable>
            <VDivider />

            <VCardText>
              <div class="d-flex align-end flex-column">
                <table class="text-high-emphasis">
                  <tbody>
                    <tr>
                      <td width="200px">Subtotal:</td>
                      <td class="font-weight-medium">
                        &#x20B9;{{ booking?.bookingDetail?.grandTotal }}
                      </td>
                    </tr>
                    <tr>
                      <td>Shipping Total:</td>
                      <td class="font-weight-medium">&#x20B9;0</td>
                    </tr>
                    <tr>
                      <td>Tax:</td>
                      <td class="font-weight-medium">&#x20B9;0</td>
                    </tr>
                    <tr>
                      <td class="text-high-emphasis font-weight-medium">Total:</td>
                      <td class="font-weight-medium">
                        &#x20B9;{{ booking?.bookingDetail.grandTotal }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Shipping Activity -->
          <VCard title="Booking Activity">
            <VCardText>
              <VTimeline
                truncate-line="both"
                line-inset="9"
                align="start"
                side="end"
                line-color="primary"
                density="compact"
              >
                <VTimelineItem
                  v-for="(h, i) in booking?.history"
                  :key="i"
                  dot-color="primary"
                  size="x-small"
                >
                  <div class="d-flex justify-space-between align-center">
                    <div class="app-timeline-title">
                      {{ h.event }}
                    </div>
                    <div class="app-timeline-meta">
                      {{ new Date(h.date_time as string).toDateString() }}
                    </div>
                  </div>
                  <p class="app-timeline-text mb-0 mt-3">
                    {{ h.remarks }}
                  </p>
                </VTimelineItem>
              </VTimeline>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="4">
          <!-- 👉 Customer Details  -->
          <VCard class="mb-6">
            <VCardText class="d-flex flex-column gap-y-6">
              <!-- <h5 class="text-h5">Customer details</h5> -->

              <!-- <div class="d-flex align-center gap-x-3">
                <VAvatar :image="avatar1" />
                <div>
                  <h6 class="text-h6">Shamus Tuttle</h6>
                  <div class="text-body-1">Customer ID: #47389</div>
                </div>
              </div> -->
              <!-- 
              <div class="d-flex gap-x-3 align-center">
                <VAvatar variant="tonal" color="success">
                  <VIcon icon="tabler-shopping-cart" />
                </VAvatar>
                <h6 class="text-h6">12 Orders</h6>
              </div> -->

              <div class="d-flex flex-column gap-y-1">
                <div class="d-flex justify-space-between align-center">
                  <h6 class="text-h6">Contact Info</h6>
                  <!-- <div
                    class="text-base text-primary cursor-pointer font-weight-medium"
                    @click="
                      isUserInfoEditDialogVisible = !isUserInfoEditDialogVisible
                    "
                  >
                    Edit
                  </div> -->
                </div>
                <span>Email: Sheldon88@yahoo.com</span>
                <span>Mobile: +1 (609) 972-22-22</span>
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Shipping Address -->
          <VCard class="mb-6">
            <VCardItem>
              <VCardTitle>Shipping Address</VCardTitle>

              <template #append>
                <div class="d-flex align-center justify-space-between">
                  <!-- <div
                    class="text-base font-weight-medium text-primary cursor-pointer"
                    @click="
                      isEditAddressDialogVisible = !isEditAddressDialogVisible
                    "
                  >
                    Edit
                  </div> -->
                </div>
              </template>
            </VCardItem>

            <VCardText>
              <div class="text-body-1">
                45 Rocker Terrace <br />
                Latheronwheel <br />
                KW5 8NW, London <br />
                UK
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Billing Address -->
          <VCard>
            <VCardText>
              <div class="d-flex align-center justify-space-between mb-2">
                <h5 class="text-h5">Billing Address</h5>
                <!-- <div
                  class="text-base font-weight-medium text-primary cursor-pointer"
                  @click="
                    isEditAddressDialogVisible = !isEditAddressDialogVisible
                  "
                >
                  Edit
                </div> -->
              </div>
              <div>
                45 Rocker Terrace <br />
                Latheronwheel <br />
                KW5 8NW, London <br />
                UK
              </div>

              <div class="mt-6">
                <h5 class="text-h5 mb-1">Mastercard</h5>
                <div class="text-body-1">Card Number: ******4291</div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- <DialogsConfirmDialog
        v-model:isDialogVisible="isConfirmDialogVisible"
        confirmation-question="Are you sure to cancel your Order?"
        cancel-msg="Order cancelled!!"
        cancel-title="Cancelled"
        confirm-msg="Your order cancelled successfully."
        confirm-title="Cancelled!"
      />

      <DialogsUserInfoEditDialog
        v-model:isDialogVisible="isUserInfoEditDialogVisible"
        :user-data="userData"
      />

      <DialogsAddEditAddressDialog
        v-model:isDialogVisible="isEditAddressDialogVisible"
        :billing-address="currentBillingAddress"
      /> -->
    </div>
  </VContainer>
</template>
