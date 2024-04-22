import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Wishlist from '../models/wishlist.js'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { wishlistUpdateValidator } from '../validators/wishlist.js'

@inject()
export default class WishlstService {
  constructor(protected ctx: HttpContext) {}
  async index() {
    const { bouncer } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('viewList')
    const wishlistQuery = Wishlist.query()

    const wishlist = await wishlistQuery.exec()

    return wishlist
  }

  async show() {
    const { bouncer, auth } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('view')

    const wishlist = await Wishlist.query()
      .where('user_id', auth.user?.id!)
      .preload('items', (i) => {
        i.select('id')
      })
      .firstOrFail()

    return wishlist
  }

  async showDetailList() {
    const { bouncer, auth } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('view')

    const wishlist = await Wishlist.query()
      .where('user_id', auth.user?.id!)
      .preload('items', (i) => {
        i.preload('serviceCategory', (s) => {
          s.select(['name'])
        })
          .preload('serviceSubcategory', (s) => {
            s.select(['id', 'name'])
          })
          .preload('tags', (s) => {
            s.select(['id', 'name'])
          })
          .preload('variants')
          .select([
            'id',
            'name',
            'slug',
            'short_desc',
            'is_active',
            'geo_location',
            'thumbnail',
            'avg_rating',
            'service_category_id',
            'service_subcategory_id',
            'created_at',
          ])
          .withCount('reviews', (r) => {
            r.as('reviews_count')
          })
          .withAggregate('variants', (v) => {
            v.min('price').as('starting_from')
          })
      })
      .firstOrFail()

    return wishlist
  }

  async add() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('update')

    const wishlist = await Wishlist.query().where('user_id', auth.user?.id!).firstOrFail()

    const vallidationSchema = vine.compile(
      vine.object({
        serviceId: vine.number(),
      })
    )

    const payload = await request.validateUsing(vallidationSchema)

    await wishlist.related('items').attach([payload.serviceId])
    await wishlist.save()

    return wishlist
  }

  async update() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('update')

    let wishlist: Wishlist | null = null
    const user = auth.user

    await db.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })

      const payload = await request.validateUsing(wishlistUpdateValidator)

      await wishlist.load('items')

      if (wishlist.items) {
        await wishlist.related('items').detach(payload.serviceVariantIds)
      }

      await wishlist.related('items').attach(payload.serviceVariantIds)
    })

    await wishlist!.load('items')

    return wishlist
  }

  async deleteItem() {
    const { bouncer, auth, params } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('delete')

    const itemId = params.itemId
    const user = auth.user

    const wishlist = await Wishlist.findByOrFail('user_id', user!.id)
    await wishlist.related('items').detach([itemId])

    await wishlist!.load('items')

    return wishlist
  }

  async clear() {
    const { bouncer, auth } = this.ctx
    await bouncer.with('WishlistPolicy').authorize('delete')
    const user = auth.user

    const wishlist = await Wishlist.findByOrFail('user_id', user!.id)
    await wishlist.related('items').detach()

    return wishlist
  }
}
