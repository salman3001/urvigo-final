import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ApiServiceController = () => import('#controllers/api/api_services_controller')
const ApiServiceCategoryController = () =>
  import('#controllers/api/api_service_categories_controller')
const ApiServiceSubCategoryController = () =>
  import('#controllers/api/api_service_subcategories_controller')
const ApiServiceTagController = () => import('#controllers/api/api_service_tags_controller')

router
  .group(() => {
    // services
    router.get('service/:slug', [ApiServiceController, 'show']).as('service.show')
    router
      .delete('service/delete-screenshot/:id', [ApiServiceController, 'deleteImages'])
      .as('service.destroy_images')
      .use(middleware.auth({ guards: ['web', 'api'] }))
    router
      .get('service/my-list', [ApiServiceController, 'myList'])
      .as('service.my_list')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .resource('service', ApiServiceController)
      .apiOnly()
      .only(['destroy', 'destroy', 'store', 'update'])
      .as('service')
      .use('*', middleware.auth({ guards: ['web', 'api'] }))

    // service categories

    router
      .get('service-category/:slug', [ApiServiceCategoryController, 'show'])
      .as('service-category.show')
    router
      .resource('service-category', ApiServiceCategoryController)
      .apiOnly()
      .as('service-category')
      .use(['destroy', 'destroy', 'update'], middleware.auth({ guards: ['web', 'api'] }))

    // service subcategories
    router
      .group(() => {
        router.get('slug', [ApiServiceSubCategoryController, 'show']).as('service-subcategory.show')

        router
          .resource('service-subcategory', ApiServiceSubCategoryController)
          .apiOnly()
          .as('service-subcategory')
          .use(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
      })
      .prefix('service-subcategory')

    // service tags

    router.get('service-tags/:slug', [ApiServiceTagController, 'show']).as('service-tags.show')

    router
      .resource('service-tags', '#controllers/api/api_service_tags_controller')
      .apiOnly()
      .as('service-tags')
      .middleware(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('api')
  .as('api')
