import type { ApplicationService } from '@adonisjs/core/types'
import { BaseModel, CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    await import('../bin/extensions.js')
    BaseModel.namingStrategy = new CamelCaseNamingStrategy()
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const { exportNamedRoutes } = await import('../app/helpers/common.js')
    exportNamedRoutes()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
