<script lang="ts" setup>
import type { Notification as NotificationProp } from '~/@layouts/types'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Notifications from '~/@core/components/Notifications.vue'
import notificationStore from '~/stores/notificationStore'
import { router } from '@inertiajs/vue3'
import { formatDistance } from 'date-fns'
import type Notification from '#models/notification'
import { NotificationTypes } from '#helpers/enums'
import routes from '~/utils/routes'

const notifications = notificationStore()

const notificationProps = ref<NotificationProp[]>([])

const resolveLink = (n?: Notification) => {
  if (n) {
    if (n.data.type === NotificationTypes.BOOKING_CREATED)
      return routes('web.booking.show', [n.data.meta.booking_id])
    if (n.data.type === NotificationTypes.BOOKING_RECIEVED)
      return routes('vendor.booking.show', [n.data.meta.booking_id])
    if (n.data.type === NotificationTypes.CUSTOM_BOOKING_CREATED)
      return routes('web.custom_booking.show', [n.data.meta.booking_id])
    if (n.data.type === NotificationTypes.CUSTOM_BOOKING_RECIEVED)
      return routes('vendor.custom-booking.show', [n.data.meta.booking_id])
    if (n.data.type === NotificationTypes.BID_RECIEVED)
      return routes('web.service_requirement.show', [n.data.meta.requirement_id])
    if (n.data.type === NotificationTypes.NEGOTIATED)
      return routes('web.service_requirement.show', [n.data.meta.requirement_id])
    if (n.data.type === NotificationTypes.NEGOTIATION_REQUESTED)
      return routes('vendor.requirements.show', [n.data.meta.requirement_id])
    else return 'tabler-circle-dot'
  } else return 'tabler-circle-dot'
}

const resolveIcon = (n?: Notification) => {
  if (n) {
    if (n.data.type === NotificationTypes.BOOKING_CREATED) return 'tabler-shopping-cart'
    if (n.data.type === NotificationTypes.BOOKING_RECIEVED) return 'tabler-shopping-cart'
    if (n.data.type === NotificationTypes.CUSTOM_BOOKING_CREATED) return 'tabler-shopping-cart'
    if (n.data.type === NotificationTypes.CUSTOM_BOOKING_RECIEVED) return 'tabler-shopping-cart'
    if (n.data.type === NotificationTypes.BID_RECIEVED) return 'tabler-hand-grab'
    if (n.data.type === NotificationTypes.NEGOTIATED) return 'tabler-heart-handshake'
    if (n.data.type === NotificationTypes.NEGOTIATION_REQUESTED) return 'tabler-question-mark'
    else return 'tabler-circle-dot'
  } else {
    return 'tabler-circle-dot'
  }
}

watch(
  () => notifications.notifcations,
  () => {
    if (notifications.notifcations) {
      notificationProps.value =
        notifications.notifcations?.map((n) => ({
          id: n.id,
          title: n.data.title,
          subtitle: n.data.subTitle,
          time: formatDistance(Date.now(), n.updatedAt as unknown as string),
          isSeen: n.readAt ? true : false,
          link: resolveLink(n as Notification),
          icon: resolveIcon(n as Notification),
        })) || []
    }
  },
  { immediate: true }
)

const removeNotification = (/*notificationId: number*/) => {
  // notificationsss.value.forEach((item, index) => {
  //   if (notificationId === item.id) notificationsss.value.splice(index, 1)
  // })
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
    :badge-props="{ content: notifications.notificationCount }"
  />
</template>
