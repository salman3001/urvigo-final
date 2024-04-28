<script setup lang="ts">
import type Bid from '#models/bid'
import BigNumber from 'bignumber.js'
import { VBadge, VChip } from 'vuetify/components'

defineProps<{
  accepted: boolean
  bid: Bid
}>()
</script>

<template>
  <VCard :class="accepted ? 'border-primary border-2' : ''" style="max-width: 500px">
    <VCardItem>
      <div class="d-flex justify-content-between gap-2 align-center">
        <span>
          {{ new Date(bid?.createdAt as unknown as string).toDateString() }}
        </span>
        <div>
          <VChip v-if="accepted" variant="tonal" color="success"> Accepted</VChip>
          <VChip v-else variant="tonal" color="warning"> Under Progress</VChip>
        </div>
      </div>
      <br />
      <div>
        Price Offered
        <span class="font-weight-bold"
          >&#x20B9;{{ new BigNumber(bid?.offeredPrice || 0).toFixed(2) }}</span
        >
      </div>
      <br />
      <div>
        <p class="line-clamp-3">
          {{ bid?.message }}
        </p>
      </div>
    </VCardItem>

    <br />
  </VCard>
</template>
