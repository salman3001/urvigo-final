<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import routes from '~/utils/routes'
</script>

<template>
  <VCardText class="text-center py-4">
    <h4 class="text-h4 text-center">Still need help?</h4>
    <p class="my-4 text-body-1">
      Our specialists are always happy to help.
      <br />
      Contact us during standard business hours or email us 24/7, and we'll get back to you.
    </p>
    <div class="d-flex justify-center gap-4 flex-wrap">
      <Link :href="routes('web.home')">
        <VBtn>Contact us</VBtn>
      </Link>
    </div>
  </VCardText>
</template>
