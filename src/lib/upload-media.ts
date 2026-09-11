import { uploadProductMedia } from '@/services/upload-service'
import { usingBackendApi } from '@/services'
import { ServiceError } from '@/services/http'

export type StoredMedia = {
  url: string
  r2Key?: string
  type: 'image' | 'video'
}

async function filesToDataUrls(files: FileList | File[], type: 'image' | 'video') {
  const filtered = Array.from(files).filter((file) =>
    type === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/'),
  )

  return Promise.all(
    filtered.map(
      (file) =>
        new Promise<StoredMedia>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({ url: String(reader.result), type })
          reader.onerror = () => reject(new Error(`Unable to read ${type}`))
          reader.readAsDataURL(file)
        }),
    ),
  )
}

export async function storeMediaFiles(
  files: FileList | File[],
  type: 'image' | 'video',
): Promise<StoredMedia[]> {
  const list = Array.from(files).filter((file) =>
    type === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/'),
  )

  if (list.length === 0) {
    return []
  }

  if (usingBackendApi) {
    try {
      return await Promise.all(
        list.map(async (file) => {
          const result = await uploadProductMedia(file, type)
          return { url: result.url, r2Key: result.r2Key, type }
        }),
      )
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error
      }
      throw new ServiceError('Upload failed.', 500, 'UPLOAD_FAILED')
    }
  }

  return filesToDataUrls(list, type)
}

export function storedMediaFromUrl(url: string, type: 'image' | 'video'): StoredMedia {
  return { url, type }
}
