<script setup lang="ts">
import { DeliveryOptions } from '#helpers/enums'
import type { CordType } from '#helpers/types'
import { ref, watch } from 'vue'
import CustomRadios from '~/@core/components/app-form-elements/CustomRadios.vue'
import { requiredValidator } from '~/@core/utils/validators'
import { isWithinRadius } from '~/utils/helpers'

const model = defineModel<string>({ required: true })
const outOfRadiusError = defineModel<boolean>('outOfRadiusError')

const props = defineProps<{
  deliveryOptions: Array<DeliveryOptions>
  geoLocation?: CordType
  kmRadius?: number
  selectedAddressCords?: CordType
  required?: boolean
}>()

const homeOption = {
  icon: { icon: 'tabler-truck-delivery' },
  title: 'Home Service',
  desc: 'Get Service at home',
  value: DeliveryOptions.HOME_SERVICE,
}

const walkinOption = {
  icon: { icon: 'tabler-walk' },
  title: 'Walkin',
  desc: 'Walk in and Get Served',
  value: DeliveryOptions.WALK_IN,
}

const onlineOption = {
  icon: { icon: 'tabler-wifi' },
  title: 'Online',
  desc: 'Get Service done online',
  value: DeliveryOptions.ONLINE,
}

const resolveDeliveryBadgeData: any = {
  [DeliveryOptions.HOME_SERVICE]: { color: 'success', price: 'Free' },
  [DeliveryOptions.WALK_IN]: { color: 'success', price: 'Free' },
  [DeliveryOptions.ONLINE]: { color: 'success', price: 'Free' },
}

const deliveryOpt = ref<any[]>([])

props.deliveryOptions.forEach((o) => {
  if (o === DeliveryOptions.HOME_SERVICE) {
    deliveryOpt.value.push(homeOption)
  }

  if (o === DeliveryOptions.WALK_IN) {
    deliveryOpt.value.push(walkinOption)
  }

  if (o === DeliveryOptions.ONLINE) {
    deliveryOpt.value.push(onlineOption)
  }
})

watch(model, (v) => {
  outOfRadiusError.value = false
  if (v === DeliveryOptions.HOME_SERVICE && props.geoLocation && props.selectedAddressCords) {
    outOfRadiusError.value = !isWithinRadius(
      props.geoLocation as CordType,
      props.selectedAddressCords,
      props.kmRadius!
    )
  }
})

watch(
  () => props.selectedAddressCords,
  () => {
    outOfRadiusError.value = false

    if (
      model.value === DeliveryOptions.HOME_SERVICE &&
      props.geoLocation &&
      props.selectedAddressCords
    ) {
      outOfRadiusError.value = !isWithinRadius(
        props.geoLocation as CordType,
        props.selectedAddressCords,
        props.kmRadius!
      )
    }
  }
)
</script>

<template>
  <CustomRadios
    v-model:selected-radio="model"
    :radio-content="deliveryOpt"
    :grid-column="{ cols: '12', sm: '4' }"
    :rules="[required && requiredValidator]"
  >
    <template #default="{ item }">
      <div class="d-flex flex-column align-center gap-2 w-100">
        <div class="d-flex justify-end w-100 mb-n3">
          <VChip :color="resolveDeliveryBadgeData[item.value].color" size="small" label>
            {{
              resolveDeliveryBadgeData[item.value].price === 'Free'
                ? resolveDeliveryBadgeData[item.value].price
                : `$${resolveDeliveryBadgeData[item.value].price}`
            }}
          </VChip>
        </div>

        <VIcon v-bind="item?.icon" size="28" />

        <h6 class="text-h6">
          {{ item.title }}
        </h6>
        <p class="text-sm text-center mb-0">
          {{ item.desc }}
        </p>
      </div>
    </template>
  </CustomRadios>
</template>
