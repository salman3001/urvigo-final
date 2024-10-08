// import { defineStore } from 'pinia'
// import type { ActiveChat } from './useChat'
// import { createUrl } from '~/@core/composable/createUrl'

// interface State {
//   chatsContacts: ChatContactWithChat[]
//   contacts: ChatContact[]
//   profileUser: ChatContact | undefined
//   activeChat: ActiveChat
// }

// export const useChatStore = defineStore('chat', {
//   // ℹ️ arrow function recommended for full type inference
//   state: (): State => ({
//     contacts: [],
//     chatsContacts: [],
//     profileUser: undefined,
//     activeChat: null,
//   }),
//   actions: {
//     async fetchChatsAndContacts(q: string) {
//       const { data, error } = await useApi<any>(
//         createUrl('/apps/chat/chats-and-contacts', {
//           query: {
//             q,
//           },
//         })
//       )

//       if (error.value) {
//         console.log(error.value)
//       } else {
//         const { chatsContacts, contacts, profileUser } = data.value

//         this.chatsContacts = chatsContacts
//         this.contacts = contacts
//         this.profileUser = profileUser
//       }
//     },

//     async getChat(userId: ChatContact['id']) {
//       const res = await $api(`/apps/chat/chats/${userId}`)

//       this.activeChat = res
//     },

//     async sendMsg(message: ChatMessage['message']) {
//       const senderId = this.profileUser?.id

//       const response = await $api(`apps/chat/chats/${this.activeChat?.contact.id}`, {
//         method: 'POST',
//         body: { message, senderId },
//       })

//       const { msg, chat }: { msg: ChatMessage; chat: ChatOut } = response

//       // ? If it's not undefined => New chat is created (Contact is not in list of chats)
//       if (chat !== undefined) {
//         const activeChat = this.activeChat!

//         this.chatsContacts.push({
//           ...activeChat.contact,
//           chat: {
//             id: chat.id,
//             lastMessage: [],
//             unseenMsgs: 0,
//             messages: [msg],
//           },
//         })

//         if (this.activeChat) {
//           this.activeChat.chat = {
//             id: chat.id,
//             messages: [msg],
//             unseenMsgs: 0,
//             userId: this.activeChat?.contact.id,
//           }
//         }
//       } else {
//         this.activeChat?.chat?.messages.push(msg)
//       }

//       // Set Last Message for active contact
//       const contact = this.chatsContacts.find((c) => {
//         if (this.activeChat) return c.id === this.activeChat.contact.id

//         return false
//       }) as ChatContactWithChat

//       contact.chat.lastMessage = msg
//     },
//   },
// })

// // temp

// export type ChatStatus = 'online' | 'offline' | 'busy' | 'away'

// export interface ChatContact {
//   id: number
//   fullName: string
//   role: string
//   about: string
//   avatar: string
//   status: ChatStatus
// }

// export interface ChatMessage {
//   message: string
//   time: string
//   senderId: number
//   feedback: {
//     isSent: boolean
//     isDelivered: boolean
//     isSeen: boolean
//   }
// }

// export interface Chat {
//   id: number
//   userId: number
//   unseenMsgs: number
//   messages: ChatMessage[]
// }

// // ℹ️ This is chat type received in response of user chat
// export interface ChatOut {
//   id: Chat['id']
//   unseenMsgs: Chat['unseenMsgs']
//   messages: ChatMessage[]

//   // @ts-expect-error indexed access type
//   lastMessage: ChatMessage[number]
// }

// export interface ChatContactWithChat extends ChatContact {
//   chat: ChatOut
// }
