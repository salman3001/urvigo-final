<script setup lang="ts">
import { OrderStatus } from '#helpers/enums'
import { useForm } from '@inertiajs/vue3'
import { VBtn } from 'vuetify/components'
import CustomForm from '../form/CustomForm.vue'
import routes from '~/utils/routes'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { requiredValidator } from '~/@core/utils/validators'

const isVisible = defineModel<boolean>('isVisible')

const props = defineProps<{
  title: string
  type: OrderStatus
  bookingType: 'normal' | 'custom'
  bookingId: number
}>()

const form = useForm({
  status: '',
  remarks: '',
  responseTime: '',
  qualityOfService: '',
  professionalBehavior: '',
  communication: '',
  fairPricing: '',
  rating: '',
  message: '',
})

const submit = () => {
  //for normal booking
  if (props.type === OrderStatus.CONFIRMED && props.bookingType === 'normal') {
    form.status = OrderStatus.CONFIRMED
    form.post(routes('vendor.booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.CANCLED && props.bookingType === 'normal') {
    form.status = OrderStatus.CANCLED
    form.post(routes('vendor.booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.REJECTED && props.bookingType === 'normal') {
    form.status = OrderStatus.REJECTED
    form.post(routes('vendor.booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.COMPLETION_REQUESTED && props.bookingType === 'normal') {
    form.status = OrderStatus.COMPLETION_REQUESTED
    form.post(routes('vendor.booking.request-completion', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.COMPLETED && props.bookingType === 'normal') {
    form.status = OrderStatus.COMPLETED
    if (['', undefined, null, 0].includes(form.rating)) {
      alert('Please select all options')
      return
    }
    form.post(routes('vendor.booking.accept-completion', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  // for customm bookings

  if (props.type === OrderStatus.CONFIRMED && props.bookingType === 'custom') {
    form.status = OrderStatus.CONFIRMED
    form.post(routes('vendor.custom-booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.CANCLED && props.bookingType === 'custom') {
    form.status = OrderStatus.CANCLED
    form.post(routes('vendor.custom-booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.REJECTED && props.bookingType === 'custom') {
    form.status = OrderStatus.REJECTED
    form.post(routes('vendor.custom-booking.update-status', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.COMPLETION_REQUESTED && props.bookingType === 'custom') {
    form.status = OrderStatus.COMPLETION_REQUESTED
    form.post(routes('vendor.custom-booking.request-completion', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }

  if (props.type === OrderStatus.COMPLETED && props.bookingType === 'custom') {
    form.status = OrderStatus.COMPLETED
    if (
      ['', undefined, null, 0].includes(form.communication) ||
      ['', undefined, null, 0].includes(form.fairPricing) ||
      ['', undefined, null, 0].includes(form.professionalBehavior) ||
      ['', undefined, null, 0].includes(form.responseTime) ||
      ['', undefined, null, 0].includes(form.qualityOfService)
    ) {
      alert('Please select all options')
      return
    }
    form.post(routes('vendor.custom-booking.accept-completion', [props.bookingId]), {
      onSuccess: () => {
        isVisible.value = false
      },
    })
  }
}
</script>

<template>
  <VDialog v-model="isVisible" max-width="500">
    <CustomForm @submit="submit">
      <VCard class="text-center px-10 py-6">
        <VCardText>
          <h6 class="text-lg font-weight-medium mb-4">
            {{ title }}
          </h6>
          <div
            v-if="type === OrderStatus.COMPLETED && props.bookingType === 'normal'"
            class="w-100"
          >
            <div class="d-flex justify-space-between mb-2">
              <label for="">Rating</label>
              <VRating v-model="form.rating" :rules="[requiredValidator]" />
            </div>
            <AppTextarea v-model="form.message" label="Comments" :rules="[requiredValidator]" />
          </div>
          <div
            v-else-if="type === OrderStatus.COMPLETED && props.bookingType === 'custom'"
            class="w-100"
          >
            <div class="d-flex justify-space-between mb-2">
              <label for="">Quality of service</label>
              <VRating v-model="form.qualityOfService" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Profesional Behaviour</label>
              <VRating v-model="form.professionalBehavior" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Response Time</label>
              <VRating v-model="form.responseTime" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Communication</label>
              <VRating v-model="form.communication" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Fair Pricing</label>
              <VRating v-model="form.fairPricing" :rules="[requiredValidator]" />
            </div>
            <AppTextarea v-model="form.message" label="Comments" :rules="[requiredValidator]" />
          </div>

          <div v-else>
            <AppTextarea v-model="form.remarks" label="Add Remarks (Optional)" />
          </div>
        </VCardText>

        <VCardText class="d-flex align-end justify-end gap-2">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="
              () => {
                isVisible = false
              }
            "
          >
            Cancel
          </VBtn>

          <VBtn variant="elevated" type="submit"> Update </VBtn>
        </VCardText>
      </VCard>
    </CustomForm>
  </VDialog>
</template>
