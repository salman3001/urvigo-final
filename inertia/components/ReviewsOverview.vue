<script setup lang="ts">
defineProps<{
  totalReviews: number | string
  rating: number | string
  reviewCardData: Array<{ rating: 1 | 2 | 3 | 4 | 5; value: number | string }>
  avgQos?: number | string
  avgPb?: number | string
  avgFp?: number | string
  avgCom?: number | string
  avgRt?: number | string
}>()
</script>

<template>
  <!-- 👉 Total Review Card  -->
  <VCard>
    <VCardText>
      <div class="d-flex gap-6 flex-column flex-sm-row">
        <div class="flex-grow-1">
          <div class="d-flex align-center gap-x-2">
            <h3 class="text-h3 text-primary">{{ rating }}</h3>
            <VIcon icon="tabler-star-filled" color="primary" size="32" />
            {{ totalReviews }} reviews
          </div>
          <div class="mb-2 text-wrap">
            <div v-if="avgQos" class="d-flex justify-space-between gap-2 align-center">
              <span>Quality Service</span
              ><span>
                <h6 class="text-h6 text-primary text-center">
                  {{ avgQos }}
                  <VIcon icon="tabler-star-filled" color="primary" size="16" />
                </h6>
              </span>
            </div>
            <div v-if="avgPb" class="d-flex justify-space-between gap-2 align-center">
              <span>Professional Behavior</span>
              <h6 class="text-h6 text-primary text-center">
                {{ avgPb }}
                <VIcon icon="tabler-star-filled" color="primary" size="16" />
              </h6>
            </div>
            <div v-if="avgRt" class="d-flex justify-space-between gap-2 align-center">
              <span>Response Time</span>
              <h6 class="text-h6 text-primary text-center">
                {{ avgRt }}
                <VIcon icon="tabler-star-filled" color="primary" size="16" />
              </h6>
            </div>
            <div v-if="avgFp" class="d-flex justify-space-between gap-2 align-center">
              <span>Fair Price</span>
              <h6 class="text-h6 text-primary text-center">
                {{ avgFp }}
                <VIcon icon="tabler-star-filled" color="primary" size="16" />
              </h6>
            </div>
            <div v-if="avgCom" class="d-flex justify-space-between gap-2 align-center">
              <span>Communication</span>
              <h6 class="text-h6 text-primary text-center">
                {{ avgCom }}
                <VIcon icon="tabler-star-filled" color="primary" size="16" />
              </h6>
            </div>
            <div class="d-flex justify-space-between gap-2 align-center">
              All Reviews are from genuine customers
            </div>
          </div>
        </div>

        <VDivider :vertical="$vuetify.display.smAndUp" />

        <div class="flex-grow-1">
          <br />
          <div
            v-for="(review, index) in reviewCardData"
            :key="index"
            class="d-flex align-center gap-x-4"
            :class="index !== reviewCardData.length - 1 ? 'mb-3' : ''"
          >
            <div class="text-no-wrap text-sm">{{ review.rating }} Star</div>

            <div class="flex-grow-1" style="min-inline-size: 150px">
              <VProgressLinear
                color="primary"
                height="8"
                :model-value="(Number(review.value) / Number(totalReviews)) * 100"
                rounded
              />
            </div>

            <div class="text-sm">
              {{ review.value }}
            </div>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
