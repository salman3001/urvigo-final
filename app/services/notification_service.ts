import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Notification from '../models/notification.js'
import { paginate } from '../helpers/common.js'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class NotificationsService {
  constructor(protected ctx: HttpContext) {}
  async index() {
    const { auth, request, bouncer } = this.ctx
    await bouncer.with('NotificationPolicy').authorize('viewList')
    const user = auth.user!

    const notifcationQuery = Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')

    const notifications = paginate(notifcationQuery, request)

    return notifications
  }

  async getMenuNotifications() {
    const { auth, bouncer } = this.ctx
    await bouncer.with('NotificationPolicy').authorize('viewList')

    const user = auth.user

    let notifcations: any[] = []
    let count: any = 0

    if (user) {
      await user.load('notifications', (b) => {
        b.orderBy('created_at', 'desc').limit(10)
      })

      const query = await db.rawQuery(
        `
      SELECT
        count(*) as count
      FROM
        notifications
      WHERE 
        user_id = ? AND read_at IS NULL
      `,
        [user.id]
      )

      if (!query) {
        count = 0
      } else {
        count = query.rows[0]?.count
      }

      notifcations = user.notifications
    }

    return { notifcations, count }
  }

  async destroy() {
    const { bouncer, params } = this.ctx
    const notification = await Notification.findOrFail(+params.id)
    await bouncer.with('NotificationPolicy').authorize('delete', notification)
    await notification.delete()

    return 'Notification deleted' as 'Notification deleted'
  }

  async destroyRead() {
    const { auth, bouncer } = this.ctx
    await bouncer.with('NotificationPolicy').authorize('view')
    const user = auth.user

    await user!.load('notifications', (n) => {
      n.whereNotNull('read_at')
    })

    for (const n of user!.notifications) {
      await n.delete()
    }

    return 'Notification deleted' as 'Notification deleted'
  }

  async destroyAll() {
    const { auth, bouncer } = this.ctx
    await bouncer.with('NotificationPolicy').authorize('view')
    const user = auth.user

    await user!.load('notifications')

    for (const n of user!.notifications) {
      await n.delete()
    }

    return 'deleted' as 'deleted'
  }

  async markAsRead() {
    const { params, bouncer } = this.ctx
    const id = +params.id
    const notification = await Notification.findOrFail(id)
    await bouncer.with('NotificationPolicy').authorize('update', notification)
    await notification.markAsRead()
    return 'marked as read' as 'marked as read'
  }

  async markAsUnRead() {
    const { params, bouncer } = this.ctx
    const id = +params.id
    const notification = await Notification.findOrFail(id)
    await bouncer.with('NotificationPolicy').authorize('update', notification)
    await notification.markAsUnread()
    return 'marked as unread' as 'marked as unread'
  }
}
