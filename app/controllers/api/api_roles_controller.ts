import type { HttpContext } from '@adonisjs/core/http'

import RoleService from '../../services/role_service.js'

export default class ApiRolesController {
  constructor(protected roleService: RoleService) {}

  async index({ response }: HttpContext) {
    const roles = await this.roleService.index()
    return response.custom({
      success: true,
      code: 200,
      data: roles,
      message: null,
    })
  }

  async show({ response }: HttpContext) {
    const role = await this.roleService.show()
    return response.custom({
      success: true,
      code: 200,
      data: role,
      message: null,
    })
  }

  async store({ response }: HttpContext) {
    const role = await this.roleService.store()
    return response.custom({
      success: true,
      code: 200,
      data: role,
      message: 'Role Created',
    })
  }

  async update({ response }: HttpContext) {
    const role = await this.roleService.update()
    return response.custom({
      success: true,
      code: 200,
      data: role,
      message: 'Role updated',
    })
  }

  async destroy({ response }: HttpContext) {
    const role = await this.roleService.destroy()
    return response.custom({
      success: true,
      code: 200,
      data: role,
      message: 'Role Deleted',
    })
  }

  async allPermissions({ response }: HttpContext) {
    const permissions = await this.roleService.allPermissions()
    return response.custom({
      success: true,
      code: 200,
      data: permissions,
      message: 'Role Deleted',
    })
  }
}
