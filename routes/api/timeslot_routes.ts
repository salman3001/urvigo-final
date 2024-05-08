import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const ApiTimeslotController = () => import('#controllers/api/api_timeslot_controller')

router
  .group(() => {
    router
      .get('timeslots-plans/:id/:date', [ApiTimeslotController, 'getAvailableSlots'])
      .as('timeslot-plan.get-available-slots')
    router
      .resource('timeslots-plans', ApiTimeslotController)
      .only(['index', 'store', 'update', 'destroy'])
      .as('timeslot-plan')
  })
  .prefix('api')
  .as('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
