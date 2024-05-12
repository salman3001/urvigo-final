<script setup lang="ts">
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import { Link } from '@inertiajs/vue3'
import { VCard } from 'vuetify/components'
import type Blog from '#models/blog'

defineProps<{
  blog: Blog
}>()

const getImageUrl = useGetImageUrl()
</script>

<template>
  <Link :href="routes('web.blogs.show', [blog.slug])">
    <VCard density="compact" class="ma-0" style="position: relative !important">
      <VImg :src="getImageUrl(blog?.thumbnail?.thumbnailUrl)" cover />
      <VCardItem>
        <VCardTitle>{{ blog.title }}</VCardTitle>
      </VCardItem>

      <VCardText>
        <p class="line-clamp-3">
          {{ blog?.shortDesc }}
        </p>
      </VCardText>
      <VCardActions class="align-center justify-space-between">
        <IconBtn color="secondary" icon="tabler-share" />
      </VCardActions>
    </VCard>
  </Link>
</template>

<style lang="scss" scoped>
.v-btn {
  transform: none;
}

.fav-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0.8;
}
</style>
