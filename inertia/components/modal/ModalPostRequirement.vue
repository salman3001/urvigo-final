<script setup lang="ts">
import type { IServiceCategory } from '#models/service_category'
import type { IServiceTag } from '#models/service_tag'
import { useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import ModalBase from './ModalBase.vue'
import CustomForm from '../form/CustomForm.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { minNumValidator, requiredValidator } from '~/@core/utils/validators'
import SelectOrAdd from '../form/SelectOrAdd.vue'
import DropZone from '~/@core/components/DropZone.vue'
import ErrorAlert from '../form/ErrorAlert.vue'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import { addDays, format } from 'date-fns'
import AddressComponent from '../AddressComponent.vue'
import { DeliveryOptions } from '#helpers/enums'
import CustomCheckboxesWithIcon from '~/@core/components/app-form-elements/CustomCheckboxesWithIcon.vue'

const isVisible = defineModel<boolean>('isVisible')
defineProps<{
  categories: IServiceCategory[]
  tags: IServiceTag[]
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const form = useForm({
  images: null as null | any[],
  title: '',
  desc: '',
  serviceCategoryId: '',
  keywords: [],
  urgent: false,
  budget: '',
  budgetUnit: '',
  geoLocation: '',
  address: '',
  expiresAt: format(addDays(Date.now(), 3), 'dd/MM/yyyy HH:mm'),
  deliveryOptions: [DeliveryOptions.WALK_IN] as Array<DeliveryOptions>,
})

const creatRequirement = async () => {
  form.post(routes('web.service_requirement.create'), {
    onSuccess: () => {
      emit('submit')
    },
    forceFormData: true,
  })
}
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Add Service Requirement"
    subtitle="Please specify your service requirement"
  >
    <CustomForm ref="formRef" class="q-gutter-y-sm" @submit="creatRequirement">
      <VRow>
        <VCol cols="12">
          <ErrorAlert v-if="form.errors" :errors="form.errors" />
        </VCol>
        <VCol cols="12" sm="6">
          <AppTextField
            v-model="form.title"
            label="Enter Your Title"
            :rules="[requiredValidator]"
            lazy-rules="true"
          />
        </VCol>
        <VCol cols="12" sm="6">
          <AppSelect
            v-model="form.serviceCategoryId"
            label="Select Category"
            :rules="[requiredValidator]"
            :items="categories"
            item-title="name"
            item-value="id"
          />
        </VCol>

        <VCol cols="12" sm="6">
          <SelectOrAdd
            v-model="form.keywords"
            label="Select Kewwords"
            :items="tags?.map((t) => t.name) || []"
            placeholder="Select Kewwords"
            chips
            multiple
            closable-chips
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12" sm="6">
          <VSwitch v-model="form.urgent" label="Need In short Time?" />
        </VCol>
        <VCol cols="12" sm="6">
          <AppTextField
            v-model="form.budget"
            type="number"
            label="Budget"
            :rules="[requiredValidator, (v: any) => minNumValidator(v, 1)]"
          />
        </VCol>
        <VCol cols="12" sm="6">
          <SelectOrAdd
            v-model="form.budgetUnit"
            label="Budget Units"
            :items="['Hourly', 'Fixed', 'Per Unit', 'Monthly']"
            placeholder="Select a Budget Unit"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <label>Select address</label>
          <AddressComponent
            required
            @selected-address="
              (ad) => {
                // @ts-ignore
                form.geoLocation = `${ad.geoLocation?.x},${ad.geoLocation?.y}`
                form.address = ad.mapAddress
              }
            "
          />
        </VCol>
        <!-- 👉 Delivery options custom input -->
        <VCol cols="12">
          <CustomCheckboxesWithIcon
            v-model:selected-checkbox="form.deliveryOptions"
            :checkbox-content="[
              {
                icon: { icon: 'tabler-truck-delivery' },
                title: 'Home Service',
                desc: 'Get Service at home',
                value: DeliveryOptions.HOME_SERVICE,
              },
              {
                icon: { icon: 'tabler-walk' },
                title: 'Walkin',
                desc: 'Walk in and Get Served',
                value: DeliveryOptions.WALK_IN,
              },
              {
                icon: { icon: 'tabler-wifi' },
                title: 'Online',
                desc: 'Get Service done online',
                value: DeliveryOptions.ONLINE,
              },
            ]"
            :grid-column="{ cols: '12', sm: '3' }"
            required
          />
        </VCol>
        <VCol cols="12">
          <AppTextarea
            v-model="form.desc"
            label="Requirement Detail"
            class="col-12 col-sm-6 col-md-3"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VCard border class="mb-6">
            <VCardItem>
              <template #title> Images </template>
            </VCardItem>

            <VCardText>
              <DropZone :max="5" @change="(images) => (form.images = images.map((i) => i.file))" />
            </VCardText>
          </VCard>
        </VCol>
        <!-- 👉 Card actions -->
        <VCol cols="12" class="text-center">
          <VBtn class="me-4" type="submit" :disabled="form.processing">
            <VProgressCircular v-if="form.processing" indeterminate color="primary" />
            Submit
          </VBtn>
          <VBtn color="secondary" variant="tonal" @click="isVisible = false"> Cancel </VBtn>
        </VCol>
      </VRow>
    </CustomForm>
  </ModalBase>
</template>
