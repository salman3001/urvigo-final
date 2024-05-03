import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const ApiAddressController = () => import('#controllers/api/api_address_controller')

router
  .group(() => {
    router
      .resource('addresses', ApiAddressController)
      .only(['index', 'store', 'update', 'destroy'])
      .as('address')
  })
  .prefix('api')
  .as('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
