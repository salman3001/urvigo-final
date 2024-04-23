<script setup lang="ts">
import Review from '#models/review'
import { VCardSubtitle } from 'vuetify/components'
import dummyAvatar from '~/assets/images/dummy-avatar.webp'
import useGetImageUrl from '~/composables/useGetImageUrl'

defineProps<{
  review: Review
}>()

const getImageUrl = useGetImageUrl()
</script>

<template>
  <!-- <VCol cols="12" lg="4" md="6">
    <VCard :title="review?.user?.firstName + ' ' + review?.user?.lastName">
      <VCardText class="d-flex align-center flex-wrap">
        <VRating :model-value="review.rating" readonly density="compact" class="me-3" />
        <span class="text-subtitle-2">{{ review.rating }} Star</span>
      </VCardText>

      <VCardText>
        {{ review.message }}
      </VCardText>

      <VCardSubtitle>
        {{ new Date(review.createdAt as unknown as string).toDateString() }}
      </VCardSubtitle>
      <br />
    </VCard>
  </VCol> -->
  <!-- 👉 Robert Meyer -->
  <VCol cols="12" sm="6" md="4">
    <VCard>
      <VCardText class="">
        <!-- User Avatar -->
        <div class="d-flex gap-2">
          <VAvatar
            size="50"
            class="avatar-center"
            :image="getImageUrl(review?.user?.profile?.avatar?.thumbnailUrl, dummyAvatar)"
          />
          <div class="me-2 mb-2">
            <VCardTitle class="pa-0">
              {{ review?.user?.firstName + ' ' + review?.user?.lastName }}
            </VCardTitle>
            <VCardSubtitle class="text-caption pa-0">
              {{ new Date(review.createdAt as unknown as string).toDateString() }}</VCardSubtitle
            >
          </div>
        </div>

        <div class="d-flex gap-2 align-center mt-1">
          <span class="text-h5">{{ review.rating }} </span>
          <VRating :model-value="review.rating" readonly density="compact" class="me-3" />
        </div>
      </VCardText>
      <VCardText>
        {{ review.message }}
      </VCardText>
    </VCard>
  </VCol>
</template>
