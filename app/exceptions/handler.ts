import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */

  async handle(error: any, ctx: HttpContext) {
    if (ctx.response.getStatus() === 422) {
      return ctx.response.status(ctx.response.getStatus()).send({
        success: false,
        message: 'Not all the fields are filled correctly',
        data: null,
        errors: error.messages.errors,
      })
    }

    if (ctx.response.getStatus() === 500) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Server Error', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 400) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Bad Request', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 403) {
      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Authorization failed', data: null, error: error.message })
    }

    if (ctx.response.getStatus() === 404) {
      console.log(ctx.response.getStatus())

      return ctx.response
        .status(ctx.response.getStatus())
        .send({ success: false, message: 'Not Found', data: null, error: error.message })
    }
    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
