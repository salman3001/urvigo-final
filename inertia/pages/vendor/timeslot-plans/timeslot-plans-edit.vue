<script lang="ts">
import Layout from '~/layouts/VendorLayout.vue'
import type { ITimeslotPlan } from '#models/timeslot_plan'
import CustomForm from '~/components/form/CustomForm.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { maxNumValidator, minNumValidator, requiredValidator } from '~/@core/utils/validators'
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
  options: props.timeslotPlan.options?.map((o) => {
    const [fromHour, fromMinute] = o.from.split(':')
    const [toHour, toMinute] = o.to.split(':')
    return {
      week: o.week,
      fromHour: fromHour,
      fromMinute: fromMinute,
      toHour: toHour,
      toMinute: toMinute,
    }
  }) || [
    {
      week: '',
      fromHour: '',
      fromMinute: '',
      toHour: '',
      toMinute: '',
    },
  ],
})

const submit = async () => {
  form
    .transform((data) => {
      const options = data.options.map((o) => {
        const from = `${o.fromHour}:${o.fromMinute}:00`
        const to = `${o.toHour}:${o.toMinute}:00`
        return {
          week: o.week,
          from: from,
          to: to,
        }
      })
      return {
        ...data,
        options,
      }
    })
    .put(routes('vendor.timeslot-plans.update', [props.timeslotPlan.id]))
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
    fromHour: '',
    fromMinute: '',
    toHour: '',
    toMinute: '',
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
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.name"
              label="Plan Name"
              placeholder="Add a plan name"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol cols="12">
            <VCheckbox v-model="form.limitToOneBooking" label="Limit One Booking per slot" />
          </VCol>
          <VCol cols="12">
            <VTable density="compact" class="text-no-wrap rounded">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Hours from</th>
                  <th>Minutes from</th>
                  <th>Hours to</th>
                  <th>Minutes to</th>
                  <th>delete</th>
                </tr>
              </thead>
              <br />
              <tbody>
                <tr v-for="(o, i) in form.options" :key="i">
                  <td>
                    <div class="table-input-wrapper">
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
                    <div class="table-input-wrapper">
                      <AppTextField
                        v-model="o.fromHour"
                        placeholder="1-24"
                        type="number"
                        :rules="[
                          requiredValidator,
                          (v: any) => minNumValidator(v, 0),
                          (v: any) => maxNumValidator(v, 24),
                        ]"
                        style="width: 150px"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="table-input-wrapper">
                      <AppTextField
                        v-model="o.fromMinute"
                        placeholder="1-60"
                        type="number"
                        :rules="[
                          requiredValidator,
                          (v: any) => minNumValidator(v, 0),
                          (v: any) => maxNumValidator(v, 60),
                        ]"
                        style="width: 150px"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="table-input-wrapper">
                      <AppTextField
                        v-model="o.toHour"
                        placeholder="1-24"
                        type="number"
                        :rules="[
                          requiredValidator,
                          (v: any) => minNumValidator(v, o.fromHour as unknown as number),
                          (v: any) => maxNumValidator(v, 24),
                        ]"
                        style="width: 150px"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="table-input-wrapper">
                      <AppTextField
                        v-model="o.toMinute"
                        placeholder="1-60"
                        type="number"
                        :rules="[
                          requiredValidator,
                          (v: any) => minNumValidator(v, 0),
                          (v: any) => maxNumValidator(v, 60),
                        ]"
                        style="width: 150px"
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
