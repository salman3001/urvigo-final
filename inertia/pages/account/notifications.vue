<script lang="ts">
import Layout from '~/layouts/default.vue'
import notificationStore from '~/stores/notificationStore'
import { resolveNotificationIcon, resolveNotificationLink } from '~/utils/helpers'
import routes from '~/utils/routes'

export default {
  layout: Layout,
}
</script>

<script setup lang="ts">
import type { IPaginatedModel } from '#helpers/types'
import { Link } from '@inertiajs/vue3'
import { formatDistance } from 'date-fns'
import { watch } from 'vue'
import { onMounted, reactive } from 'vue'
import { VListItem, VSkeletonLoader } from 'vuetify/components'
import TablePagination from '~/@core/components/TablePagination.vue'
import AccountLayout from '~/components/Views/Web/account/AccountLayout.vue'
import useApiGet from '~/composables/useApiGet'

const query = reactive({
  page: 1,
})

const notificationPinia = notificationStore()

const { data: notifications, exec, processing } = useApiGet<IPaginatedModel<Notification>>()

// Data table Headers
const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Read', key: 'readAt' },
  { title: 'Action', key: 'actions', sortable: false },
]

onMounted(() => {
  exec(routes('api.notifications.index'))
})

watch(
  () => query.page,
  () => {
    exec(routes('api.notifications.index'), {
      params: query,
    })
  }
)
</script>

<template>
  <AccountLayout :active-tab="'Notifications'">
    <VCard>
      <VDataTableServer
        v-if="!processing"
        v-model:items-per-page="notifications.meta.perPage!"
        v-model:page="query.page"
        :headers="headers"
        :items="notifications.data"
        item-value="order"
        :items-length="notifications?.meta?.total!"
        show-select
        class="text-no-wrap"
      >
        <!-- Date -->

        <template #item.createdAt="{ item }">
          {{ formatDistance(Date.now(), item?.createdAt as unknown as string) }}
        </template>

        <!-- title  -->

        <template #item.title="{ item }">
          <div class="d-flex align-center gap-2 py-2">
            <VAvatar size="28" :variant="'tonal'">
              <VIcon :icon="resolveNotificationIcon(item)"></VIcon>
            </VAvatar>

            <Link :href="resolveNotificationLink(item)">
              {{ item.data?.title }}
              <div class="text-grey-600">
                {{ item.data?.subTitle }}
              </div>
            </Link>
          </div>
        </template>

        <template #item.readAt="{ item }">
          <VIcon
            size="22"
            :icon="item.readAt ? 'tabler-mail-opened' : 'tabler-mail'"
            :color="!item.readAt ? 'primary' : '#a8aaae'"
            :class="`${item.readAt ? 'visible-in-hover' : ''}`"
            class="mb-3"
          />
        </template>
        <!-- Actions -->

        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  prepend-icon="tabler-mail-opened"
                  value="view"
                  v-if="!item.readAt"
                  @click="
                    async () => {
                      await notificationPinia.markAsRead(item.id)
                      await exec(routes('api.notifications.index'))
                      await notificationPinia.getMenuNotifications()
                    }
                  "
                >
                  Mark read</VListItem
                >
                <VListItem
                  prepend-icon="tabler-mail"
                  value="view"
                  v-if="item.readAt"
                  @click="
                    async () => {
                      await notificationPinia.markAsUnead(item.id)
                      await exec(routes('api.notifications.index'))
                      await notificationPinia.getMenuNotifications()
                    }
                  "
                >
                  Mark unread</VListItem
                >
                <VListItem
                  prepend-icon="tabler-trash"
                  value="view"
                  @click="
                    async () => {
                      await notificationPinia.deleteOneNotifcation(item.id)
                      await exec(routes('api.notifications.index'))
                      await notificationPinia.getMenuNotifications()
                    }
                  "
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- pagination -->

        <template #bottom>
          <TablePagination
            :page="Number(query.page)"
            :items-per-page="Number(notifications?.meta?.perPage)"
            :total-items="Number(notifications?.meta?.total)"
            @update:page="
              (p) => {
                query.page = p
              }
            "
          />
        </template>
      </VDataTableServer>
      <div v-else>
        <VSkeletonLoader type="list-item-three-line"></VSkeletonLoader>
      </div>
    </VCard>
  </AccountLayout>
</template>
