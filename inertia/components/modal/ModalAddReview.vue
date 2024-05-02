<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { requiredValidator } from '~/@core/utils/validators'
import routes from '~/utils/routes'
import CustomForm from '../form/CustomForm.vue'
import ErrorAlert from '../form/ErrorAlert.vue'
import ModalBase from './ModalBase.vue'
import { VRating } from 'vuetify/components'

const isVisible = defineModel<boolean>('isVisible')

const props = defineProps<{
  serviceId?: number
  businessProfileId?: number
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const serviceReviewForm = useForm({
  rating: '',
  message: '',
})

const vendorReviewForm = useForm({
  rating: '',
  message: '',
})

const formSubmit = async () => {
  if (props.serviceId) {
    serviceReviewForm.post(routes('web.services.create_review', [props.serviceId]), {
      onSuccess: () => {
        emit('submit')
      },
    })
  }

  if (props.businessProfileId) {
    // to be done
    serviceReviewForm.post('', {
      onSuccess: () => {
        emit('submit')
      },
    })
  }
}
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Add Review"
    subtitle="Share your thoughts about this service"
  >
    <CustomForm fast-fail @submit="() => formSubmit()" ref="formRef">
      <ErrorAlert v-if="serviceReviewForm.errors" :errors="serviceReviewForm.errors" />
      <ErrorAlert v-if="vendorReviewForm.errors" :errors="vendorReviewForm.errors" />
      <br />
      <VRow>
        <!-- 👉 Card Number -->
        <VCol cols="12" class="d-flex justify-center">
          <VRating
            v-if="serviceId"
            v-model="serviceReviewForm.rating"
            label="Rating"
            :rules="[requiredValidator]"
          />
          <VRating
            v-if="businessProfileId"
            v-model="vendorReviewForm.rating"
            label="Rating"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Card Name -->
        <VCol cols="12" md="12">
          <AppTextarea
            v-if="serviceId"
            v-model="serviceReviewForm.message"
            label="Message"
            :rules="[requiredValidator]"
          />
          <AppTextarea
            v-if="businessProfileId"
            v-model="vendorReviewForm.message"
            label="Message"
            :rules="[requiredValidator]"
          />
        </VCol>
        <!-- 👉 Card actions -->
        <VCol cols="12" class="text-center">
          <VBtn class="me-4" type="submit"> Submit </VBtn>
          <VBtn color="secondary" variant="tonal" @click="isVisible = false"> Cancel </VBtn>
        </VCol>
      </VRow>
    </CustomForm>
  </ModalBase>
</template>
