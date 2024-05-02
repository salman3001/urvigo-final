<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import { VDataTableServer } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import type { IPaginatedModel } from '../../../../app/helpers/types'
import ModalConfirm from '~/components/modal/ModalConfirm.vue'
import { format, differenceInMinutes } from 'date-fns'
import type { ICoupon } from '../../../../app/models/coupon'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import routes from '~/utils/routes'
import { Link, router } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'

defineProps<{
  coupons: IPaginatedModel<ICoupon>
}>()

const selectedCoupnId = ref<number>()
const deletModal = ref(false)

const query = reactive({
  perPage: 20,
  page: 1,
  orderBy: 'created_at:desc',
  search: '',
})

// Data table Headers
const headers = [
  { title: 'id', key: 'id' },
  { title: 'name', key: 'name' },
  { title: 'Discount Type', key: 'discountType' },
  { title: 'Discount Flat', key: 'discountFlat' },
  { title: 'Discount Percentage', key: 'discountPercentage' },
  { title: 'Min. Purchase', key: 'minPurchaseAmount' },
  { title: 'Max. Users', key: 'maxUsers' },
  { title: 'Total Used', key: 'totalUsed' },
  { title: 'Valid From', key: 'validFrom' },
  { title: 'Expired At ', key: 'expiredAt' },
  { title: 'Stautus', key: 'status' },
  { title: 'Action', key: 'actions' },
]

const resolveCouponStatus = (validFrom: string | Date, expiredAt: string | Date) => {
  const isValidFromValid = differenceInMinutes(validFrom, Date.now()) < 0
  const isExpiredAtValid = differenceInMinutes(expiredAt, Date.now()) > 0
  if (isValidFromValid && isExpiredAtValid) return { text: 'Active', color: 'success' }
  if (!isValidFromValid && isExpiredAtValid) return { text: 'Waiting', color: 'warning' }
  if (isValidFromValid && !isExpiredAtValid) return { text: 'Expired', color: 'error' }
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
</script>

<template>
  <VContainer>
    <div>
      <VCard>
        <!-- 👉 Filters -->
        <VCardText>
          <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
            <AppTextField
              v-model="query.search"
              placeholder="Search Coupons"
              style="max-inline-size: 200px; min-inline-size: 200px"
              label="Search"
            />

            <div class="d-flex gap-x-4 align-center">
              <AppSelect
                v-model="query.perPage"
                style="min-inline-size: 6.25rem"
                :items="[5, 10, 20, 50, 100]"
                label="Per Page"
              />
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
        <VDataTableServer
          v-model:items-per-page="query.perPage!"
          v-model:page="query.page"
          :headers="headers"
          :items="coupons?.data"
          item-value="order"
          :items-length="coupons?.meta?.total!"
          show-select
          class="text-no-wrap"
        >
          <!-- Order ID -->
          <template #item.id="{ item }">
            <Link :href="routes('web.booking.show', [item.id])"> #{{ item.id }} </Link>
          </template>

          <!-- name -->

          <template #item.name="{ item }">
            <div class="d-flex align-center gap-2 justify-start">
              <!-- <div style="height: 30px; width: 50px">
                <VImg :src="getImageUrl(item.thumbnail?.thumbnailUrl)" width="100%" />
              </div> -->
              <span>
                {{ item.name }}
              </span>
            </div>
          </template>

          <!-- expire -->

          <template #item.expiredAt="{ item }">
            {{ format(item.expiredAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </template>

          <!-- valid -->

          <template #item.validFrom="{ item }">
            {{ format(item.validFrom as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </template>

          <!-- discount Type -->

          <template #item.subcategory="{ item }">
            <VChip label size="small" :text="item.discountType" color="info" />
          </template>

          <!-- discount Flat -->

          <template #item.discountFlat="{ item }"> &#x20B9;{{ item.discountFlat }} </template>

          <!-- discount Percentage -->

          <template #item.discountPercentage="{ item }"> {{ item.discountPercentage }}% </template>

          <!-- Status -->

          <template #item.status="{ item }">
            <VChip
              v-bind="resolveCouponStatus(item.validFrom, item.expiredAt)"
              label
              size="small"
            />
          </template>

          <!-- Actions -->

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList class="text-primary">
                  <Link :href="routes('vendor.coupon.edit', [item.id])">
                    <VListItem value="view"> <VIcon icon="tabler-edit" />&nbsp; Edit </VListItem>
                  </Link>

                  <VListItem
                    value="delete"
                    @click="
                      () => {
                        selectedCoupnId = item.id
                        deletModal = true
                      }
                    "
                  >
                    <VIcon icon="tabler-trash" />&nbsp; Delete
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->

          <template #bottom>
            <TablePagination
              :page="Number(query.page)"
              :items-per-page="Number(coupons?.meta?.perPage)"
              :total-items="Number(coupons?.meta?.total)"
              @update:page="
                (p) => {
                  query.page = p
                }
              "
            />
          </template>
        </VDataTableServer>
      </VCard>
    </div>
    <ModalConfirm
      v-model:is-visible="deletModal"
      title="Delete Service"
      message="Deleting this service, are your sure? "
      @confirmed="
        () => {
          router.visit(routes('vendor.coupon.delete', [selectedCoupnId || 0]), {
            only: ['coupons'],
            method: 'delete',
            replace: true,
          })
        }
      "
    />
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
