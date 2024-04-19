<script lang="ts">
import Layout from '~/layouts/default.vue'
import WebBookingsController from '#controllers/web/web_bookings_controller'
import { Prop } from '#helpers/types'
import { router } from '@inertiajs/vue3'
import routes from '~/utils/routes'
import CheckoutLayout from '~/components/Views/Web/checkout/CheckoutLayout.vue'
import CheckoutAddress from '~/components/Views/Web/checkout/CheckoutAddress.vue'

export default {
    layout: Layout,
}
</script>

<script setup lang="ts">
defineProps<{
    summary: Awaited<Prop<WebBookingsController['summary']>['summary']>
}>()

</script>

<template>
    <br />
    <br />
    <br />
    <br />
    <VContainer>
        <CheckoutLayout :step="1">
            <CheckoutAddress :summary="summary" @next="router.visit(routes.bookings.checkout.payment)" />
        </CheckoutLayout>
    </VContainer>

    <br />
    <br />
    <br />
</template>
