<script setup lang="ts">
import Coupon from '#models/coupon'
import BigNumber from 'bignumber.js'

defineProps<{
  coupon: Coupon
}>()
</script>

<template>
  <VCard :color="'primary'" hover class="cursor-pointer">
    <VCardItem>
      <p>{{ coupon.name }}</p>
      <p v-if="coupon.discountType == 'percentage'">
        {{ new BigNumber(coupon.discountPercentage).toFixed() }}% off
      </p>
      <p v-if="coupon.discountType == 'flat'" class="text-h6">
        &#8377;{{ coupon.discountFlat }} flat off
      </p>
    </VCardItem>
  </VCard>
</template>
