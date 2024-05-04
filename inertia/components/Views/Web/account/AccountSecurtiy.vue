<script lang="ts" setup>
import type { IPageProps } from '#helpers/types'
import { useForm, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { confirmedValidator, passwordValidator, requiredValidator } from '~/@core/utils/validators'
import CustomForm from '~/components/form/CustomForm.vue'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import routes from '~/utils/routes'

const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const form = useForm({
  old_password: '',
  password: '',
  password_confirmation: '',
})

const updatePassword = async (reset: () => void, resetValidation: () => void) => {
  form.post(routes('web.account.security.post', [user.value!.id]), {
    onSuccess: () => {
      reset()
      resetValidation()
    },
  })
}
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <CustomForm @submit="updatePassword">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <ErrorAlert v-if="form.errors" :errors="form.errors" />
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <AppTextField
                  v-model="form.old_password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Current Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <AppTextField
                  v-model="form.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="New Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="form.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Confirm New Password"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :rules="[requiredValidator, (v: string) => confirmedValidator(v, form.password)]"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-h6 text-medium-emphasis mb-4">Password Requirements:</h6>

            <VList class="card-list">
              <VListItem
                v-for="item in passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon size="10" icon="tabler-circle-filled" />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit" :disabled="form.processing">Save changes</VBtn>

            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
          </VCardText>
        </CustomForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
</style>
