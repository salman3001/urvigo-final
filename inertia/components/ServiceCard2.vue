<script setup lang="ts">
import { DiscountType } from '#helpers/enums'
import type Service from '#models/service'
import BigNumber from 'bignumber.js'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'

const getImageUrl = useGetImageUrl()

const props = defineProps<{ service: Service }>()

const minPriceVariant = props.service.variants.reduce((prev, current) =>
  prev.price < current.price ? prev : current
)

let discount = new BigNumber(0)

if (minPriceVariant.discountType === DiscountType.FLAT) {
  discount = discount.plus(minPriceVariant?.discountFlat || 0)
} else if (minPriceVariant?.discountType === DiscountType.PERCENATAGE) {
  discount = new BigNumber(minPriceVariant?.discountPercentage || 0)
    .div(100)
    .times(minPriceVariant.price)
}
</script>

<template>
  <VCard density="compact" :to="routes('web.services.show', [service.slug])">
    <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column">
      <div class="ma-auto pa-1">
        <VImg
          cover
          aspect-ratio="16/9"
          width="300"
          :src="getImageUrl(service.images?.[0]?.file?.thumbnailUrl)"
        />
      </div>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <div>
        <VCardItem>
          <VChip variant="tonal" color="info" size="small"
            >{{ service?.serviceCategory?.name }}
          </VChip>
          <VCardTitle> {{ service?.name }}</VCardTitle>
        </VCardItem>

        <VCardText>
          <p class="line-clamp-3">
            {{ service?.shortDesc }}
          </p>
          <span>
            <VChip
              color="error"
              v-if="discount.gt(0) && minPriceVariant.discountType === DiscountType.FLAT"
              >&#x20B9;{{ minPriceVariant.discountFlat }} off</VChip
            >
            <VChip
              color="error"
              v-if="discount.gt(0) && minPriceVariant.discountType === DiscountType.PERCENATAGE"
              >{{ minPriceVariant.discountPercentage }}% off</VChip
            >
          </span>
          <span class="font-weight-medium">
            <div class="d-flex justify-between">
              <div class="">
                <span> {{ service.variants?.length ? 1 && 'Starting From ' : '' }}</span>
                <span class="text-bold text-h6"
                  >&#x20B9;{{
                    new BigNumber(minPriceVariant.price).minus(discount).toFixed(2)
                  }}</span
                >
                <span v-if="discount.gt(0)" class="text-bold text-h6 text-decoration-line-through"
                  >&nbsp;&#x20B9;{{ new BigNumber(minPriceVariant.price).toFixed(2) }}</span
                >
              </div>
            </div>
          </span>
        </VCardText>

        <VCardActions class="align-center justify-space-between">
          <VBtn>
            <VIcon icon="tabler-star-filled" color="primary" size="22" />
            &nbsp;
            <span>{{ service.avgRating }} | {{ service?.meta?.reviews_count }} Reviews</span>
          </VBtn>

          <IconBtn color="secondary" icon="tabler-share" />
        </VCardActions>
      </div>
    </div>
  </VCard>
</template>
