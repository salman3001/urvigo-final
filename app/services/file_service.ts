import commonConfig from '#config/common'
import { ImageType } from '#helpers/types'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

@inject()
export default class FileService {
  constructor(protected ctx: HttpContext) {}

  async uploadeFile(file: MultipartFile, folder: string = '') {
    const buffer = readFileSync(file.tmpPath!)
    return await this.writeFile(folder, buffer, file.extname || '')
  }

  async uploadeImage(file: MultipartFile, folder: string = '') {
    const url = await this.resizeImageAndSave(file, folder)
    const thumbnailUrl = await this.resizeImageAndSave(file, folder, 320, 240)
    return {
      url,
      thumbnailUrl,
    }
  }

  async deleteImage(image: ImageType): Promise<void> {
    await this.deleteFile(image.url)
    await this.deleteFile(image.thumbnailUrl)
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Check if the file exists
    const filePath = path.join(app.makePath(commonConfig.uploadPath), fileUrl)
    if (existsSync(filePath)) {
      // Delete the file
      unlinkSync(filePath)
    }
  }

  async resizeImageAndSave(
    file: MultipartFile,
    folder: string = '',
    width?: number,
    height?: number
  ): Promise<string> {
    // Resize the image
    const resizedBuffer = await sharp(file.tmpPath)
      .resize(width, height, { fit: 'cover' })
      .toFormat('webp')
      .toBuffer()

    return await this.writeFile(folder, resizedBuffer, 'webp')
  }

  async writeFile(folder: string = '', buffer: NodeJS.ArrayBufferView, extName: string) {
    // Ensure the output directory exists
    const url = path.join(folder, Date.now() + cuid() + `.${extName}`)
    const outputDir = path.join(app.makePath(commonConfig.uploadPath), folder)
    const outputPath = path.join(outputDir, url)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write the resized image buffer to the file system
    writeFileSync(outputPath, buffer)

    return path.posix.normalize(url)
  }
}
