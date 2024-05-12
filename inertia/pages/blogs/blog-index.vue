<script lang="ts">
import Layout from '~/layouts/default.vue'
import { VContainer } from 'vuetify/components'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AppSearchHeader from '~/components/Views/Web/AppSearchHeader.vue'
import type Blog from '#models/blog'
import BlogCard from '~/components/BlogCard.vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import { reactive, watch } from 'vue'
import type { IPaginatedModel } from '#helpers/types'

defineProps<{
  blogs: IPaginatedModel<Blog>
}>()

const query = reactive({
  page: 1,
  search: '',
})

watch(
  () => query.search,
  () => {
    router.reload({ data: { ...query, page: 1 } })
  }
)

watch(
  () => query.page,
  () => {
    router.reload({ data: query })
  }
)
</script>

<template>
  <div class="help-center-page">
    <div v-if="blogs">
      <AppSearchHeader
        subtitle="Common topics: Services listing, Payment process, Custom Requirements"
        custom-class="rounded-0"
        placeholder="Search"
        @search="
          (v) => {
            query.search = v
          }
        "
      >
        <template #title>
          <h4 class="text-h4 font-weight-medium" style="color: rgba(var(--v-theme-primary), 1)">
            Hello, how can we help?
          </h4>
        </template>
      </AppSearchHeader>

      <!-- 👉 Popular Articles -->
      <VContainer>
        <div v-if="blogs.data" class="help-center-section bg-surface pa-8">
          <h4 class="text-h4 text-center mb-6">Latest Blogs</h4>
          <VRow>
            <VCol v-for="b in blogs.data" :key="b.id" cols="12" sm="6" md="4" lg="3">
              <BlogCard :blog="b" />
            </VCol>
          </VRow>
        </div>
        <br />
        <div>
          <TablePagination
            :page="Number(query.page)"
            :items-per-page="Number(blogs?.meta?.perPage)"
            :total-items="Number(blogs?.meta?.total)"
            @update:page="
              (p) => {
                query.page = p
              }
            "
          />
        </div>
      </VContainer>
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
