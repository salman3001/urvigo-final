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
import type { IAddress } from '../../../app/models/address'
import { watch } from 'vue'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'error'): void
}>()

const props = defineProps<{
  address: IAddress
}>()

const model = defineModel<boolean>({ required: true })

const editAddressForm = useApiForm({
  type: props.address?.type || AddressType.HOME,
  // @ts-ignore
  geoLocation: `${props.address?.geoLocation?.x},${props.address?.geoLocation?.y}` || '',
  mapAddress: props.address?.mapAddress || '',
  address: props.address?.address || '',
  mobile: props.address?.mobile || '',
})

const resetForm = () => {
  editAddressForm.type = AddressType.HOME
  editAddressForm.geoLocation = ''
  editAddressForm.mapAddress = ''
  editAddressForm.address = ''
  editAddressForm.mobile = ''
}

const submit = () => {
  editAddressForm.put(
    routes('api.address.update', [props.address.id]),
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

watch(
  () => props.address,
  () => {
    editAddressForm.type = props.address?.type || AddressType.HOME

    editAddressForm.geoLocation =
      // @ts-ignore
      `${props.address?.geoLocation?.x},${props.address?.geoLocation?.y}` || ''
    editAddressForm.mapAddress = props.address?.mapAddress || ''
    editAddressForm.address = props.address?.address || ''
    editAddressForm.mobile = props.address?.mobile || ''
  }
)
</script>
<template>
  <ModalBase v-model:is-visible="model" title="Edit Address" subtitle="">
    <VRow class="justify-center">
      <VCol style="max-width: 400px">
        <CustomForm @submit="submit">
          <ErrorAlert v-if="editAddressForm.error" :errors="editAddressForm.error" class="mb-2" />
          <div class="d-flex flex-column gap-3">
            <CustomRadios
              v-model:selected-radio="editAddressForm.type"
              :radio-content="[
                { title: 'Home', value: AddressType.HOME },
                { title: 'Office', value: AddressType.OFFICE },
              ]"
              :grid-column="{ cols: '12', sm: '6', md: '4' }"
            />
            <LocationAutocomplete
              @selection="
                (v: any) => {
                  editAddressForm.geoLocation = v.coordinates
                  editAddressForm.mapAddress = v.mapAddress
                }
              "
            />
            <AppTextField v-model="editAddressForm.mapAddress" label="Address line 1" />
            <AppTextField v-model="editAddressForm.address" label="Address line 2 (optional)" />
            <AppTextField
              v-model="editAddressForm.mobile"
              type="number"
              label="Mobile"
              :rules="[requiredValidator, (v: string) => minLengthValidator(v, 8)]"
            />
            <VBtn type="submit" class="mt-2">Update Address</VBtn>
          </div>
        </CustomForm>
      </VCol>
    </VRow>
  </ModalBase>
</template>
