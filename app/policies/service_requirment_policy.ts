import ServiceRequirement from '#models/service_requirement'
import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class ServiceRequirmentPolicy extends BasePolicy {
  async myList(user: User) {
    if (user instanceof User) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  async viewList() {
    return true
  }

  @action({ allowGuest: true })
  async view() {
    return true
  }

  async create(user: User) {
    if (user instanceof User) {
      return true
    } else {
      false
    }
  }

  async update(user: User, serviceRequirement: ServiceRequirement) {
    if (user instanceof User && serviceRequirement.userId === user.id) {
      return true
    } else {
      return false
    }
  }

  async delete(user: User, serviceRequirement: ServiceRequirement) {
    if (user instanceof User && serviceRequirement.userId === user.id) {
      return true
    } else {
      return false
    }
  }
}
