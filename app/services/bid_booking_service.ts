import { OrderStatus, userTypes } from '#helpers/enums'
import Bid from '#models/bid'
import BidBooking from '#models/bid_booking'
import ServiceRequirement from '#models/service_requirement'
import { BidBookingCreateValidator } from '#validators/bid_booking'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import db from '@adonisjs/lucid/services/db'
import { BigNumber } from 'bignumber.js'
import { DateTime } from 'luxon'
import { IndexOption } from '../helpers/types.js'
import {
  UpdateBookingStatusValidator,
  requestBookingCompletionValidator,
} from '#validators/booking'

@inject()
export default class BidBookingService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    // @ts-ignore
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
    const booking = await BidBooking.query()
      .where('id', id)
      .preload('user')
      .preload('businessProfile', (b) => {
        b.preload('vendor')
      })
      .firstOrFail()

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
          paymentDetail: payload.paymentdetail as any,
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
          addressDetail: payload.addressDetail,
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
    const booking = await BidBooking.findOrFail(+params.id)
    await bouncer.with('BidBookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(UpdateBookingStatusValidator)

    console.log('ran')
    if (payload.status === OrderStatus.CONFIRMED) {
      if (booking.status !== OrderStatus.PLACED) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    if (payload.status === OrderStatus.CANCLED) {
      if (
        booking.status === OrderStatus.REJECTED ||
        booking.status === OrderStatus.COMPLETED ||
        booking.status === OrderStatus.COMPLETION_REQUESTED
      ) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    if (payload.status === OrderStatus.REJECTED) {
      if (
        booking.status === OrderStatus.CANCLED ||
        booking.status === OrderStatus.COMPLETED ||
        booking.status === OrderStatus.COMPLETION_REQUESTED
      ) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    await booking.refresh()

    return booking
  }

  async requestCompletion() {
    const { bouncer, request, params } = this.ctx
    const booking = await BidBooking.findOrFail(+params.id)
    await bouncer.with('BidBookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(requestBookingCompletionValidator)

    if (booking.status === OrderStatus.CONFIRMED) {
      await db.transaction(async (trx) => {
        booking.useTransaction(trx)
        booking.merge({ status: OrderStatus.COMPLETION_REQUESTED })
        booking.history.push({
          date_time: DateTime.now(),
          event: 'Booking completion requested',
          remarks: payload?.remarks || '',
        })
        await booking.save()
      })

      return booking
    } else {
      return 'Invalid Request'
    }
  }

  async acceptBookingCompleted() {
    const { bouncer, request, params } = this.ctx
    const booking = await BidBooking.findOrFail(+params.id)
    await bouncer.with('BidBookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(requestBookingCompletionValidator)

    if (booking.status === OrderStatus.COMPLETION_REQUESTED) {
      await db.transaction(async (trx) => {
        booking.useTransaction(trx)
        booking.merge({ status: OrderStatus.COMPLETED })
        booking.history.push({
          date_time: DateTime.now(),
          event: 'Booking completed',
          remarks: payload?.remarks || '',
        })
        await booking.save()
      })

      return booking
    } else {
      return 'Invalid Request'
    }
  }
}
