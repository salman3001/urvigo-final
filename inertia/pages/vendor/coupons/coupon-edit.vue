<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'
import type { IService } from '#models/service'
import AppDateTimePicker from '~/@core/components/app-form-elements/AppDateTimePicker.vue'
import { ref } from 'vue'
import type { ICoupon } from '#models/coupon'
import { DiscountType } from '#helpers/enums'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import ProductDescriptionEditor from '~/@core/components/ProductDescriptionEditor.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { maxNumValidator, minNumValidator, requiredValidator } from '~/@core/utils/validators'
import CustomForm from '~/components/form/CustomForm.vue'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import { format } from 'date-fns'

const props = defineProps<{
  services: IService[]
  coupon: ICoupon
}>()

const form = useForm({
  name: props?.coupon?.name || '',
  desc: props?.coupon?.desc || '',
  discountType: props?.coupon?.discountType || DiscountType.FLAT,
  discountFlat: props?.coupon?.discountFlat || 0,
  discountPercentage: props?.coupon?.discountPercentage || 0,
  maxUsers: props?.coupon?.maxUsers || 0,
  minPurchaseAmount: props?.coupon?.minPurchaseAmount || 10,
  validFrom: (props?.coupon?.validFrom || 0) as unknown as string,
  expiredAt: (props?.coupon?.expiredAt || 0) as unknown as string,
  serviceIds: props?.coupon?.services?.map((s) => s.id) || [],
})

const dateRange = ref<string>(
  format(props?.coupon?.validFrom, 'dd/MM/yyyy HH:mm') +
    ' to ' +
    format(props?.coupon?.expiredAt, 'dd/MM/yyyy HH:mm')
)

const submit = () => {
  const [validFrom, expiredAt] = dateRange.value!.split(' to ')
  form.validFrom = validFrom
  form.expiredAt = expiredAt
  form.put(routes('vendor.coupon.edit.post', [props.coupon.id]))
}

const minPurchaseValidator = (v: string) => {
  if (form.discountType === DiscountType.FLAT) {
    return minNumValidator(v, form.discountFlat)
  }
  if (form.discountType === DiscountType.PERCENATAGE) {
    return minNumValidator(v, 10)
  }
}
</script>

<template>
  <div>
    <CustomForm @submit="submit">
      <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
        <div class="d-flex flex-column justify-center">
          <h4 class="text-h4 font-weight-medium">Update Discount Coupon</h4>
          <div class="text-body-1">
            You can add coupons to providers customers special discount on checkout
          </div>
        </div>

        <div class="d-flex gap-4 align-center flex-wrap">
          <Link :href="routes('vendor.service.index')">
            <VBtn variant="tonal" color="secondary"> Discard </VBtn>
          </Link>
          <!-- <VBtn variant="tonal" color="primary" > Save for later </VBtn> -->
          <VBtn type="submit" :disabled="form.processing">Update Coupon</VBtn>
        </div>
      </div>
      <VRow>
        <VCol md="8">
          <!-- 👉 service Information -->
          <VCard class="mb-6" title="Coupon Information">
            <ErrorAlert v-if="form.errors" :errors="form.errors" />
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.name"
                    label="Name"
                    placeholder="Coupon Name"
                    :rules="[requiredValidator]"
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
                    :rules="[(v: string) => minNumValidator(v, 0)]"
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
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.maxUsers"
                    type="number"
                    label="Max Users"
                    :rules="[(v: string) => minNumValidator(v, 0)]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.minPurchaseAmount"
                    type="number"
                    label="Minimum purchase amount"
                    :rules="[requiredValidator, minPurchaseValidator]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppDateTimePicker
                    v-model="dateRange"
                    label="Select Date range"
                    placeholder="Select date range"
                    :config="{ enableTime: true, dateFormat: 'd/m/Y H:i', mode: 'range' }"
                    :rules="[requiredValidator]"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <VCol md="4" cols="12">
          <!-- 👉 Categories -->
          <VCard title="Select Services" class="mb-6">
            <VCardText>
              <div class="d-flex flex-column gap-y-4">
                <AppSelect
                  v-model="form.serviceIds"
                  multiple
                  chips
                  :items="services"
                  item-title="name"
                  item-value="id"
                  label="Select Services"
                  style="min-inline-size: 260px"
                  :rules="[requiredValidator]"
                />
              </div>
            </VCardText>
          </VCard>
          <!-- description -->
          <VCard title="Description (optional)" class="mb-6">
            <VCardText>
              <ProductDescriptionEditor
                v-model="form.desc"
                placeholder="service Description"
                class="border rounded"
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </CustomForm>
  </div>
</template>
