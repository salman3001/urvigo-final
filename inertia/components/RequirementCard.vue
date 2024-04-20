<script setup lang="ts">
import type ServiceRequirement from '#models/service_requirement'
import { Link, usePage } from '@inertiajs/vue3'
import BigNumber from 'bignumber.js'
import { differenceInMinutes } from 'date-fns'
import { computed } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import ClientOnly from './client-only.vue'
import LightBox from './LightBox.vue'

defineProps<{
  requirement: ServiceRequirement
}>()

const page = usePage()
const currentUrl = computed(() => page.url)

const getImageUrls = useGetImageUrl()
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol>
        <VCardItem>
          <VCardTitle
            ><h3>{{ requirement.title }}</h3></VCardTitle
          >
        </VCardItem>

        <VCardText>
          {{ requirement.desc }}
        </VCardText>
        <VCardItem v-if="requirement?.images">
          <h3>Images</h3>
          <br />
          <ClientOnly>
            <LightBox :images="requirement.images.map((i) => getImageUrls(i?.file?.url))" />
          </ClientOnly>
        </VCardItem>

        <VCardItem>
          <div class="d-flex flex-wrap justify-space-between gap-3 text-caption">
            <div class="d-flex flex-column gap-2">
              <div>
                <VIcon icon="tabler-map-pin"></VIcon>
                Jarkhand, India
              </div>
              <div class="d-flex gap-2">
                <VChip v-if="requirement.urgent" color="error">Urgent Requirment</VChip>
                <VChip color="warning" v-if="!requirement.acceptedBidId">Active</VChip>
                <VChip v-else-if="requirement.acceptedBidId != null" color="success"
                  >Accepted</VChip
                >
                <VChip
                  color="error"
                  v-else-if="
                    differenceInMinutes(requirement.expiresAt as unknown as string, Date.now()) < 0
                  "
                  >Expired</VChip
                >
              </div>
            </div>

            <div>
              <ClientOnly>
                <div>
                  Posted on:
                  {{ new Date(requirement.createdAt as unknown as string).toDateString() }}
                </div>
                <div>
                  Expired on:
                  {{ new Date(requirement.expiresAt as unknown as string).toDateString() }}
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
            <VChip color="secondary"
              ><VIcon icon="tabler-message" />&nbsp; Bids&nbsp;
              <span>{{ requirement?.meta?.recievedBids_count }}</span></VChip
            >
            <VChip color="secondary">
              <VIcon icon="tabler-moneybag" /> &nbsp;Avg. Price
              <span>
                &nbsp; &#x20B9;
                {{ new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2) }}</span
              >
            </VChip>
            <VChip color="secondary"
              ><VIcon icon="tabler-circle-check" />&nbsp;Accepted Bid&nbsp;
              <span> {{ requirement.acceptedBidId ? 1 : 0 }}</span></VChip
            >
            <Link
              :href="routes.service_requirement.view(requirement.id)"
              v-if="currentUrl != routes.service_requirement.view(requirement.id)"
            >
              <VBtn color="primary"> View Detail </VBtn>
            </Link>
          </div>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
