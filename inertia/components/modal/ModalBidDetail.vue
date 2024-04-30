<script setup lang="ts">
import type { IBid } from '#models/bid'
import type { IServiceRequirement } from '#models/service_requirement'
import dummyAvatar from '@images/dummy-avatar.webp'
import { Link } from '@inertiajs/vue3'
import BigNumber from 'bignumber.js'
import { ref } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import ModalBidNegotiate from './ModalBidNegotiate.vue'
import ModalBase from './ModalBase.vue'
import RatingComponent from '../RatingComponent.vue'
import routes from '~/utils/routes'
import { format } from 'date-fns'

defineProps<{
  selectedBid: IBid
  acceptedBid: IBid
  serviceRequirement: IServiceRequirement
}>()

const emit = defineEmits<{
  (e: 'createChat'): void
  (e: 'negotiated'): void
}>()

const model = defineModel<boolean>({ required: true })
const negotiateModal = ref(false)

const getImageUrl = useGetImageUrl()
</script>

<template>
  <ModalBase v-model:is-visible="model" title="" subtitle="">
    <VCardItem v-if="selectedBid">
      <div class="d-flex gap-2 flex-wrap justify-space-between">
        <div class="d-flex gap-2">
          <VAvatar
            :image="getImageUrl(selectedBid?.vendor?.profile?.avatar?.url, dummyAvatar)"
            size="x-large"
          />
          <div>
            <div>
              <RatingComponent
                :rating="selectedBid?.vendor?.businessProfile.avgRating || 0"
                size="large"
              />
            </div>
            <div class="d-flex gap-2" v-if="acceptedBid?.id === selectedBid?.id">
              <span>
                {{ selectedBid?.vendor.firstName }}
                {{ selectedBid?.vendor.lastName }}
              </span>
              <VBtn
                size="small"
                v-if="acceptedBid?.id === selectedBid?.id"
                @click="() => emit('createChat')"
                >chat
              </VBtn>
            </div>
            <p v-else>Anonymous</p>
            <div>
              <Link :href="routes('web.vendor-profile.about', [selectedBid.vendor.id])">{{
                selectedBid?.vendor?.businessProfile?.businessName
              }}</Link>
            </div>
          </div>
        </div>
        <div>
          <p class="text-caption">
            {{ format(selectedBid?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </p>
          <VChip v-if="acceptedBid?.id === selectedBid?.id" outline color="success">
            Accepted</VChip
          >
        </div>
      </div>
      <br />
      <div>
        Price Offered
        <span class="font-weight-bold"
          >&#x20B9;{{ new BigNumber(selectedBid?.offeredPrice || 0).toFixed(2) }}</span
        >
      </div>
      <br />
      <div>
        <p>
          {{ selectedBid?.message }}
        </p>
      </div>
      <br />
      <div v-if="selectedBid?.negotiateHistory.length">
        <h4 class="text-bold">Negotiation History</h4>
        <br />
        <VTimeline
          truncate-line="both"
          line-inset="9"
          align="start"
          side="end"
          line-color="primary"
          density="compact"
        >
          <VTimelineItem
            v-for="(h, i) in selectedBid?.negotiateHistory"
            :key="i"
            dot-color="primary"
            size="x-small"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="app-timeline-title">You Offered {{ h.asked_price }}</div>
              <div class="app-timeline-meta">
                {{ format(h?.date_time as unknown as string, 'dd/MM/yyyy HH:mm') }}
              </div>
            </div>
            <p class="app-timeline-text mb-1 mt-1">
              {{ h.message }}
            </p>
            <div v-if="!h.accepted">
              <VChip color="warning">Pending</VChip>
            </div>
            <div v-else>
              <VChip color="success">Accepted</VChip>
            </div>
          </VTimelineItem>
        </VTimeline>
      </div>
    </VCardItem>
    <VCardItem v-if="selectedBid && !acceptedBid">
      <div class="d-flex justify-end gap-2">
        <VBtn
          variant="tonal"
          color="primary"
          @click.prevent="negotiateModal = true"
          v-if="
            !selectedBid?.negotiateHistory?.length ||
            selectedBid?.negotiateHistory[selectedBid?.negotiateHistory?.length - 1]?.accepted
          "
          >Negotiate</VBtn
        >
        <Link
          :href="
            routes('web.custom_booking.summary') +
            `?requirementId=${serviceRequirement.id}&acceptedBidId=${selectedBid.id}`
          "
        >
          <VBtn v-if="!serviceRequirement?.acceptedBidId" color="primary">Accept and Book</VBtn>
        </Link>
      </div>
    </VCardItem>
    <ModalBidNegotiate
      v-model="negotiateModal"
      :selected-bid="selectedBid"
      :service-requirement="serviceRequirement"
      @negotiated="
        () => {
          negotiateModal = false
          emit('negotiated')
        }
      "
    />
  </ModalBase>
</template>
~/utils/routes-old
