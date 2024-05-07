<script setup lang="ts">
import type { IServiceRequirement } from '#models/service_requirement'
import { Link, usePage } from '@inertiajs/vue3'
import BigNumber from 'bignumber.js'
import { computed } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import dummyThumb from '~/assets/images/dummy-avatar.webp'
import LightBox from '../LightBox.vue'
import ClientOnly from '../client-only.vue'
import { format } from 'date-fns'
import MapLink from '../MapLink.vue'
import type { CordType } from '#helpers/types'
import { resolveDeliveryOptions } from '~/utils/helpers'
import { DeliveryOptions } from '#helpers/enums'

defineProps<{
  requirement: IServiceRequirement
}>()

const page = usePage()
const currentUrl = computed(() => page.url)

const getImageUrls = useGetImageUrl()
</script>

<template>
  <VCard density="compact" dense>
    <template #title>
      <div class="d-flex flex-wrap">
        <VTooltip
          v-for="(dt, i) in requirement.deliveryOptions"
          :key="i"
          text="Accepted Delivery type"
        >
          <template #activator="{ props }">
            <VChip
              variant="text"
              :prepend-icon="
                dt === DeliveryOptions.HOME_SERVICE
                  ? 'tabler-truck-delivery'
                  : dt === DeliveryOptions.WALK_IN
                    ? 'tabler-walk'
                    : dt === DeliveryOptions.ONLINE
                      ? 'tabler-wifi'
                      : ''
              "
              v-bind="props"
            >
              {{ resolveDeliveryOptions(dt) }}
            </VChip>
          </template>
        </VTooltip>
      </div>
    </template>
    <template #append>
      <div class="d-flex flex-column align-center justify-center">
        <VAvatar
          :image="getImageUrls(requirement?.user?.profile?.avatar?.thumbnailUrl, dummyThumb)"
          size="48"
        >
        </VAvatar>
        <div>
          {{ requirement?.user?.firstName }}
          {{ requirement?.user?.lastName }}
        </div>
      </div>
    </template>

    <VCardText>
      <p class="text-h5">{{ requirement.title }}</p>
      <p>
        {{ requirement.desc }}
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <VChip color="" style="max-width: max-content"
          >&#x20B9;{{ requirement.budget }} {{ requirement.budgetUnit }}</VChip
        >
        <VChip v-if="requirement.urgent" color="error" style="max-width: max-content"
          >Urgent Requirment</VChip
        >
      </div>
    </VCardText>

    <VCardItem v-if="requirement?.images">
      <h3>Images</h3>
      <br />
      <ClientOnly>
        <LightBox :images="requirement.images.map((i) => getImageUrls(i?.file?.url))" />
      </ClientOnly>
    </VCardItem>
    <VCardItem>
      <div class="d-flex flex-wrap justify-space-between gap-3">
        <div class="d-flex gap-2">
          <VIcon icon="tabler-map-pin"></VIcon>
          <MapLink
            :x="(requirement.geoLocation as CordType).x"
            :y="(requirement.geoLocation as CordType).y"
            >{{ requirement.address }}</MapLink
          >
        </div>

        <div>
          <ClientOnly>
            <div>
              Posted on:
              {{ format(requirement?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
            </div>
            <div>
              Expired on:
              {{ format(requirement?.expiresAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
            </div>
          </ClientOnly>
        </div>
      </div>
    </VCardItem>

    <VCardText>
      <VDivider />
    </VCardText>

    <VCardText class="d-flex flex-wrap justify-space-between">
      <div class="normalcase d-flex gap-2 flex-grow-1 pa-2">
        <p v-for="(tag, i) in requirement?.tags" :key="i">#{{ tag.name }}</p>
      </div>

      <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

      <div class="d-flex flex-wrap justify-end gap-2 pa-2 flex-grow-1">
        <VChip color="secondary">
          <VIcon icon="tabler-message" />&nbsp; Bids&nbsp;
          <span>{{ requirement?.meta?.recievedBids_count }}</span>
        </VChip>
        <VChip color="secondary">
          <VIcon icon="tabler-moneybag" /> &nbsp;Avg. Price
          <span>
            &nbsp; &#x20B9;
            {{ new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2) }}</span
          >
        </VChip>
        <VChip color="secondary">
          <VIcon icon="tabler-circle-check" />&nbsp;Accepted Bid&nbsp;
          <span> {{ requirement.acceptedBidId ? 1 : 0 }}</span>
        </VChip>
        <Link
          v-if="currentUrl != routes('vendor.requirements.show', [requirement.id])"
          :href="routes('vendor.requirements.show', [requirement.id])"
        >
          <VBtn variant="tonal" color="primary"> View Detail </VBtn>
        </Link>
      </div>
    </VCardText>
  </VCard>
</template>
