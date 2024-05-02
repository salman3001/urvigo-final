<script setup lang="ts">
import ModalBase from './ModalBase.vue'
import { maxNumValidator, minNumValidator, requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import CustomForm from '../form/CustomForm.vue'
import routes from '~/utils/routes'
import { useForm } from '@inertiajs/vue3'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import { WeekDays } from '#helpers/enums'
import { VBtn } from 'vuetify/components'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'error'): void
}>()

const model = defineModel<boolean>({ required: true })

const form = useForm({
  name: '',
  limitToOneBooking: false,
  options: [
    {
      week: '',
      fromHour: '',
      fromMinute: '',
      toHour: '',
      toMinute: '',
    },
  ],
})

const resetForm = () => {
  form.name = ''
  form.limitToOneBooking = false
  form.options = [
    {
      week: '',
      fromHour: '',
      fromMinute: '',
      toHour: '',
      toMinute: '',
    },
  ]
}

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
    .post(routes('vendor.timeslot-plans.create'), {
      onSuccess: () => {
        emits('success')
        resetForm()
      },
      onError: () => {
        emits('error')
      },
    })
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
    week: '',
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
  <ModalBase
    v-model:is-visible="model"
    title="Create a time slot plan"
    subtitle="Add a weekly time slot plan. Plan will be repeated each week. You can update any time"
  >
    <CustomForm @submit="submit">
      <VCardItem>
        <div class="d-flex flex-column gap-4">
          <AppTextField
            v-model="form.name"
            label="Plan Name"
            placeholder="Add a plan name"
            :rules="[requiredValidator]"
          />
          <VCheckbox v-model="form.limitToOneBooking" label="Limit One Booking per slot" />
          <VTable density="compact" class="text-no-wrap">
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

          <VBtn text="Add Slot" prepend-icon="tabler-plus" @click="addSlot" />
        </div>
      </VCardItem>
      <VCardItem class="d-flex justify-end p-2">
        <VBtn type="submit">Submit Request</VBtn>
      </VCardItem>
    </CustomForm>
  </ModalBase>
</template>

<style lang="scss" scoped>
.table-input-wrapper {
  min-width: 100px !important;
  margin: 10px 0px 10px 0px;
}
</style>
