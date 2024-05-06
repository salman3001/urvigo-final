<script lang="ts">
import type { IPaginatedModel } from '#helpers/types'
import type { IServiceRequirement } from '#models/service_requirement'
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
const filterModal = ref(false)
const filter = ref<string | null>(null)

const pageProps = defineProps<{
  requirements: IPaginatedModel<IServiceRequirement>
  query: {
    page: number
    orderBy: number
  }
}>()

const query = reactive({
  page: pageProps?.query?.page || 1,
  orderBy: pageProps?.query?.page || 'created_at:desc',
})

watch(filter, (newFilterValue) => {
  if (newFilterValue === 'Heighest Price') {
    const newQuery = {
      page: 1,
      orderBy: 'budget:asc',
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue === 'Lowest Price') {
    const newQuery = {
      page: 1,
      orderBy: 'budget:desc',
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue === '') {
    const newQuery = {
      page: 1,
      orderBy: 'created_at:desc',
    }

    Object.assign(query, newQuery)
  }
})
watch(query, () => {
  router.reload({
    data: query,
  })
})
</script>

<template>
  <div class="d-flex align-center justify-end gap-2">
    <div class="d-flex flex-wrap justify-end gap-2">
      <div v-if="filter" class="normalcase">
        <VChip color="info">
          <VICon icon="tabler-filter" />
          filtering by {{ filter }}
        </VChip>
        <VTooltip text="Clear Filters">
          <template #activator="{ props }">
            <IconBtn v-bind="props" @click="filter = ''">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </template>
        </VTooltip>
      </div>
      <VTooltip text="Filters">
        <template #activator="{ props }">
          <IconBtn v-bind="props" @click="filterModal = true">
            <VIcon icon="tabler-filter" />
          </IconBtn>
        </template>
      </VTooltip>
    </div>
  </div>
  <br />
  <div>
    <div v-if="!requirements">
      <VSkeletonLoader v-for="n in 5" :key="n" type="card" />
    </div>
    <VRow v-else>
      <VCol v-for="requirement in requirements?.data" :key="requirement.id" cols="12">
        <VendorRequirementCard :requirement="requirement" />
      </VCol>
    </VRow>

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
      <VCardItem>
        <h3>Sorty By</h3>
        <div class="my-1">
          <VRadioGroup v-model="filter">
            <VRadio label="Heighest Price" value="Heighest Price" />
            <VRadio label="Lowest Price" value="Lowest Price" />
          </VRadioGroup>
        </div>
        <div class="d-flex justify-end">
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
    </ModalBase>
  </div>
</template>
