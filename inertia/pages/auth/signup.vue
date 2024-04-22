<script lang="ts">
import Layout from '~/layouts/blank.vue'
import { userTypes } from '#helpers/enums'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { VNodeRenderer } from '~/@layouts/components/VNodeRenderer'
import { themeConfig } from '~/themeConfig'

import authV2RegisterIllustrationBorderedDark from '~/assets/images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '~/assets/images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '~/assets/images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '~/assets/images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '~/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '~/assets/images/pages/misc-mask-light.png'
import { Link, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import routes from '~/utils/routes'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import {
  confirmedValidator,
  emailValidator,
  passwordValidator,
  requiredValidator,
} from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AuthProvider from '~/components/Views/Web/AuthProvider.vue'
import CustomForm from '~/components/form/CustomForm.vue'

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const loading = ref(false)
const isPasswordVisible = ref(false)

const form = useForm({
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  temp: false,
  userType: userTypes.USER,
})
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

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 100px">
          <VImg max-width="500" :src="imageVariant" class="auth-illustration mt-16 mb-2" />
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

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">Adventure starts here 🚀</h4>
          <p class="mb-0">Make your app management easy and fun!</p>
        </VCardText>

        <VCardText>
          <CustomForm
            @submit="
              () => {
                form.post(routes('web.auth.'))
              }
            "
            ref="formRef"
          >
            <ErrorAlert v-if="form.errors" :errors="form.errors" />
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.firstName"
                  :rules="[requiredValidator]"
                  autofocus
                  label="First Name"
                  placeholder="John"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="form.lastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                  placeholder="doe"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
                <AppTextField
                  v-model="form.passwordConfirmation"
                  :rules="[requiredValidator, (v: string) => confirmedValidator(v, form.password)]"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center my-6">
                  <VCheckbox id="privacy-policy" v-model="form.temp" inline />
                  <VLabel for="privacy-policy" style="opacity: 1">
                    <span class="me-1 text-high-emphasis">I agree to</span>
                    <a href="javascript:void(0)" class="text-primary">privacy policy & terms</a>
                  </VLabel>
                </div>

                <VBtn block type="submit" :disabled="loading"> Sign up </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span class="d-inline-block">Already have an account?</span>
                <Link class="text-primary ms-1 d-inline-block" :href="routes('web.auth.login')">
                  Sign in instead
                </Link>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <AuthProvider />
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
~/utils/routes-old
