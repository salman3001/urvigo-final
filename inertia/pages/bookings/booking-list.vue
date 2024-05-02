<script lang="ts">
import Layout from '~/layouts/default.vue'
import { VDataTableServer } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import { format } from 'date-fns'
import { resolvePaymentMode, resolvePaymentStatus, resolveStatus } from '~/utils/helpers'
import BigNumber from 'bignumber.js'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { reactive } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import type { IPaginatedModel } from '../../../app/helpers/types'
import type { IBooking } from '../../../app/models/booking'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import routes from '~/utils/routes'
import { Link, router } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'

defineProps<{
  bookings: IPaginatedModel<IBooking>
}>()

const getImageUrl = useGetImageUrl()

const query = reactive({
  perPage: 20,
  page: 1,
  orderBy: 'created_at:desc',
  search: '',
})

// Data table Headers
const headers = [
  { title: 'id', key: 'id' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Service', key: 'bookingDetail' },
  { title: 'Service Price', key: 'servicePrice', sortable: false },
  { title: 'Qty', key: 'qty', sortable: false },
  { title: 'Discount', key: 'vendorDiscount', sortable: false },
  { title: 'Coupon Discount', key: 'couponDiscount', sortable: false },
  { title: 'Total', key: 'total', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Payment', key: 'paymentDetail', sortable: false },
  { title: 'Payment Method', key: 'method', sortable: false },
  { title: 'Action', key: 'actions', sortable: false },
]

watchDebounced(query, () => {
  router.reload({
    data: query,
    replace: true,
  })
})
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <div>
      <VCard>
        <!-- 👉 Filters -->
        <VCardText>
          <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
            <AppTextField
              v-model="query.search"
              placeholder="Search Booking"
              style="max-inline-size: 200px; min-inline-size: 200px"
            />

            <div class="d-flex gap-x-4 align-center">
              <AppSelect
                v-model="query.perPage"
                style="min-inline-size: 6.25rem"
                :items="[5, 10, 20, 50, 100]"
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
          :items="bookings?.data"
          item-value="order"
          :items-length="bookings?.meta?.total!"
          show-select
          class="text-no-wrap"
        >
          <!-- Order ID -->
          <template #item.id="{ item }">
            <Link :href="routes('web.booking.show', [item.id])"> #{{ item.id }} </Link>
          </template>

          <!-- Date -->

          <template #item.createdAt="{ item }">
            {{ format(item?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </template>

          <!-- Customers  -->

          <template #item.bookingDetail="{ item }">
            <div class="d-flex align-center gap-x-3">
              <VAvatar
                size="34"
                :color="item?.bookingDetail?.service_variant.image?.url ? 'primary' : ''"
                :variant="'tonal'"
              >
                <VImg
                  :src="getImageUrl(item?.bookingDetail?.service_variant.image?.thumbnailUrl)"
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="text-body-1 font-weight-medium">
                  <Link
                    :href="
                      routes('web.services.show', [
                        item.bookingDetail?.service_variant?.service?.slug,
                      ])
                    "
                    class="text-link"
                  >
                    {{ item.bookingDetail?.service_variant.name }}
                  </Link>
                </div>
              </div>
            </div>
          </template>

          <!-- Service Price -->

          <template #item.servicePrice="{ item }">
            &#x20B9;{{ item.bookingDetail?.service_variant?.price }}
          </template>

          <!-- vendor discount -->

          <template #item.vendorDiscount="{ item }">
            <span
              :class="{ 'text-success': new BigNumber(item.bookingDetail?.vendorDiscount).gt(0) }"
            >
              &#x20B9;{{ item.bookingDetail?.vendorDiscount }}
            </span>
          </template>

          <!-- Coupon disocunt -->

          <template #item.couponDiscount="{ item }">
            <span
              :class="{ 'text-success': new BigNumber(item.bookingDetail?.couponDiscount).gt(0) }"
            >
              &#x20B9;{{ item.bookingDetail?.couponDiscount }}
            </span>
          </template>

          <!-- Qty -->

          <template #item.qty="{ item }">
            {{ item?.bookingDetail?.qty }}
          </template>

          <!-- total -->

          <template #item.total="{ item }">
            &#x20B9;{{ item?.bookingDetail?.grandTotal }}
          </template>

          <!-- Payments -->

          <template #item.paymentDetail="{ item }">
            <div
              :class="`text-${resolvePaymentStatus(item.paymentDetail?.paymentStatus)?.color}`"
              class="font-weight-medium d-flex align-center gap-x-2"
            >
              <VIcon icon="tabler-circle-filled" size="10" />
              <div style="line-height: 22px">
                {{ resolvePaymentStatus(item?.paymentDetail?.paymentStatus)?.text }}
              </div>
            </div>
          </template>

          <!-- Status -->

          <template #item.status="{ item }">
            <VChip v-bind="resolveStatus(item.status)" label size="small" />
          </template>

          <!-- Method -->
          <template #item.method="{ item }">
            <VChip
              v-bind="resolvePaymentMode(item?.paymentDetail?.paymentMode)"
              label
              size="small"
            />
          </template>

          <!-- Actions -->

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <Link :href="routes('web.booking.show', [item.id])">
                    <VListItem value="view"> View </VListItem>
                  </Link>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->

          <template #bottom>
            <TablePagination
              :page="Number(query.page)"
              :items-per-page="Number(bookings?.meta?.perPage)"
              :total-items="Number(bookings?.meta?.total)"
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
