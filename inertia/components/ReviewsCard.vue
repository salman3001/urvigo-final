<script setup lang="ts">
import Review from '#models/review'
import { format } from 'date-fns';
import { VCardSubtitle } from 'vuetify/components'
import dummyAvatar from '~/assets/images/dummy-avatar.webp'
import useGetImageUrl from '~/composables/useGetImageUrl'

defineProps<{
  review: Review
}>()

const getImageUrl = useGetImageUrl()
</script>

<template>
  <!-- 👉 Robert Meyer -->
  <VCol cols="12" sm="6" md="4">
    <VCard>
      <VCardText class="">
        <!-- User Avatar -->
        <div class="d-flex gap-2">
          <VAvatar size="50" class="avatar-center"
            :image="getImageUrl(review?.user?.profile?.avatar?.thumbnailUrl, dummyAvatar)" />
          <div class="me-2 mb-2">
            <VCardTitle class="pa-0">
              {{ review?.user?.firstName + ' ' + review?.user?.lastName }}
            </VCardTitle>
            <VCardSubtitle class="text-caption pa-0">
              {{ format(review.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
            </VCardSubtitle>
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
