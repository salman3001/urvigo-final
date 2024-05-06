<script setup lang="ts">
import type { IPageProps, IPaginatedModel } from '#helpers/types'
import type { IReview } from '#models/review'
import { router, usePage } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'
import { reactive } from 'vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import ReviewsCard from '~/components/ReviewsCard.vue'
import ReviewsOverview from '~/components/ReviewsOverview.vue'

defineProps<{
  vendorId: number
  avgRating: number
  reviewsCount: number
  reviews: IPaginatedModel<IReview>
}>()

const page = usePage<IPageProps<{}>>()

const query = reactive({
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
  <ReviewsOverview :total-reviews="reviewsCount" :rating="avgRating" />
  <br />
  <div v-if="reviews">
    <VRow>
      <VCol v-for="(r, i) in reviews.data" :key="i">
        <ReviewsCard :review="r" />
      </VCol>
    </VRow>
  </div>
  <br />
  <TablePagination
    :page="Number(query.page)"
    :items-per-page="Number(reviews?.meta?.perPage)"
    :total-items="Number(reviews?.meta?.total)"
    @update:page="
      (p) => {
        query.page = p
      }
    "
  />
</template>

<style lang="scss">
@use '@core/scss/template/libs/apex-chart.scss';
</style>
