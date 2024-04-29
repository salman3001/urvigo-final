<script lang="ts">
import Layout from '~/layouts/default.vue'
import routes from '~/utils/routes'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type { IPaginatedModel } from '#helpers/types'
import type Bid from '#models/bid'
import type ServiceRequirement from '#models/service_requirement'
import { router } from '@inertiajs/vue3'
import { onMounted, reactive, ref, watch } from 'vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import DropDown from '~/components/DropDown.vue'
import RequirementCard from '~/components/RequirementCard.vue'
import ModalBidDetail from '~/components/modal/ModalBidDetail.vue'
import ProposalCard from '~/components/web/ProposalCard.vue'
import useApiForm from '~/composables/useApiForm'
import useApiGet from '~/composables/useApiGet'

const props = defineProps<{
  requirement: ServiceRequirement
  acceptedBid: Bid
}>()

const {
  data: recivedBids,
  exec: getRecievedBids,
  processing: processingRecievedBids,
} = useApiGet<IPaginatedModel<typeof Bid>>()

const bidQuery = reactive({
  page: 1,
  perPage: 20,
  order_by: 'created_at:asc',
  orderby_lowest_price: '',
  orderby_avg_rating: '',
})

const bidDetailModal = ref(false)
const selectedBid = ref<Bid | null>(null)

const sortByVendorRating = () => {
  const newQuery = {
    page: 1,
    perPage: 20,
    order_by: '',
    orderby_avg_rating: '1',
    orderby_lowest_price: '',
  }
  Object.assign(bidQuery, newQuery)
}

const sortByLowestPrice = () => {
  const newQuery = {
    page: 1,
    perPage: 20,
    order_by: '',
    orderby_avg_rating: '',
    orderby_lowest_price: '1',
  }
  Object.assign(bidQuery, newQuery)
}

const refreshData = async () => {
  router.reload({
    only: ['requirements'],
    onSuccess: async () => {
      const newQuery = {
        page: 1,
        perPage: 20,
        order_by: 'created_at:asc',
        orderby_avg_rating: '',
        orderby_lowest_price: '',
      }
      Object.assign(bidQuery, newQuery)
    },
  })
}

watch(bidQuery, () => {
  getRecievedBids(routes('api.requirements.show_bids', [props.requirement.id]), {
    params: bidQuery,
  })
})

const creatChatForm = useApiForm({
  name: '',
  participantId: props.requirement.user.id,
})

const createChat = () => {
  creatChatForm.participantId = props.acceptedBid?.vendor.id
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

onMounted(() => {
  getRecievedBids(routes('api.requirements.show_bids', [props.requirement.id]), {
    params: bidQuery,
  })
})
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer>
    <div>
      <RequirementCard :requirement="requirement" />
      <br />
      <br />
      <div class="" style="max-width: 95vw">
        <div>
          <h3 class="text-bold">Acceped Bid</h3>
        </div>
        <br />
        <div class="row">
          <div v-if="!acceptedBid" class="text-subtitle1">
            <p>You haven't accepted any bid yet. Please accept a bid</p>
            <br />
          </div>
          <ProposalCard
            v-else
            :accepted="true"
            :bid="acceptedBid"
            @create-chat="createChat"
            :any-bid-accepted="acceptedBid ? true : false"
            :requirement-id="requirement.id"
            @bid-rejected="refreshData"
            @review="
              (v) => {
                selectedBid = v
                bidDetailModal = true
              }
            "
          />
        </div>
        <br />
        <br />
        <div class="d-flex flex-column gap-4">
          <div class="d-flex justify-space-between items-center gap-4">
            <div>
              <h3 class="text-bold">Bids Recieved</h3>
            </div>
            <div class="d-flex items-center gap-2">
              <VChip color="primary" v-if="bidQuery.orderby_avg_rating == '1'"
                >Sorting by Top Rating</VChip
              >
              <VChip color="primary" v-if="bidQuery.orderby_lowest_price == '1'"
                >Sorting by Lowest Price</VChip
              >

              <DropDown name="Filter" left-icon="tabler-filter">
                <v-list-item @click="sortByVendorRating">
                  <v-list-item-title> Highest Rating</v-list-item-title>
                </v-list-item>
                <v-list-item @click="sortByLowestPrice">
                  <v-list-item-title>Lowest Price</v-list-item-title>
                </v-list-item>
              </DropDown>
            </div>
          </div>
          <br />

          <div>
            <div v-if="processingRecievedBids">
              <VSkeletonLoader type="list-item-avatar-three-line" v-for="i in 3" :key="i" />
            </div>
            <div v-else-if="recivedBids?.data!?.length < 1">No Bids Recieved..</div>
            <VRow v-else class="row gap-100">
              <VCol v-for="bid in recivedBids?.data" cols="12" sm="6" md="4" lg="3">
                <ProposalCard
                  :accepted="false"
                  :bid="bid"
                  :any-bid-accepted="acceptedBid ? true : false"
                  @bid-accpted="refreshData"
                  @create-chat=""
                  @review="
                    (v) => {
                      selectedBid = v
                      bidDetailModal = true
                    }
                  "
                />
              </VCol>
            </VRow>
            <br />
            <br />
            <TablePagination
              :page="Number(bidQuery.page)"
              :items-per-page="Number(bidQuery?.perPage)"
              :total-items="Number(recivedBids?.meta?.total)"
              @update:page="
                (p) => {
                  bidQuery.page = p
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <ModalBidDetail
      v-model="bidDetailModal"
      :accepted-bid="acceptedBid!"
      :service-requirement="requirement"
      @create-chat="createChat"
      @negotiated="
        () => {
          bidDetailModal = false
          getRecievedBids(routes('api.requirements.show_bids', [props.requirement.id]), {
            params: bidQuery,
          })
        }
      "
      :selected-bid="selectedBid!"
    />
  </VContainer>
</template>
