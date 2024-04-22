import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const conversationsController = () => import('#controllers/api/api_conversations_controller')

router
  .group(() => {
    router
      .post('conversations/:id/create-message', [conversationsController, 'createMessage'])
      .as('chat.create_message')
    router
      .post('conversations/:id/mark-all-as-read', [conversationsController, 'markAllAsRead'])
      .as('chat.markall_asread')
    router
      .get('conversations/:id/get-messages', [conversationsController, 'getConversationMessages'])
      .as('chat.get_messages')
    router
      .resource('conversations', conversationsController)
      .only(['index', 'show', 'store'])
      .as('chat')
  })
  .prefix('api/chat')
  .as('api')
  .use(
    middleware.auth({
      guards: ['web', 'api'],
    })
  )
