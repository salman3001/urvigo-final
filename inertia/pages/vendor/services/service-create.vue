<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'
import { DeliveryOptions } from '#helpers/enums'
import AddressComponent from '~/components/AddressComponent.vue'
import CustomRadios from '~/@core/components/app-form-elements/CustomRadios.vue'
import type { ITimeslotPlan } from '../../../../app/models/timeslot_plan'
import ModalAddTimeslotPlan from '~/components/modal/ModalAddTimeslotPlan.vue'
import CustomCheckboxesWithIcon from '~/@core/components/app-form-elements/CustomCheckboxesWithIcon.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type { IvariantFrom } from '#helpers/types'
import type { IServiceCategory } from '#models/service_category'
import type { IServiceSubcategory } from '#models/service_subcategory'
import type { IServiceTag } from '#models/service_tag'
import { Link, router, useForm } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import DropZone from '~/@core/components/DropZone.vue'
import ProductDescriptionEditor from '~/@core/components/ProductDescriptionEditor.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { requiredValidator } from '~/@core/utils/validators'
import dummyThumb from '~/assets/images/no-image.png'
import AvatarInput from '~/components/form/AvatarInput.vue'
import CustomForm from '~/components/form/CustomForm.vue'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import ModalAddVariant from '~/components/modal/ModalAddVariant.vue'

defineProps<{
  categories: IServiceCategory[]
  subcategories: IServiceSubcategory[]
  tags: IServiceTag[]
  timeslotPlans: ITimeslotPlan[]
}>()

const form = useForm({
  thumbnail: null,
  images: [] as File[],
  video: null,
  variantImages: [] as Array<File | null>,
  service: {
    name: '',
    slug: '',
    serviceCategoryId: '',
    serviceSubcategoryId: '',
    locationSpecific: '',
    shortDesc: '',
    longDesc: '',
    deliveryOptions: [DeliveryOptions.WALK_IN] as Array<DeliveryOptions>,
    geoLocation: '',
    address: '',
    kmRadius: 10,
    isActive: true,
  },
  tags: [] as number[],
  seo: {
    metaTitle: '',
    metaKeywords: '',
    metaDesc: '',
  },
  faq: [] as {
    quest: string
    ans: string
  }[],
  variant: [] as IvariantFrom[],
  timeSlotPlanId: '' as unknown as number,
})

const variantModalRef = ref(false)
const selectedVariant = ref<
  | {
      index: number
      variant: IvariantFrom
      variantThumbnailUrl: string
    }
  | undefined
>(undefined)
const timeslotAddModal = ref(false)

const removeVariant = (index: number) => {
  form.variantImages.splice(index, 1)
  form.variant.splice(index, 1)
}

const onVariantAdded = (opt: { variant: IvariantFrom; image: File | null }) => {
  console.log(opt)
  form.variant.push(opt.variant)
  form.variantImages.push(opt.image)
  variantModalRef.value = false
}

const onVariantEdited = (opt: { variant: IvariantFrom; image: File | null; index: number }) => {
  form.variant[opt.index] = opt.variant
  form.variantImages[opt.index] = opt.image
  variantModalRef.value = false
}

const serviceThumbnailUrl = computed(() => {
  return form.thumbnail ? URL.createObjectURL(form.thumbnail) : dummyThumb
})

const variantThumbnailUrl = computed(() => {
  return form.variantImages.map((v) => (v ? URL.createObjectURL(v) : dummyThumb))
})

const submit = () => {
  if (form.variant.length < 1) {
    alert('Please add a service variant')
  } else {
    form.post(routes('vendor.service.create.post'), {
      forceFormData: true,
    })
  }
}
</script>

<template>
  <div>
    <CustomForm @submit="submit">
      <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
        <div class="d-flex flex-column justify-center">
          <h4 class="text-h4 font-weight-medium">Add a new service</h4>
          <div class="text-body-1">Orders placed across your store</div>
        </div>

        <div class="d-flex gap-4 align-center flex-wrap">
          <Link :href="routes('vendor.service.index')">
            <VBtn variant="tonal" color="secondary"> Discard </VBtn>
          </Link>
          <!-- <VBtn variant="tonal" color="primary" > Save for later </VBtn> -->
          <VBtn type="submit" :disabled="form.processing">Publish Service</VBtn>
        </div>
      </div>
      <VRow>
        <VCol md="8">
          <!-- 👉 service Information -->
          <VCard class="mb-6" title="Service Information">
            <ErrorAlert v-if="form.errors" :errors="form.errors" />
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.service.name"
                    label="Name"
                    placeholder="Service Name"
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol cols="12">
                  <label for="" class="v-label mb-2">Select Service Address</label>
                  <!-- <div class="pa-2 text-h5 border rounded my-2" v-if="form.service.address">
                    {{ form.service.address }}
                  </div> -->
                  <AddressComponent
                    required
                    @selected-address="
                      (ad) => {
                        // @ts-ignore
                        form.service.geoLocation = `${ad.geoLocation?.x},${ad.geoLocation?.y}`
                        form.service.address = ad.mapAddress
                      }
                    "
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextarea v-model="form.service.shortDesc" label="Short Description" />
                </VCol>
                <VCol cols="12">
                  <span class="mb-1">Description (optional)</span>
                  <ProductDescriptionEditor
                    v-model="form.service.longDesc"
                    placeholder="service Description"
                    class="border rounded"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- 👉 Variants -->
          <VCard title="Variants (Minimum 01 is required)" class="mb-6">
            <VCardText>
              <VTable density="compact" class="text-no-wrap">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(v, i) in form.variant" :key="i">
                    <td>
                      {{ v.name }}
                    </td>
                    <td>
                      {{ v.price }}
                    </td>
                    <td>
                      <div class="d-flex align-center gap-2">
                        <IconBtn
                          @click="
                            () => {
                              selectedVariant = {
                                index: i,
                                variant: {
                                  desc: v.desc,
                                  discountFlat: v.discountFlat as number,
                                  discountPercentage: v.discountPercentage as number,
                                  discountType: v.discountType,
                                  name: v.name,
                                  price: v.price as number,
                                },
                                variantThumbnailUrl: variantThumbnailUrl[i],
                              }
                              variantModalRef = true
                            }
                          "
                        >
                          <VIcon icon="tabler-pencil" />
                        </IconBtn>

                        <IconBtn @click="() => removeVariant(i)">
                          <VIcon icon="tabler-trash" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </VTable>

              <VBtn
                class="mt-6"
                variant="tonal"
                prepend-icon="tabler-plus"
                @click="
                  () => {
                    selectedVariant = undefined
                    variantModalRef = true
                  }
                "
              >
                Add variant
              </VBtn>
            </VCardText>
          </VCard>

          <!-- 👉 Media -->
          <VCard class="mb-6">
            <VCardItem>
              <template #title> Service Image </template>

              <template #append>
                <span class="text-primary font-weight-medium text-sm cursor-pointer"
                  >Add Media from URL</span
                >
              </template>
            </VCardItem>

            <VCardText>
              <DropZone :max="5" @change="(images) => (form.images = images.map((i) => i.file))" />
            </VCardText>
          </VCard>

          <!-- 👉 Faqs -->
          <VCard title="Frequently Asked Questions" class="inventory-card">
            <VCardText>
              <div class="column q-gutter-sm">
                <div v-for="(f, i) in form.faq" :key="i">
                  <div class="d-flex justify-space-between align-center">
                    <p class="text-bold">Faq - {{ i + 1 }}</p>
                    <VTooltip text="Remove Faq">
                      <template #activator="{ props }">
                        <IconBtn
                          v-bind="props"
                          @click="
                            () => {
                              form.faq.splice(i, 1)
                            }
                          "
                        >
                          <VIcon icon="tabler-trash" />
                        </IconBtn>
                      </template>
                    </VTooltip>
                  </div>

                  <div>
                    <AppTextField
                      v-model="f.quest"
                      label="Question"
                      placeholder="Add a Question"
                      :rules="[requiredValidator]"
                    />
                    <AppTextarea
                      v-model="f.ans"
                      label="Answer"
                      placeholder="Add answer"
                      :rules="[requiredValidator]"
                    />
                    <br />
                  </div>
                </div>
              </div>

              <div class="q-pt-md">
                <VBtn
                  class="mt-6"
                  variant="tonal"
                  prepend-icon="tabler-plus"
                  @click="
                    () => {
                      form.faq.push({
                        quest: '',
                        ans: '',
                      })
                    }
                  "
                >
                  Add Faq
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <VCol md="4" cols="12">
          <!-- 👉 Thumbnail -->
          <VCard title=" Service Thumbnail" class="mb-6">
            <VCardText>
              <div class="d-flex ga-2">
                <AvatarInput
                  name="logo"
                  :url="serviceThumbnailUrl"
                  helper-text="Add a Thumbnail"
                  size="120"
                  @image="
                    (f) => {
                      form.thumbnail = f as unknown as null
                    }
                  "
                />
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Categories -->
          <VCard title="Categorize" class="mb-6">
            <VCardText>
              <div class="d-flex flex-column gap-y-4">
                <AppSelect
                  v-model="form.service.serviceCategoryId"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="Select Category"
                  style="min-inline-size: 260px"
                />
                <AppSelect
                  v-model="form.service.serviceSubcategoryId"
                  :items="subcategories"
                  item-title="name"
                  item-value="id"
                  label="Select Sub Category"
                  style="min-inline-size: 260px"
                />
                <AppSelect
                  v-model="form.tags"
                  :items="tags"
                  item-title="name"
                  item-value="id"
                  label="Select Tags"
                  chips
                  multiple
                  closable-chips
                  style="min-inline-size: 260px"
                />
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Delivery options -->
          <VCard title="Delivery options" class="mb-6">
            <VCardText>
              <div class="d-flex ga-2 flex-column">
                <CustomCheckboxesWithIcon
                  v-model:selected-checkbox="form.service.deliveryOptions"
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
                  :grid-column="{ cols: '12' }"
                  required
                />
                <div
                  v-if="form.service.deliveryOptions.includes(DeliveryOptions.HOME_SERVICE)"
                  class="mt-2"
                >
                  <AppTextField
                    v-model="form.service.kmRadius"
                    label="Max distance (Km) for home services"
                    type="number"
                    placeholder="Specify in kilometers"
                    :rules="[requiredValidator]"
                  />
                </div>
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Select Time Slot plan -->
          <VCard title="Select timeslot plan" subtitle="Only for booking by timeslots" class="mb-6">
            <VCardText>
              <div class="d-flex ga-2 flex-column">
                <CustomRadios
                  v-if="timeslotPlans"
                  v-model:selected-radio="form.timeSlotPlanId"
                  :radio-content="timeslotPlans.map((t) => ({ title: t.name, value: t.id }))"
                  :grid-column="{ cols: '12' }"
                />
                <div v-else>No Timeslot plans found! Please a plan</div>
                <div class="mt-2">
                  <VBtn
                    variant="tonal"
                    prepend-icon="tabler-plus"
                    text="Add plan"
                    @click="
                      () => {
                        timeslotAddModal = true
                      }
                    "
                  />
                </div>
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 SEO -->
          <VCard title="SEO">
            <VCardText>
              <div class="d-flex flex-column gap-y-4">
                <AppTextField v-model="form.seo.metaTitle" label="Meta Title" />
                <AppTextField v-model="form.seo.metaKeywords" label="Meta Keywords" />
                <AppTextarea
                  v-model="form.seo.metaDesc"
                  type="textarea"
                  outlined
                  label="Meta Description"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      <ModalAddVariant
        v-model:isVisible="variantModalRef"
        :selected-variant="selectedVariant"
        @variant-added="
          (opt) => {
            onVariantAdded(opt)
          }
        "
        @variant-edited="
          (opt) => {
            onVariantEdited(opt)
          }
        "
      />
      <ModalAddTimeslotPlan
        v-model="timeslotAddModal"
        @success="
          () => {
            router.reload({
              only: ['timeslotPlans'],
            })
            timeslotAddModal = false
          }
        "
      />
    </CustomForm>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}
</style>
