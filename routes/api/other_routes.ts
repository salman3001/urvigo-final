import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

router.get('api/build-routes', ({ response }: HttpContext) => {
  return response.custom({
    code: 200,
    data: null,
    message: 'Routes Exported',
    success: true,
  })
})
