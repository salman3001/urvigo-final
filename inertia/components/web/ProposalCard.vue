<script setup lang="ts">
import BigNumber from 'bignumber.js'
import dummyThumb from '@images/dummy-avatar.webp'
import type Bid from '#models/bid'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import { Link } from '@inertiajs/vue3'
import RatingComponent from '../RatingComponent.vue'
import { format } from 'date-fns'
defineProps<{
  accepted: boolean
  bid: Bid
}>()

const emit = defineEmits<{
  (e: 'review', bid: Bid): void
  (e: 'negotiate', bid: Bid): void
  (e: 'create-chat'): void
}>()

const getImageUrl = useGetImageUrl()
</script>

<template>
  <VCard bordered :class="accepted ? 'border-primary border-2' : ''">
    <VCardItem>
      <div class="d-flex gap-2 flex-wrap justify-space-between">
        <div class="d-flex gap-4">
          <VAvatar size="48" :image="getImageUrl(bid?.vendor?.profile?.avatar?.url, dummyThumb)" />
          <div>
            <RatingComponent :rating="bid?.vendor?.businessProfile.avgRating || 0" size="small" />
            <div v-if="accepted">
              {{ bid?.vendor.firstName }}
              {{ bid?.vendor.lastName }}
              <VBtn color="primary" @click="emit('create-chat')">chat</VBtn>
            </div>
            <div v-else>Anonymous</div>
            <Link :href="routes('web.vendor-profile.about', [bid?.vendor?.id])">{{
    bid?.vendor?.businessProfile?.businessName
  }}</Link>
            <div clas="text-caption">
              {{ format(bid?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
            </div>
          </div>
        </div>
        <div>

          <VChip v-if="accepted" color="success"> Accepted</VChip>
        </div>
      </div>
      <br />
      <div>
        <VChip color="primary">
          &#x20B9;{{ new BigNumber(bid?.offeredPrice || 0).toFixed(2) }}</VChip>
      </div>
      <br />
      <div>
        <p class="text-body-1 line-clamp-3">
          {{ bid?.message }}
        </p>
      </div>
    </VCardItem>
    <VDivider />
    <VCardActions class="justify-end mt-2">
      <VBtn color="primary" @click="emit('review', bid)">Review</VBtn>
    </VCardActions>
    <br />
  </VCard>
</template>
