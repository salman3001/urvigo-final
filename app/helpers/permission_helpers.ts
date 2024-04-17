import User from '#models/user'
import { userTypes } from './enums.js'

export const hasPermission = async (user: User, permission: string) => {
  await user.load('role')
  if (user?.role) {
    if (user?.role?.name === 'Super Admin') {
      return true
    }

    if (user?.role?.isActive === false) {
      return false
    }

    if ((user.role?.permissions as string[])?.includes(permission)) {
      return true
    }
    return false
  }
}

export const isAdmin = (user: User) => {
  if (user.userType === userTypes.ADMIN) {
    return true
  } else {
    false
  }
}

export const isVendor = (user: User) => {
  if (user.userType === userTypes.VENDER) {
    return true
  } else {
    false
  }
}

export const isUser = (user: User) => {
  if (user.userType === userTypes.USER) {
    return true
  } else {
    false
  }
}
