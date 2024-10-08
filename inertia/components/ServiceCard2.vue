<script setup lang="ts">
import { DiscountType } from '#helpers/enums'
import Service from '#models/service'
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
  <VCard :to="routes.services.view(service?.slug)">
    <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column">
      <div class="ma-auto pa-1">
        <VImg
          cover
          aspect-ratio="16/9"
          width="300"
          :src="getImageUrl(service.images?.[0]?.file?.breakpoints?.thumbnail?.url)"
        />
      </div>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <div>
        <VCardItem>
          <VCardTitle> {{ service?.name }}</VCardTitle>
        </VCardItem>

        <VCardText>
          <p class="line-clamp-3">
            {{ service?.shortDesc }}
          </p>
        </VCardText>

        <VCardText class="text-subtitle-1">
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
                <span> {{ service.variants?.length ? 1 && 'Starting From' : '' }}</span
                ><span class="text-bold text-h6">
                  &#x20B9;{{
                    service.variants?.length > 1
                      ? service?.meta?.starting_from
                      : service?.variants[0]?.price
                  }}</span
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
