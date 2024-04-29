<script setup lang="ts">
import { DiscountType } from '#helpers/enums'
import type ServiceVariant from '#models/service_variant'
import { Link, usePage } from '@inertiajs/vue3'
import BigNumber from 'bignumber.js'
import { computed, ref } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import type { IPageProps } from '../../../app/helpers/types'

const getImageUrl = useGetImageUrl()

const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

const props = defineProps<{
  variant: ServiceVariant
  diableBookButton?: boolean
}>()

let discount = new BigNumber(0)

if (props.variant.discountType === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discountFlat)
} else if (props.variant.discountType === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discountPercentage).div(100).times(props.variant.price)
}

const qty = ref(1)

const incrementQty = () => {
  qty.value += 1
}

const decrementQty = () => {
  if (qty.value > 1) {
    qty.value -= 1
  }
}
</script>

<template>
  <VCard>
    <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
      <div class="ma-auto pa-2">
        <VImg
          :width="250"
          aspect-ratio="16/9"
          cover
          :src="getImageUrl(variant.image?.thumbnailUrl)"
        />
      </div>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <div class="flex-grow-1">
        <VCardItem>
          <VCardTitle>{{ variant?.name }} </VCardTitle>
          <VChip
            color="error"
            v-if="discount.gt(0) && variant.discountType === DiscountType.PERCENATAGE"
            >{{ new BigNumber(variant.discountPercentage).toFixed(0) }}% off</VChip
          >

          <VChip color="error" v-if="discount.gt(0) && variant.discountType === DiscountType.FLAT"
            >&#x20B9;{{ variant.discountFlat }} off</VChip
          >
        </VCardItem>

        <VCardText>
          {{ variant.desc }}
        </VCardText>

        <VCardText class="text-subtitle-1">
          <span>Price :</span>
          <span class="font-weight-medium"
            >&#x20B9;{{ new BigNumber(variant?.price).minus(discount).toFixed(2) }}</span
          >&nbsp;
          <span class="font-weight-medium text-decoration-line-through" v-if="discount.gt(0)"
            >&#x20B9;{{ new BigNumber(variant?.price).toFixed(2) }}</span
          >
        </VCardText>

        <VCardActions class="justify-space-between">
          <Link
            :href="
              user
                ? routes('web.booking.summary', [variant.id]) +
                  `?serviceVariantId=${variant.id}&qty=1&couponId=`
                : routes('web.auth.login') +
                  `?next=${routes('web.booking.summary', [variant.id]) + `?serviceVarintId=${variant.id}&qty=1&couponId=`}`
            "
          >
            <VBtn v-if="!diableBookButton">
              <VIcon icon="tabler-shopping-cart-plus" />
              <span class="ms-2">Book Now</span>
            </VBtn>
          </Link>

          <IconBtn color="secondary" icon="tabler-share" />
        </VCardActions>
      </div>
    </div>
  </VCard>
</template>
