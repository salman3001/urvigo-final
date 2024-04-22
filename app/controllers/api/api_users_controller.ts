import type { HttpContext } from '@adonisjs/core/http'
import UserService from '../../services/user_service.js'

export default class ApiUsersController {
  constructor(protected userService: UserService) {}

  async index({ response }: HttpContext) {
    const users = await this.userService.index()
    return response.custom({
      success: true,
      code: 200,
      data: users,
      message: null,
    })
  }

  async show({ response }: HttpContext) {
    const user = await this.userService.show()
    return response.custom({
      success: true,
      code: 200,
      data: user,
      message: null,
    })
  }

  async update({ response }: HttpContext) {
    const user = await this.userService.update()
    return response.custom({
      success: true,
      code: 200,
      data: user,
      message: 'User Updated Successfully',
    })
  }

  async destroy({ response }: HttpContext) {
    const user = await this.userService.destroy()
    return response.custom({
      success: true,
      code: 200,
      data: user,
      message: 'User Deleted',
    })
  }

  async ban({ response }: HttpContext) {
    const user = await this.userService.banUser()
    return response.custom({
      success: true,
      code: 200,
      data: user,
      message: 'User Banned',
    })
  }

  async me({ response }: HttpContext) {
    const user = await this.userService.me()
    return response.custom({
      success: true,
      code: 200,
      data: user,
      message: null,
    })
  }

  async updatePassword({ response }: HttpContext) {
    await this.userService.updateUserPassword()
    return response.custom({
      success: true,
      code: 200,
      data: null,
      message: 'Password updated',
    })
  }

  async updateSubscribedCategories({ response }: HttpContext) {
    const data = await this.userService.updateSubscribedCategories()

    if (data === 'Not Authorized') {
      return response.custom({
        success: false,
        code: 400,
        data: null,
        message: 'Not Authorized',
      })
    } else {
      return response.custom({
        success: true,
        code: 200,
        data: null,
        message: 'Password updated',
      })
    }
  }
}
