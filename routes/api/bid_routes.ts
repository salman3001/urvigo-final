import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // router.get('service-requirements/my-list', 'bid/ServiceRequirementController.myList')
    router.get(
      'service-requirements/:id/show-bids',
      '#controllers/api/api_service_requirements_controller.showBids'
    )
    // router.get(
    //   'service-requirements/:id/accepted-bid',
    //   'bid/ServiceRequirementController.showAcceptedBid'
    // )
    // router.post(
    //   'service-requirements/:id/negotiate-price',
    //   'bid/ServiceRequirementController.negotiate'
    // )
    // router.get(
    //   'service-requirements/:id/show-vendor-placed-bid',
    //   'bid/ServiceRequirementController.showVendorPlacedbid'
    // )
    // router.resource('service-requirements', 'bid/ServiceRequirementController').apiOnly()
    router.put(
      'bids/:id/accept-negotiate',
      '#controllers/api/api_bids_controller.acceptNegotiation'
    )
    router.resource('bids', '#controllers/api/api_bids_controller').apiOnly()
  })
  .prefix('api')
