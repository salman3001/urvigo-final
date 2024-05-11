<script lang="ts" setup>
import type { Notification as NotificationProp } from '~/@layouts/types'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Notifications from '~/@core/components/Notifications.vue'
import notificationStore from '~/stores/notificationStore'
import { router } from '@inertiajs/vue3'
import { formatDistance } from 'date-fns'
import type Notification from '#models/notification'
import { resolveNotificationIcon, resolveNotificationLink } from '~/utils/helpers'

const notifications = notificationStore()

const notificationProps = ref<NotificationProp[]>([])

watch(
  () => notifications.notifcations,
  () => {
    if (notifications.notifcations) {
      notificationProps.value =
        notifications.notifcations?.map((n) => ({
          id: n.id,
          title: n.data.title,
          subtitle: n.data.subTitle,
          time: formatDistance(Date.now(), n.createdAt as unknown as string),
          isSeen: n.readAt ? true : false,
          link: resolveNotificationLink(n as Notification),
          icon: resolveNotificationIcon(n as Notification),
        })) || []
    }
  },
  { immediate: true }
)

const removeNotification = (notificationId: number) => {
  notifications.deleteOneNotifcation(notificationId)
}

const markRead = async (notificationId: number[]) => {
  for (const id of notificationId) {
    await notifications.markAsRead(id)
  }
  notifications.getMenuNotifications()
}

const markUnRead = async (notificationId: number[]) => {
  for (const id of notificationId) {
    await notifications.markAsUnead(id)
  }
  notifications.getMenuNotifications()
}

const handleNotificationClick = async (notification: NotificationProp) => {
  if (!notification.isSeen) await markRead([notification.id])
  notification.link && router.visit(notification.link)
}

onMounted(() => {
  notifications.getMenuNotifications()
  notifications.setupNotificationSocket()
})

onUnmounted(() => {
  notifications.disconnectSocket()
})
</script>

<template>
  <Notifications
    :notifications="notificationProps"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
    :unread-count="notifications.notificationCount"
  />
</template>
