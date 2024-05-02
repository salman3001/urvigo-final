<script lang="ts">
import Layout from '~/layouts/blank.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { themeConfig } from '~/themeConfig'
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '~/assets/images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '~/assets/images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '~/assets/images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '~/assets/images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '~/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '~/assets/images/pages/misc-mask-light.png'
import { VNodeRenderer } from '~/@layouts/components/VNodeRenderer'
import { ref } from 'vue'
import { Link, useForm } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import { emailValidator, requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AuthProvider from '~/components/Views/Web/AuthProvider.vue'
import CustomForm from '~/components/form/CustomForm.vue'

const loading = ref(false)

const isPasswordVisible = ref(false)

const form = useForm({
  email: '',
  password: '',
})

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
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

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem">
          <VImg max-width="613" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
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

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h4>
          <p class="mb-0">Please sign-in to your account and start the adventure</p>
        </VCardText>

        <VCardText>
          <CustomForm
            @submit="
              () => {
                form.post(routes('web.auth.login'), {
                  // onSuccess: () => {
                  //   wishlist.fetchWishlist({})
                  // }
                })
              }
            "
          >
            <ErrorAlert v-if="form?.errors" :errors="form?.errors" />
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

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[requiredValidator]"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <!-- <VCheckbox v-model="form.remember" label="Remember me" /> -->
                  <Link class="text-primary ms-2 mb-1" :href="routes('web.auth.forgot-password')">
                    Forgot Password?
                  </Link>
                </div>

                <VBtn block type="submit" :disabled="loading"> Login </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center">
                <span>New on our platform?</span>

                <Link class="text-primary ms-2" :href="routes('web.auth.signup')">
                  Create an account
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
