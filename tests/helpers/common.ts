import { userTypes } from '#helpers/enums'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
const resolveEmail = (type: userTypes) =>
  type === userTypes.USER
    ? 'user@gmail.com'
    : type === userTypes.VENDER
      ? 'vendor@gmail.com'
      : type === userTypes.ADMIN
        ? 'admin@gmail.com'
        : 'null'

export async function createUser(type: userTypes) {
  const user = await User.create({
    firstName: 'salman',
    lastName: 'khan',
    email: resolveEmail(type),
    password: '123456789',
    userType: type,
  })

  return user
}

export const truncateTables = async (tables: string[]) => {
  for (const table of tables) {
    const query = `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`
    await db.rawQuery(query)
  }
}
