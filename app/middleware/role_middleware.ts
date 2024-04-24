import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class RoleMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/denied'

  async handle(ctx: HttpContext, next: NextFn, role: 'admin' | 'vendor' | 'user') {
    const user = ctx.auth.user
    if (user && user.userType === role) {
      return next()
    } else {
      return ctx.response.redirect(this.redirectTo, true)
    }
  }
}
