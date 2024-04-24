<script lang="ts" setup>
import { IPageProps } from '#helpers/types'
import type Conversation from '#models/conversation'
import dummyAvatar from '@images/dummy-avatar.webp'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { avatarText, formatDateToMonthShort } from '~/@core/utils/formatters'
import useGetImageUrl from '~/composables/useGetImageUrl'

interface Props {
  conversation: Conversation
  selectedConversation?: Conversation
}

const props = defineProps<Props>()

const getImageUrl = useGetImageUrl()
const page = usePage<IPageProps<{}>>()
const user = computed(() => page.props?.user)

const isChatContactActive = computed(() => {
  const isActive = props?.selectedConversation?.id === props.conversation.id

  return isActive
})

const computedParticipant = computed(() => {
  if (props.conversation.participantOneId != user.value?.id) {
    return props.conversation.participantOne
  } else if (props.conversation.participantTwoId != user.value?.id) {
    return props.conversation.participantTwo
  } else {
    return null
  }
})
</script>

<template>
  <li
    class="chat-contact cursor-pointer d-flex align-center"
    :class="{ 'chat-contact-active': isChatContactActive }"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="0"
      :color="'success'"
      bordered
      :model-value="true"
    >
      <VAvatar size="40" :variant="'tonal'">
        <VImg
          v-if="computedParticipant?.profile?.avatar"
          :src="getImageUrl(computedParticipant?.profile?.avatar?.thumbnailUrl, dummyAvatar)"
          :alt="computedParticipant?.firstName || '' + ' ' + computedParticipant?.lastName"
        />
        <span v-else>{{
          avatarText(computedParticipant?.firstName || '' + ' ' + computedParticipant?.lastName)
        }}</span>
      </VAvatar>
    </VBadge>
    <div class="flex-grow-1 ms-4 overflow-hidden">
      <p class="text-base text-high-emphasis mb-0">
        {{ computedParticipant?.firstName || '' + ' ' + computedParticipant?.lastName }}
      </p>
      <p class="mb-0 text-truncate text-body-2" v-if="conversation?.messages?.length > 0">
        {{ conversation?.messages[0]?.body }}
      </p>
      <p class="mb-0 text-truncate text-body-2" v-else>
        Say Hi to {{ computedParticipant?.firstName }}
      </p>
    </div>
    <div v-if="conversation?.messages?.length > 0" class="d-flex flex-column align-self-start">
      <div
        v-if="conversation?.messages[0]?.createdAt"
        class="text-body-2 text-disabled whitespace-no-wrap"
      >
        {{ formatDateToMonthShort(conversation?.messages[0]?.createdAt as unknown as string) }}
      </div>
      <div v-if="conversation.messages[0]">
        <VBadge
          v-if="conversation.meta?.unread_messages && conversation.meta?.unread_messages > 0"
          color="error"
          inline
          :content="conversation.meta?.unread_messages"
          class="ms-auto"
        />
      </div>
    </div>
  </li>
</template>

<style lang="scss">
@use '~/@core/scss/template/mixins' as templateMixins;
@use '~/assets/styles/variables/vuetify.scss';
@use '~/@core/scss/base/mixins';
@use 'vuetify/lib/styles/tools/states' as vuetifyStates;

.chat-contact {
  border-radius: vuetify.$border-radius-root;
  padding-block: 8px;
  padding-inline: 12px;

  @include mixins.before-pseudo;
  @include vuetifyStates.states($active: false);

  &.chat-contact-active {
    @include templateMixins.custom-elevation(var(--v-theme-primary), 'sm');

    background: rgb(var(--v-theme-primary));
    color: #fff;

    --v-theme-on-background: #fff;
  }

  .v-badge--bordered .v-badge__badge::after {
    color: #fff;
  }
}
</style>
