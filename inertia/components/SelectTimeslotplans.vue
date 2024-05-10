<script setup lang="ts">
import type TimeslotPlan from '#models/timeslot_plan'
import { onMounted, ref } from 'vue'
import CustomRadios from '~/@core/components/app-form-elements/CustomRadios.vue'
import ModalAddTimeslotPlan from './modal/ModalAddTimeslotPlan.vue'
import useApiGet from '~/composables/useApiGet'
import routes from '~/utils/routes'
import type { IPaginatedModel } from '#helpers/types'

const timeslotPlans = ref<TimeslotPlan[]>([])

const model = defineModel<string | number>()
const timeslotAddModal = ref(false)

const { data, processing, exec } = useApiGet<IPaginatedModel<TimeslotPlan>>()

const getPlans = () => {
  exec(
    routes('api.timeslot_plan.index'),
    {},
    {
      onSuccess: () => {
        timeslotPlans.value = data.value?.data!
      },
    }
  )
}

onMounted(() => {
  getPlans()
})
</script>
<template>
  <div class="d-flex ga-2 flex-column">
    <CustomRadios
      v-if="!processing && timeslotPlans?.length > 0"
      v-model:selected-radio="model"
      :radio-content="timeslotPlans.map((t) => ({ title: t.name, value: t.id }))"
      :grid-column="{ cols: '12', sm: '6' }"
    />
    <div v-else>No Timeslot plans found! Please a plan</div>
    <div class="mt-2">
      <VBtn
        variant="tonal"
        prepend-icon="tabler-plus"
        text="Add plan"
        @click="
          () => {
            timeslotAddModal = true
          }
        "
      />
    </div>
    <ModalAddTimeslotPlan
      v-model="timeslotAddModal"
      @success="
        () => {
          getPlans()
          timeslotAddModal = false
        }
      "
    />
  </div>
</template>
