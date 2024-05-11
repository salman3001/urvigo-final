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
    notificationCount: number
  }>()

  const deleteAllNotifcationsForm = useApiForm({})
  const deleteReadNotifcationsForm = useApiForm({})
  const deleteOneNotifcationsForm = useApiForm({})
  const markOneAsReadForm = useApiForm({})
  const markOneAsUnreadForm = useApiForm({})

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
      deleteAllNotifcationsForm.post(routes('api.notifications.destroy_all'))
    } else if (type === 'read') {
      deleteReadNotifcationsForm.post(routes('api.notifications.destroy_read'))
    }
  }

  const deleteOneNotifcation = async (id: string) => {
    deleteOneNotifcationsForm.post(routes('api.notifications.destroy', [id]))
  }

  const markAsRead = async (id: number) => {
    markOneAsReadForm.post(routes('api.notifications.mark_read', [id]))
  }

  const markAsUnead = async (id: number) => {
    markOneAsUnreadForm.post(routes('api.notifications.mark_unread', [id]))
  }

  const setupNotificationSocket = () => {
    connectSocket('/notifications/')
    socket?.value?.on('room-joined', (room: string) => {
      console.log(room)
    })

    socket?.value?.on('new-notification', (notification: any) => {
      if (notifcations.value.length < 20) {
        notifcations.value.push(notification)
        notificationCount.value += 1
      } else {
        notifcations.value.pop()
        notifcations.value.unshift(notification)
        notificationCount.value += 1
      }
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
