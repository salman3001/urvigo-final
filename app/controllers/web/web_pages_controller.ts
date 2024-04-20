import FileService from '#services/file_service'
import ServiceCategoryService from '#services/service_category_service'
import ServiceService from '#services/service_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebPagesController {
  constructor(
    protected serviceService: ServiceService,
    protected categoryService: ServiceCategoryService,
    protected fileService: FileService
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
    return inertia.render('account/profile')
  }

  async security({ inertia }: HttpContext) {
    return inertia.render('account/security')
  }

  async settings({ inertia }: HttpContext) {
    return inertia.render('account/settings')
  }

  async wishlist({ inertia }: HttpContext) {
    return inertia.render('account/wishlist')
  }

  async notifications({ inertia }: HttpContext) {
    return inertia.render('account/notifications')
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
