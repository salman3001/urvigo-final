<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type { IPaginatedModel } from '#helpers/types'
import type { IServiceCategory } from '#models/service_category'
import type { IServiceRequirement } from '#models/service_requirement'
import type { IServiceTag } from '#models/service_tag'
import { router } from '@inertiajs/vue3'
import { format } from 'date-fns'
import { reactive, ref, watch } from 'vue'
import { VIcon } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import RequirementCard from '~/components/RequirementCard.vue'
import ModalPostRequirement from '~/components/modal/ModalPostRequirement.vue'

const filterModal = ref(false)
const filter = ref(null)
const postModal = ref(false)

const props = defineProps<{
  requirements: IPaginatedModel<IServiceRequirement>
  categories: IServiceCategory[]
  tags: IServiceTag[]
  query: {
    where_active: string
    acepted: boolean | undefined
    expires_at_lt: boolean | undefined
    page: string
    perPage: string
  }
}>()

const query = reactive({
  where_active: props?.query?.where_active,
  acepted: props?.query?.acepted,
  expires_at_lt: props?.query?.expires_at_lt,
  page: props?.query?.page || 1,
  perPage: props?.query?.page || 20,
})

watch(filter, (newFilterValue) => {
  if (newFilterValue == 'active') {
    const newQuery = {
      where_active: 1,
      acepted: null,
      expires_at_lt: null,
      page: 1,
      perPage: 20,
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue == 'accepted') {
    const newQuery = {
      where_active: null,
      acepted: 1,
      expires_at_lt: null,
      page: 1,
      perPage: 20,
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue == 'expired') {
    const newQuery = {
      where_active: null,
      acepted: null,
      expires_at_lt: format(Date.now(), 'YYYY/MM/DD hh:mm:ss'),
      page: 1,
      perPage: 20,
    }

    Object.assign(query, newQuery)
  }
})

watch(query, () => {
  router.reload({
    data: query,
    only: ['requirements'],
  })
})
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer id="team">
    <div class="q-gutter-y-xl">
      <br />
      <div class="">
        <h2>Service Requirements</h2>
        <br />
        <br />
        <div class="d-flex flex-wrap justify-end gap-2">
          <div class="normalcase" v-if="filter">
            <VChip color="info">
              <VICon icon="tabler-filter" />
              filtering by {{ filter }}
            </VChip>
            <VChip
              @click="
                () => {
                  filter = null
                  router.reload({
                    only: ['requirements'],
                  })
                }
              "
            >
              <VIcon icon="tabler-x" />
            </VChip>
          </div>
          <IconBtn @click="filterModal = true">
            <VIcon icon="tabler-filter" />
          </IconBtn>
          <VBtn color="primary" @click="() => (postModal = true)">+ Post A Requirement</VBtn>
        </div>
        <br />
      </div>
      <div class="">
        <div style="max-width: 95vw">
          <div class="q-gutter-y-md">
            <div v-if="!requirements" v-for="n in 5">
              <VSkeletonLoader type="list-item-three-line" />
            </div>
            <VRow v-else>
              <VCol v-for="requirement in requirements?.data" cols="12">
                <RequirementCard :requirement="requirement" />
              </VCol>
            </VRow>
            <br />
            <TablePagination
              :page="Number(query.page)"
              :items-per-page="Number(query.perPage)"
              :total-items="Number(requirements?.meta?.total)"
              @update:page="
                (p) => {
                  query.page = p as unknown as string
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <ModalPostRequirement
      :categories="categories"
      :tags="tags"
      v-model:is-visible="postModal"
      @submit="
        async () => {
          router.reload({
            only: ['requirements'],
          })
          postModal = false
        }
      "
    />
  </VContainer>
</template>
