<script setup lang="ts">
import type { ICoupon } from '#models/coupon'
import BigNumber from 'bignumber.js'

defineProps<{
  coupon: ICoupon
}>()
</script>

<template>
  <VCardItem class="cursor-pointer bg-primary rounded">
    <p>{{ coupon.name }}</p>
    <p v-if="coupon.discountType == 'percentage'">
      {{ new BigNumber(coupon.discountPercentage).toFixed() }}% off on minimum purchase of &#8377;{{
        coupon.minPurchaseAmount
      }}
    </p>
    <p v-if="coupon.discountType == 'flat'" class="text-h6">
      &#8377;{{ coupon.discountFlat }} flat off on minimum purchase of
      {{ coupon.minPurchaseAmount }}
    </p>
  </VCardItem>
</template>
