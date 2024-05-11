<script lang="ts">
import Layout from '~/layouts/default.vue'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type KnowledgeBaseCategory from '#models/knowledge_base_category'
import type KnowledgeBaseContent from '#models/knowledge_base_content'
import AppSearchHeader from '~/components/Views/Web/AppSearchHeader.vue'
import HelpCenterArticlesOverview from '~/components/Views/Web/help-center/HelpCenterArticlesOverview.vue'
import HelpCenterKnowledgeBase from '~/components/Views/Web/help-center/HelpCenterKnowledgeBase.vue'
import HelpcenterFooter from '~/components/Views/Web/help-center/HelpcenterFooter.vue'

defineProps<{
  data: {
    catgories: KnowledgeBaseCategory[]
    featuredContent: KnowledgeBaseContent[]
  }
}>()
</script>

<template>
  <div class="help-center-page">
    <div v-if="data && data.catgories.length">
      <AppSearchHeader
        subtitle="Common topics: Services listing, Payment process, Custom Requirements"
        custom-class="rounded-0"
        placeholder="Search"
      >
        <template #title>
          <h4 class="text-h4 font-weight-medium" style="color: rgba(var(--v-theme-primary), 1)">
            Hello, how can we help?
          </h4>
        </template>
      </AppSearchHeader>

      <!-- 👉 Popular Articles -->
      <div class="help-center-section bg-surface">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">Popular Articles</h4>
          <HelpCenterArticlesOverview :articles="data.featuredContent" />
        </VContainer>
      </div>

      <!-- 👉 Knowledge Base -->
      <div class="help-center-section">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">Knowledge Base</h4>
          <HelpCenterKnowledgeBase :categories="data.catgories" />
        </VContainer>
      </div>

      <!-- 👉 Keep Learning -->
      <div class="help-center-section bg-surface">
        <VContainer>
          <h4 class="text-h4 text-center mb-6">Keep Learning</h4>
          <HelpCenterArticlesOverview :articles="data.featuredContent" />
        </VContainer>
      </div>

      <!-- 👉 Still need help? -->
      <div class="help-center-section">
        <HelpcenterFooter />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.help-center-page {
  .search-header {
    background-size: cover !important;
    padding-block: 9.25rem 4.75rem !important;
  }

  .help-center-section {
    padding-block: 5.25rem;
  }
}

@media (max-width: 960px) and (min-width: 600px) {
  .help-center-page {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

@media (max-width: 599px) {
  .help-center-page {
    .search-header {
      padding-block: 7rem 2rem !important;
      padding-inline: 2rem !important;
    }

    .help-center-section {
      padding-block: 3.5rem;
    }
  }
}
</style>
