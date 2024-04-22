import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const reviewsontroller = () => import('#controllers/api/api_reviews_controller')

// reviews
router
  .group(() => {
    router
      .get('/reviews/service-reviews/:serviceId', [reviewsontroller, 'getServiceReviews'])
      .as('reviews.service')
    router
      .get('/reviews/venodr-reviews/:vendorId', [reviewsontroller, 'getVendorReviews'])
      .as('reviews.vendor')

    router
      .group(() => {
        router
          .post('/reviews/service-reviews', [reviewsontroller, 'createServiceReview'])
          .as('reviews.service.create')

        router
          .post('/reviews/venodr-reviews/', [reviewsontroller, 'createVendorReview'])
          .as('reviews.vendor.create')
      })
      .use(middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('api')
  .as('api')
