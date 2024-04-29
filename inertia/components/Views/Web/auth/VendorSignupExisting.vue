<script setup lang="ts">
import routes from '~/utils/routes'
import ErrorAlert from '~/components/form/ErrorAlert.vue'
import { emailValidator, requiredValidator } from '~/@core/utils/validators'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import AuthProvider from '~/components/Views/Web/AuthProvider.vue'
import CustomForm from '~/components/form/CustomForm.vue'
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const loading = ref(false)
const isPasswordVisible = ref(false)

const form = useForm({
  email: '',
  password: '',
  temp: false,
  businessProfile: {
    businessName: '',
  },
})
</script>

<template>
  <CustomForm
    @submit="
      () => {
        form.post(routes('web.auth.vendor.signup.existing.post'))
      }
    "
    ref="formRef"
  >
    <ErrorAlert v-if="form.errors" :errors="form.errors" />
    <VRow>
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
          :rules="[requiredValidator]"
          label="Password"
          placeholder="············"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <br />
        <AppTextField
          v-model="form.businessProfile.businessName"
          :rules="[requiredValidator]"
          label="Business Name"
          placeholder="choose a unique business name"
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
</template>
