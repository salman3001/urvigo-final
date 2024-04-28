<script lang="ts">
import type { IPaginatedModel } from '#helpers/types'
import type ServiceRequirement from '#models/service_requirement'
import { router } from '@inertiajs/vue3'
import { reactive, ref, watch } from 'vue'
import { VBtn, VRadio, VRadioGroup, VSkeletonLoader, VTooltip } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import ModalBase from '~/components/modal/ModalBase.vue'
import VendorRequirementCard from '~/components/vendor/VendorRequirementCard.vue'
import Layout from '~/layouts/VendorLayout.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
const page = ref(1)
const filterModal = ref(false)
const filter = ref(null)

defineProps<{
  requirements: IPaginatedModel<ServiceRequirement>
}>()

const query = reactive({
  page: page.value,
  orderBy: 'created_at:desc',
})

watch(query, () => {
  router.reload({
    data: query,
  })
})
</script>

<template>
  <br />
  <div class="d-flex align-center justify-end gap-2">
    <IconBtn
      v-if="filter"
      @click="
        () => {
          filter = null
          // refresh();
        }
      "
    >
      <VIcon icon="tabler-filter" />
    </IconBtn>
    <VTooltip text="Fliters">
      <template #activator="{ props }">
        <IconBtn v-bind="props" @click="filterModal = true">
          <VIcon icon="tabler-filter" />
        </IconBtn>
      </template>
    </VTooltip>
  </div>
  <br />
  <div>
    <div v-if="!requirements" v-for="n in 5">
      <VSkeletonLoader type="card" />
    </div>
    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="requirement in requirements?.data">
        <VendorRequirementCard :requirement="requirement" />
      </div>
    </div>
    <br />
    <TablePagination
      :page="Number(query.page)"
      :items-per-page="Number(requirements?.meta?.perPage)"
      :total-items="Number(requirements?.meta?.total)"
      @update:page="
        (p) => {
          query.page = p
        }
      "
    />
    <ModalBase v-model:is-visible="filterModal" title="Filter requirements">
      <VCard>
        <VCardItem>
          <div>
            <h6>Sorty By</h6>
            <div class="q-gutter-sm">
              <VRadioGroup v-model="query.orderBy">
                <VRadio label="Latest" value="created_at:desc" />
              </VRadioGroup>
            </div>
          </div>
          <div class="row justify-end">
            <VBtn
              label="Apply"
              color="primary"
              @click="
                () => {
                  router.reload({
                    data: { ...query, page: 1 },
                  })
                  filterModal = false
                }
              "
              >Apply</VBtn
            >
          </div>
        </VCardItem>
      </VCard>
    </ModalBase>
  </div>
</template>
