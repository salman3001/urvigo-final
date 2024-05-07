import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const ApiTimeslotController = () => import('#controllers/api/api_timeslot_controller')

router
  .group(() => {
    router
      .resource('timeslots', ApiTimeslotController)
      .only(['index', 'store', 'update', 'destroy'])
      .as('timeslots')
  })
  .prefix('api')
  .as('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
