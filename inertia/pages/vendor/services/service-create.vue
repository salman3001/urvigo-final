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
  categories: ServiceCategory[]
  subcategories: ServiceSubcategory[]
  tags: ServiceTag[]
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

const imagesUrls = computed(() => {
  return form.images.map((img: File) => URL.createObjectURL(img))
})

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
      forceFormData: true
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
          <VBtn type="submit">Publish Service</VBtn>
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
                  <AppTextField label="Name" placeholder="Service Name" v-model="form.service.name"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12">
                  <AppTextField label="Location" placeholder="FXSK123U" v-model="form.service.geoLocation"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12">
                  <AppTextarea label="Short Description" v-model="form.service.shortDesc" />
                </VCol>
                <VCol cols="12">
                  <span class="mb-1">Description (optional)</span>
                  <ProductDescriptionEditor v-model="form.service.longDesc" placeholder="service Description"
                    class="border rounded" />
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
                    <th>
                      Name
                    </th>
                    <th>
                      Price
                    </th>
                    <th>
                      Actions
                    </th>
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
                        <IconBtn @click="() => {
      variantModalEditMode = true
      variantModalRef[i] = true
    }
      ">
                          <VIcon icon="tabler-pencil" />
                        </IconBtn>

                        <IconBtn @click="() => removeVariant(i)">
                          <VIcon icon="tabler-trash" />
                        </IconBtn>
                      </div>

                      <ModalAddVariant v-model:isVisible="variantModalRef[i]" :variant="v"
                        :variantThumbnailUrl="variantThumbnailUrl[i]" @cancled="() => onVariantCancle(i)"
                        @variant-added="(opt) => {
      onVariantAdded(opt, i)
    }
      " />
                    </td>
                  </tr>
                </tbody>
              </VTable>



              <VBtn class="mt-6" prepend-icon="tabler-plus" @click="addVariant"> Add variant </VBtn>
            </VCardText>
          </VCard>


          <!-- 👉 Media -->
          <VCard class="mb-6">
            <VCardItem>
              <template #title> Service Image </template>

              <template #append>
                <span class="text-primary font-weight-medium text-sm cursor-pointer">Add Media from URL</span>
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

                      <template v-slot:activator="{ props }">
                        <IconBtn v-bind="props" @click="() => {
      form.faq.splice(i, 1);
    }
      ">
                          <VIcon icon="tabler-trash" />
                        </IconBtn>
                      </template>
                    </VTooltip>
                  </div>

                  <div>
                    <AppTextField label="Question" placeholder="Add a Question" v-model="f.quest"
                      :rules="[requiredValidator]" />
                    <AppTextarea label="Answer" placeholder="Add answer" v-model="f.ans" :rules="[requiredValidator]" />
                    <br />
                  </div>
                </div>
              </div>

              <div class="q-pt-md">
                <VBtn class="mt-6" prepend-icon="tabler-plus" @click="() => {

      form.faq.push({
        quest: '',
        ans: '',
      });
    }
      "> Add Faq </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <VCol md="4" cols="12">
          <!-- 👉 Thumbnail -->
          <VCard title=" Service Thumbnail" class="mb-6">
            <VCardText>
              <div class="d-flex ga-2">
                <AvatarInput name="logo" @image="(f) => { form.thumbnail = f as unknown as null }"
                  :url="serviceThumbnailUrl" helperText="Add a Thumbnail" size="120" />
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 Categories -->
          <VCard title="Categorize" class="mb-6">
            <VCardText>
              <div class="d-flex flex-column gap-y-4">
                <AppSelect v-model="form.service.serviceCategoryId" :items="categories" item-title="name"
                  item-value="id" label="Select Category" style="min-inline-size: 260px" />
                <AppSelect v-model="form.service.serviceSubcategoryId" :items="subcategories" item-title="name"
                  item-value="id" label="Select Sub Category" style="min-inline-size: 260px" />
                <AppSelect v-model="form.tags" :items="tags" item-title="name" item-value="id" label="Select Tags" chips
                  multiple closable-chips style="min-inline-size: 260px" />
              </div>
            </VCardText>
          </VCard>

          <!-- 👉 SEO -->
          <VCard title="SEO">
            <VCardText>
              <div class="d-flex flex-column gap-y-4">
                <AppTextField v-model="form.seo.metaTitle" label="Meta Title" />
                <AppTextField v-model="form.seo.metaKeywords" label="Meta Keywords" />
                <AppTextarea type="textarea" outlined v-model="form.seo.metaDesc" label="Meta Description" />
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
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
