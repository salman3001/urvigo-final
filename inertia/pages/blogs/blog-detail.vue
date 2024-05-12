<script lang="ts">
import Layout from '~/layouts/default.vue'
import { VBreadcrumbs, VBreadcrumbsItem, VIcon } from 'vuetify/components'
import { ref } from 'vue'
import { format } from 'date-fns'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type KnowledgeBaseContent from '#models/knowledge_base_content'
import { Link, router } from '@inertiajs/vue3'
import routes from '~/utils/routes'

defineProps<{
  data: { blog: KnowledgeBaseContent; similarBlogs: KnowledgeBaseContent[] }
}>()

const search = ref('')
const searchContent = () => {
  if (search.value) {
    router.visit(routes('web.blogs.index'), {
      data: {
        search: search.value,
      },
    })
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="bg-surface help-center-article">
    <!-- 👉 Content -->
    <VContainer>
      <div v-if="data?.blog" class="article-section">
        <VRow>
          <VCol cols="12" md="8">
            <div>
              <VBreadcrumbs class="px-0 pb-2 pt-0 help-center-breadcrumbs">
                <Link :href="routes('web.blogs.index')">
                  <VBreadcrumbsItem active>Blogs</VBreadcrumbsItem>
                </Link>
                <VIcon icon="tabler-chevron-right" />
                <VBreadcrumbsItem
                  class="line-clamp-1"
                  style="max-width: 200px; text-wrap: nowrap"
                  >{{ data?.blog?.title }}</VBreadcrumbsItem
                >
              </VBreadcrumbs>
              <h4 class="text-h4 mb-2">
                {{ data?.blog?.title }}
              </h4>
              <div class="text-body-1">
                {{ format(data?.blog?.updatedAt as unknown as string, 'dd/MM/yyyy HH:mm') }}&nbsp;
                <VChip v-if="data.blog.category" color="primary">{{
                  data.blog.category.name
                }}</VChip>
              </div>
            </div>
            <VDivider class="my-6" />
            <p>{{ data?.blog.shortDesc }}</p>
            <!-- eslint-disable vue/no-v-html -->
            <div class="mb-6 text-body-1" v-html="data?.blog?.content" />
            <!-- <VImg class="rounded-lg" :src="content?.content" />
            <p class="my-6 text-body-1">
              {{ articleData?.checkoutContent }}
            </p>
            <VImg class="rounded-lg" :src="articleData?.checkoutImg" /> -->
          </VCol>
          <VCol cols="12" md="4">
            <VTextField
              prepend-inner-icon="tabler-search"
              placeholder="Search..."
              class="mb-6"
              v-model="search"
              @keyup.enter="searchContent"
            />
            <div>
              <!-- 👉 Article List  -->
              <h5
                class="text-h5 px-6 py-2 mb-4 rounded"
                style="background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity))"
              >
                Similar Articles
              </h5>
              <VList class="card-list">
                <VListItem
                  v-for="(item, index) in data?.similarBlogs"
                  :key="index"
                  link
                  class="text-disabled"
                >
                  <template #append>
                    <VIcon
                      :icon="$vuetify.locale.isRtl ? 'tabler-chevron-left' : 'tabler-chevron-right'"
                      size="20"
                    />
                  </template>
                  <Link :href="routes('web.blogs.show', [item.slug])">
                    <div class="text-body-1 text-high-emphasis line-clamp-2">
                      {{ item.title }}
                    </div>
                  </Link>
                </VListItem>
              </VList>
            </div>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.article-section {
  margin-block: 10.5rem 5.25rem;
}

@media (max-width: 600px) {
  .article-section {
    margin-block-start: 6rem;
  }
}

.card-list {
  --v-card-list-gap: 1rem;
}
</style>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .help-center-article {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

.help-center-breadcrumbs {
  &.v-breadcrumbs {
    .v-breadcrumbs-item {
      padding: 0 !important;

      &.v-breadcrumbs-item--disabled {
        opacity: 0.9;
      }
    }
  }
}
</style>
