<script setup lang="ts">
import Shepherd from 'shepherd.js'
// import type { SearchResults } from '@db/app-bar-search/types'
import { useConfigStore } from '~/@core/stores/config'
import { defineAsyncComponent, ref, watch } from 'vue'
import routes from '~/utils/routes'
import { Link, router } from '@inertiajs/vue3'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'

interface Suggestion {
  icon: string
  title: string
  url: any
}

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  inputVisible?: boolean
}>()

const configStore = useConfigStore()

interface SuggestionGroup {
  title: string
  content: Suggestion[]
}

// 👉 Is App Search Bar Visible
const isAppSearchBarVisible = ref(false)
const isLoading = ref(false)

// 👉 Default suggestions

const suggestionGroups: SuggestionGroup[] = [
  {
    title: 'Popular Searches',
    content: [
      {
        icon: 'tabler-chart-bar',
        title: 'Services',
        url: { path: routes.services.list },
      },
      {
        icon: 'tabler-chart-donut-3',
        title: 'Service Requirements',
        url: { path: routes.service_requirement.list },
      },
      {
        icon: 'tabler-shopping-cart',
        title: 'Bookings',
        url: { path: routes.bookings.list },
      },
    ],
  },
  {
    title: 'Apps & Pages',
    content: [
      {
        icon: 'tabler-chart-bar',
        title: 'Vendor CRM',
        url: { path: import.meta.env.VENDOR_BASE_URL + routes.vendor.dashboard },
      },
      {
        icon: 'tabler-chart-donut-3',
        title: 'Blogs',
        url: { path: routes.blogs.list },
      },
      {
        icon: 'tabler-shopping-cart',
        title: 'Pricing',
        url: { path: routes.pricing },
      },
    ],
  },
  {
    title: 'Blogs',
    content: [
      {
        icon: 'tabler-typography',
        title: 'Blogs 1',
        url: { path: routes.blogs.list },
      },
      {
        icon: 'tabler-menu-2',
        title: 'Blogs 2',
        url: { path: routes.blogs.list },
      },
      {
        icon: 'tabler-info-triangle',
        title: 'Blogs 3',
        url: { path: 'components-alert' },
      },
      {
        icon: 'tabler-checkbox',
        title: 'Blogs 4',
        url: { path: routes.blogs.list },
      },
    ],
  },
  {
    title: 'Faqs',
    content: [
      {
        icon: 'tabler-typography',
        title: 'Faq 1',
        url: { path: routes.faqs },
      },
      {
        icon: 'tabler-menu-2',
        title: 'Faq 2',
        url: { path: routes.faqs },
      },
      {
        icon: 'tabler-info-triangle',
        title: 'Faq 3',
        url: { path: routes.faqs },
      },
      {
        icon: 'tabler-checkbox',
        title: 'Faq 4',
        url: { path: routes.faqs },
      },
    ],
  },
]

// 👉 No Data suggestion
const noDataSuggestions: Suggestion[] = [
  {
    title: 'Services',
    icon: 'tabler-brand-azure',
    url: { path: routes.services.list },
  },
  {
    title: 'Blogs',
    icon: 'tabler-article',
    url: { path: routes.blogs.list },
  },
  {
    title: 'Faqs',
    icon: 'tabler-messages',
    url: { path: routes.faqs },
  },
]

const searchQuery = ref('')

const searchResult = ref<any[]>([])

const fetchResults = async () => {
  isLoading.value = true

  // const { data } = await useApi<any>("");

  // searchResult.value = data.value;

  // ℹ️ simulate loading: we have used setTimeout for better user experience your can remove it
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

watch(searchQuery, fetchResults)

const closeSearchBar = () => {
  isAppSearchBarVisible.value = false
  searchQuery.value = ''
}

// 👉 redirect the selected page
const redirectToSuggestedPage = (selected: Suggestion) => {
  router.visit(selected.url as string)
  closeSearchBar()
}

const LazyAppBarSearch = defineAsyncComponent(() => import('~/@core/components/AppBarSearch.vue'))
</script>

<template>
  <div
    class="d-flex align-center cursor-pointer gap-2"
    v-bind="$attrs"
    style="user-select: none"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible"
  >
    <!-- 👉 Search Trigger button -->
    <!-- close active tour while opening search bar using icon -->
    <IconBtn @click="Shepherd.activeTour?.cancel()">
      <VIcon icon="tabler-search" />
    </IconBtn>
    <AppTextField placeholder="Search Services" @focus.prevent="" v-if="inputVisible" />

    <span
      v-if="configStore.appContentLayoutNav === 'vertical'"
      class="d-none d-md-flex align-center text-disabled ms-2"
      @click="Shepherd.activeTour?.cancel()"
    >
      <span class="me-2">Search</span>
      <span class="meta-key">&#8984;K</span>
    </span>
  </div>

  <!-- 👉 App Bar Search -->
  <LazyAppBarSearch
    v-model:isDialogVisible="isAppSearchBarVisible"
    :search-results="searchResult"
    :is-loading="isLoading"
    @search="searchQuery = $event"
  >
    <!-- suggestion -->
    <template #suggestions>
      <VCardText class="app-bar-search-suggestions pa-12">
        <VRow v-if="suggestionGroups">
          <VCol v-for="suggestion in suggestionGroups" :key="suggestion.title" cols="12" sm="6">
            <p
              class="custom-letter-spacing text-disabled text-uppercase py-2 px-4 mb-0"
              style="font-size: 0.75rem; line-height: 0.875rem"
            >
              {{ suggestion.title }}
            </p>
            <VList class="card-list">
              <VListItem
                v-for="item in suggestion.content"
                :key="item.title"
                class="app-bar-search-suggestion mx-4 mt-2"
                @click="redirectToSuggestedPage(item)"
              >
                <VListItemTitle>{{ item.title }}</VListItemTitle>
                <template #prepend>
                  <VIcon :icon="item.icon" size="20" class="me-n1" />
                </template>
              </VListItem>
            </VList>
          </VCol>
        </VRow>
      </VCardText>
    </template>

    <!-- no data suggestion -->

    <template #noDataSuggestion>
      <Link
        :href="routes.services.list"
        :data="{ search: searchQuery }"
        class="text-h5 text-primary"
        >Search for "{{ searchQuery }}" in services</Link
      >
      <div class="mt-9">
        <span class="d-flex justify-center text-disabled mb-2">Try searching for</span>
        <h6
          v-for="suggestion in noDataSuggestions"
          :key="suggestion.title"
          class="app-bar-search-suggestion text-h6 font-weight-regular cursor-pointer py-2 px-4"
          @click="redirectToSuggestedPage(suggestion)"
        >
          <VIcon size="20" :icon="suggestion.icon" class="me-2" />
          <span>{{ suggestion.title }}</span>
        </h6>
      </div>
    </template>

    <!-- search result -->

    <template #searchResult="{ item }">
      <VListSubheader class="text-disabled custom-letter-spacing font-weight-regular ps-4">
        {{ item.title }}
      </VListSubheader>
      <VListItem
        v-for="list in item.children"
        :key="list.title"
        :to="list.url"
        @click="closeSearchBar"
      >
        <template #prepend>
          <VIcon size="20" :icon="list.icon" class="me-n1" />
        </template>

        <template #append>
          <VIcon size="20" icon="tabler-corner-down-left" class="enter-icon flip-in-rtl" />
        </template>
        <VListItemTitle>
          {{ list.title }}
        </VListItemTitle>
      </VListItem>
    </template>
  </LazyAppBarSearch>
</template>

<style lang="scss">
@use '~/assets/styles/variables/vuetify.scss';

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  font-size: 0.8125rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-bar-search-dialog {
  .custom-letter-spacing {
    letter-spacing: 0.8px;
  }

  .card-list {
    --v-card-list-gap: 8px;
  }
}
</style>
