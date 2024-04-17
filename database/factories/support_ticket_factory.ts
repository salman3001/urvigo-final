import { TicketStatus } from '#helpers/enums'
import SupportTicket from '#models/support_ticket'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(SupportTicket, ({ faker }) => {
  return {
    subject: faker.lorem.lines(1),
    status: TicketStatus.OPEN,
    userId: faker.number.int({ min: 1, max: 5 }),
  }
}).build()
