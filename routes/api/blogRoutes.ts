import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'

router
  .group(() => {
    router
      .resource('blogs', '#controllers/api/api_blogs_controller')
      .apiOnly()
      .middleware(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
    router
      .resource('blog-categories', '#controllers/api/api_blog_categories_controller')
      .apiOnly()
      .middleware(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('api')
