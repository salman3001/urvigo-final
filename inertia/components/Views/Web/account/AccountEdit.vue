<script setup lang="ts">
import type User from '#models/user'
import { useForm } from '@inertiajs/vue3'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { emailValidator, requiredValidator } from '~/@core/utils/validators'
import avatar from '~/assets/images/dummy-avatar.webp'
import AvatarInput from '~/components/form/AvatarInput.vue'
import CustomForm from '~/components/form/CustomForm.vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'

const props = defineProps<{
  user: User
}>()

const getImageUrl = useGetImageUrl()

const form = useForm({
  avatar: undefined as File | undefined,
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  phone: props.user.phone,
})

const updateProfile = async () => {
  form.post(routes('web.account.profile.post', [props.user.id]), {
    forceFormData: true,
  })
}
</script>

<template>
  <VCard>
    <!-- 👉 Avatar -->
    <VCardText class="d-flex">
      <AvatarInput
        size="100"
        :url="getImageUrl(user?.profile?.avatar?.thumbnailUrl, avatar)"
        @image="
          (f) => {
            form.avatar = f
          }
        "
      />
    </VCardText>

    <VCardText class="pt-2">
      <!-- 👉 Form -->
      <CustomForm @submit="updateProfile" class="mt-3">
        <VRow>
          <!-- 👉 First Name -->
          <VCol md="6" cols="12">
            <AppTextField
              v-model="form.firstName"
              placeholder="John"
              label="First Name"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Last Name -->
          <VCol md="6" cols="12">
            <AppTextField
              v-model="form.lastName"
              placeholder="Doe"
              label="Last Name"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Email -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.email"
              label="E-mail"
              placeholder="johndoe@gmail.com"
              type="email"
              :rules="[requiredValidator, emailValidator]"
            />
          </VCol>

          <!-- 👉 Phone -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.phone"
              label="Phone Number"
              placeholder="+1 (917) 543-9876"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Form Actions -->
          <VCol cols="12" class="d-flex flex-wrap gap-4">
            <VBtn type="submit">Save changes</VBtn>

            <VBtn color="secondary" variant="tonal" type="reset" @click.prevent="() => {}">
              Cancel
            </VBtn>
          </VCol>
        </VRow>
      </CustomForm>
    </VCardText>
  </VCard>
</template>
