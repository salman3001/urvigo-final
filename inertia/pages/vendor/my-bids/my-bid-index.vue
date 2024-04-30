<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import type { IBid } from '../../../../app/models/bid'
import BigNumber from 'bignumber.js'
import { reactive, ref } from 'vue'
import ModalBase from '~/components/modal/ModalBase.vue'
import type { IPaginatedModel } from '../../../../app/helpers/types'
import { Link, router, useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import CustomForm from '~/components/form/CustomForm.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { requiredValidator } from '~/@core/utils/validators'
import { watch } from 'vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import { format } from 'date-fns'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
defineProps<{
  bids: IPaginatedModel<IBid>
}>()

const detailModal = ref(false)
const selectedBid = ref<IBid | null>(null)
const negotiateModal = ref(false)

const query = reactive({
  page: 1,
})

const acceptNegotiaionForm = useForm({
  newPrice: '',
})

const acceptNegotiate = (placedBidId: number) => {
  acceptNegotiaionForm.post(routes('vendor.bids.accept_negotiate', [placedBidId]), {
    onSuccess: () => {
      negotiateModal.value = false
      detailModal.value = false
      router.reload()
    },
    onError: () => {
      negotiateModal.value = false
    },
  })
}

watch(selectedBid, () => {
  if (selectedBid.value)
    acceptNegotiaionForm.newPrice =
      selectedBid.value?.negotiateHistory[selectedBid.value?.negotiateHistory?.length - 1]
        ?.asked_price || ''
})

watch(query, () => {
  router.reload({
    only: ['bids'],
    data: query,
  })
})
</script>

<template>
  <VRow>
    <VCol v-for="bid in bids.data" :key="bid.id" :bid="bid" cols="12" md="4">
      <VCard>
        <VCardItem>
          <div class="d-flex gap-2 flex-wrap justify-space-between">
            <div class="d-flex gap-4">
              <div>
                <div clas="text-caption">
                  {{ format(bid?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
                </div>
              </div>
            </div>
            <div>
              <VChip v-if="bid.id === bid?.serviceRequirement?.acceptedBidId" color="success">
                Accepted
              </VChip>
            </div>
          </div>
          <br />
          <Link :href="routes('vendor.requirements.show', [bid.serviceRequirement.id])">
            <p>
              {{ bid.serviceRequirement.title }}
            </p>
          </Link>
          <div>
            <VChip color="primary">
              &#x20B9;{{ new BigNumber(bid?.offeredPrice || 0).toFixed(2) }}</VChip
            >
          </div>
          <br />
          <div>
            <p class="text-body-1 line-clamp-3">
              {{ bid?.message }}
            </p>
          </div>
        </VCardItem>
        <VDivider />
        <VCardActions class="justify-end mt-2">
          <VBtn
            color="primary"
            @click="
              () => {
                selectedBid = bid
                detailModal = true
              }
            "
            >Review</VBtn
          >
        </VCardActions>
        <br />
      </VCard>
    </VCol>
  </VRow>
  <br />
  <TablePagination
    :page="Number(query.page)"
    :items-per-page="Number(bids?.meta?.perPage)"
    :total-items="Number(bids?.meta?.total)"
    @update:page="
      (p) => {
        query.page = p
      }
    "
  />
  <ModalBase v-model:is-visible="detailModal" title="Bid Detail">
    <VCardItem v-if="selectedBid">
      <div class="d-flex gap-2 flex-wrap justify-space-between">
        <div>
          <p class="text-caption">
            {{ format(selectedBid?.createdAt as unknown as string, 'dd/MM/yyyy HH:mm') }}
          </p>
          <VChip
            v-if="selectedBid.id === selectedBid?.serviceRequirement?.acceptedBidId"
            outline
            color="success"
          >
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
      <div v-if="selectedBid && selectedBid.negotiateHistory?.length > 0">
        <h4 class="text-bold">Negotiate history</h4>
        <br />
        <div>
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
                <p>customer has offered &#x20B9;{{ h.asked_price }}</p>
                <p>
                  {{ format(h?.date_time as unknown as string, 'dd/MM/yyyy HH:mm') }}
                </p>
              </div>
              <p>
                Customer Says :
                {{ h.message }}
              </p>
              <div v-if="!h.accepted">
                <VBtn @click="negotiateModal = true">Negotiate</VBtn>
              </div>
              <div v-else>
                <VChip variant="tonal">Negotiated</VChip>
              </div>
            </VTimelineItem>
          </VTimeline>
        </div>
      </div>
    </VCardItem>
  </ModalBase>
  <ModalBase
    v-model="negotiateModal"
    title="Negotiate Price"
    subtitle="You can accept the customer offered price or propose a new price"
  >
    <VCardItem>
      <CustomForm
        @submit="
          () => {
            acceptNegotiate(selectedBid!.id)
          }
        "
      >
        <AppTextField
          type="number"
          v-model="acceptNegotiaionForm.newPrice"
          label="New Price"
          :rules="[requiredValidator]"
        />
        <br />
        <div class="d-flex justify-end">
          <VBtn v-if="acceptNegotiaionForm.processing" disabled>
            <VProgressCircular /> Processing
          </VBtn>
          <VBtn type="submit" :disabled="acceptNegotiaionForm.processing" v-else>Update</VBtn>
        </div>
      </CustomForm>
    </VCardItem>
  </ModalBase>
</template>
