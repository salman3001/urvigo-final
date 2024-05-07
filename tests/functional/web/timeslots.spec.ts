import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Web timeslots', (group) => {
  group.each.setup(() => testUtils.db().truncate())
  // test('get avaialable timeslots', async ({ assert }) => {})
})
