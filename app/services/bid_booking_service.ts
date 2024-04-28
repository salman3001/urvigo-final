import { OrderStatus, userTypes } from '#helpers/enums'
import Bid from '#models/bid'
import BidBooking from '#models/bid_booking'
import ServiceRequirement from '#models/service_requirement'
import { BidBookingCreateValidator } from '#validators/bid_booking'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { BigNumber } from 'bignumber.js'
import { DateTime } from 'luxon'
import { IndexOption } from '../helpers/types.js'

@inject()
export default class BidBookingService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('BidBookingPolicy').authorize('viewList')
    const bookingQuery = BidBooking.query()
      .preload('user', (u) => {
        u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })
      .preload('businessProfile', (b) => {
        b.preload('vendor', (v) => {
          v.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
            p.select(['avatar'])
          })
        })
      })

    !opt?.disableFilter && bookingQuery.filter(request.qs())

    return await bookingQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
  }

  async myList() {
    const { bouncer, auth, request } = this.ctx
    await bouncer.with('BidBookingPolicy').authorize('myList')

    const user = auth.user!

    const bookingQuery = BidBooking.query()

    if (user.userType === userTypes.USER) {
      bookingQuery.where('user_id', user.id).preload('businessProfile', (b) => {
        b.preload('vendor', (u) => {
          u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
            p.select(['avatar'])
          })
        })
      })
    }

    if (user.userType === userTypes.VENDER) {
      bookingQuery.whereHas('businessProfile', (b) => {
        b.whereHas('vendor', (u) => {
          u.where('user_id', user.id)
            .select(['id', 'first_name', 'last_name'])
            .preload('profile', (p) => {
              p.select(['avatar'])
            })
        })
      })
    }

    return await bookingQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
  }

  async show() {
    const { bouncer, params } = this.ctx
    const id = params.id
    const booking = await BidBooking.query().where('id', id).firstOrFail()

    await bouncer.with('BidBookingPolicy').authorize('view', booking)

    return booking
  }

  async store() {
    const { bouncer, request, auth } = this.ctx
    await bouncer.with('BidBookingPolicy').authorize('create')

    const payload = await request.validateUsing(BidBookingCreateValidator)

    const serviceRequirement = await ServiceRequirement.findOrFail(payload.serviceRequirementId)

    const bid = await Bid.findOrFail(payload.acceptedBidId)
    await bid.load('vendor', (v) => {
      v.select('id').preload('businessProfile').select('id')
    })

    const price = new BigNumber(bid.offeredPrice).times(payload.qty)

    let bidBooking: BidBooking | null = null

    await db.transaction(async (trx) => {
      bidBooking = await BidBooking.create(
        {
          price: price.toFixed(2),
          qty: payload.qty,
          status: OrderStatus.PLACED,
          userId: auth.user?.id,
          businessProfileId: bid.vendor.businessProfile.id,
          paymentDetail: payload.paymentdetail,
          history: [
            {
              date_time: DateTime.now(),
              event: 'Order Placed',
              remarks: '',
            },
          ],
          bookingDetail: {
            serviceRequirement: {
              id: serviceRequirement.id,
              title: serviceRequirement.title,
              desc: serviceRequirement.desc,
              budgetUnit: serviceRequirement.budgetUnit,
              budget: serviceRequirement.budget,
            },
            acceptedBid: {
              id: bid.id,
              offeredPrice: bid.offeredPrice,
            },
          },
        },
        { client: trx }
      )

      serviceRequirement.useTransaction(trx)
      serviceRequirement.acceptedBidId = bid.id
      await serviceRequirement.save()
    })

    await bidBooking!?.refresh()

    return bidBooking!
  }

  async updateStatus() {
    const { bouncer, request, params } = this.ctx
    const bidBooking = await BidBooking.findOrFail(+params.id)

    await bouncer.with('BidBookingPolicy').authorize('update', bidBooking)

    const validationSchema = vine.compile(
      vine.object({
        status: vine.enum(Object.values(OrderStatus)),
        remarks: vine.string().optional(),
      })
    )

    const payload = await request.validateUsing(validationSchema)

    bidBooking.merge({ status: payload.status })
    bidBooking.history.push({
      date_time: DateTime.now(),
      event: `Booking ${payload.status}`,
      remarks: payload?.remarks || '',
    })

    await bidBooking.save()

    return bidBooking
  }
}
