import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TimeslotPlanService from '#services/timeslot_plan_service'

@inject()
export default class ApiTimeslotController {
  constructor(protected timeSlotService: TimeslotPlanService) {}

  async index({ response }: HttpContext) {
    const plans = await this.timeSlotService.index()
    return response.custom({
      code: 200,
      data: plans,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const plan = await this.timeSlotService.store()
    return response.custom({
      code: 200,
      data: plan,
      message: 'Plan Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const plan = await this.timeSlotService.update()
    return response.custom({
      code: 200,
      data: plan,
      message: 'Plan Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const plan = await this.timeSlotService.destroy()
    return response.custom({
      code: 200,
      data: plan,
      message: 'Plan Deleted',
      success: true,
    })
  }
}
