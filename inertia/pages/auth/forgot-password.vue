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

import authV2ForgotPasswordIllustrationDark from '~/assets/images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '~/assets/images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '~/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '~/assets/images/pages/misc-mask-light.png'
import { Link, useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import { emailValidator, requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import CustomForm from '~/components/form/CustomForm.vue'
import ErrorAlert from '~/components/form/ErrorAlert.vue'

const form = useForm({
  email: '',
})

const authThemeImg = useGenerateImageVariant(
  authV2ForgotPasswordIllustrationLight,
  authV2ForgotPasswordIllustrationDark
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <Link :href="routes('web.home')">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </Link>

  <VRow class="auth-wrapper bg-surface" no-gutters>
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 150px">
          <VImg max-width="468" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">Forgot Password? 🔒</h4>
          <p class="mb-0">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </VCardText>

        <VCardText>
          <CustomForm
            @submit="
              () => {
                form.post(routes('web.auth.forgot-password'))
              }
            "
          >
            <ErrorAlert v-if="form.errors" :errors="form.errors" />
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit" :disabled="form.processing"> Send Reset Link </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <Link class="d-flex align-center justify-center" :href="routes('web.auth.login')">
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

<style lang="scss">
@use '~/@core/scss/template/pages/page-auth.scss';
</style>
