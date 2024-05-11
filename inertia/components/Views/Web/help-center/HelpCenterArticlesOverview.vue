<script setup lang="ts">
import type KnowledgeBaseContent from '#models/knowledge_base_content'
import { Link } from '@inertiajs/vue3'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
interface Props {
  articles: KnowledgeBaseContent[]
}

const getImageUrl = useGetImageUrl()

const props = defineProps<Props>()
</script>

<template>
  <VRow v-if="props.articles.length">
    <VCol v-for="article in props.articles" :key="article.title" cols="12" md="4">
      <VCard flat border>
        <VCardText class="align-center text-center d-flex flex-column gap-3">
          <img
            :src="getImageUrl(article?.imgIcon?.thumbnailUrl)"
            alt="svg"
            height="58"
            width="58"
          />

          <h5 class="text-h5">
            {{ article.title }}
          </h5>
          <p class="text-body-1 mb-0 line-clamp-2">
            {{ article.shortDesc }}
          </p>

          <Link :href="routes('web.helpcenter.show', [article.slug])">
            <VBtn size="small" variant="tonal"> Read More </VBtn>
          </Link>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
