import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const notificationController = () => import('#controllers/api/api_notifications_controller')

router
  .group(() => {
    router
      .get('/notifications/get-menu-notifications', [
        notificationController,
        'getMenuNotifications',
      ])
      .as('notifications.menu')
    router
      .post('/notifications/mark-as-read/:id', [notificationController, 'markAsRead'])
      .as('notifications.mark_read')
    router
      .delete('/notifications/delete/read', [notificationController, 'destroyRead'])
      .as('notifications.destroy_read')
    router
      .delete('/notifications/delete/all', [notificationController, 'destroyAll'])
      .as('notifications.destroy_all')
    router
      .resource('/notifications', notificationController)
      .only(['index', 'update', 'destroy'])
      .as('notifications')
  })
  .prefix('api')
  .as('api')
  .use(
    middleware.auth({
      guards: ['web', 'api'],
    })
  )
