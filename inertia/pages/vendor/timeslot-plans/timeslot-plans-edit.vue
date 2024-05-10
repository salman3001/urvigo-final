<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import type { ITimeslotPlan } from '#models/timeslot_plan'
import CustomForm from '~/components/form/CustomForm.vue'
import TimePicker from '~/components/form/TimePicker.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import routes from '~/utils/routes'
import { useForm } from '@inertiajs/vue3'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import { WeekDays } from '#helpers/enums'
import { VBtn } from 'vuetify/components'

const props = defineProps<{
  timeslotPlan: ITimeslotPlan
}>()

const form = useForm({
  name: props.timeslotPlan.name,
  limitToOneBooking: props.timeslotPlan.limitToOneBooking,
  skipHours: props.timeslotPlan.skipHours,
  options: props.timeslotPlan.options?.map((o) => ({
    week: o.week,
    from: o.from,
    to: o.to,
  })) || [
    {
      week: WeekDays.MONDAY,
      from: '',
      to: '',
    },
  ],
})

const submit = async () => {
  form.put(routes('vendor.timeslot-plans.update', [props.timeslotPlan.id]))
}

const weekDaysOptions = [
  {
    name: 'Mon',
    value: WeekDays.MONDAY,
  },
  {
    name: 'Tue',
    value: WeekDays.TUESDAY,
  },
  {
    name: 'Web',
    value: WeekDays.WEDNESDAY,
  },
  {
    name: 'Thu',
    value: WeekDays.THURSDAY,
  },
  {
    name: 'Fri',
    value: WeekDays.FRIDAY,
  },
  {
    name: 'Sat',
    value: WeekDays.SATURDAY,
  },
  {
    name: 'Sun',
    value: WeekDays.SUNDAY,
  },
]

const addSlot = () => {
  form.options.push({
    week: WeekDays.MONDAY,
    from: '',
    to: '',
  })
}

const deleteSlot = (index: number) => {
  form.options.splice(index, 1)
}
</script>

<template>
  <VContainer>
    <CustomForm @submit="submit">
      <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
        <div class="d-flex flex-column justify-center">
          <h4 class="text-h4 font-weight-medium">Update Timeslot plan</h4>
          <div class="text-body-1">Update Timeslot plan</div>
        </div>

        <div class="d-flex gap-4 align-center flex-wrap">
          <Link :href="routes('vendor.timeslot-plans.index')">
            <VBtn variant="tonal" color="secondary"> Discard </VBtn>
          </Link>
          <!-- <VBtn variant="tonal" color="primary" > Save for later </VBtn> -->
          <VBtn type="submit" :disabled="form.processing">Update plan</VBtn>
        </div>
      </div>
      <div>
        <VRow>
          <VCol cols="12" sm="6">
            <AppTextField
              v-model="form.name"
              label="Plan Name"
              placeholder="Add a plan name"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol cols="12" sm="6">
            <AppTextField
              v-model="form.skipHours"
              type="number"
              label="Hours to skip before bookings starts"
              placeholder="Skip hours"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol cols="12" sm="6">
            <VCheckbox v-model="form.limitToOneBooking" label="Limit One Booking per slot" />
          </VCol>
          <VCol cols="12">
            <VTable density="compact" class="text-no-wrap rounded">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time from</th>
                  <th>Time to</th>
                  <th>delete</th>
                </tr>
              </thead>
              <br />
              <tbody>
                <tr v-for="(o, i) in form.options" :key="i">
                  <td>
                    <div style="min-width: 100px">
                      <AppSelect
                        v-model="o.week"
                        :items="weekDaysOptions"
                        item-title="name"
                        item-value="value"
                        placeholder="Select Day"
                        :rules="[requiredValidator]"
                      />
                    </div>
                  </td>
                  <td>
                    <div style="min-width: 120px">
                      <TimePicker
                        v-model="o.from"
                        format="24hr"
                        :rules="[requiredValidator]"
                        @update:model-value="
                          () => {
                            o.to = ''
                          }
                        "
                      />
                    </div>
                  </td>
                  <td>
                    <div style="min-width: 120px">
                      <TimePicker
                        v-model="o.to"
                        format="24hr"
                        :min="o.from"
                        :rules="[requiredValidator]"
                      />
                    </div>
                  </td>
                  <td class="py-2">
                    <IconBtn @click="deleteSlot(i)">
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
                  </td>
                </tr>
              </tbody>
            </VTable>
            <div class="d-flex justify-end my-4">
              <VBtn text="Add Slot" prepend-icon="tabler-plus" @click="addSlot" />
            </div>
          </VCol>
        </VRow>
      </div>
    </CustomForm>
  </VContainer>
</template>

<style lang="scss" scoped>
.table-input-wrapper {
  min-width: 100px !important;
  margin: 10px 0px 10px 0px;
}
</style>
