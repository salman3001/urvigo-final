import type { INotification } from '#models/notification'
import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import useApiForm from '~/composables/useApiForm'
import useApiGet from '~/composables/useApiGet'
import routes from '~/utils/routes'

const notificationStore = defineStore('notification', () => {
  const notifcations = ref<any[]>([])
  const notificationCount = ref(0)
  const socket = ref<Socket | null>(null)
  const { exec: getMenuNotificationsApi, data } = useApiGet<{
    notifcations: INotification[]
    notificationCount: number
  }>()

  const deleteAllNotifcationsForm = useApiForm({})
  const deleteReadNotifcationsForm = useApiForm({})
  const deleteOneNotifcationsForm = useApiForm({})
  const markAllNotifcationsAsReadForm = useApiForm({})

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
          notificationCount.value = data.value?.notificationCount || 0
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

  const markAsRead = async (id: string) => {
    markAllNotifcationsAsReadForm.post(routes('api.notifications.mark_read', [id]))
  }

  const connectSocket = (url: string, user: any, socketToken: any) => {
    if (!socket.value) {
      socket.value = io(url + '/notifications/', {
        transports: ['websocket'],
        auth: {
          userId: user?.id || '',
          socketToken: socketToken || '',
        },
      })

      socket.value.on('room-joined', (room: string) => {
        console.log(room)
      })

      socket.value.on('new-notification', (notification: any) => {
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
  }

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  return {
    notifcations,
    notificationCount,
    getMenuNotifications,
    deleteNotifcations,
    deleteOneNotifcation,
    connectSocket,
    disconnectSocket,
    markAsRead,
  }
})

export default notificationStore
