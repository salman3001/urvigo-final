<script setup lang="ts">
import type ServiceCategory from '#models/service_category'
import type ServiceTag from '#models/service_tag'
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

const isVisible = defineModel<boolean>('isVisible')
defineProps<{
  categories: ServiceCategory[]
  tags: ServiceTag[]
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
  location: '21.25,87.52',
  expiresAt: format(addDays(Date.now(), 3), 'dd/MM/yyyy HH:mm'),
})

const creatRequirement = async () => {
  form.post(routes.service_requirement.create, {
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
        <VCol cols="12">
          <AppTextField
            v-model="form.title"
            label="Enter Your Title"
            :rules="[requiredValidator]"
            lazy-rules="true"
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
          <AppSelect
            label="Select Category"
            :rules="[requiredValidator]"
            :items="categories"
            item-title="name"
            item-value="id"
            v-model="form.serviceCategoryId"
          />
        </VCol>
        <VCol cols="12">
          <SelectOrAdd
            label="Select Kewwords"
            v-model="form.keywords"
            :items="tags?.map((t) => t.name) || []"
            placeholder="Select Kewwords"
            chips
            multiple
            closable-chips
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <VSwitch v-model="form.urgent" label="Need In short Time?" />
        </VCol>
        <VCol cols="12">
          <AppTextField
            type="number"
            v-model="form.budget"
            label="Budget"
            :rules="[requiredValidator, (v: any) => minNumValidator(v, 1)]"
          />
        </VCol>
        <VCol cols="12">
          <SelectOrAdd
            label="Budget Units"
            v-model="form.budgetUnit"
            :items="['Hourly', 'Fixed', 'Per Unit', 'Monthly']"
            placeholder="Select a Budget Unit"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12">
          <AppTextField v-model="form.location" label="Location" :rules="[requiredValidator]" />
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
            <VProgressCircular indeterminate color="primary" v-if="form.processing" />
            Submit
          </VBtn>
          <VBtn color="secondary" variant="tonal" @click="isVisible = false"> Cancel </VBtn>
        </VCol>
      </VRow>
    </CustomForm>
  </ModalBase>
</template>
