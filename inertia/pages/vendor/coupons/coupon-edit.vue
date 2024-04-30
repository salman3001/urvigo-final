<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'
import type { IService } from '../../../../app/models/service'
import AppDateTimePicker from '~/@core/components/app-form-elements/AppDateTimePicker.vue'
import { ref } from 'vue'
import { ICoupon } from '../../../../app/models/coupon'

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

const props = defineProps<{
  services: IService[]
  coupon: ICoupon
}>()

const form = useForm({
  name: porps?.coupon?.name || '',
  desc: porps?.coupon?.desc ||'',
  discountType:porps?.coupon?.discountType ||'' 'flat',
  discountFlat: porps?.coupon?.discountFlat || 0,
  discountPercentage: porps?.coupon?.discountPercentage || 0,
  maxUsers: porps?.coupon?.maxUsers || 0,
  minPurchaseAmount: porps?.coupon?.minPurchaseAmount || 0,
  validFrom: porps?.coupon?.validFrom || 0,
  expiredAt: porps?.coupon?.expiredAt || 0,
  serviceIds: [] as number[],
})

const dateRange = ref<string>((porps?.coupon?.validFrom))

const submit = () => {
  const [validFrom, expiredAt] = dateRange.value!.split(' to ')
  form.validFrom = validFrom
  form.expiredAt = expiredAt
  form.post(routes('vendor.coupon.create.post'))
}
</script>

<template>
  <div>
    <CustomForm @submit="submit">
      <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
        <div class="d-flex flex-column justify-center">
          <h4 class="text-h4 font-weight-medium">Add a new Discount Coupon</h4>
          <div class="text-body-1">
            You can add coupons to providers customers special discount on checkout
          </div>
        </div>

        <div class="d-flex gap-4 align-center flex-wrap">
          <Link :href="routes('vendor.service.index')">
            <VBtn variant="tonal" color="secondary"> Discard </VBtn>
          </Link>
          <!-- <VBtn variant="tonal" color="primary" > Save for later </VBtn> -->
          <VBtn type="submit" :disabled="form.processing">Add Coupon</VBtn>
        </div>
      </div>
      <VRow>
        <VCol md="8">
          <!-- 👉 service Information -->
          <VCard class="mb-6" title="Coupon Information">
            <ErrorAlert :errors="form.errors" v-if="form.errors" />
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    label="Name"
                    placeholder="Coupon Name"
                    v-model="form.name"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <p class="q-pl-sm">Discount Type</p>
                  <VRadioGroup
                    v-model="form.discountType"
                    @update:model-value="
                      (value: string) => {
                        if (value === 'flat') {
                          form.discountPercentage = 0
                        }

                        if (value === 'percentage') {
                          form.discountFlat = 0
                        }
                      }
                    "
                  >
                    <VRadio label="Flat" value="flat" />
                    <VRadio label="Percentage" value="percentage" />
                  </VRadioGroup>
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    type="number"
                    v-model="form.discountFlat"
                    label="Flat Discount"
                    v-if="form.discountType === 'flat'"
                    :rules="[(v: string) => minNumValidator(v, 0)]"
                  />
                  <AppTextField
                    type="number"
                    v-model="form.discountPercentage"
                    label="Percentage Discount"
                    v-if="form.discountType === 'percentage'"
                    :rules="[
                      (v: string) => minNumValidator(v, 0),
                      (value: string) => maxNumValidator(value, 99),
                    ]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    type="number"
                    v-model="form.maxUsers"
                    label="Max Users"
                    :rules="[(v: string) => minNumValidator(v, 0)]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    type="number"
                    v-model="form.minPurchaseAmount"
                    label="Minimum purchase amount"
                    :rules="[(v: string) => minNumValidator(v, 0)]"
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
