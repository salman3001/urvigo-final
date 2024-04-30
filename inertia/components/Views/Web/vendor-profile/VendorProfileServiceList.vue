<script setup lang="ts">
import type { IPageProps, IPaginatedModel } from '#helpers/types'
import type { IService } from '#models/service'
import { router, usePage } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'
import { reactive } from 'vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import ServiceCard from '~/components/ServiceCard.vue'

const page = usePage<IPageProps<{}>>()

defineProps<{
  services: IPaginatedModel<IService>
}>()

const query = reactive({
  search: page?.props?.query?.search || '',
  page: page?.props?.query?.page || 1,
})

watchDebounced(
  query,
  () => {
    router.reload({
      data: query,
    })
  },
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
      <h5 class="text-h5">Service List</h5>
      <div style="inline-size: 272px">
        <AppTextField v-model="query.search" :debounce="500" placeholder="Search Services" />
      </div>
    </VCardText>
    <VDivider />
    <VCardItem>
      <div v-if="services">
        <VRow class="">
          <VCol v-for="s in services.data" cols="12" md="6" lg="3">
            <ServiceCard :service="s" />
          </VCol>
        </VRow>
      </div>
      <div v-else>
        <VRow class="">
          <VCol v-for="s in 10" cols="12" md="6" lg="3">
            <VSkeletonLoader type="card" />
          </VCol>
        </VRow>
      </div>
      <br />
      <div>
        <TablePagination
          :page="Number(query.page)"
          :items-per-page="Number(services?.meta?.perPage)"
          :total-items="Number(services?.meta?.total)"
          @update:page="
            (p) => {
              query.page = p
            }
          "
        />
      </div>
    </VCardItem>
  </VCard>
</template>
