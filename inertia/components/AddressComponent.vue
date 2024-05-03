<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IAddress } from '../../app/models/address'
import useApiGet from '~/composables/useApiGet'
import routes from '~/utils/routes'
import { VBtn, VSkeletonLoader } from 'vuetify/components'
import ModalAddAddress from './modal/ModalAddAddress.vue'

const addAddressModal = ref(false)
const selectedAddress = ref<IAddress>()

const { data: addresses, processing, exec: getAddresses } = useApiGet<IAddress[]>()

defineEmits<{
  (e: 'selected-address', address: IAddress): void
}>()

onMounted(() => {
  getAddresses(routes('api.address.index'))
})
</script>

<template>
  <div class="py-2">
    <div class="d-flex flex-wrap gap-2">
      <VSkeletonLoader v-if="processing" v-for="i in 3" :key="i" type="list-item-avatar-two-line" />
      <div v-if="addresses && addresses?.length < 1">No Address! Please add an address</div>
      <div
        v-else
        v-for="ad in addresses"
        @click="
          () => {
            selectedAddress = ad as IAddress
            $emit('selected-address', ad as IAddress)
          }
        "
      >
        {{ ad.mapAddress }}
      </div>
    </div>
    <div class="d-flex justify-end p-2 mt-4">
      <VBtn
        prepend-icon="tabler-plus"
        @click="
          () => {
            addAddressModal = true
          }
        "
        >Add New Address</VBtn
      >
    </div>
  </div>
  <ModalAddAddress
    v-model="addAddressModal"
    @success="() => getAddresses(routes('api.address.index'))"
  />
</template>
