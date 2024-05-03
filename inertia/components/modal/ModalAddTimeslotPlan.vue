<script setup lang="ts">
import ModalBase from './ModalBase.vue'
import { requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import CustomForm from '../form/CustomForm.vue'
import routes from '~/utils/routes'
import { useForm } from '@inertiajs/vue3'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import { WeekDays } from '#helpers/enums'
import { VBtn } from 'vuetify/components'
import TimePicker from '../form/TimePicker.vue'

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
      week: WeekDays.MONDAY,
      from: '',
      to: '',
    },
  ],
})

const resetForm = () => {
  form.name = ''
  form.limitToOneBooking = false
  form.options = [
    {
      week: WeekDays.MONDAY,
      from: '',
      to: '',
    },
  ]
}

const submit = async () => {
  form.post(routes('vendor.timeslot-plans.create'), {
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

          <VBtn text="Add Slot" prepend-icon="tabler-plus" @click="addSlot" />
        </div>
      </VCardItem>
      <VCardItem class="d-flex justify-end p-2">
        <VBtn type="submit">Add Plan</VBtn>
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
