import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const ApiReviewController = () => import('#controllers/api/api_reviews_controller')

router
  .group(() => {
    //reviews services
    router
      .get('reviews/services/:serviceId', [ApiReviewController, 'getServiceReviews'])
      .as('reviews.services')
    router
      .get('reviews/services/:serviceId/get-info', [ApiReviewController, 'getServiceReviewsInfo'])
      .as('reviews.services.info')
    router
      .post('reviews/services/:serviceId', [ApiReviewController, 'createServiceReview'])
      .as('reviews.services.store')
      .use(middleware.auth({ guards: ['web', 'api'] }))
    // reviews vendor
    router
      .get('reviews/vendor/:businessProfileId', [ApiReviewController, 'getVendorReviews'])
      .as('reviews.vendor')
    router
      .get('reviews/vendor/:businessProfileId/get-info', [
        ApiReviewController,
        'getVendorReviewsInfo',
      ])
      .as('reviews.vendor.info')
    router
      .post('reviews/vendor/:businessProfileId', [ApiReviewController, 'createVendorReview'])
      .as('reviews.vendor.store')
      .use(middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('api')
  .as('api')
