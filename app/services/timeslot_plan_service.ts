import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { createDateTime, paginate } from '../helpers/common.js'
import TimeslotPlan from '#models/timeslot_plan'
import { CreateTimeslotValidator, UpdateTimeslotValidator } from '#validators/timeslot'
import { IndexOption } from '#helpers/types'
import { DateTime } from 'luxon'

@inject()
export default class TimeslotPlanService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('TimeslotPlanPolicy').authorize('viewList')
    const user = auth.user!
    const timeSlotQuery = TimeslotPlan.query().where('user_id', user.id)

    const timeSlotplan = opt?.unPaginated
      ? await timeSlotQuery.exec()
      : await paginate(timeSlotQuery, request)

    return timeSlotplan
  }

  async show() {
    const { bouncer, params } = this.ctx

    const id = params.id
    const timeSlotplan = await TimeslotPlan.query().where('id', id).firstOrFail()
    // @ts-ignore
    await bouncer.with('TimeslotPlanPolicy').authorize('view', timeSlotplan)

    return timeSlotplan
  }

  async store() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('TimeslotPlanPolicy').authorize('create')

    const payload = await request.validateUsing(CreateTimeslotValidator)

    const timeslotPlan = await TimeslotPlan.create({ ...payload, userId: auth.user!.id })

    return timeslotPlan
  }

  async update() {
    const { request, bouncer, params } = this.ctx
    const timeslotPlan = await TimeslotPlan.findOrFail(+params.id)
    await bouncer.with('TimeslotPlanPolicy').authorize('update', timeslotPlan)

    const payload = await request.validateUsing(UpdateTimeslotValidator)

    await timeslotPlan.merge(payload).save()

    return timeslotPlan
  }

  async destroy() {
    const { bouncer, params } = this.ctx

    const timeslotPlan = await TimeslotPlan.findOrFail(+params.id)
    await bouncer.with('TimeslotPlanPolicy').authorize('delete', timeslotPlan)

    await timeslotPlan.delete()

    return timeslotPlan
  }

  async getAvailableTimeslots() {
    const { params } = this.ctx
    const year = params.year
    const month = params.month
    const day = params.day

    const plan = await TimeslotPlan.findOrFail(+params.id)

    const requestedDate = DateTime.local(+year, +month, +day, 0, 0, 0, { zone: 'local' })

    const getNormalSlots = () => {
      const normalSlots: Array<{
        from: DateTime<true> | DateTime<false>
        to: DateTime<true> | DateTime<false>
      }> = []
      plan.options.map((o) => {
        const skipHours = plan.skipHours
        const fromDateTime = createDateTime(requestedDate, o.from)
        const toDateTime = createDateTime(requestedDate, o.to)

        if (
          fromDateTime.weekday === Number.parseInt(o.week) &&
          fromDateTime.diffNow('hour').hours > skipHours
        ) {
          normalSlots.push({
            from: fromDateTime,
            to: toDateTime,
          })
        }
      })
      return normalSlots
    }

    if (plan.limitToOneBooking) {
      await plan.load('bookedTimeslots')
      if (plan.bookedTimeslots?.length < 1) {
        return getNormalSlots()
      } else {
        const normalTimeslots = getNormalSlots()
        const slots = normalTimeslots.filter((nt) => {
          let isAvailable = true
          plan.bookedTimeslots.forEach((bt) => {
            if (
              DateTime.fromJSDate(bt.startTime).equals(nt.from) &&
              DateTime.fromJSDate(bt.endTime).equals(nt.to)
            ) {
              isAvailable = false
            }
          })
          return isAvailable
        })

        return slots
      }
    } else {
      return getNormalSlots()
    }
  }
}
