<script setup lang="ts">
import type Bid from '#models/bid'
import type ServiceRequirement from '#models/service_requirement'
import ModalBase from './ModalBase.vue'
import { requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import CustomForm from '../form/CustomForm.vue'
import routes from '~/utils/routes'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { useForm } from '@inertiajs/vue3'

const props = defineProps<{
  selectedBid: Bid
  serviceRequirement: ServiceRequirement
}>()

const emits = defineEmits<{
  (e: 'negotiated'): void
}>()

const model = defineModel<boolean>({ required: true })

const negotiateForm = useForm({
  bidId: props.selectedBid.id,
  price: '',
  message: '',
})

const submit = async () => {
  negotiateForm.post(routes('web.service_requirement.negotiate', [props.serviceRequirement.id]), {
    onSuccess: () => {
      emits('negotiated')
    },
  })
}
</script>

<template>
  <ModalBase
    v-model:is-visible="model"
    title="Request a Negotiation"
    subtitle="Please ask a reasonable negotiation. Very high negotiations are most likely be rejected by the vendor"
  >
    <CustomForm @submit="submit">
      <VCardItem>
        <AppTextField
          type="number"
          v-model="negotiateForm.price"
          label="Request a price"
          :rules="[requiredValidator]"
        />
        <AppTextarea v-model="negotiateForm.message" label="message" :rules="[requiredValidator]" />
      </VCardItem>
      <VCardItem class="d-flex justify-end p-2">
        <VBtn type="submit">Submit Request</VBtn>
      </VCardItem>
    </CustomForm>
  </ModalBase>
</template>
