<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'
import type Service from '../../../../app/models/service'
import AppDateTimePicker from '~/@core/components/app-form-elements/AppDateTimePicker.vue'

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

defineProps<{
  services: Service[]
}>()

const form = useForm({
  name: '',
  desc: '',
  discountType: 'flat',
  discountFlat: 0,
  discountPercentage: 0,
  maxUsers: 0,
  minPurchaseAmount: 0,
  validFrom: '',
  expiredAt: '',
  serviceIds: [] as number[],
})

const submit = () => {
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
          <VBtn type="submit">Add Coupon</VBtn>
        </div>
      </div>
      <VRow>
        <VCol md="8">
          <!-- 👉 service Information -->
          <VCard class="mb-6" title="Service Information">
            <ErrorAlert :errors="form.errors" v-if="form.errors" />
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    label="Name"
                    placeholder="Service Name"
                    v-model="form.name"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppSelect
                    label="Discount Type"
                    v-model="form.discountType"
                    :items="['flat', 'percentage']"
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
                </VCol>
                <VCol cols="12" md="6">
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
                    v-model="form.validFrom"
                    label="Valid from"
                    placeholder="Select date and time"
                    :config="{
                      enableTime: true,
                      dateFormat: 'd/m/Y H:i',
                    }"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppDateTimePicker
                    v-model="form.expiredAt"
                    label="Expires At"
                    placeholder="Select date and time"
                    :config="{
                      enableTime: true,
                      dateFormat: 'd/m/Y H:i',
                    }"
                  />
                </VCol>
                <VCol cols="12">
                  <span class="mb-1">Description (optional)</span>
                  <ProductDescriptionEditor
                    v-model="form.desc"
                    placeholder="service Description"
                    class="border rounded"
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
                  :items="services"
                  item-title="name"
                  item-value="id"
                  label="Select Services"
                  style="min-inline-size: 260px"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </CustomForm>
  </div>
</template>
