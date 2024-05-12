<script setup lang="ts">
import useGetImageUrl from '~/composables/useGetImageUrl'
import BigNumber from 'bignumber.js'
import type { IService } from '#models/service'
import wishlistStore from '~/stores/wishlistStore'
import { ref, watch } from 'vue'
import { DiscountType } from '#helpers/enums'
import routes from '~/utils/routes'
import { Link, useForm } from '@inertiajs/vue3'
import { VBtn, VCard, VChip } from 'vuetify/components'

const pageProps = defineProps<{
  service: IService
}>()

const getImageUrl = useGetImageUrl()
const wishlist = wishlistStore()
const color = ref('white')

const minPriceVariant = pageProps.service.variants.reduce((prev, current) =>
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

const isWishlisted = ref<boolean | undefined>(false)

watch(
  () => wishlist.wishlistItems,
  () => {
    isWishlisted.value = wishlist.isWishlisted(pageProps.service.id)
  },
  { immediate: true }
)

const addItemForm = useForm({
  serviceId: '',
})

const removeItemForm = useForm({
  serviceId: '',
})

const addItem = (serviceId: number | string) => {
  addItemForm.serviceId = serviceId as string
  addItemForm.post(routes('web.account.wishlist.add_item'), {
    onSuccess: () => {
      wishlist.fetchWishlist({})
    },
    preserveScroll: true,
  })
}

const removeItem = (serviceId: number | string) => {
  removeItemForm.serviceId = serviceId as string
  removeItemForm.post(routes('web.account.wishlist.remove_item'), {
    onSuccess: () => {
      wishlist.fetchWishlist({})
    },
    preserveScroll: true,
  })
}
</script>

<template>
  <Link :href="routes('web.services.show', [service.slug])">
    <VCard density="compact" class="ma-0" style="position: relative !important">
      <VImg :src="getImageUrl(service?.thumbnail?.thumbnailUrl)" cover />
      <VCardItem>
        <VChip v-if="service?.serviceCategory?.name" variant="tonal" color="info" size="small">
          {{ service?.serviceCategory?.name }}
        </VChip>
        <VCardTitle>{{ service.name }}</VCardTitle>
      </VCardItem>

      <VCardText>
        <p class="line-clamp-3">
          {{ service?.shortDesc }}
        </p>
        <span>
          <span>
            <VChip
              v-if="discount.gt(0) && minPriceVariant.discountType === DiscountType.FLAT"
              color="error"
              >&#x20B9;{{ minPriceVariant.discountFlat }} off</VChip
            >
            <VChip
              v-if="discount.gt(0) && minPriceVariant.discountType === DiscountType.PERCENATAGE"
              color="error"
              >{{ minPriceVariant.discountPercentage }}% off</VChip
            >
          </span>
        </span>
        <span class="font-weight-medium">
          <div class="d-flex justify-between">
            <div class="">
              <span> {{ service.variants?.length ? 1 && 'Starting From ' : '' }}</span>
              <span class="text-bold text-h6 font-weight-bold"
                >&#x20B9;{{ new BigNumber(minPriceVariant.price).minus(discount).toFixed(2) }}</span
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
      <div class="fav-icon">
        <VTooltip v-if="isWishlisted" text="Remove FromWishlist">
          <template #activator="{ props }">
            <VBtn
              icon
              color="pink"
              v-bind="props"
              class="cursor-pointer"
              size="large"
              @click="
                (e: Event) => {
                  e.preventDefault()
                  removeItem(service.id)
                }
              "
            >
              <VIcon icon="tabler-heart-filled" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip v-else text="Add to Wishlist">
          <template #activator="{ props }">
            <VBtn
              icon
              :color="color"
              v-bind="props"
              class="cursor-pointer"
              size="large"
              @mouseenter="color = 'pink'"
              @mouseleave="color = 'secondary'"
              @click="
                (e: Event) => {
                  e.preventDefault()
                  addItem(service.id)
                }
              "
            >
              <VIcon icon="tabler-heart-filled" />
            </VBtn>
          </template>
        </VTooltip>
      </div>
    </VCard>
  </Link>
</template>

<style lang="scss" scoped>
.v-btn {
  transform: none;
}

.fav-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0.8;
}
</style>
