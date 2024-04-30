<script lang="ts" setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import Conversations from './Conversations.vue'
import dummyAvatar from '~/assets/images/dummy-avatar.webp'
import { findObjectAndMoveToIndex0 } from '~/utils/helpers'
import { computed, reactive, ref, watch } from 'vue'
import useGetImageUrl from '~/composables/useGetImageUrl'
import type { IMessage } from '#models/message'
import type { IConversation } from '#models/conversation'
import type { IPageProps } from '#helpers/types'
import { router, usePage } from '@inertiajs/vue3'
import { watchDebounced } from '@vueuse/core'
import AppTextField from '~/@core/components/app-form-elements/AppTextField.vue'

const props = defineProps<{
  isDrawerOpen: boolean
  newMessage: null | IMessage
  selectedConversation?: IConversation
  chatList: IConversation[]
}>()

const emit = defineEmits<{
  (e: 'openChatOfConversation', conversation: IConversation): void
  (e: 'showUserProfile'): void
  (e: 'close'): void
  (e: 'update:search', value: string): void
}>()

const getImageUrl = useGetImageUrl()
const page = usePage<IPageProps<{}>>()
const user = computed(() => page?.props?.user)

const query = reactive({
  page: 1,
  search: '',
})

// if (page.props.query?.newConversationId) {
//   const existingConversation = props.chatList.filter(
//     (c) => c.id == (page.props?.query.newConversationId as unknown as number)
//   )
//   if (existingConversation) {
//     emit('openChatOfConversation', existingConversation[0])
//   } else {
//     getChatList({})
//   }
// }

const conversationsRef = ref(props.chatList)

watch(
  () => props.chatList,
  () => {
    conversationsRef.value = props.chatList
  }
)

watch(
  () => props.newMessage,
  () => {
    if (props.newMessage !== null) {
      if (conversationsRef.value?.some((c) => c.id == props.newMessage?.conversationId)) {
        const newData = findObjectAndMoveToIndex0(
          conversationsRef.value,
          props.newMessage,
          'id',
          'conversationId'
        )

        conversationsRef.value = newData as IConversation[]
        conversationsRef.value[0].messages[0] = props.newMessage
      } else {
        router.reload({
          only: ['chatList'],
          data: {
            page: 1,
          },
        })
      }
    }
  }
)

watchDebounced(
  query,
  () => {
    router.reload({
      data: query,
      only: ['chatList'],
    })
  },
  {
    debounce: 500,
    maxWait: 1000,
  }
)
</script>

<template>
  <!-- 👉 Chat list header -->
  <div v-if="user" class="chat-list-header">
    <VBadge dot location="bottom right" offset-x="3" offset-y="3" :color="'success'" bordered>
      <VAvatar size="40" class="cursor-pointer" @click="$emit('showUserProfile')">
        <VImg
          :src="getImageUrl(user.profile?.avatar?.thumbnailUrl, dummyAvatar)"
          :alt="user.firstName + user.lastName"
        />
      </VAvatar>
    </VBadge>

    <AppTextField
      v-model="query.search"
      placeholder="Search..."
      prepend-inner-icon="tabler-search"
      class="ms-4 me-1 chat-list-search"
    />

    <IconBtn v-if="$vuetify.display.smAndDown" @click="$emit('close')">
      <VIcon icon="tabler-x" class="text-medium-emphasis" />
    </IconBtn>
  </div>
  <VDivider />

  <PerfectScrollbar
    tag="ul"
    class="d-flex flex-column gap-y-1 chat-contacts-list px-3 py-2 list-none"
    :options="{ wheelPropagation: false }"
  >
    <li class="list-none">
      <h5 class="chat-contact-header text-primary text-h5">Chats</h5>
    </li>

    <Conversations
      v-for="conversation in chatList"
      :key="conversation.id"
      :conversation="conversation"
      :selected-conversation="selectedConversation"
      @click="
        () => {
          $emit('openChatOfConversation', conversation)
        }
      "
    />

    <span
      v-show="Array.isArray(chatList) && chatList.length < 1"
      class="no-chat-items-text text-disabled"
      >No chats found</span
    >
  </PerfectScrollbar>
</template>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 16px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block: 0.5rem 0.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}

.chat-list-search {
  .v-field--focused {
    box-shadow: none !important;
  }
}
</style>
