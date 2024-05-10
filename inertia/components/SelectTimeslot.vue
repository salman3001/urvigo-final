<script setup lang="ts">
import type { SlotType } from '#helpers/types'
import { ref, watch } from 'vue'
import AppDateTimePicker from '~/@core/components/app-form-elements/AppDateTimePicker.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import { requiredValidator } from '~/@core/utils/validators'
import useApiGet from '~/composables/useApiGet'
import routes from '~/utils/routes'
import { differenceInDays, format } from 'date-fns'

const props = defineProps<{
  timeSlotId: number
}>()

const emits = defineEmits<{
  (e: 'selected-slot', slot: SlotType[0]): void
}>()

const date = ref('')
const slot = ref<null | SlotType[0]>()

const { data: slots, processing, exec } = useApiGet<Array<SlotType>>()

const getTimeSlots = (opt: { year: number; month: number; day: number }) => {
  exec(
    routes('api.timeslot_plan.get_available_slots', [
      props.timeSlotId,
      opt.year,
      opt.month,
      opt.day,
    ])
  )
}

watch(date, () => {
  if (date.value) {
    const [day, month, year] = date.value.split('/')

    getTimeSlots({
      year: +year,
      month: +month,
      day: +day,
    })
  }
})

watch(slot, () => {
  slot.value && emits('selected-slot', slot.value)
})

const itemProps = (item: SlotType[0]) => {
  const fromDate = new Date(item.from)
  const toDate = new Date(item.to)

  return { title: item ? `${format(fromDate, 'hh:mm')}-${format(toDate, 'hh:mm')}` : '' }
}

const enabledDate = (dateValue: Date) => {
  const from = new Date(Date.now())
  return differenceInDays(dateValue, from) >= 0 && differenceInDays(dateValue, from) <= 30
}
</script>

<template>
  <VRow>
    <VCol cols="12" md="6">
      <AppDateTimePicker
        v-model="date"
        label="Select Date"
        placeholder="Select Date"
        :config="{
          dateFormat: 'd/m/Y',
          enable: [enabledDate],
        }"
        :rules="[requiredValidator]"
        @update:model-value="
          () => {
            slot = null
          }
        "
      />
    </VCol>
    <VCol cols="12" md="6" class="mt-1">
      <AppSelect
        v-if="!processing && slots!?.length > 0"
        v-model="slot"
        :items="slots"
        label="Select time Slot"
        :rules="[requiredValidator]"
        :item-props="itemProps"
        return-object
      />
      <p v-else-if="!date" class="text-center mt-4">Select date for available slots</p>
      <p v-else class="text-center mt-4">No Slots available</p>
    </VCol>
  </VRow>
</template>
