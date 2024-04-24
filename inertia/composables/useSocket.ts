import type { IPageProps } from '#helpers/types'
import { usePage } from '@inertiajs/vue3'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

export default function useSocket() {
  const socket = ref<Socket | null>(null)
  const page = usePage<IPageProps<{}>>()
  const user = computed(() => page.props?.user)

  const connectSocket = (url: string) => {
    if (!socket.value) {
      socket.value = io(url || '', {
        transports: ['websocket'],
        auth: {
          'user-id': user?.value!.id as unknown as string,
        },
      })
    }
  }

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.removeAllListeners()
      socket.value.disconnect()
      socket.value = null
    }
  }

  return {
    socket,
    connectSocket,
    disconnectSocket,
  }
}
