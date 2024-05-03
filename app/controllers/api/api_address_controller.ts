import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AddressService from '#services/address_service'

@inject()
export default class ApiAddressController {
  constructor(protected addressService: AddressService) {}

  async index({ response }: HttpContext) {
    const categories = await this.addressService.index()
    return response.custom({
      code: 200,
      data: categories,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const Address = await this.addressService.store()
    return response.custom({
      code: 200,
      data: Address,
      message: 'Address Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const Address = await this.addressService.update()
    return response.custom({
      code: 200,
      data: Address,
      message: 'Address Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const Address = await this.addressService.destroy()
    return response.custom({
      code: 200,
      data: Address,
      message: 'Address Deleted',
      success: true,
    })
  }
}
