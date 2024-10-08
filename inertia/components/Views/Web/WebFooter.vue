<script setup lang="ts">
import appleImg from '~/assets/images/front-pages/landing-page/apple-icon.png'
import googlePlayImg from '~/assets/images/front-pages/landing-page/google-play-icon.png'

import footerDarkBg from '~/assets/images/front-pages/backgrounds/footer-bg-dark.png'
import footerLightBg from '~/assets/images/front-pages/backgrounds/footer-bg-light.png'

import { VNodeRenderer } from '~/@layouts/components/VNodeRenderer'
import { themeConfig } from '~/themeConfig'
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import routes from '~/utils/routes'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import { Link } from '@inertiajs/vue3'

interface Menu {
  name: string
  to: any
  isNew?: boolean
}

const footerBg = useGenerateImageVariant(footerLightBg, footerDarkBg)

const pagesList: Menu[] = [
  { name: 'Pricing', to: routes.pricing },
  { name: 'Services', to: routes.services.list, isNew: true },
  {
    name: 'Service Requirements',
    to: routes.service_requirement.list,
  },
  { name: 'Help Center', to: routes.help_center.list },
  { name: 'Login/Register', to: routes.auth.login },
]

const demoList = [
  { title: 'Home', to: routes.home },
  { title: 'Blogs', to: routes.blogs.list },
  { title: 'Faqs', to: routes.faqs },
  { title: 'About', to: routes.about },
  { title: 'Contact', to: routes.contact },
]
</script>

<template>
  <div class="footer">
    <div class="footer-top pt-11" :style="{ 'background-image': `url(${footerBg})` }">
      <VContainer>
        <VRow>
          <!-- 👉 Footer  -->
          <VCol cols="12" md="5">
            <div class="mb-4" :class="$vuetify.display.smAndDown ? 'w-100' : 'w-75'">
              <div class="app-logo mb-6">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title text-white">
                  {{ themeConfig.app.title }}
                </h1>
              </div>

              <div
                class="mb-6"
                :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
              >
                "Unloack New Oppurtunities 🤩: Join Out platform and reach more customers"
              </div>
              <VForm class="subscribe-form d-flex align-center">
                <AppTextField label="Subscribe to newsletter" placeholder="john@email.com" />
                <VBtn class="align-self-end rounded-s-0"> Subscribe </VBtn>
              </VForm>
            </div>
          </VCol>

          <!-- 👉 Demos -->
          <VCol md="2" sm="4" xs="6">
            <div>
              <h6 class="footer-title text-h6 mb-6">Pages</h6>
              <ul style="list-style: none">
                <li v-for="(item, index) in demoList" :key="index" class="mb-4">
                  <a
                    :href="item.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                  >
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Pages  -->
          <VCol md="2" sm="4" xs="6">
            <div>
              <h6 class="footer-title text-h6 mb-6">Services</h6>
              <ul style="list-style: none">
                <li v-for="(item, index) in pagesList" :key="index" class="mb-4">
                  <Link
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                    class="me-2"
                    :href="item.to"
                  >
                    {{ item.name }}
                  </Link>
                  <template v-if="item.isNew">
                    <VChip color="primary" variant="elevated" label size="small"> New </VChip>
                  </template>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Download App -->
          <VCol cols="12" md="3" sm="4">
            <div>
              <h6 class="footer-title text-h6 mb-6">Download our app</h6>

              <div>
                <VBtn
                  v-for="(item, index) in [
                    { image: appleImg, store: 'App Store' },
                    { image: googlePlayImg, store: 'Google Play' },
                  ]"
                  :key="index"
                  color="#282c3e"
                  height="56"
                  class="mb-4 d-block"
                >
                  <template #default>
                    <div class="d-flex align-center gap-x-8 footer-logo-buttons">
                      <VImg :src="item.image" height="34" width="34" />
                      <div class="d-flex flex-column justify-content-start">
                        <div
                          :class="
                            $vuetify.theme.current.dark ? 'text-body-2' : 'text-white-variant '
                          "
                        >
                          Download on the
                        </div>
                        <h6
                          class="text-h6 text-start"
                          :class="$vuetify.theme.current.dark ? 'text-body-1' : 'footer-title'"
                        >
                          {{ item.store }}
                        </h6>
                      </div>
                    </div>
                  </template>
                </VBtn>
              </div>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>

    <!-- 👉 Footer Line -->
    <div class="footer-line w-100">
      <VContainer>
        <div class="d-flex justify-space-between flex-wrap gap-y-5 align-center">
          <div class="text-body-1 text-white text-white-variant text-wrap me-4">
            &copy;

            {{ new Date().getFullYear() }}
            <a
              href="https://pixinvent.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="font-weight-bold ms-1 text-white"
              >Urvigo</a
            >, Where Services Meets ❤️ Satifaction .
          </div>

          <div class="d-flex gap-x-6">
            <template
              v-for="(item, index) in [
                {
                  title: 'github',
                  icon: 'tabler-brand-github-filled',
                  href: 'https://github.com/pixinvent',
                },
                {
                  title: 'facebook',
                  icon: 'tabler-brand-facebook-filled',
                  href: 'https://www.facebook.com/pixinvents/',
                },
                {
                  title: 'twitter',
                  icon: 'tabler-brand-twitter-filled',
                  href: 'https://twitter.com/pixinvents',
                },
                {
                  title: 'google',
                  icon: 'tabler-brand-youtube-filled',
                  href: 'https://www.youtube.com/channel/UClOcB3o1goJ293ri_Hxpklg',
                },
              ]"
              :key="index"
            >
              <a :href="item.href" target="_blank" rel="noopener noreferrer">
                <VIcon :icon="item.icon" size="16" color="white" />
              </a>
            </template>
          </div>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-title {
  color: rgba(255, 255, 255, 92%);
}

.footer-top {
  border-radius: 60px 60px 0 0;
  background-size: cover;
  color: #fff;
}

.footer-line {
  background: #282c3e;
}
</style>

<style lang="scss">
.subscribe-form {
  .v-label {
    color: rgba(225, 222, 245, 90%) !important;
  }

  .v-field {
    border-end-end-radius: 0;
    border-end-start-radius: 10px;
    border-start-end-radius: 0;
    border-start-start-radius: 10px;

    input.v-field__input::placeholder {
      color: rgba(225, 222, 245, 40%) !important;
    }

    input.v-field__input {
      color: rgba(255, 255, 255, 78%);
    }
  }
}

.footer {
  border-radius: 50%;

  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }

    .footer-logo-buttons {
      gap: 0.75rem;
    }
  }
}
</style>
