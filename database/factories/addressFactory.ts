import Address from '#models/address'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Address, ({ faker }) => {
  return {
    address: faker.lorem.lines(1),
    geoLocation: `${faker.location.longitude()},${faker.location.latitude()}`,
  }
}).build()
