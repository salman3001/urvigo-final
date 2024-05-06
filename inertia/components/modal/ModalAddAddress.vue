<script setup lang="ts">
import useApiForm from '~/composables/useApiForm'
import routes from '~/utils/routes'
import CustomForm from '../form/CustomForm.vue'
import { minLengthValidator, requiredValidator } from '~/@core/utils/validators'
import ModalBase from './ModalBase.vue'
import LocationAutocomplete from '../form/LocationAutocomplete.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { AddressType } from '../../../app/helpers/enums'
import CustomRadios from '~/@core/components/app-form-elements/CustomRadios.vue'
import ErrorAlert from '../form/ErrorAlert.vue'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'error'): void
}>()

const model = defineModel<boolean>({ required: true })

const addAddressForm = useApiForm({
  type: AddressType.HOME,
  geoLocation: '',
  mapAddress: '',
  address: '',
  mobile: '',
})

const resetForm = () => {
  addAddressForm.type = AddressType.HOME
  addAddressForm.geoLocation = ''
  addAddressForm.mapAddress = ''
  addAddressForm.address = ''
  addAddressForm.mobile = ''
}

const submit = () => {
  addAddressForm.post(
    routes('api.address.store'),
    {},
    {
      onSucess: () => {
        emits('success')
        resetForm()
        model.value = false
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
    <VRow class="justify-center">
      <VCol style="max-width: 400px">
        <CustomForm @submit="submit">
          <ErrorAlert v-if="addAddressForm.error" :errors="addAddressForm.error" class="mb-2" />
          <div class="d-flex flex-column gap-3">
            <CustomRadios
              v-model:selected-radio="addAddressForm.type"
              :radio-content="[
                { title: 'Home', value: AddressType.HOME },
                { title: 'Office', value: AddressType.OFFICE },
              ]"
              :grid-column="{ cols: '12', sm: '6', md: '4' }"
            />
            <LocationAutocomplete
              :rules="[requiredValidator]"
              @selection="
                (v: any) => {
                  addAddressForm.geoLocation = v.coordinates
                  addAddressForm.mapAddress = v.mapAddress
                }
              "
            />
            <AppTextField v-model="addAddressForm.mapAddress" label="Address line 1" disabled />
            <AppTextField v-model="addAddressForm.address" label="Address line 2 (optional)" />
            <AppTextField
              v-model="addAddressForm.mobile"
              type="number"
              label="Mobile"
              :rules="[requiredValidator, (v: string) => minLengthValidator(v, 8)]"
            />
            <VBtn type="submit" class="mt-2">Add Address</VBtn>
          </div>
        </CustomForm>
      </VCol>
    </VRow>
  </ModalBase>
</template>
