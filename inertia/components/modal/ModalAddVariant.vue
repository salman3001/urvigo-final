<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { maxNumValidator, minNumValidator, requiredValidator } from '~/@core/utils/validators'
import CustomForm from '../form/CustomForm.vue'
import { ref, watch } from 'vue'
import type { IvariantFrom } from '#helpers/types'
import ModalBase from './ModalBase.vue'
import AvatarInput from '../form/AvatarInput.vue'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { VBtn } from 'vuetify/components'
import { DiscountType } from '#helpers/enums'

const props = defineProps<{
  selectedVariant?: {
    index: number
    variant: IvariantFrom
    variantThumbnailUrl: string
  }
}>()

const model = defineModel<boolean>({ required: true })

const form = useForm({
  name: '',
  price: '',
  discountType: DiscountType.FLAT,
  discountFlat: 0,
  discountPercentage: 0,
  desc: '',
})

const emits = defineEmits<{
  (e: 'variant-added', opt: { variant: IvariantFrom; image: File | null }): void
  (e: 'variant-edited', opt: { variant: IvariantFrom; image: File | null; index: number }): void
}>()

const image = ref<null | File>(null)

const emitAdd = () => {
  if (props.selectedVariant) {
    emits('variant-edited', {
      variant: {
        name: form.name,
        desc: form.desc,
        discountFlat: form.discountFlat,
        discountPercentage: form.discountPercentage,
        discountType: form.discountType,
        price: Number(form.price),
      },
      image: image.value,
      index: props.selectedVariant.index,
    })
  } else {
    emits('variant-added', {
      variant: {
        name: form.name,
        desc: form.desc,
        discountFlat: form.discountFlat,
        discountPercentage: form.discountPercentage,
        discountType: form.discountType,
        price: Number(form.price),
      },
      image: image.value,
    })
  }
}

watch(
  () => props.selectedVariant,
  () => {
    form.name = props.selectedVariant?.variant?.name || ''
    form.price = (props.selectedVariant?.variant?.price as unknown as string) || ''
    form.discountType = props.selectedVariant?.variant?.discountType || DiscountType.FLAT
    form.discountFlat = props.selectedVariant?.variant?.discountFlat || 0
    form.discountPercentage = props.selectedVariant?.variant?.discountPercentage || 0
    form.desc = props.selectedVariant?.variant?.desc || ''
  }
)
</script>
<template>
  <ModalBase v-model:is-visible="model" title="" subtitle="" persistent>
    <CustomForm @submit="emitAdd">
      <VRow>
        <VCol cols="12">
          <div class="d-flex">
            <AvatarInput
              name="image"
              size="120"
              :url="selectedVariant?.variantThumbnailUrl"
              @image="
                (file: any) => {
                  image = file
                }
              "
            />
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField v-model="form.name" label="Name" :rules="[requiredValidator]" />
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField
            v-model="form.price"
            type="number"
            label="Price"
            :rules="[requiredValidator, (v: string) => minNumValidator(v, 1)]"
          />
        </VCol>
        <VCol cols="12" md="6">
          <p class="q-pl-sm">Discount Type</p>
          <VRadioGroup
            v-model="form.discountType"
            @update:model-value="
              (value: string) => {
                if (value === DiscountType.FLAT) {
                  form.discountPercentage = 0
                }

                if (value === DiscountType.PERCENATAGE) {
                  form.discountFlat = 0
                }
              }
            "
          >
            <VRadio label="Flat" :value="DiscountType.FLAT" />
            <VRadio label="Percentage" :value="DiscountType.PERCENATAGE" />
          </VRadioGroup>
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField
            v-if="form.discountType === DiscountType.FLAT"
            v-model="form.discountFlat"
            type="number"
            label="Flat Discount"
            :rules="[
              (v: string) => minNumValidator(v, 0),
              (value: string) => maxNumValidator(value, Number(form.price)),
            ]"
          />
          <AppTextField
            v-if="form.discountType === DiscountType.PERCENATAGE"
            v-model="form.discountPercentage"
            type="number"
            label="Percentage Discount"
            :rules="[
              (v: string) => minNumValidator(v, 0),
              (value: string) => maxNumValidator(value, 99),
            ]"
          />
        </VCol>
        <VCol cols="12">
          <AppTextarea v-model="form.desc" label="Short Description" />
        </VCol>
        <VCol cols="12" class="d-flex justify-end gap-2">
          <VBtn
            variant="text"
            @click="
              () => {
                model = false
              }
            "
            >Cancle</VBtn
          >
          <VBtn prepend-icon="tabler-plus" type="submit">{{
            selectedVariant ? 'Update' : 'Add Variant'
          }}</VBtn>
        </VCol>
      </VRow>
    </CustomForm>
  </ModalBase>
</template>
