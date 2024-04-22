<script setup lang="ts">
import BigNumber from 'bignumber.js'
import dummyThumb from '@images/dummy-avatar.webp'
import type Bid from '#models/bid'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
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
  <VCard
    bordered
    :class="accepted ? 'border-primary border-2' : ''"
    style="max-width: 450px; height: max-content"
  >
    <VCardItem>
      <div class="fd-lex gap-2 flex-wrap justify-space-between">
        <div class="d-flex gap-6">
          <VAvatar
            size="x-large"
            :image="getImageUrl(bid?.vendor?.profile?.avatar?.url, dummyThumb)"
          />
          <div>
            <div>
              <RatingComponent :rating="bid?.vendor?.businessProfile.avgRating || 0" size="small" />
            </div>
            <p v-if="accepted">
              {{ bid?.vendor.firstName }}
              {{ bid?.vendor.lastName }}
              <VBtn color="primary" @click="emit('create-chat')">chat</VBtn>
            </p>
            <p v-else>Anonymous</p>
            <div>
              <NuxtLink :to="''" class="underline">{{
                bid?.vendor?.businessProfile?.businessName
              }}</NuxtLink>
            </div>
          </div>
        </div>
        <div>
          <p class="text-caption">
            {{ new Date(bid?.createdAt as unknown as string).toDateString() }}
          </p>
          <VChip v-if="accepted" color="success"> Accepted</VChip>
        </div>
      </div>
      <br />
      <div class="gap-2">
        <VChip color="primary">
          &#x20B9;{{ new BigNumber(bid?.offeredPrice || 0).toFixed(2) }}</VChip
        >
      </div>
      <br />
      <div>
        <p class="text-body-1 line-clamp-3">
          {{ bid?.message }}
        </p>
      </div>
    </VCardItem>
    <VDivider />
    <VCardActions class="row q-gutter-sm q-px-sm justify-end">
      <VBtn color="primary" @click="emit('review', bid)">Review</VBtn>
    </VCardActions>
    <br />
  </VCard>
</template>
~/utils/routes-old
