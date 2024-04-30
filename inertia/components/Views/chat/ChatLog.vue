<script lang="ts" setup>
import dummyAvatar from '~/assets/images/dummy-avatar.webp'
import { Socket } from 'socket.io-client'
import type { IMessage } from '#models/message'
import type { IConversation } from '#models/conversation'
import { usePage } from '@inertiajs/vue3'
import type { IPageProps, IPaginatedModel } from '#helpers/types'
import { computed, onMounted, reactive, ref } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'
import { watch } from 'vue'
import { formatDistance } from 'date-fns'
import useApiGet from '~/composables/useApiGet'
import type { IUser } from '#models/user'

const props = defineProps<{
  selectedConversation: IConversation
  selectedParticipant: IUser
  socket: Socket | null
  newMessage: null | IMessage
}>()

const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

// const { fetcher } = useFetchRef()
const getImageUrl = useGetImageUrl()

const { data, processing, exec: getMessages } = useApiGet<IPaginatedModel<IMessage>>()

const {
  data: newData,
  processing: loadingMore,
  exec: getNewMessages,
} = useApiGet<IPaginatedModel<IMessage>>()

const query = reactive({
  page: 1,
  orderBy: 'createdAt:desc',
})

const dataRef = ref<IPaginatedModel<IMessage> | null>(null)

watch(data, () => {
  dataRef.value = data.value
})

watch(
  () => props.selectedConversation,
  () => {
    getMessages(routes('api.chat.get_messages', [props.selectedConversation.id]), {
      params: query,
    })
  }
)

watch(
  () => props.newMessage,
  () => {
    if (
      props.newMessage !== null &&
      props.newMessage.conversationId == props.selectedConversation.id
    ) {
      dataRef.value?.data.unshift(props.newMessage)
      if (dataRef.value?.data.length! > 19) {
        dataRef.value?.data.pop()
      }
    }
  }
)

const getMoreMessages = async () => {
  if (dataRef.value?.meta.nextPageUrl) {
    await getNewMessages(routes('api.chat.get_messages', [props.selectedConversation.id]), {
      params: {
        page: dataRef.value?.meta.currentPage! + 1,
        orderBy: 'createdAt:desc',
      },
    })

    const joinedData = [...(dataRef?.value?.data || []), ...newData?.value!?.data]

    dataRef.value!.data = joinedData
    dataRef.value!.meta = newData.value!?.meta
  }
}

onMounted(async () => {
  await getMessages(routes('api.chat.get_messages', [props.selectedConversation.id]), {
    params: query,
  })

  dataRef.value = data.value
})
</script>

<template>
  <div class="chat-log pa-6" v-for="m in dataRef?.data" :key="m.id">
    <div
      class="chat-group d-flex align-start"
      :class="[
        {
          'flex-row-reverse': m.userId == user?.id,
        },
      ]"
    >
      <div class="chat-avatar" :class="m.userId == user?.id ? 'ms-4' : 'me-4'">
        <VAvatar size="32">
          <VImg
            :src="getImageUrl(selectedParticipant.profile?.avatar?.thumbnailUrl, dummyAvatar)"
            :alt="user!?.firstName + user!?.lastName"
          />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="m.userId == user?.id ? 'align-end' : 'align-start'"
      >
        <div
          class="chat-content py-2 px-4 elevation-2"
          style="background-color: rgb(var(--v-theme-surface))"
        >
          <p class="mb-0 text-base">{{ m.body }}</p>
        </div>
        <div :class="{ 'text-right': m.userId == user?.id }">
          <VIcon v-if="m.userId == user?.id" size="16" :color="'success'" />
          <span class="text-sm ms-2 text-disabled">{{
            formatDistance(new Date(m.createdAt as unknown as string), Date.now())
          }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loadingMore" class="chat-log pa-6" v-for="m in 5" :key="m">
    <div class="chat-group d-flex align-start flex-row-reverse">
      <VSkeletonLoader type="list-item" class="w-50" />
    </div>
    <div class="chat-group d-flex align-start">
      <VSkeletonLoader type="list-item" class="w-50" />
    </div>
  </div>
  <div v-else-if="dataRef?.data?.length! > 1" class="d-flex justify-center w-100">
    <VBtn
      v-if="dataRef?.meta?.nextPageUrl"
      variant="tonal"
      :disabled="loadingMore"
      @click="
        () => {
          getMoreMessages()
          // y = -10000000000;
          // page += 1;
        }
      "
      >Load More</VBtn
    >
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-body {
    max-inline-size: calc(100% - 6.75rem);

    .chat-content {
      border-end-end-radius: 6px;
      border-end-start-radius: 6px;

      p {
        overflow-wrap: anywhere;
      }

      &.chat-left {
        border-start-end-radius: 6px;
      }

      &.chat-right {
        border-start-start-radius: 6px;
      }
    }
  }
}
</style>
