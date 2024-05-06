<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { IAddress } from '../../app/models/address'
import useApiGet from '~/composables/useApiGet'
import routes from '~/utils/routes'
import { VBtn, VSkeletonLoader } from 'vuetify/components'
import ModalAddAddress from './modal/ModalAddAddress.vue'
import CustomRadios from '~/@core/components/app-form-elements/CustomRadios.vue'
import { AddressType } from '../../app/helpers/enums'
import ModalConfirm from './modal/ModalConfirm.vue'
import useApiForm from '~/composables/useApiForm'
import ModalEditAddress from './modal/ModalEditAddress.vue'
import { emptyValidator, requiredValidator } from '~/@core/utils/validators'

const addAddressModal = ref(false)
const deleteAddressModal = ref(false)
const editAddressModal = ref(false)
const selectedAddress = ref<IAddress>()
defineProps<{
  editable?: boolean
  required?: boolean
}>()

const { data: addresses, processing, exec: getAddresses } = useApiGet<IAddress[]>()
const deleteAddressForm = useApiForm({})

const radioContent = computed(() =>
  addresses.value
    ? addresses.value.map((ad) => ({
        title: ad.mapAddress,
        desc: ad.address,
        subtitle: ad.mobile,
        value: ad,
      }))
    : []
)

const resolveAddressBadgeColor: any = {
  [AddressType.HOME]: 'primary',
  [AddressType.OFFICE]: 'success',
}

defineEmits<{
  (e: 'selected-address', address: IAddress): void
}>()

const deleteAddress = () => {
  deleteAddressForm.delete(
    routes('api.address.destroy', [selectedAddress.value!?.id]),
    {},
    {
      onSucess: () => {
        getAddresses(routes('api.address.index'))
      },
    }
  )
}

onMounted(() => {
  getAddresses(routes('api.address.index'))
})
</script>

<template>
  <div v-if="processing">
    <VSkeletonLoader v-for="i in 3" :key="i" type="list-item-two-line" />
  </div>
  <div v-if="addresses && addresses?.length < 1">No Address! Please add an address</div>
  <CustomRadios
    v-model:selected-radio="selectedAddress"
    :radio-content="radioContent"
    :grid-column="{ cols: '12', sm: '6' }"
    :rules="[required ? requiredValidator : emptyValidator]"
    @update:selected-radio="
      (v) => {
        $emit('selected-address', v)
      }
    "
  >
    <template #default="{ item }">
      <div class="w-100">
        <div class="d-flex justify-space-between mb-3 flex-wrap-reverse flex-md-nowrap">
          <h6 class="text-base font-weight-medium line-clamp-2">
            {{ item.title }}
          </h6>

          <VChip
            :color="resolveAddressBadgeColor[item?.value?.type]"
            label
            size="small"
            class="text-capitalize"
            style="min-width: max-content"
          >
            {{ item.value?.type === AddressType.HOME ? 'Home' : 'Office' }}
          </VChip>
        </div>

        <p class="mb-0 text-sm line-clamp-2">
          {{ item.desc }}
        </p>
        <p class="text-sm mb-3">Mobile: {{ item.subtitle }}</p>
        <VDivider v-if="editable" />
        <div v-if="editable" class="pt-2">
          <VBtn
            variant="text"
            href="#"
            class="me-4"
            @click="
              () => {
                selectedAddress = item.value
                editAddressModal = true
              }
            "
          >
            Edit
          </VBtn>
          <VBtn
            variant="text"
            href="#"
            @click="
              () => {
                selectedAddress = item.value
                deleteAddressModal = true
              }
            "
          >
            Remove
          </VBtn>
        </div>
      </div>
    </template>
  </CustomRadios>

  <!-- 👉 Add New Address -->
  <VBtn
    variant="tonal"
    class="mt-4 mb-6"
    prepend-icon="tabler-plus"
    @click="
      () => {
        addAddressModal = true
      }
    "
  >
    Add New Address
  </VBtn>

  <ModalAddAddress
    v-model="addAddressModal"
    @success="() => getAddresses(routes('api.address.index'))"
  />
  <ModalEditAddress
    v-model="editAddressModal"
    :address="selectedAddress!"
    @success="() => getAddresses(routes('api.address.index'))"
  />
  <ModalConfirm
    v-model:is-visible="deleteAddressModal"
    title="Delete Address"
    message="Are you sure to delete this address?"
    @confirmed="
      () => {
        deleteAddress()
        deleteAddressModal = false
      }
    "
  />
</template>
