<script setup lang="ts">
import Coupon from '#models/coupon'
import CouponCard from '../CouponCard.vue'
import ModalBase from './ModalBase.vue'

const isVisible = defineModel<boolean>('isVisible')

defineProps<{
  couponList: Coupon[]
}>()

const emit = defineEmits<{
  (e: 'apply', couponId: number): void
}>()
</script>

<template>
  <ModalBase
    v-model:is-visible="isVisible"
    title="Apply Coupon"
    subtitle="Please select oone from available coupons"
  >
    <VCardItem>
      <VRow>
        <VCol cols="2" sm="6" v-for="(c, i) in couponList" :key="i">
          <CouponCard :coupon="c" @click="$emit('apply', c.id)" />
        </VCol>
      </VRow>
    </VCardItem>
  </ModalBase>
</template>
