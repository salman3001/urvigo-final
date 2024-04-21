import { promises as fsPromises, constants } from 'node:fs'

const directoryPath = 'build'

// Check if the directory exists
async function checkAndDeleteDirectory(path) {
  try {
    await fsPromises.access(path, constants.F_OK)
    // Directory exists, so delete it
    await fsPromises.rm(path, { recursive: true })
    console.log('Directory deleted successfully')
  } catch (err) {
    console.error('Error:', err.code === 'ENOENT' ? 'Directory does not exist' : err.message)
  }
}

checkAndDeleteDirectory(directoryPath)
