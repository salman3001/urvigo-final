<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import { VDataTableServer, VImg } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import type Service from '../../../../app/models/service'
import type { IPaginatedModel } from '../../../../app/helpers/types'
import type ServiceCategory from '../../../../app/models/service_category'
import ServiceSubcategory from '../../../../app/models/service_subcategory'
import ModalConfirm from '~/components/modal/ModalConfirm.vue'
import { format } from 'date-fns'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { reactive } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import routes from '~/utils/routes'
import { Link, router, useForm } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'
import { ref } from 'vue'

defineProps<{
  services: IPaginatedModel<Service>
  categories: ServiceCategory[]
  subcategories: ServiceSubcategory[]
}>()

const getImageUrl = useGetImageUrl()
const confirmModal = ref(false)
const deletModal = ref(false)
const selectedServiceId = ref<null | number>(null)

const query = reactive({
  perPage: 20,
  page: 1,
  orderBy: 'created_at:desc',
  search: '',
  serviceCategoryId: '',
  serviceSubcategoryId: '',
})

// Data table Headers
const headers = [
  { title: 'id', key: 'id' },
  { title: 'name', key: 'name' },
  { title: 'category', key: 'category' },
  { title: 'subcategory', key: 'subcategory' },
  { title: 'tags', key: 'tags' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'actions' },
]

const resolveActiveStatus = (status: boolean | number) => {
  if (status === 0 || status === false) return { text: 'Inactive', color: 'error' }
  if (status === 1 || status === true) return { text: 'Active', color: 'success' }
}

watchDebounced(
  query,
  () => {
    router.reload({
      data: query,
      replace: true,
    })
  },
  {
    debounce: 500,
    maxWait: 1000,
  }
)

const updateStatusForm = useForm({
  service: {
    isActive: false,
  },
})
</script>

<template>
  <VContainer>
    <div>
      <VCard>
        <!-- 👉 Filters -->
        <VCardText>
          <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
            <AppTextField v-model="query.search" placeholder="Search Service"
              style="max-inline-size: 200px; min-inline-size: 200px" label="Search" />

            <div class="d-flex gap-x-4 align-center">
              <AppSelect v-model="query.serviceCategoryId" :items="[...categories, { name: 'None', id: '' }]"
                item-title="name" item-value="id" label="Categories" style="min-inline-size: 260px" />
              <AppSelect v-model="query.serviceSubcategoryId" :items="[...subcategories, { name: 'None', id: '' }]"
                item-title="name" item-value="id" label="Sub Categories" style="min-inline-size: 260px" />
              <AppSelect v-model="query.perPage" style="min-inline-size: 6.25rem" :items="[5, 10, 20, 50, 100]"
                label="Per Page" />
              <!-- <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            /> -->
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Order Table -->
        <VDataTableServer v-model:items-per-page="query.perPage!" v-model:page="query.page" :headers="headers"
          :items="services?.data" item-value="order" :items-length="services?.meta?.total!" show-select
          class="text-no-wrap">
          <!-- Order ID -->
          <template #item.id="{ item }">
            <Link :href="routes('web.booking.show', [item.id])"> #{{ item.id }} </Link>
          </template>

          <!-- Date -->

          <template #item.createdAt="{ item }">
            {{ format(item.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </template>

          <!-- name -->

          <template #item.name="{ item }">
            <div class="d-flex align-center gap-2 justify-start">
              <div style="height: 30px; width: 50px">
                <VImg :src="getImageUrl(item.thumbnail?.thumbnailUrl)" width="100%" />
              </div>
              <span>
                {{ item.name }}
              </span>
            </div>
          </template>

          <!-- category -->

          <template #item.category="{ item }">
            {{ item.serviceCategory?.name }}
          </template>

          <!-- subcategory -->

          <template #item.subcategory="{ item }">
            {{ item.serviceSubcategory?.name }}
          </template>

          <!-- tags -->

          <template #item.tags="{ item }">
            <VChip v-for="tag in item?.tags" label size="small" :text="tag.name" color="info" :key="tag.id" />
          </template>

          <!-- Status -->

          <template #item.status="{ item }">
            <VChip v-bind="resolveActiveStatus(item.isActive)" label size="small" />
          </template>

          <!-- Actions -->

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList class="text-primary">
                  <Link :href="routes('vendor.service.show', [item.slug])">
                  <VListItem value="view">
                    <VIcon icon="tabler-eye" />&nbsp; View
                  </VListItem>
                  </Link>
                  <Link :href="routes('vendor.service.edit', [item.slug])">
                  <VListItem value="view">
                    <VIcon icon="tabler-eye" />&nbsp; Edit
                  </VListItem>
                  </Link>
                  <VListItem :value="item.isActive === true ? 'Deactivate' : 'Activate'" @click="() => {
                updateStatusForm.service.isActive = item.isActive === true ? false : true
                selectedServiceId = item.id
                confirmModal = true
              }
              ">
                    <VIcon icon="tabler-alert-circle" />&nbsp;
                    {{ item.isActive === true ? 'Deactivate' : 'Activate' }}
                  </VListItem>
                  <VListItem value="delete" @click="() => {
                selectedServiceId = item.id
                deletModal = true
              }
              ">
                    <VIcon icon="tabler-trash" />&nbsp; Delete
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->

          <template #bottom>
            <TablePagination :page="Number(query.page)" :items-per-page="Number(services?.meta?.perPage)"
              :total-items="Number(services?.meta?.total)" @update:page="(p) => {
                query.page = p
              }
              " />
          </template>
        </VDataTableServer>
      </VCard>
    </div>
    <ModalConfirm v-model:is-visible="confirmModal" title="Update Status"
      message="Change status of the service are your sure? " @confirmed="() => {
                updateStatusForm.put(routes('vendor.service.edit.post', [selectedServiceId || 0]), {
                  onSuccess: () => {
                    router.reload({
                      only: ['services'],
                      data: query,
                      replace: true,
                    })
                    confirmModal = false
                  },
                })
              }
              " />
    <ModalConfirm v-model:is-visible="deletModal" title="Delete Service"
      message="Deleting this service, are your sure? " @confirmed="() => {
                router.visit(routes('vendor.service.destroy', [selectedServiceId || 0]), {
                  only: ['services'],
                  method: 'delete',
                  replace: true,
                })
              }
              " />
  </VContainer>
  <br />
  <br />
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
