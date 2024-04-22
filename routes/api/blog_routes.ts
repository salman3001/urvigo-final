import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const BlogController = () => import('#controllers/api/api_bids_controller')
const BlogCategoryController = () => import('#controllers/api/api_blog_categories_controller')

router
  .group(() => {
    router
      .resource('blogs', BlogController)
      .apiOnly()
      .use(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
      .as('blogs')
    router
      .resource('blog-categories', BlogCategoryController)
      .apiOnly()
      .use(['destroy', 'store', 'update'], middleware.auth({ guards: ['web', 'api'] }))
      .as('blog-categories')
  })
  .prefix('api')
  .as('api')
