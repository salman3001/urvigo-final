<script setup lang="ts">
import { IPageProps } from '#helpers/types'
import Service from '#models/service'
import { Link, router, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { ref } from 'vue'
import dummyAvatar from '~/assets/images/dummy-avatar.webp'
import ReviewsCard from '~/components/ReviewsCard.vue'
import ReviewsOverview from '~/components/ReviewsOverview.vue'
import ServiceCard2 from '~/components/ServiceCard2.vue'
import SwiperCrousel from '~/components/SwiperCrousel.vue'
import ModalAddReview from '~/components/modal/ModalAddReview.vue'
import WebSelectVariant from '~/components/web/WebSelectVariant.vue'

const getImageUrl = useGetImageUrl()
const addReviewModal = ref(false)
const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

defineProps<{
  service: Service
  similarServices: Service[]
}>()
</script>

<script lang="ts">
import useGetImageUrl from '~/composables/useGetImageUrl'
import Layout from '~/layouts/default.vue'
import routes from '~/utils/routes'

export default {
  layout: Layout,
}
</script>

<template>
  <br />
  <br />
  <br />
  <br />
  <VContainer fluid>
    <VRow>
      <VCol cols="12" md="9">
        <VCard>
          <VCardItem :title="service?.name" class="pb-6">
            <template #subtitle>
              <div class="text-body-1">
                category.
                <span class="text-h6 d-inline-block">{{ service?.serviceCategory?.name }}</span>
              </div>
            </template>

            <template #append>
              <div class="d-flex gap-4 align-center">
                <VChip variant="tonal" color="error" size="small">{{ service?.serviceCategory?.name }}
                </VChip>
                <VIcon size="24" class="cursor-pointer" icon="tabler-share" />
                <VIcon size="24" class="cursor-pointer" icon="tabler-bookmarks" />
              </div>
            </template>
          </VCardItem>
          <VCardText>
            <VCard flat border>
              <div class="px-2 pt-2 crousel-wrapper">
                <SwiperCrousel :images="service?.images?.length > 0
              ? service?.images?.map((i) => i?.file?.url)
              : [
                getImageUrl(service?.thumbnail?.url),
                getImageUrl(service?.thumbnail?.url),
                getImageUrl(service?.thumbnail?.url),
              ]
            " />
                <!-- <VImg
                  :src="getImageUrl(service?.thumbnail?.url)"
                  :height="$vuetify.display.mdAndUp ? 440 : 250"
                  class="w-100 rounded"
                /> -->
              </div>
              <VCardText>
                <h5 class="text-h5 mb-4">About this service</h5>
                <p class="text-body-1">
                  {{ service?.shortDesc }}
                </p>
                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Service Variants</h5>
                <VRow>
                  <VCol cols="12" xl="6" v-for="variant in service?.variants">
                    <WebSelectVariant :variant="variant" />
                  </VCol>
                </VRow>
                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Description</h5>
                <div v-html="service?.longDesc"></div>

                <VDivider class="my-6" />

                <h5 class="text-h5 mb-4">Listed By</h5>
                <div class="d-flex align-center gap-x-4">
                  <VAvatar :image="getImageUrl(
            service?.businessProfile.vendor?.profile?.avatar?.thumbnailUrl,
            dummyAvatar
          )
            " size="38" />
                  <div>
                    <Link :href="routes('web.vendor-profile.about', [service?.businessProfile.vendor?.id])
            ">
                    <h6 class="text-h6 mb-1">
                      {{ service?.businessProfile.vendor?.firstName }}
                      {{ service?.businessProfile.vendor?.lastName }}
                    </h6>
                    </Link>
                    <div class="text-body-2">
                      {{ service?.businessProfile.businessName }}
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCardText>
        </VCard>
        <br />

        <ReviewsOverview :total-reviews="service?.businessProfile?.meta?.reviews_count || 0"
          :rating="Number(service?.businessProfile.avgRating)">
          <div class="d-flex gap-2 flex-wrap">
            <VBtn @click="() => {
              if (user) {
                addReviewModal = true
              } else {
                router.visit(`${routes('web.auth.login')}?next=${page.url}`)
              }
            }
            ">
              <VIcon size="24" class="cursor-pointer" icon="tabler-plus" />
              Add Review
            </VBtn>
            <VBtn>
              <VIcon size=" 24" class="cursor-pointer" icon="tabler-eye" /> &nbsp;
              View All
            </VBtn>
          </div>
        </ReviewsOverview>
        <br />
        <VRow>
          <VCol v-for="(r, i) in service?.reviews" :key="i">
            <ReviewsCard :review="r" />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12" md="3">
        <h6 class="text-h6">Similar Services</h6>
        <div class="course-content">
          <ServiceCard2 class="ma-2" v-for="(s, i) in similarServices" :service="s" :key="i" />
        </div>
      </VCol>
    </VRow>
    <ModalAddReview v-model:isVisible="addReviewModal" :service-id="service!.id" @submit="async () => {
              router.reload({ only: ['service'] })
              addReviewModal = false
            }
            " />
  </VContainer>
</template>

<style lang="scss" scoped>
.course-content {
  position: sticky;
}

.card-list {
  --v-card-list-gap: 16px;
}
</style>

<style lang="scss">
@use '@layouts/styles/mixins' as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }
}
</style>
~/utils/routes-old
