<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import { VDataTableServer } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import type { IPaginatedModel } from '../../../../app/helpers/types'
import ModalConfirm from '~/components/modal/ModalConfirm.vue'
import type { ITimeslotPlan } from '#models/timeslot_plan'
import ModalAddTimeslotPlan from '~/components/modal/ModalAddTimeslotPlan.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import routes from '~/utils/routes'
import { Link, router } from '@inertiajs/vue3'

defineProps<{
  timeslotPlans: IPaginatedModel<ITimeslotPlan>
}>()

const selectedPlanId = ref<number>()
const deletModal = ref(false)
const addTimeslotModal = ref(false)

const query = reactive({
  perPage: 20,
  page: 1,
  search: '',
})

// Data table Headers
const headers = [
  { title: 'id', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'One booking/slot', key: 'limitToOneBooking' },
  { title: 'Skip hours', key: 'skipHours' },
  { title: 'Actions', key: 'actions' },
]
</script>

<template>
  <VContainer>
    <div>
      <VCard>
        <!-- 👉 Filters -->
        <VCardText>
          <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
            <div></div>
            <!-- <AppTextField
              v-model="query.search"
              placeholder="Search Coupons"
              style="max-inline-size: 200px; min-inline-size: 200px"
              label="Search"
            /> -->

            <div class="d-flex gap-x-4 align-center">
              <!-- <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            /> -->
              <VBtn
                prepend-icon="tabler-plus"
                text="Create Plan"
                @click="
                  () => {
                    addTimeslotModal = true
                  }
                "
              />
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Order Table -->
        <VDataTableServer
          v-model:items-per-page="query.perPage!"
          v-model:page="query.page"
          :headers="headers"
          :items="timeslotPlans?.data"
          item-value="order"
          :items-length="timeslotPlans?.meta?.total!"
          show-select
          class="text-no-wrap"
        >
          <!-- Order ID -->
          <template #item.id="{ item }"> #{{ item.id }} </template>

          <!-- name -->

          <template #item.name="{ item }">
            <div class="d-flex align-center gap-2 justify-start">
              <span>
                {{ item.name }}
              </span>
            </div>
          </template>

          <!-- limitToOneBooking -->

          <template #item.limitToOneBooking="{ item }">
            <div class="d-flex align-center gap-2 justify-start">
              <span>
                {{ item.limitToOneBooking == true ? 'Yes' : 'No' }}
              </span>
            </div>
          </template>

          <!-- Actions -->

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList class="text-primary">
                  <Link :href="routes('vendor.timeslot-plans.edit', [item.id])">
                    <VListItem value="view"> <VIcon icon="tabler-edit" />&nbsp; Edit </VListItem>
                  </Link>

                  <VListItem
                    value="delete"
                    @click="
                      () => {
                        selectedPlanId = item.id
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
              :items-per-page="Number(timeslotPlans?.meta?.perPage)"
              :total-items="Number(timeslotPlans?.meta?.total)"
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
          router.visit(routes('vendor.timeslot-plans.destroy', [selectedPlanId || 0]), {
            only: ['timeslotPlans'],
            method: 'delete',
            replace: true,
          })
        }
      "
    />
    <ModalAddTimeslotPlan
      v-model="addTimeslotModal"
      @success="
        () => {
          addTimeslotModal = false
          router.reload({
            only: ['timeslotPlans'],
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
