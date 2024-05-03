import { BasePolicy } from '@adonisjs/bouncer'

export default class AddressPolicy extends BasePolicy {
  async viewList() {
    return true
  }

  async view() {
    return true
  }

  async create() {
    return true
  }
  async update() {
    return true
  }
  async delete() {
    return true
  }
}
