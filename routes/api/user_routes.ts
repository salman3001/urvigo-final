import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ApiUserController = () => import('#controllers/api/api_users_controller')
const ApiWishlistController = () => import('#controllers/api/api_wishlists_controller')

router
  .group(() => {
    // user routes

    router
      .post('users/ban/:id', [ApiUserController, 'ban'])
      .as('user.ban')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .post('users/update-password/:id', [ApiUserController, 'updatePassword'])
      .as('user.update_password')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .put('users/:id/update-profile', [ApiUserController, 'update'])
      .as('user.update')
      .use(middleware.auth({ guards: ['web', 'api'] }))
    router
      .resource('users', ApiUserController)
      .apiOnly()
      .only(['index', 'show', 'store', 'destroy'])
      .as('user')
      .use(['destroy', 'store'], middleware.auth({ guards: ['web', 'api'] }))

    // wishlist routes
    router
      .group(() => {
        router.get('my-wishlist', [ApiWishlistController, 'show']).as('wishlist.index')
        router
          .get('my-wishlist/detailed', [ApiWishlistController, 'showDetailList'])
          .as('wishlist.index_detailed')
        router
          .post('my-wishlist/add-item', [ApiWishlistController, 'addItem'])
          .as('wishlist.add_item')
        router
          .delete('my-wishlist/:itemId', [ApiWishlistController, 'deleteItem'])
          .as('wishlist.remove_item')
        router.delete('my-wishlist', [ApiWishlistController, 'clearWishlist']).as('wishlist.clear')
      })
      .use(middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('api')
  .as('api')
