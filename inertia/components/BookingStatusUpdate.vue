<script setup lang="ts">
import { OrderStatus } from '#helpers/enums'
import type { IBooking } from '#models/booking'
import { ref } from 'vue'
import ModalUpdateBookingStatus from './modal/ModalUpdateBookingStatus.vue'
import type { IBidBooking } from '#models/bid_booking'

defineProps<{
  booking: IBooking | IBidBooking
  bookingType: 'normal' | 'custom'
  allowedOptions: Array<OrderStatus>
}>()

const updateStatusModal = ref(false)
const updateStatusModalMessage = ref('')
const updateStatusModalStatusType = ref(OrderStatus.PLACED)
</script>

<template>
  <div class="d-flex gap-2 flex-wrap">
    <VBtn
      v-if="allowedOptions.includes(OrderStatus.CONFIRMED) && booking.status === OrderStatus.PLACED"
      variant="tonal"
      color="warning"
      @click="
        () => {
          updateStatusModalMessage = 'Confirm booking are you sure'
          updateStatusModalStatusType = OrderStatus.CONFIRMED
          updateStatusModal = true
        }
      "
    >
      Confirm Booking
    </VBtn>

    <VBtn
      v-if="
        allowedOptions.includes(OrderStatus.REJECTED) &&
        [OrderStatus.PLACED, OrderStatus.CONFIRMED].includes(booking.status)
      "
      variant="tonal"
      color="error"
      @click="
        () => {
          updateStatusModalMessage = 'Reject Booking, Are you sure?'
          updateStatusModalStatusType = OrderStatus.REJECTED
          updateStatusModal = true
        }
      "
    >
      Reject Booking
    </VBtn>

    <VBtn
      v-if="allowedOptions.includes(OrderStatus.CANCLED) && booking.status === OrderStatus.PLACED"
      variant="tonal"
      color="error"
      @click="
        () => {
          updateStatusModalMessage = 'Cancle Booking, Are you sure?'
          updateStatusModalStatusType = OrderStatus.CANCLED
          updateStatusModal = true
        }
      "
    >
      Cancle Booking
    </VBtn>

    <VBtn
      v-if="
        allowedOptions.includes(OrderStatus.COMPLETION_REQUESTED) &&
        booking.status === OrderStatus.CONFIRMED
      "
      variant="tonal"
      color="info"
      @click="
        () => {
          updateStatusModalMessage = 'Request booking completion, Are you sure?'
          updateStatusModalStatusType = OrderStatus.COMPLETION_REQUESTED
          updateStatusModal = true
        }
      "
    >
      Request Booking Completion
    </VBtn>

    <VBtn
      v-if="
        allowedOptions.includes(OrderStatus.COMPLETED) &&
        booking.status === OrderStatus.COMPLETION_REQUESTED
      "
      variant="tonal"
      color="success"
      @click="
        () => {
          updateStatusModalMessage = `Accept Completion and Rate this ${bookingType === 'normal' ? 'Service' : 'Vendor'}`
          updateStatusModalStatusType = OrderStatus.COMPLETED
          updateStatusModal = true
        }
      "
    >
      Accept Completion
    </VBtn>

    <ModalUpdateBookingStatus
      v-model:isVisible="updateStatusModal"
      :title="updateStatusModalMessage"
      :type="updateStatusModalStatusType"
      :booking-id="booking.id"
      :booking-type="bookingType"
    />
  </div>
</template>
