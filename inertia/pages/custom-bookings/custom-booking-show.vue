<script lang="ts">
import Layout from '~/layouts/default.vue'
import { VDataTable } from 'vuetify/components'
import type { IBidBooking } from '#models/bid_booking'
import { format } from 'date-fns'
import BookingStatusUpdate from '~/components/BookingStatusUpdate.vue'
import { OrderStatus } from '#helpers/enums'
import { resolveDeliveryOptions, resolvePaymentStatus, resolveStatus } from '~/utils/helpers'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  booking: IBidBooking
}>()

const bookingData = computed(() => (props.booking ? [props.booking] : []))

const headers = [
  { title: 'Service Requirement', key: 'service_requirement' },
  { title: 'Price', key: 'service_requirement_price' },
  { title: 'Quantity', key: 'quantity' },
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
            <VChip v-bind="resolveStatus(booking.status)" label size="small" />
          </div>
          <div class="d-flex gap-2 align-center mb-2 flex-wrap">
            <h6 class="text-h6">Payment Status</h6>
            <VChip
              v-bind="resolvePaymentStatus(booking?.paymentDetail?.paymentStatus)"
              label
              size="small"
            />
          </div>

          <div class="text-body-1">
            {{ format(booking?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </div>
        </div>
        <BookingStatusUpdate
          :booking="booking"
          booking-type="custom"
          :allowed-options="[OrderStatus.CANCLED, OrderStatus.COMPLETED]"
        />
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
              <template #item.service_requirement="{ item }">
                <div class="d-flex gap-x-3 align-center">
                  <div class="d-flex flex-column align-start">
                    <h6 class="text-h6">
                      {{ item?.bookingDetail?.serviceRequirement.title }}
                    </h6>

                    <span class="text-body-2">
                      {{ item.bookingDetail?.serviceRequirement?.title }}
                    </span>
                  </div>
                </div>
              </template>

              <template #item.service_requirement_price="{ item }">
                <div class="text-body-1">
                  &#x20B9;{{ item?.bookingDetail?.acceptedBid.offeredPrice }}
                </div>
              </template>

              <template #item.quantity="{ item }">
                <div class="text-body-1">
                  {{ item?.qty }}
                </div>
              </template>

              <template #item.grandTotal="{ item }">
                <div class="text-body-1">&#x20B9;{{ item.price }}</div>
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
                      <td class="font-weight-medium">&#x20B9;{{ booking?.price }}</td>
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
                      <td class="font-weight-medium">&#x20B9;{{ booking?.price }}</td>
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
                      {{ format(h.date_time as unknown as string, 'dd/MM/yyyy HH:mm') }}
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

              <div class="d-flex align-center gap-x-3">
                <!-- <VAvatar :image="" /> -->
                <div>
                  <h6 class="text-h6">
                    {{ booking?.user?.firstName }} {{ booking?.user?.lastName }}
                  </h6>
                  <div class="text-body-1">Customer ID: #{{ booking?.user?.id }}</div>
                </div>
              </div>
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
                </div>
                <span>{{ booking?.user?.email }}</span>
                <span>Mobile: {{ booking?.user?.phone }}</span>
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Booking Information -->
          <VCard class="mb-6">
            <VCardItem>
              <VCardTitle>Booking Information</VCardTitle>
            </VCardItem>

            <VCardText>
              <div class="text-body-1">
                <span class="font-weight-bold">Booking Type:</span>
                {{ resolveDeliveryOptions(booking.deliveryType) }}
                <br />
                <span class="font-weight-bold">Time slot:</span> to be done
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Billing Address -->
          <VCard>
            <VCardText>
              <div class="d-flex align-center justify-space-between mb-2">
                <h5 class="text-h5">Billing Address</h5>
              </div>
              <div>
                {{ booking.addressDetail.address }} <br />
                {{ booking.addressDetail.mapAddress }}<br />
                {{ booking.addressDetail.mobile }} <br />
              </div>

              <div class="mt-6">
                <h5 class="text-h5 mb-1">Mastercard</h5>
                <div class="text-body-1">Card Number: ******4291</div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>
