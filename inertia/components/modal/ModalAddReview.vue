<script setup lang="ts">
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { requiredValidator } from '~/@core/utils/validators'
import routes from '~/utils/routes'
import CustomForm from '../form/CustomForm.vue'
import ErrorAlert from '../form/ErrorAlert.vue'
import ModalBase from './ModalBase.vue'
import { VRating } from 'vuetify/components'
import useApiForm from '~/composables/useApiForm'

const isVisible = defineModel<boolean>('isVisible')

const props = defineProps<{
  serviceId?: number
  businessProfileId?: number
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const serviceReviewForm = useApiForm({
  rating: '',
  message: '',
})

const vendorReviewForm = useApiForm({
  responseTime: '',
  qualityOfService: '',
  professionalBehavior: '',
  communication: '',
  fairPricing: '',
  message: '',
})

const formSubmit = async () => {
  if (props.serviceId) {
    if (['', undefined, null, 0].includes(serviceReviewForm.rating)) {
      alert('Please select all options')
      return
    }
    serviceReviewForm.post(
      routes('api.reviews.services.store', [props.serviceId]),
      {},
      {
        onSucess: () => {
          emit('submit')
        },
      }
    )
  }

  if (props.businessProfileId) {
    if (
      ['', undefined, null, 0].includes(vendorReviewForm.communication) ||
      ['', undefined, null, 0].includes(vendorReviewForm.fairPricing) ||
      ['', undefined, null, 0].includes(vendorReviewForm.professionalBehavior) ||
      ['', undefined, null, 0].includes(vendorReviewForm.responseTime) ||
      ['', undefined, null, 0].includes(vendorReviewForm.qualityOfService)
    ) {
      alert('Please select all options')
      return
    }
    vendorReviewForm.post(
      routes('api.reviews.vendor.store', [props.businessProfileId]),
      {},
      {
        onSucess: () => {
          emit('submit')
        },
      }
    )
  }
}
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Add Review"
    :subtitle="`Share your thoughts about this ${serviceId ? 'service' : 'vendor'}`"
    :width="400"
  >
    <CustomForm ref="formRef" fast-fail @submit="() => formSubmit()">
      <ErrorAlert v-if="serviceReviewForm.error" :errors="serviceReviewForm.error" />
      <ErrorAlert v-if="vendorReviewForm.error" :errors="vendorReviewForm.error" />
      <br />
      <VRow>
        <VCol cols="12" class="d-flex justify-center">
          <div v-if="serviceId" class="w-100">
            <div class="d-flex justify-space-between mb-2">
              <label for="">Rating</label>
              <VRating v-model="serviceReviewForm.rating" :rules="[requiredValidator]" />
            </div>
            <AppTextarea
              v-model="serviceReviewForm.message"
              label="Comments"
              :rules="[requiredValidator]"
            />
          </div>
          <div v-if="businessProfileId" class="w-100">
            <div class="d-flex justify-space-between mb-2">
              <label for="">Quality of service</label>
              <VRating v-model="vendorReviewForm.qualityOfService" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Profesional Behaviour</label>
              <VRating
                v-model="vendorReviewForm.professionalBehavior"
                :rules="[requiredValidator]"
              />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Response Time</label>
              <VRating v-model="vendorReviewForm.responseTime" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Communication</label>
              <VRating v-model="vendorReviewForm.communication" :rules="[requiredValidator]" />
            </div>
            <div class="d-flex justify-space-between mb-2">
              <label for="">Fair Pricing</label>
              <VRating v-model="vendorReviewForm.fairPricing" :rules="[requiredValidator]" />
            </div>
            <AppTextarea
              v-model="vendorReviewForm.message"
              label="Comments"
              :rules="[requiredValidator]"
            />
          </div>
        </VCol>

        <!-- 👉 Card actions -->
        <VCol cols="12" class="text-end">
          <VBtn class="me-4" color="secondary" variant="tonal" @click="isVisible = false">
            Cancel
          </VBtn>
          <VBtn type="submit"> Submit </VBtn>
        </VCol>
      </VRow>
    </CustomForm>
  </ModalBase>
</template>
