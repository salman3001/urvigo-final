<script setup lang="ts">
import type { IPageProps, IPaginatedModel } from '#helpers/types'
import type { IService } from '#models/service'
import type { IServiceCategory } from '#models/service_category'
import { router, usePage } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'
import { computed, reactive, ref, watch } from 'vue'
import TablePagination from '~/@core/components/TablePagination.vue'
import AppSelect from '~/@core/components/app-form-elements/AppSelect.vue'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'
import academyCourseIllustration1 from '~/assets/images/pages/academy-course-illustration1.png'
import academyCourseIllustration2 from '~/assets/images/pages/academy-course-illustration2.png'
import ServiceCard from '~/components/ServiceCard.vue'
import routes from '~/utils/routes'

const page = usePage<
  IPageProps<{
    services: IPaginatedModel<IService>
    categories: IServiceCategory[]
  }>
>()

const services = computed(() => page.props.services)
const categories = computed(() => page.props.categories)

const query = reactive({
  search: '',
  orderBy: 'created_at:desc',
  serviceCategoryId: '',
  page: 1,
})

// const page = ref(1)

watchDebounced(
  [() => query.orderBy, () => query.search, () => query.serviceCategoryId],
  () => {
    router.visit(routes('web.services'), {
      data: { ...query, page: 1 },
      preserveState: true,
    })
  },
  { debounce: 500, maxWait: 1000 }
)

watch(
  () => query.page,
  () => {
    router.visit(routes('web.services'), {
      data: { ...query },
      preserveState: true,
    })
  }
)
</script>

<template>
  <VContainer id="features" class="py-5">
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
        >
          <h4
            class="text-h4 text-center text-wrap mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
          >
            Discover Our Permier Selection of Services
            <span class="text-primary text-no-wrap"> All in one place.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            Explore our service listing page for a wide array of offerings tailored to your
            requirements. From consultations to specialized solutions, find the expertise you need
            at your fingertips.
          </p>
          <div class="d-flex justify-center align-center gap-4 flex-wrap">
            <div class="flex-grow-1" style="max-inline-size: 350px">
              <AppTextField v-model="query.search" placeholder="Find your Service" />
            </div>
            <VBtn color="primary" density="comfortable" icon="tabler-search" class="rounded" />
          </div>
        </div>
        <img
          :src="academyCourseIllustration1"
          class="illustration1 d-none d-md-block"
          height="180"
        />
        <img
          :src="academyCourseIllustration2"
          class="illustration2 d-none d-md-block"
          height="100"
        />
      </VCardText>
    </VCard>
    <VCard class="mb-6">
      <VCardText>
        <!-- 👉 Header -->
        <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
          <div>
            <h5 class="text-h5">Services</h5>
            <div class="text-body-1">Lorem ipsum dolor sit amet.</div>
          </div>

          <div class="d-flex flex-wrap gap-x-6 gap-y-4 align-center">
            <AppSelect
              v-model="query.orderBy"
              :items="[
                { name: 'None', value: 'created_at:desc' },
                { name: 'Highest Rating', value: 'avg_rating:desc' },
                { name: 'Lowest Price', value: 'starting_from' },
              ]"
              item-title="name"
              item-value="value"
              label="Sort By"
              style="min-inline-size: 260px"
            />
            <AppSelect
              v-model="query.serviceCategoryId"
              :items="[...categories, { name: 'All Services', id: '' }]"
              item-title="name"
              item-value="id"
              label="Categories"
              style="min-inline-size: 260px"
            />
          </div>
        </div>
      </VCardText>
    </VCard>
    <br />
    <div v-if="services">
      <VRow class="">
        <VCol v-for="s in services?.data" :key="s" cols="12" md="6" lg="3">
          <ServiceCard :service="s" />
        </VCol>
      </VRow>
    </div>
    <div v-else>
      <VRow class="">
        <VCol v-for="s in 10" :key="s" cols="12" md="6" lg="3">
          <VSkeletonLoader type="card" />
        </VCol>
      </VRow>
    </div>
    <br />
    <div>
      <TablePagination
        :page="Number(query.page)"
        :items-per-page="Number(services?.meta?.perPage)"
        :total-items="Number(services?.meta?.total)"
        @update:page="
          (p) => {
            query.page = p
          }
        "
      />
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.search-bar-wrapper {
  width: 100%;
  min-width: 200px !important;
  max-width: 700px !important;
}

.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>
