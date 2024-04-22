import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const ApiServiceRequirementController = () =>
  import('#controllers/api/api_service_requirements_controller')
const ApiBidController = () => import('#controllers/api/api_bids_controller')

router
  .group(() => {
    //service requirements

    router
      .get('service-requirements/:id/show-bids', [ApiServiceRequirementController, 'showBids'])
      .as('requirements.show_bids')
    router
      .get('service-requirements/:id/accepted-bid', [
        ApiServiceRequirementController,
        'showAcceptedBid',
      ])
      .as('requirements.show_accepted_bids')
    router
      .post('service-requirements/:id/negotiate-price', [
        ApiServiceRequirementController,
        'negotiate',
      ])
      .as('requirements.negotiate_price')
    router
      .get('service-requirements/:id/show-vendor-placed-bid', [
        ApiServiceRequirementController,
        'showVendorPlacedbid',
      ])
      .as('requirements.vendor_placed_bids')
    router
      .get('service-requirements/my-list', [ApiServiceRequirementController, 'myList'])
      .as('requirements.my_list')
    router
      .resource('service-requirements', ApiServiceRequirementController)
      .apiOnly()
      .as('requirements')

    // bids

    router
      .put('bids/:id/accept-negotiate', '#controllers/api/api_bids_controller.acceptNegotiation')
      .as('bids.accept-negotiate')
    router.resource('bids', ApiBidController).apiOnly().as('bids')
  })
  .prefix('api')
  .as('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
