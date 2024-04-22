import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'

router
  .group(() => {
    router.get(
      'service-requirements/my-list',
      '#controllers/api/api_service_requirements_controller.myList'
    )
    router.get(
      'service-requirements/:id/show-bids',
      '#controllers/api/api_service_requirements_controller.showBids'
    )
    router.get(
      'service-requirements/:id/accepted-bid',
      '#controllers/api/api_service_requirements_controller.showAcceptedBid'
    )
    router.post(
      'service-requirements/:id/negotiate-price',
      '#controllers/api/api_service_requirements_controller.negotiate'
    )
    router.get(
      'service-requirements/:id/show-vendor-placed-bid',
      '#controllers/api/api_service_requirements_controller.showVendorPlacedbid'
    )
    router
      .resource('service-requirements', '#controllers/api/api_service_requirements_controller')
      .apiOnly()

    // bids
    router.put(
      'bids/:id/accept-negotiate',
      '#controllers/api/api_bids_controller.acceptNegotiation'
    )
    router.resource('bids', '#controllers/api/api_bids_controller').apiOnly()
  })
  .prefix('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
