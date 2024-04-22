import type { HttpContext } from '@adonisjs/core/http'

import WishlstService from '#services/wishlist_service'

export default class ApiWishlistsController {
  constructor(protected wishlistService: WishlstService) {}

  async show({ response }: HttpContext) {
    const wishlist = await this.wishlistService.show()
    return response.custom({
      code: 200,
      data: wishlist,
      message: null,
      success: true,
    })
  }

  async showDetailList({ response }: HttpContext) {
    const wishlist = await this.wishlistService.showDetailList()
    return response.custom({
      code: 200,
      data: wishlist,
      message: null,
      success: true,
    })
  }

  async addItem({ response }: HttpContext) {
    const wishlist = await this.wishlistService.add()
    return response.custom({
      code: 200,
      data: wishlist,
      message: 'Service Added to Wishlist',
      success: true,
    })
  }

  async deleteItem({ response }: HttpContext) {
    const wishlist = await this.wishlistService.deleteItem()
    return response.custom({
      code: 200,
      data: wishlist,
      message: 'Service Removed from Wishlist',
      success: true,
    })
  }

  async clearWishlist({ response }: HttpContext) {
    const wishlist = await this.wishlistService.clear()
    return response.custom({
      code: 200,
      data: wishlist,
      message: 'Wishlist Cleared',
      success: true,
    })
  }
}
