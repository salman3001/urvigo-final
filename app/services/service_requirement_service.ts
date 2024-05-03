import { paginate, slugify } from '#helpers/common'
import { userTypes } from '#helpers/enums'
import Bid from '#models/bid'
import ServiceRequirement from '#models/service_requirement'
import ServiceTag from '#models/service_tag'
import {
  createServiceRequirementValidator,
  updateServiceRequirementValidator,
} from '#validators/service_requirement'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import FileService from './file_service.js'
import vine from '@vinejs/vine'
import { BigNumber } from 'bignumber.js'
import { DateTime } from 'luxon'
import { IndexOption } from '#helpers/types'

@inject()
export default class ServiceRequirementService {
  constructor(
    protected ctx: HttpContext,
    protected fileservice: FileService
  ) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServiceRequirementPolicy').authorize('viewList')

    const serviceRequirementQuery = ServiceRequirement.query()
      .preload('user', (u) => {
        u.select(['first_name', 'last_name']).preload('profile', (p) => {
          p.select('avatar')
        })
      })
      .preload('serviceCategory', (c) => {
        c.select('name')
      })
      .preload('tags', (t) => {
        t.select(['name'])
      })
      .orderBy('created_at', 'desc')

    !opt?.disableFilter && serviceRequirementQuery.filter(request.qs())

    const serviceRequirements = await paginate<typeof ServiceRequirement>(
      serviceRequirementQuery,
      request
    )

    return serviceRequirements
  }

  async listForVendor(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServiceRequirementPolicy').authorize('viewList')

    const serviceRequirementQuery = ServiceRequirement.query()
      .where('expires_at', '>', DateTime.now().toSQL())
      .whereNull('accepted_bid_id')
      .preload('user', (u) => {
        u.select(['first_name', 'last_name']).preload('profile', (p) => {
          p.select('avatar')
        })
      })
      .preload('serviceCategory', (c) => {
        c.select('name')
      })
      .preload('tags', (t) => {
        t.select(['name'])
      })
      .orderBy('created_at', 'desc')

    !opt?.disableFilter && serviceRequirementQuery.filter(request.qs())

    const serviceRequirements = await paginate<typeof ServiceRequirement>(
      serviceRequirementQuery,
      request
    )

    return serviceRequirements
  }

  async myList(opt?: IndexOption) {
    const { auth, bouncer, request } = this.ctx
    await bouncer.with('ServiceRequirementPolicy').authorize('myList')

    const user = auth.user!

    const serviceRequirementQuery = ServiceRequirement.query()
      .where('user_id', user.id)
      .preload('user', (u) => {
        u.select(['first_name', 'last_name']).preload('profile', (p) => {
          p.select('avatar')
        })
      })
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .withCount('recievedBids')
      .withAggregate('recievedBids', (b) => {
        b.avg('offered_price').as('avgBidPrice')
      })
      .preload('tags', (t) => {
        t.select(['name'])
      })

    !opt?.disableFilter && serviceRequirementQuery.filter(request.qs())

    const serviceRequirements = await paginate<typeof ServiceRequirement>(
      serviceRequirementQuery,
      request
    )

    return serviceRequirements
  }

  async show() {
    const { bouncer, params } = this.ctx
    const serviceRequirement = await ServiceRequirement.query()
      .where('id', +params.id)
      .preload('serviceCategory', (s) => {
        s.select('name')
      })
      .preload('user', (u) => {
        u.preload('profile')
      })
      .withCount('recievedBids')
      .withAggregate('recievedBids', (b) => {
        b.avg('offered_price').as('avgBidPrice')
      })
      .preload('images')
      .preload('tags', (t) => {
        t.select(['name'])
      })
      .firstOrFail()

    await bouncer.with('ServiceRequirementPolicy').authorize('view')

    return serviceRequirement
  }

  async showAcceptedBid() {
    const { bouncer, params } = this.ctx
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view')

    const bidQuery = Bid.query()
      .where('id', serviceRequirement.acceptedBidId || 0)
      .preload('vendor', (v) => {
        v.select(['first_name', 'last_name', 'id'])
          .preload('profile', (p) => {
            p.select('avatar')
          })
          .preload('businessProfile', (p) => {
            p.select(['avg_rating', 'business_name'])
          })
      })

    const bid = await bidQuery.first()

    return bid
  }

  async showVendorPlacedbid() {
    const { bouncer, params, auth } = this.ctx
    const isVendor = auth.user?.userType === userTypes.VENDER
    if (!isVendor) {
      return 'Unautorized'
    }

    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view')

    const bidQuery = Bid.query()
      .where('service_requirement_id', serviceRequirement.id || 0)
      .whereHas('vendor', (v) => {
        v.where('id', auth.user!.id)
      })
      .preload('vendor', (v) => {
        v.select(['first_name', 'last_name', 'id'])
          .preload('profile', (p) => {
            p.select('avatar')
          })
          .preload('businessProfile', (p) => {
            p.select(['avg_rating', 'business_name'])
          })
      })

    const bid = await bidQuery.first()

    return bid
  }

  async showBids() {
    const { bouncer, params, request } = this.ctx
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view')

    const bidQuery = Bid.query()
      .where('service_requirement_id', serviceRequirement.id)
      .preload('vendor', (v) => {
        v.preload('businessProfile', (b) => {
          b.select('avg_rating')
        })
      })

    bidQuery.whereNot('bids.id', serviceRequirement?.acceptedBidId || 0)

    if (request.qs()?.orderby_avg_rating) {
      bidQuery.join('vendor_users', 'bids.vendor_user_id', 'vendor_users.id')

      bidQuery.select('bids.*')
      bidQuery.orderBy('vendor_users.avg_rating', 'desc')
    } else if (request.qs()?.orderby_lowest_price) {
      bidQuery.whereNot('id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.orderBy('offered_price', 'asc')
      bidQuery.select('*')
    } else {
      bidQuery.whereNot('id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.orderBy('created_at', 'desc')
    }

    bidQuery.filter(request.qs())

    const bids = await paginate<typeof Bid>(bidQuery, request)

    return bids
  }

  async store() {
    const { auth, bouncer, request } = this.ctx
    // @ts-ignore
    await bouncer.with('ServiceRequirementPolicy').authorize('create')

    const { keywords, images, ...payload } = await request.validateUsing(
      createServiceRequirementValidator
    )

    let serviceRequirement: ServiceRequirement | null = null

    await db.transaction(async (trx) => {
      serviceRequirement = await ServiceRequirement.create(
        { ...payload, userId: auth.user!.id },
        { client: trx }
      )

      if (payload.address) {
        await serviceRequirement.related('address').create(payload.address)
      }

      if (keywords) {
        const tags = await ServiceTag.fetchOrCreateMany(
          'name',
          keywords.map((k) => ({ name: k, slug: slugify(k) }))
        )
        await serviceRequirement.related('tags').saveMany(tags)
      }

      if (images) {
        for (const i of images) {
          const imageData = await this.fileservice.uploadeImage(i)
          await serviceRequirement.related('images').create({ file: imageData })
        }
      }
    })

    if (serviceRequirement) {
      await (serviceRequirement as ServiceRequirement).refresh()
    }

    return serviceRequirement!
  }

  async update() {
    const { auth, bouncer, request, params } = this.ctx
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const { images, ...payload } = await request.validateUsing(updateServiceRequirementValidator)

    await db.transaction(async (trx) => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ ...payload, userId: auth.user!.id })
      await serviceRequirement.save()

      if (payload.address) {
        await serviceRequirement.load('address')
        if (serviceRequirement.address) {
          serviceRequirement.address.merge(payload.address)
          await serviceRequirement.address.save()
        } else {
          await serviceRequirement.related('address').create(payload.address)
        }
      }

      if (images) {
        for (const i of images) {
          const imageData = await this.fileservice.uploadeImage(i)
          await serviceRequirement.related('images').create({ file: imageData })
        }
      }
    })

    await serviceRequirement.refresh()

    return serviceRequirement!
  }

  async negotiate() {
    const { bouncer, request, params } = this.ctx
    const validationSchema = vine.compile(
      vine.object({
        bidId: vine.number(),
        price: vine.number().min(0),
        message: vine.string().maxLength(255),
      })
    )

    const payload = await request.validateUsing(validationSchema)

    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    const bid = await Bid.query()
      .where('id', payload.bidId)
      .where('serviceRequirementId', serviceRequirement.id)
      .firstOrFail()

    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const lastNegotiiate = bid.negotiateHistory[bid.negotiateHistory.length - 1]

    if (lastNegotiiate && lastNegotiiate.accepted === false) {
      return 'Last Request Pending'
    }

    bid.negotiateHistory.push({
      asked_price: new BigNumber(payload.price).toFixed(2),
      date_time: DateTime.now(),
      message: payload.message,
      accepted: false,
    })

    await bid.save()

    return serviceRequirement
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('delete', serviceRequirement)

    await serviceRequirement.delete()

    return serviceRequirement
  }
}
