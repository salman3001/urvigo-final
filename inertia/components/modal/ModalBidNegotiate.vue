<script setup lang="ts">
import type Bid from '#models/bid'
import type ServiceRequirement from '#models/service_requirement'
import { reactive } from 'vue'
import useApi from '~/composables/useApi'
import apiRoutes from '~/utils/apiRoutes'
import ModalBase from './ModalBase.vue'
import { requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import CustomForm from '../form/CustomForm.vue'

const props = defineProps<{
  selectedBid: Bid
  serviceRequirement: ServiceRequirement
}>()

const emits = defineEmits<{
  (e: 'negotiated'): void
}>()

const model = defineModel<boolean>({ required: true })

const form = reactive({
  bidId: props.selectedBid.id,
  price: '',
  message: '',
})

const negotiate = useApi(apiRoutes.bids.acceptNegotiation(props.selectedBid.id), 'post')

const submit = async () => {
  negotiate.exec(
    {
      data: form,
    },
    {
      onSuccess: () => {
        emits('negotiated')
      },
    }
  )
}
</script>

<template>
  <ModalBase
    v-model:is-visible="model"
    title="Request a Negotiation"
    subtitle="Please ask a reasonable negotiation. Very high negotiations are most likely be rejected by the vendor"
  >
    <CustomForm ref="formRef" @submit.prevent="submit">
      <VCardItem class="column q-pa-lg">
        <AppTextField
          type="number"
          v-model="form.price"
          label="Request a price"
          :rules="[requiredValidator]"
        />
        <AppTextarea v-model="form.message" label="message" :rules="[requiredValidator]" />
      </VCardItem>
      <VCardItem class="row justify-end q-pa-lg">
        <VBtn color="primary" type="submit">Submit Request</VBtn>
      </VCardItem>
    </CustomForm>
  </ModalBase>
</template>
