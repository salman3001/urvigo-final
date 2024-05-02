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
import ModalBase from '~/components/modal/ModalBase.vue'
import ModalPostRequirement from '~/components/modal/ModalPostRequirement.vue'

const filterModal = ref(false)
const filter = ref<null | string>(null)
const postModal = ref(false)

const props = defineProps<{
  requirements: IPaginatedModel<IServiceRequirement>
  categories: IServiceCategory[]
  tags: IServiceTag[]
  query: {
    active: string
    completed: boolean | undefined
    expiresAtLt: boolean | undefined
    page: string
    perPage: string
    orderBy: string
  }
}>()

const query = reactive({
  active: props?.query?.active,
  completed: props?.query?.completed,
  expiresAtLt: props?.query?.expiresAtLt,
  page: props?.query?.page || 1,
  perPage: props?.query?.perPage || 20,
  orderBy: props?.query?.orderBy || 'created_at:desc',
})

watch(filter, (newFilterValue) => {
  if (newFilterValue == 'active') {
    const newQuery = {
      active: 1,
      completed: null,
      expiresAtLt: null,
      page: 1,
      perPage: 20,
      orderBy: 'created_at:desc',
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue == 'completed') {
    const newQuery = {
      active: null,
      completed: 1,
      expiresAtLt: null,
      page: 1,
      perPage: 20,
      orderBy: 'created_at:desc',
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue == 'expired') {
    const newQuery = {
      active: null,
      completed: null,
      expiresAtLt: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      page: 1,
      perPage: 20,
      orderBy: 'created_at:desc',
    }

    Object.assign(query, newQuery)
  }

  if (newFilterValue == '') {
    const newQuery = {
      active: null,
      completed: null,
      expiresAtLt: null,
      page: 1,
      perPage: 20,
      orderBy: 'created_at:desc',
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
    <ModalBase v-model:is-visible="filterModal" title="Filter Requirements">
      <VCardItem>
        <h3>Sorty By</h3>
        <div class="my-1">
          <VRadioGroup v-model="filter" @update:model-value="filterModal = false">
            <VRadio label="Active" value="active" />
            <VRadio label="Completed" value="completed" />
            <VRadio label="Expired" value="expired" />
          </VRadioGroup>
        </div>
        <!-- <div class="d-flex justify-end">
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
        </div> -->
      </VCardItem>
    </ModalBase>
  </VContainer>
</template>
