<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { IvariantFrom } from '#helpers/types'
import type ServiceCategory from '#models/service_category'
import type ServiceSubcategory from '#models/service_subcategory'
import type ServiceTag from '#models/service_tag'
import { Link, useForm } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { VRadioGroup } from 'vuetify/components'
import DropZone from '~/@core/components/DropZone.vue'
import ProductDescriptionEditor from '~/@core/components/ProductDescriptionEditor.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { maxNumValidator, minNumValidator, requiredValidator } from '~/@core/utils/validators'
import dummyThumb from '~/assets/images/no-image.png'
import AvatarInput from '~/components/form/AvatarInput.vue'
import ModalAddVariant from '~/components/modal/ModalAddVariant.vue'

defineProps<{
  categories: ServiceCategory[]
  subcategories: ServiceSubcategory[]
  tags: ServiceTag[]
}>()

const activeTab = ref('Restock')
const isTaxChargeToProduct = ref(true)

const shippingList = [
  {
    desc: "You'll be responsible for product delivery.Any damage or delay during shipping may cost you a Damage fee",
    title: 'Fulfilled by Seller',
    value: 'Fulfilled by Seller',
  },
  {
    desc: 'Your product, Our responsibility.For a measly fee, we will handle the delivery process for you.',
    title: 'Fulfilled by Company name',
    value: 'Fulfilled by Company name',
  },
] as const

const shippingType = ref<(typeof shippingList)[number]['value']>('Fulfilled by Company name')
const deliveryType = ref('Worldwide delivery')
const selectedAttrs = ref(['Biodegradable', 'Expiry Date'])

const inventoryTabsData = [
  { icon: 'tabler-cube', title: 'Restock', value: 'Restock' },
  { icon: 'tabler-car', title: 'Shipping', value: 'Shipping' },
  { icon: 'tabler-map-pin', title: 'Global Delivery', value: 'Global Delivery' },
  { icon: 'tabler-world', title: 'Attributes', value: 'Attributes' },
  { icon: 'tabler-lock', title: 'Advanced', value: 'Advanced' },
]

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
    geoLocation: '23.5,67.3',
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
})

const variantModalRef = ref<boolean[]>([])
const variantModalEditMode = ref(false)

const addVariant = () => {
  form.variant.push({
    name: '',
    price: 0,
    discountType: 'flat',
    discountFlat: 0,
    discountPercentage: 0,
    desc: '',
  })
  form.variantImages.push(null)
  variantModalRef.value.push(true)
}

const removeVariant = (index: number) => {
  variantModalRef.value.splice(index, 1)
  form.variantImages.splice(index, 1)
  form.variant.splice(index, 1)
}

const onVariantAdded = (opt: { variant: IvariantFrom; image: File | null }, index: number) => {
  form.variant[index] = opt.variant
  form.variantImages[index] = opt.image
  variantModalRef.value[index] = false
}

const onVariantCancle = (index: number) => {
  if (variantModalEditMode.value === false) {
    variantModalRef.value.pop()
    form.variantImages.pop()
    form.variant.pop()
  } else {
    variantModalEditMode.value = false
    variantModalRef.value[index] = false
  }
}

const screenShotUrls = computed(() => {
  return form.images.map((img: File) => URL.createObjectURL(img))
})

const serviceThumbnailUrl = computed(() => {
  return form.thumbnail ? URL.createObjectURL(form.thumbnail) : dummyThumb
})

const variantThumbnailUrl = computed(() => {
  return form.variantImages.map((v) => (v ? URL.createObjectURL(v) : dummyThumb))
})
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">Add a new product</h4>
        <div class="text-body-1">Orders placed across your store</div>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <Link :href="routes('vendor.service.index')">
          <VBtn variant="tonal" color="secondary"> Discard </VBtn>
        </Link>
        <VBtn variant="tonal" color="primary"> Save for later </VBtn>
        <VBtn>Publish Service</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Product Information -->
        <VCard class="mb-6" title="Product Information">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField label="Name" placeholder="Service Name" />
              </VCol>
              <VCol cols="12" md="6">
                <AppSelect
                  v-model="form.service.serviceCategoryId"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="Select Category"
                  style="min-inline-size: 260px"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppSelect
                  v-model="form.service.serviceSubcategoryId"
                  :items="subcategories"
                  item-title="name"
                  item-value="id"
                  label="Select Sub Category"
                  style="min-inline-size: 260px"
                />
              </VCol>
              <VCol cols="12" md="6">
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
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField
                  label="Location"
                  placeholder="FXSK123U"
                  v-model="form.service.geoLocation"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea label="Short Description" v-model="form.service.shortDesc" />
              </VCol>
              <VCol cols="12">
                <span class="mb-1">Description (optional)</span>
                <ProductDescriptionEditor
                  v-model="form.service.longDesc"
                  placeholder="Product Description"
                  class="border rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- 👉 Media -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title> Product Image </template>
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

        <!-- 👉 Variants -->
        <VCard title="Variants (Minimum 01 is required)" class="mb-6">
          <VCardText>
            <template v-for="(v, i) in form.variant" :key="i">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex align-center gap-2">
                    <p class="text-subtitle1 text-bold">{{ v.name }}</p>
                    <IconBtn
                      @click="
                        () => {
                          variantModalEditMode = true
                          variantModalRef[i] = true
                        }
                      "
                    >
                      <VIcon icon="tabler-pencil" />
                    </IconBtn>

                    <IconBtn @click="() => removeVariant(i)">
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
                  </div>
                  <br />
                </VCol>
                <!-- <div class="col-12 q-mb-xl">
                  <div class="q-py-xs" style="font-weight: 500">Thumbnail</div>

                  <AvatarInput
                    name="inage"
                    @image="
                      (file: any) => {
                        form.variantImages[i] = file
                      }
                    "
                    width="10rem"
                    height="8rem"
                    style="max-width: 10rem"
                    :url="variantThumbnailUrl[i]"
                  />
                </div>
                 -->
                <!-- <AppTextField v-model="v.name" label="Name" :rules="[requiredValidator]" />
                <AppTextField
                  type="number"
                  v-model="v.price"
                  label="Price"
                  :rules="[requiredValidator, (v: string) => minNumValidator(v, 1)]"
                />
                <div class="col-12 col-sm-6 col-md-3">
                  <p class="q-pl-sm">Discount Type</p>
                  <VRadioGroup
                    v-model="v.discountType"
                    @update:model-value="
                      (value) => {
                        if (value === 'flat') {
                          v.discountPercentage = 0
                        }

                        if (value === 'percentage') {
                          v.discountFlat = 0
                        }
                      }
                    "
                  >
                    <VRadio label="Flat" value="flat" />
                    <VRadio label="Percentage" value="percentage" />
                  </VRadioGroup>
                </div>
                <AppTextField
                  type="number"
                  v-model="v.price"
                  label="Flat Discount"
                  v-if="v.discountType === 'flat'"
                  :rules="[
                    (v: string) => minNumValidator(v, 0),
                    (value: string) => maxNumValidator(value, v.price),
                  ]"
                />
                <AppTextField
                  type="number"
                  v-model="v.price"
                  label="Percentage Discount"
                  v-if="v.discountType === 'percentage'"
                  :rules="[
                    (v: string) => minNumValidator(v, 0),
                    (value: string) => maxNumValidator(value, 99),
                  ]"
                />
                <AppTextarea label="Short Description" v-model="v.desc" /> -->
                <ModalAddVariant
                  v-model:isVisible="variantModalRef[i]"
                  :variant="v"
                  :variantThumbnailUrl="variantThumbnailUrl[i]"
                  @cancled="() => onVariantCancle(i)"
                  @variant-added="
                    (opt) => {
                      onVariantAdded(opt, i)
                    }
                  "
                />
              </VRow>
            </template>

            <VBtn class="mt-6" prepend-icon="tabler-plus" @click="addVariant"> Add variant </VBtn>
          </VCardText>
        </VCard>

        <!-- 👉 Inventory -->
        <VCard title="Inventory" class="inventory-card">
          <VCardText>
            <VRow>
              <VCol cols="12" md="4">
                <div class="pe-3">
                  <VTabs
                    v-model="activeTab"
                    direction="vertical"
                    color="primary"
                    class="v-tabs-pill"
                  >
                    <VTab v-for="(tab, index) in inventoryTabsData" :key="index">
                      <VIcon :icon="tab.icon" class="me-2" />
                      <div class="text-truncate font-weight-medium text-start">
                        {{ tab.title }}
                      </div>
                    </VTab>
                  </VTabs>
                </div>
              </VCol>

              <VDivider :vertical="!$vuetify.display.smAndDown" />

              <VCol cols="12" md="8">
                <VWindow v-model="activeTab" class="w-100" :touch="false">
                  <VWindowItem value="Restock">
                    <div class="d-flex flex-column gap-y-4 ps-3">
                      <p class="mb-0">Options</p>

                      <div class="d-flex gap-x-4 align-center">
                        <AppTextField label="Add to Stock" placeholder="Quantity" />
                        <VBtn class="align-self-end"> Confirm </VBtn>
                      </div>

                      <div>
                        <div class="text-base text-high-emphasis pb-2">
                          Product in stock now: 54
                        </div>
                        <div class="text-base text-high-emphasis pb-2">Product in transit: 390</div>
                        <div class="text-base text-high-emphasis pb-2">
                          Last time restocked: 24th June, 2022
                        </div>
                        <div class="text-base text-high-emphasis pb-2">
                          Total stock over lifetime: 2,430
                        </div>
                      </div>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Shipping">
                    <VRadioGroup v-model="shippingType" label="Shipping Type" class="ms-3">
                      <VRadio
                        v-for="item in shippingList"
                        :key="item.value"
                        :value="item.value"
                        class="mb-4"
                      >
                        <template #label>
                          <div>
                            <div class="text-high-emphasis font-weight-medium mb-1">
                              {{ item.title }}
                            </div>
                            <div class="text-sm">
                              {{ item.desc }}
                            </div>
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VWindowItem>

                  <VWindowItem value="Global Delivery">
                    <div class="ps-3">
                      <h5 class="text-h5 mb-6">Global Delivery</h5>

                      <VRadioGroup v-model="deliveryType" label="Global Delivery">
                        <VRadio value="Worldwide delivery" class="mb-4">
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Worldwide delivery
                              </div>
                              <div class="text-sm">
                                Only available with Shipping method:
                                <span class="text-primary"> Fulfilled by Company name </span>
                              </div>
                            </div>
                          </template>
                        </VRadio>

                        <VRadio value="Selected Countries" class="mb-4">
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Selected Countries
                              </div>
                              <VTextField placeholder="USA" style="min-inline-size: 200px" />
                            </div>
                          </template>
                        </VRadio>

                        <VRadio>
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Local delivery
                              </div>
                              <div class="text-sm">
                                Deliver to your country of residence
                                <span class="text-primary"> Change profile address </span>
                              </div>
                            </div>
                          </template>
                        </VRadio>
                      </VRadioGroup>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Attributes">
                    <div class="ps-3">
                      <div class="mb-6 text-h6">Attributes</div>
                      <div class="d-flex flex-column gap-y-1">
                        <VCheckbox
                          v-model="selectedAttrs"
                          label="Fragile Product"
                          value="Fragile Product"
                        />
                        <VCheckbox
                          v-model="selectedAttrs"
                          value="Biodegradable"
                          label="Biodegradable"
                        />
                        <VCheckbox v-model="selectedAttrs" value="Frozen Product">
                          <template #label>
                            <div class="d-flex flex-column mb-1">
                              <div>Frozen Product</div>
                              <VTextField
                                placeholder="40 C"
                                type="number"
                                style="min-inline-size: 250px"
                              />
                            </div>
                          </template>
                        </VCheckbox>
                        <VCheckbox v-model="selectedAttrs" value="Expiry Date">
                          <template #label>
                            <div class="d-flex flex-column mb-1">
                              <div>Expiry Date of Product</div>
                              <AppDateTimePicker
                                model-value="2025-06-14"
                                placeholder="Select a Date"
                              />
                            </div>
                          </template>
                        </VCheckbox>
                      </div>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Advanced">
                    <div class="ps-3">
                      <h5 class="text-h5 mb-6">Advanced</h5>
                      <div
                        class="d-flex flex-sm-row flex-column flex-wrap justify-space-between gap-x-6 gap-y-4"
                      >
                        <AppSelect
                          label="Product ID Type"
                          placeholder="Select Product Type"
                          :items="['ISBN', 'UPC', 'EAN', 'JAN']"
                        />
                        <AppTextField label="Product Id" placeholder="100023" />
                      </div>
                    </div>
                  </VWindowItem>
                </VWindow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol md="4" cols="12">
        <!-- 👉 Pricing -->
        <VCard title="Pricing" class="mb-6">
          <VCardText>
            <AppTextField label="Best Price" placeholder="Price" class="mb-6" />
            <AppTextField label="Discounted Price" placeholder="$499" class="mb-6" />

            <VCheckbox v-model="isTaxChargeToProduct" label="Charge Tax on this product" />

            <VDivider class="my-2" />

            <div class="d-flex flex-raw align-center justify-space-between">
              <span>In stock</span>
              <VSwitch density="compact" />
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Organize -->
        <VCard title="Organize">
          <VCardText>
            <div class="d-flex flex-column gap-y-4">
              <AppSelect
                placeholder="Select Vendor"
                label="Vendor"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <div>
                <VLabel class="d-flex">
                  <div class="d-flex text-sm justify-space-between w-100">
                    <div class="text-high-emphasis">Category</div>
                  </div>
                </VLabel>

                <div class="d-flex gap-x-4">
                  <AppSelect
                    placeholder="Select Category"
                    :items="['Household', 'Office', 'Electronics', 'Management', 'Automotive']"
                  />
                  <VBtn rounded icon="tabler-plus" variant="tonal" />
                </div>
              </div>
              <AppSelect
                placeholder="Select Collection"
                label="Collection"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <AppSelect
                placeholder="Select Status"
                label="Status"
                :items="['Published', 'Inactive', 'Scheduled']"
              />
              <AppTextField label="Tags" placeholder="Fashion, Trending, Summer" />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
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
