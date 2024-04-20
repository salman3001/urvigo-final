import { paginate } from '#helpers/common'
import Bid from '#models/bid'
import ServiceRequirement from '#models/service_requirement'
import { BidValidator } from '#validators/bid'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'

@inject()
export default class BidService {
  constructor(protected ctx: HttpContext) {}

  async index() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('BidPolicy').authorize('viewList')

    const bidsQuery = Bid.query().where('user_id', auth.user!.id)

    const bids = await paginate<typeof Bid>(bidsQuery, request)

    return bids
  }

  async show() {
    const { bouncer, params } = this.ctx
    const id = params.id
    const bid = await Bid.query().where('id', id).firstOrFail()

    await bouncer.with('BidPolicy').authorize('view', bid)

    return bid
  }

  async store() {
    const { bouncer, request, auth } = this.ctx

    await bouncer.with('BidPolicy').authorize('create')

    const payload = await request.validateUsing(BidValidator)

    const serviceRequirment = await ServiceRequirement.query()
      .where('id', payload.serviceRequirementId)
      .whereHas('recievedBids', (r) => {
        r.whereHas('vendor', (v) => {
          v.where('id', auth.user!.id)
        })
      })
      .first()

    if (serviceRequirment) {
      return 'proposal exist'
    }

    let bid: Bid | null = null

    await db.transaction(async (trx) => {
      bid = await Bid.create({ ...payload, userId: auth.user!.id }, { client: trx })
    })

    if (bid) {
      await (bid as Bid).refresh()
    }

    return bid!
  }

  async update() {
    const { auth, bouncer, request, params } = this.ctx
    const bid = await Bid.findOrFail(+params.id)
    await bouncer.with('BidPolicy').authorize('update', bid)

    const payload = await request.validateUsing(BidValidator)

    await db.transaction(async (trx) => {
      bid.useTransaction(trx)
      bid.merge({ ...payload, userId: auth.user!.id })
      await bid.save()
    })

    await bid.refresh()

    return bid!
  }

  async acceptNegotiation() {
    const { bouncer, request, params } = this.ctx

    const bid = await Bid.findOrFail(+params.id)
    await bouncer.with('BidPolicy').authorize('update', bid)

    const validationSchema = vine.compile(
      vine.object({
        newPrice: vine.number().max(Number(bid.offeredPrice)),
      })
    )

    const payload = await request.validateUsing(validationSchema)

    if (bid.negotiateHistory.length < 1) {
      return 'Negotiation Not Requested'
    }

    const lastNegotiiate = bid.negotiateHistory[bid.negotiateHistory.length - 1]

    bid.negotiateHistory[bid.negotiateHistory.length - 1] = {
      ...lastNegotiiate,
      accepted: true,
    }

    bid.offeredPrice = payload.newPrice

    await bid.save()

    return bid
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const bid = await Bid.findOrFail(+params.id)

    await bouncer.with('BidPolicy').authorize('delete', bid)

    await bid.delete()

    return bid
  }
}
