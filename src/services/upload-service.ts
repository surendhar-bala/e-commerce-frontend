import { apiEndpoints } from '@/lib/api-endpoints'
import { getAccessToken, getApiBaseUrl, ServiceError } from '@/services/http'

export type UploadResult = {
  url: string
  r2Key: string
  fileName: string
  mediaType: 'image' | 'video'
}

export async function uploadProductMedia(file: File, mediaType: 'image' | 'video'): Promise<UploadResult> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    throw new ServiceError('Upload requires the backend API.', 503, 'BACKEND_UNAVAILABLE')
  }

  const formData = new FormData()
  formData.append('file', file)

  const token = getAccessToken()
  const response = await fetch(`${baseUrl}${apiEndpoints.upload}?type=${mediaType}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string; code?: string }
    throw new ServiceError(
      body.message ?? `Upload failed with status ${response.status}`,
      response.status,
      body.code ?? 'UPLOAD_FAILED',
    )
  }

  return (await response.json()) as UploadResult
}
