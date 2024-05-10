<script setup lang="ts">
import useAuth from '~/composables/useAuth'
import ReviewsOverview from './ReviewsOverview.vue'
import ModalAddReview from './modal/ModalAddReview.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import ReviewsCard from './ReviewsCard.vue'
import useApiGet from '~/composables/useApiGet'
import type { IPageProps, IPaginatedModel, VendorReviewsInfo } from '#helpers/types'
import routes from '~/utils/routes'
import { VCol, VRow, VSkeletonLoader } from 'vuetify/components'
import { router, usePage } from '@inertiajs/vue3'
import TablePagination from '~/@core/components/TablePagination.vue'
import type VendorReview from '#models/vendor_review'

const props = defineProps<{
  bussinessProfileId: number
}>()

const { user } = useAuth()
const page = usePage<IPageProps<{}>>()
const addReviewModal = ref(false)
const query = reactive({
  page: 1,
})
const { data: reviews, exec, processing } = useApiGet<IPaginatedModel<VendorReview>>()
const {
  data: reviewsInfo,
  exec: getReviewInfo,
  processing: processingGetReviewInfo,
} = useApiGet<VendorReviewsInfo>()

onMounted(() => {
  exec(routes('api.reviews.vendor', [props.bussinessProfileId]))
  getReviewInfo(routes('api.reviews.vendor.info', [props.bussinessProfileId]))
})

watch(query, () => {
  exec(routes('api.reviews.vendor', [props.bussinessProfileId]), {
    params: query,
  })
})
</script>
<template>
  <div>
    <VRow>
      <VCol cols="12" lg="9">
        <ReviewsOverview
          v-if="!processingGetReviewInfo && reviewsInfo"
          :total-reviews="Number(reviewsInfo?.totalReviews)"
          :rating="Number(reviewsInfo?.avgRating).toFixed(1)"
          :review-card-data="reviewsInfo?.counts!"
          :avg-com="reviewsInfo?.avgCommunication"
          :avg-fp="reviewsInfo?.avgFairPricing"
          :avg-rt="reviewsInfo?.avgResponseTime"
          :avg-pb="reviewsInfo?.avgProfessionalBehavior"
          :avg-qos="reviewsInfo?.avgQualityOfService"
        >
        </ReviewsOverview>
        <VSkeletonLoader v-else type="card" />
      </VCol>

      <VCol cols="12" lg="3">
        <VBtn
          @click="
            () => {
              if (user) {
                addReviewModal = true
              } else {
                router.visit(`${routes('web.auth.login')}?next=${page.url}`)
              }
            }
          "
        >
          <VIcon size="24" class="cursor-pointer" icon="tabler-plus" />
          Add Review
        </VBtn>
      </VCol>
    </VRow>

    <br />
    <VRow v-if="!processing">
      <VCol v-for="(r, i) in reviews?.data" :key="i" cols="12" sm="6">
        <ReviewsCard :review="r" />
      </VCol>
      <VCol cols="12">
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
      </VCol>
      <VCol v-if="reviews?.data?.length < 1" cols="12" sm="6">
        <p>No reviews</p>
      </VCol>
    </VRow>
    <VRow v-else>
      <VCol v-for="n in 5" :key="n">
        <VSkeletonLoader type="card" />
      </VCol>
    </VRow>
  </div>
  <ModalAddReview
    v-model:isVisible="addReviewModal"
    :business-profile-id="bussinessProfileId"
    @submit="
      async () => {
        exec(routes('api.reviews.vendor', [props.bussinessProfileId]))
        getReviewInfo(routes('api.reviews.vendor.info', [props.bussinessProfileId]))
        addReviewModal = false
      }
    "
  />
</template>
