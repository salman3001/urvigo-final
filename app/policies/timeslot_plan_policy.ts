import { isVendor } from '#helpers/permission_helpers'
import TimeslotPlan from '#models/timeslot_plan'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class TimeslotPlanPolicy extends BasePolicy {
  async viewList(user: User) {
    return isVendor(user) ? true : false
  }

  async view(user: User, timeSlotPlan: TimeslotPlan) {
    if (isVendor(user) && user.id === timeSlotPlan.userId) return true
  }

  async create(user: User) {
    return isVendor(user) ? true : false
  }

  async update(user: User, timeSlotPlan: TimeslotPlan) {
    if (isVendor(user) && user.id === timeSlotPlan.userId) return true
    return false
  }

  async delete(user: User, timeSlotPlan: TimeslotPlan) {
    if (isVendor(user) && user.id === timeSlotPlan.userId) return true
    return false
  }
}
