<script setup lang="ts">
import useApiForm from '~/composables/useApiForm'
import routes from '~/utils/routes'
import CustomForm from '../form/CustomForm.vue'
import { requiredValidator } from '~/@core/utils/validators'
import ModalBase from './ModalBase.vue'
import LocationAutocomplete from '../form/LocationAutocomplete.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'error'): void
}>()

const model = defineModel<boolean>({ required: true })

const addAddressForm = useApiForm({
  geoLocation: '',
  mapAddress: '',
  address: '',
})

const submit = () => {
  addAddressForm.post(
    routes('api.address.store'),
    {},
    {
      onSucess: () => {
        emits('success')
      },
      onError: () => {
        emits('error')
      },
    }
  )
}
</script>
<template>
  <ModalBase v-model:is-visible="model" title="Add New Address" subtitle="">
    <CustomForm @submit="submit">
      <VCardItem>
        <LocationAutocomplete
          :rules="[requiredValidator]"
          @selection="
            (v: any) => {
              addAddressForm.geoLocation = v.coordinates
              addAddressForm.mapAddress = v.mapAddress
            }
          "
        />
        <AppTextField label="Address line 1" v-model="addAddressForm.mapAddress" disabled />
        <AppTextField label="Address line 2 (optional)" v-model="addAddressForm.address" />
      </VCardItem>
      <VCardItem class="d-flex justify-end p-2">
        <VBtn type="submit">Add Address</VBtn>
      </VCardItem>
    </CustomForm>
  </ModalBase>
</template>
