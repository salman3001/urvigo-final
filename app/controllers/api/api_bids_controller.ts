import BidService from '#services/bid_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ApiBidsController {
  constructor(protected bidService: BidService) {}
  async index({ response }: HttpContext) {
    const bids = await this.bidService.index()
    return response.custom({
      code: 200,
      data: bids,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const bid = await this.bidService.show()
    return response.custom({
      code: 200,
      data: bid,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const data = await this.bidService.store()

    if (data === 'proposal exist') {
      return response.custom({
        code: 400,
        data: null,
        message: 'You have already sent proposal',
        success: false,
      })
    }

    return response.custom({
      code: 200,
      data: data,
      message: 'Bid Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const data = await this.bidService.update()

    return response.custom({
      code: 200,
      data: data,
      message: 'Bid Updated',
      success: true,
    })
  }

  async acceptNegotiation({ response }: HttpContext) {
    const data = await this.bidService.acceptNegotiation()
    if (data === 'Negotiation Not Requested') {
      return response.custom({
        code: 400,
        message: 'Negotiation Not requested',
        data: null,
        success: false,
      })
    }

    return response.custom({
      code: 200,
      message: 'Bid updated with new price',
      data: data,
      success: true,
    })
  }

  async delete({ response }: HttpContext) {
    const data = await this.bidService.destroy()
    return response.custom({
      code: 200,
      data: data,
      message: 'Bid deleted',
      success: true,
    })
  }
}
