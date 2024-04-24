import FileService from '#services/file_service'
import ServiceCategoryService from '#services/service_category_service'
import ServiceService from '#services/service_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserService from '../../services/user_service.js'
import notificationsService from '../../services/notification_service.js'
import ReviewsService from '#services/review_service'
import ChatService from '#services/chat_service'
@inject()
export default class WebVendorController {
  constructor(
    protected serviceService: ServiceService,
    protected categoryService: ServiceCategoryService,
    protected userService: UserService,
    protected fileService: FileService,
    protected notificationService: notificationsService,
    protected reviewsService: ReviewsService,
    protected chatService: ChatService
  ) {}

  async dashboard({ inertia }: HttpContext) {
    return inertia.render('vendor/dashboard')
  }
}
