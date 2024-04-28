export function findObjectAndMoveToIndex0(
  array: Record<string, any>[],
  object: Record<string, any>,
  arrayObjectKeyToMatch: string,
  objectKeyToMatch: string
) {
  let newArray = array.slice()
  // Check if the object exists in the array
  let index = newArray.findIndex((item) => item[arrayObjectKeyToMatch] === object[objectKeyToMatch])

  // If object found, move it to index 0
  if (index !== -1) {
    // Remove the object from its current position
    let removedItem = newArray.splice(index, 1)[0]
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

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0
}
