import type Notification from '#models/notification'
import type { INotification } from '#models/notification'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import useApiForm from '~/composables/useApiForm'
import useApiGet from '~/composables/useApiGet'
import useSocket from '~/composables/useSocket'
import routes from '~/utils/routes'

const notificationStore = defineStore('notification', () => {
  const notifcations = ref<Notification[]>([])
  const notificationCount = ref(0)
  const { connectSocket, disconnectSocket, socket } = useSocket()

  const { exec: getMenuNotificationsApi, data } = useApiGet<{
    notifcations: INotification[]
    count: number
  }>()

  const deleteAllNotifcationsForm = useApiForm({}, { disableToast: true })
  const deleteReadNotifcationsForm = useApiForm({}, { disableToast: true })
  const deleteOneNotifcationsForm = useApiForm({}, { disableToast: true })
  const markOneAsReadForm = useApiForm({}, { disableToast: true })
  const markOneAsUnreadForm = useApiForm({}, { disableToast: true })

  // const playSound = () => {
  //   const audio = new Audio('/audio/iphone_sound.mp3')
  //   audio.play()
  // }

  const getMenuNotifications = async () => {
    getMenuNotificationsApi(
      routes('api.notifications.menu'),
      {},
      {
        onSuccess() {
          notifcations.value = data.value?.notifcations || []
          notificationCount.value = data.value?.count || 0
        },
      }
    )
  }

  const deleteNotifcations = async (type: 'all' | 'read') => {
    if (type === 'all') {
      await deleteAllNotifcationsForm.post(routes('api.notifications.destroy_all'))
      getMenuNotifications()
    } else if (type === 'read') {
      await deleteReadNotifcationsForm.post(routes('api.notifications.destroy_read'))
      getMenuNotifications()
    }
  }

  const deleteOneNotifcation = async (id: number) => {
    await deleteOneNotifcationsForm.delete(routes('api.notifications.destroy', [id]))
    getMenuNotifications()
  }

  const markAsRead = async (id: number) => {
    await markOneAsReadForm.post(routes('api.notifications.mark_read', [id]))
  }

  const markAsUnead = async (id: number) => {
    await markOneAsUnreadForm.post(routes('api.notifications.mark_unread', [id]))
  }

  const setupNotificationSocket = () => {
    connectSocket('/notifications/')
    socket?.value?.on('room-joined', (room: string) => {
      console.log(room)
    })

    socket?.value?.on('new-notification', () => {
      // if (notifcations.value.length < 20) {
      //   notifcations.value.push(notification)
      //   notificationCount.value += 1
      // } else {
      //   notifcations.value.pop()
      //   notifcations.value.unshift(notification)
      //   notificationCount.value += 1
      // }
      getMenuNotifications()
    })
  }

  return {
    notifcations,
    notificationCount,
    getMenuNotifications,
    deleteNotifcations,
    deleteOneNotifcation,
    setupNotificationSocket,
    disconnectSocket,
    markAsRead,
    markAsUnead,
  }
})

export default notificationStore
