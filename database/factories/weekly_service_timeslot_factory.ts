import factory from '@adonisjs/lucid/factories'
import WeeklyServiceTimeslot from '#models/timeslot'

export const WeeklyServiceTimeslotFactory = factory
  .define(WeeklyServiceTimeslot, async ({ faker }) => {
    return {
      startTime: '11:00',
      endTime: '14:00',
      weekDay: faker.number.int({ min: 1, max: 7 }),
    }
  })
  .build()
