import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { paginate } from '../helpers/common.js'
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
    const dateToCheck = params.date
    const slots = [] as any[]

    const getNormalSlots = () => {
      plan.options.map((o) => {
        const fromDateTime = DateTime.fromFormat(`${dateToCheck} ${o.from}`, 'dd/MM/yyyy HH:mm')
        const toDateTime = DateTime.fromFormat(`${dateToCheck} ${o.to}`, 'dd/MM/yyyy HH:mm')
        slots.push({
          from: fromDateTime,
          to: toDateTime,
        })
      })
    }

    const plan = await TimeslotPlan.findOrFail(+params.id)
    if (plan.limitToOneBooking) {
      plan.load('bookedTimeslots', (b) => {
        b.where('start_time', dateToCheck)
      })

      if (plan.bookedTimeslots.length < 1) {
        getNormalSlots()
      } else {
        // itrate over bookedslots > convert to time only >
      }
    } else {
      getNormalSlots()
    }

    return slots
  }
}
