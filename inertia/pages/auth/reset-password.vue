<script lang="ts">
import Layout from '~/layouts/blank.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '~/@layouts/components/VNodeRenderer'
import { themeConfig } from '~/themeConfig'

import authV2ResetPasswordIllustrationDark from '~/assets/images/pages/auth-v2-reset-password-illustration-dark.png'
import authV2ResetPasswordIllustrationLight from '~/assets/images/pages/auth-v2-reset-password-illustration-light.png'
import authV2MaskDark from '~/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '~/assets/images/pages/misc-mask-light.png'
import { ref } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import { IPageProps } from '#helpers/types'
import routes from '~/utils/routes'
import CustomForm from '~/components/form/CustomForm.vue'
import { confirmedValidator, passwordValidator, requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'

const authThemeImg = useGenerateImageVariant(
  authV2ResetPasswordIllustrationLight,
  authV2ResetPasswordIllustrationDark
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const { props } = usePage<IPageProps<{}>>()

const form = useForm({
  email: props?.query.email,
  otp: '',
  password: '',
  password_confirmation: '',
})
</script>

<template>
  <Link :href="routes.home">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </Link>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 150px">
          <VImg max-width="451" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <img
          class="auth-footer-mask flip-in-rtl"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">Reset Password 🔒</h4>
          <p class="mb-0">Your new password must be different from previously used passwords</p>
        </VCardText>

        <VCardText>
          <CustomForm
            @submit="
              () => {
                form.post(routes.auth.reset_password)
              }
            "
          >
            <FormErrorAlert v-if="form.errors" :errors="form.errors" />
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  autofocus
                  label="New Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password_confirmation"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :rules="[(v: string) => confirmedValidator(v, form.password)]"
                />
              </VCol>

              <!-- OTP -->
              <VCol cols="12">
                <h6 class="text-body-1">Type your 6 digit security code</h6>
                <VOtpInput
                  v-model="form.otp"
                  :disabled="form.processing"
                  type="number"
                  class="pa-0"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Set password -->
              <VCol cols="12">
                <VBtn block type="submit" :disabled="form.processing"> Set New Password </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <Link class="d-flex align-center justify-center" :href="routes.auth.login">
                  <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
                  <span>Back to login</span>
                </Link>
              </VCol>
            </VRow>
          </CustomForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<styles lang="scss">
@use '~/@core/scss/template/pages/page-auth.scss';
</styles>
