import FileService from '#services/file_service'
import ServiceCategoryService from '#services/service_category_service'
import ServiceService from '#services/service_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserService from '../../services/user_service.js'
import WishlstService from '../../services/wishlist_service.js'
import notificationsService from '../../services/notification_service.js'
@inject()
export default class WebPagesController {
  constructor(
    protected serviceService: ServiceService,
    protected categoryService: ServiceCategoryService,
    protected userService: UserService,
    protected fileService: FileService,
    protected wishlistService: WishlstService,
    protected notificationService: notificationsService
  ) {}

  //auth

  async home({ inertia }: HttpContext) {
    return inertia.render('home', {
      topServices: async () => await this.serviceService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services({ inertia }: HttpContext) {
    return inertia.render('services/service-list', {
      services: () => this.serviceService.index(),
      categories: () => this.categoryService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services_show({ inertia }: HttpContext) {
    return inertia.render('services/service-show', {
      service: () => this.serviceService.showBySlug(),
      similarServices: () => this.serviceService.similarServices(),
    })
  }

  async createReview({ response, session }: HttpContext) {
    const data = await this.serviceService.createReview()
    if (data === 'Review Exit') {
      session.flash('flash', {
        message: 'You have already reviews this service',
        type: 'error',
      })

      return response.redirect().back()
    } else {
      session.flash('flash', { message: 'Review added', type: 'success' })
      return response.redirect().back()
    }
  }

  async profile({ inertia }: HttpContext) {
    return inertia.render('account/profile', {
      user: () => this.userService.me(),
    })
  }

  async updatProfile({ response, session }: HttpContext) {
    await this.userService.update()
    session.flash('flas', {
      message: 'Profile Updated',
      type: 'success',
    })
    return response.redirect().back()
  }

  async security({ inertia }: HttpContext) {
    return inertia.render('account/security')
  }

  async updateSecurity({ response, session }: HttpContext) {
    await this.userService.updateUserPassword()
    session.flash('flash', { message: 'User security updated', type: 'success' })
    return response.redirect().back()
  }

  async settings({ inertia }: HttpContext) {
    return inertia.render('account/settings')
  }

  async wishlist({ inertia }: HttpContext) {
    return inertia.render('account/wishlist', {
      wishlist: () => this.wishlistService.showDetailList(),
    })
  }

  async AddWishlistItem({ response, session }: HttpContext) {
    await this.wishlistService.add()
    session.flash('flash', { message: 'Service added to wishlist', type: 'success' })
    return response.redirect().back()
  }

  async RemoveWishlistItem({ response, session }: HttpContext) {
    await this.wishlistService.deleteItem()
    session.flash('flash', { message: 'Service removed from wishlist', type: 'success' })
    return response.redirect().back()
  }

  async ClearWishlist({ response, session }: HttpContext) {
    await this.wishlistService.clear()
    session.flash('flash', { message: 'Wishlist Cleared', type: 'success' })
    return response.redirect().back()
  }

  async notifications({ inertia }: HttpContext) {
    return inertia.render('account/notifications', {
      notifications: () => this.notificationService.index(),
    })
  }

  async markNotificationAsRed({ response }: HttpContext) {
    await this.notificationService.markAsRead()
    return response.redirect().back()
  }

  async destroyReadNotifications({ response, session }: HttpContext) {
    await this.notificationService.destroyRead()
    session.flash('flash', { message: 'Read Notification deleted', type: 'success' })
    return response.redirect().back()
  }

  async destroyAllNotifications({ response, session }: HttpContext) {
    await this.notificationService.destroyAll()
    session.flash('flash', { message: 'All Notification deleted', type: 'success' })
    return response.redirect().back()
  }

  // async businessProfile({ view }: HttpContext) {
  //   return view.render('pages/business/view', {})
  // }

  async temp({ response }: HttpContext) {
    // const file = request.file('file')
    // const image = await this.fileService.uploadeImage(file!, '/uploads')
    return response.redirect().back()
  }
}
