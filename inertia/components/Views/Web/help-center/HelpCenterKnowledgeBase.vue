<script setup lang="ts">
import type KnowledgeBaseCategory from '#models/knowledge_base_category'
import { Link } from '@inertiajs/vue3'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'

interface Props {
  categories: KnowledgeBaseCategory[]
}

const getImageUrl = useGetImageUrl()

const props = defineProps<Props>()
</script>

<template>
  <VRow>
    <VCol v-for="article in props.categories" :key="article.name" cols="12" sm="6" lg="4">
      <VCard :title="article.name">
        <template #prepend>
          <VAvatar rounded color="primary" variant="tonal" size="32" class="me-1">
            <img
              :src="getImageUrl(article?.imgIcon?.thumbnailUrl)"
              alt="svg"
              height="58"
              width="58"
            />
          </VAvatar>
        </template>

        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="(content, index) in article.contents"
              :key="index"
              class="text-disabled"
            >
              <Link
                :href="routes('web.helpcenter.show', [content.slug])"
                class="text-high-emphasis"
              >
                <div>{{ content.title }}</div>
              </Link>
              <template #append>
                <VIcon icon="tabler-chevron-right" class="flip-in-rtl" size="20" />
              </template>
            </VListItem>
          </VList>

          <!-- <div class="mt-6">
            <Link href="" class="text-base d-flex align-center font-weight-medium d-inline-block">
              <span class="d-inline-block"> See All Articles </span>

              <VIcon icon="tabler-arrow-right" size="18" class="ms-3 flip-in-rtl" />
            </Link>
          </div> -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 0.5rem;
}
</style>
