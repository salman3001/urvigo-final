<script lang="ts">
import Layout from '~/layouts/blank.vue'
import { IPageProps } from '../../../app/helpers/types'
import VendorSignupNew from '~/components/Views/Web/auth/VendorSignupNew.vue'
import VendorSignupExisting from '~/components/Views/Web/auth/VendorSignupExisting.vue'

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
import { Link, usePage } from '@inertiajs/vue3'
import { computed, } from 'vue'
import { useGenerateImageVariant } from '~/@core/composable/useGenerateImageVariant'
import routes from '~/utils/routes'

const page = usePage<IPageProps<{}>>()
const tab = computed(() => page.props.params?.type)

const imageVariant = useGenerateImageVariant(
    authV2RegisterIllustrationLight,
    authV2RegisterIllustrationDark,
    authV2RegisterIllustrationBorderedLight,
    authV2RegisterIllustrationBorderedDark,
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
                <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 100px">
                    <VImg max-width="500" :src="imageVariant" class="auth-illustration mt-16 mb-2" />
                </div>

                <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100" />
            </div>
        </VCol>

        <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center"
            style="background-color: rgb(var(--v-theme-surface))">
            <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
                <VCardText>
                    <h4 class="text-h4 mb-1">Signup as a vendor 🚀</h4>
                    <p class="mb-0">Make your services management easy and fun!</p>
                </VCardText>
                <VCardText>
                    <VTabs :model-value="tab" class="v-tabs-pill" direction="vertical">
                        <Link :href="routes('web.auth.vendor.signup', ['new'])">
                        <VTab :value="'new'">
                            <VIcon size="20" start :icon="'tabler-plus'" />
                            New Account
                        </VTab>
                        </Link>
                        <Link :href="routes('web.auth.vendor.signup', ['existing'])">
                        <VTab :value="'existing'">
                            <VIcon size="20" start :icon="'tabler-user'" />
                            Migrate Existing user account
                        </VTab>
                        </Link>
                    </VTabs>
                </VCardText>

                <VCardText>
                    <div v-if="tab === 'new'">
                        <VendorSignupNew />
                    </div>
                    <div v-if="tab === 'existing'">
                        <VendorSignupExisting />
                    </div>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss">
@use '~/@core/scss/template/pages/page-auth.scss';
</style>
