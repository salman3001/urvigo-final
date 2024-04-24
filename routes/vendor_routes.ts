import router from '@adonisjs/core/services/router'
import { middleware } from '../start/kernel.js'
const WebVendorController = () => import('#controllers/web/web_vendor_controller')

router
  .group(() => {
    router.get('dashboard', [WebVendorController, 'dashboard']).as('dashboard')
  })
  .prefix('vendor')
  .as('vendor')
  .use([middleware.auth({ guards: ['web'] }), middleware.role('vendor')])
