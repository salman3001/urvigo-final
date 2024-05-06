<script lang="ts">
import type { IBid } from '#models/bid'
import type { IServiceRequirement } from '#models/service_requirement'
import { router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { VCardItem, VChip, VProgressCircular } from 'vuetify/components'
import useApiForm from '~/composables/useApiForm'
import Layout from '~/layouts/VendorLayout.vue'
import routes from '~/utils/routes'
import ModalBase from '~/components/modal/ModalBase.vue'
import CustomForm from '~/components/form/CustomForm.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { requiredValidator } from '~/@core/utils/validators'
import VendorRequirementCard from '~/components/vendor/VendorRequirementCard.vue'
import VendorPlacedBidCard from '~/components/vendor/VendorPlacedBidCard.vue'
import AppTextarea from '~/@core/components/app-form-elements/AppTextarea.vue'
import { format } from 'date-fns'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
const props = defineProps<{
  requirement: IServiceRequirement
  placedBid: IBid
}>()

const placeBidModal = ref(false)
const negotiateModal = ref(false)

const creatChatForm = useApiForm({
  name: '',
  participantId: props.requirement.user.id,
})

const createChat = () => {
  creatChatForm.participantId = props.requirement.user.id
  creatChatForm.post(
    routes('api.chat.store'),
    {},
    {
      onSucess: () => {
        router.visit(routes('web.chat'))
      },
      onError: () => {
        router.visit(routes('web.chat'))
      },
    }
  )
}

const createBidForm = useForm({
  serviceRequirementId: props.requirement.id,
  offeredPrice: '',
  message: '',
})

const createBid = () => {
  createBidForm.post(routes('vendor.bids.create'), {
    onSuccess: () => {
      placeBidModal.value = false
    },
    onError: () => {
      placeBidModal.value = false
    },
  })
}

const acceptNegotiaionForm = useForm({
  newPrice:
    props.placedBid?.negotiateHistory[props?.placedBid?.negotiateHistory?.length - 1]
      ?.asked_price || '',
})

const acceptNegotiate = (placedBidId: number) => {
  acceptNegotiaionForm.post(routes('vendor.bids.accept_negotiate', [placedBidId]), {
    onSuccess: () => {
      negotiateModal.value = false
      router.reload()
    },
    onError: () => {
      negotiateModal.value = false
    },
  })
}
</script>

<template>
  <div>
    <VendorRequirementCard :requirement="requirement" />
    <br />
    <br />
    <div>
      <div v-if="!placedBid">
        <VBtn @click="placeBidModal = true"> Place a Bid</VBtn>
      </div>
      <div v-else>
        <h4 class="text-bold">Placed Bid</h4>
        <br />
        <VendorPlacedBidCard
          :bid="placedBid"
          :accepted="requirement?.acceptedBidId == placedBid?.id"
        />
      </div>
      <br />
      <div v-if="placedBid && placedBid.negotiateHistory?.length > 0">
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
              v-for="(h, i) in placedBid?.negotiateHistory"
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
      <br />
      <br />
      <br />
    </div>
    <ModalBase v-model:is-visible="placeBidModal" title="Place a bid">
      <VCardItem>
        <CustomForm class="q-gutter-y-sm" @submit="createBid">
          <AppTextField
            v-model="createBidForm.offeredPrice"
            type="number"
            label="Offer a price"
            :rules="[requiredValidator]"
          />
          <AppTextarea
            v-model="createBidForm.message"
            label="Message"
            :rules="[requiredValidator]"
          />
          <div class="d-flex gap-2 justify-end pt-4">
            <VBtn v-if="createBidForm.processing" disabled> <VProgressCircular /> Processing </VBtn>
            <VBtn v-else type="submit" :disabled="createBidForm.processing">Submit</VBtn>
          </div>
        </CustomForm>
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
              acceptNegotiate(placedBid!.id)
            }
          "
        >
          <AppTextField
            v-model="acceptNegotiaionForm.newPrice"
            type="number"
            label="New Price"
            :rules="[requiredValidator]"
          />
          <br />
          <div class="d-flex justify-end">
            <VBtn v-if="acceptNegotiaionForm.processing" disabled>
              <VProgressCircular /> Processing
            </VBtn>
            <VBtn v-else type="submit" :disabled="acceptNegotiaionForm.processing">Update</VBtn>
          </div>
        </CustomForm>
      </VCardItem>
    </ModalBase>
  </div>
</template>
