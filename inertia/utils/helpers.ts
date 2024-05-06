import { OrderStatus, PaymentMode, PaymentStatus, userTypes } from '#helpers/enums'
import type { CordType } from '#helpers/types'

export function findObjectAndMoveToIndex0(
  array: Record<string, any>[],
  object: Record<string, any>,
  arrayObjectKeyToMatch: string,
  objectKeyToMatch: string
) {
  const newArray = array.slice()
  // Check if the object exists in the array
  const index = newArray.findIndex(
    (item) => item[arrayObjectKeyToMatch] === object[objectKeyToMatch]
  )

  // If object found, move it to index 0
  if (index !== -1) {
    // Remove the object from its current position
    const removedItem = newArray.splice(index, 1)[0]
    // Add the removed item at index 0
    newArray.unshift(removedItem)
  }

  return newArray
}

export function pickKeysFromReference(source: Record<any, any>, reference: Record<any, any>) {
  const result: Record<any, any> = {}
  const referenceKeys = Object.keys(reference)

  // Iterate over the reference keys
  referenceKeys.forEach((key) => {
    // If the key exists in the source object, add it to the result
    if (source.hasOwnProperty(key)) {
      result[key] = source[key]
    }
  })

  return result
}

export const isEmptyObject = (obj: object) => {
  return Object.keys(obj).length === 0
}

export const resolveStatus = (status: OrderStatus) => {
  if (status === OrderStatus.COMPLETED) return { text: 'Completed', color: 'success' }
  if (status === OrderStatus.COMPLETION_REQUESTED)
    return { text: 'Completion Requested', color: 'info' }
  if (status === OrderStatus.PLACED) return { text: 'Placed', color: 'warning' }
  if (status === OrderStatus.CONFIRMED) return { text: 'Confirmed', color: 'info' }
  if (status === OrderStatus.REJECTED) return { text: 'Rejected', color: 'error' }
  if (status === OrderStatus.CANCLED) return { text: 'Canceled', color: 'error' }
}

export const resolvePaymentStatus = (status: PaymentStatus) => {
  if (status === PaymentStatus.PENDING) return { text: 'Pending', color: 'warning' }
  if (status === PaymentStatus.PARTIAL_PAIID) return { text: 'Partial Paid', color: 'info' }
  if (status === PaymentStatus.PAID) return { text: 'Paid', color: 'success' }
  if (status === PaymentStatus.REFUND_REQUESTED)
    return { text: 'Refund Requested', color: 'warning' }
  if (status === PaymentStatus.REFUNDED) return { text: 'Refunded', color: 'success' }
}

export const resolvePaymentMode = (status: PaymentMode) => {
  if (status === PaymentMode.COD) return { text: 'COD', color: 'info' }
  if (status === PaymentMode.ONLINE) return { text: 'Online', color: 'info' }
}

export const resolveUserType = (type: userTypes) => {
  if (type === userTypes.USER) return 'User'
  if (type === userTypes.VENDER) return 'Vendor'
  if (type === userTypes.ADMIN) return 'Admin'
  return ''
}

export const isWithinRadius = (cord1: CordType, cord2: CordType, maxRadius: number) => {
  const toRadiance = (degree: number): number => degree * (Math.PI / 180)
  const { x: lon1, y: lat1 } = cord1
  const { x: lon2, y: lat2 } = cord2

  const lat1Rad = toRadiance(lat1)
  const lon1Rad = toRadiance(lon1)
  const lat2Rad = toRadiance(lat2)
  const lon2Rad = toRadiance(lon2)

  const earthRadiusKm = 6371

  const dLat = lat2Rad - lat1Rad
  const dLon = lon2Rad - lon1Rad

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sign(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceKm = earthRadiusKm * c
  return distanceKm <= maxRadius
}
