import type { UploadApiResponse } from '@/types/config.d'
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { NotificationService } from '@/components/Notification/NotificationService';

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const uploadImage = async (file: File): Promise<UploadApiResponse> => {
  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

    if (!file.type.startsWith('image/')) {
      NotificationService.push({
        title: 'Error al subir la imagen',
        description: 'El archivo no es una imagen válida.',
        type: 'error'
      })
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      NotificationService.push({
        title: 'Error al subir la imagen',
        description: response.statusText,
        type: 'error'
      })
      console.error('Error uploading image:', response.statusText)
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      NotificationService.push({
        title: 'Error al subir la imagen',
        description: error.message,
        type: 'error'
      })
      console.error('Error uploading image:', error.message)
      throw error
    } else {
      NotificationService.push({
        title: 'Error al subir la imagen',
        description: 'Error desconocido al subir la imagen',
        type: 'error'
      })
      console.error('Unknown error uploading image:', error)
      throw new Error('Unknown error uploading image')
    }
  }
}

export const getOptimizedImageUrl = (publicId: string) => {
  return cld
    .image(publicId)
    .delivery(format('auto'))
    .delivery(quality(auto()))
    .toURL()
}

export const getTransformedImageUrl = (publicId: string, width = 500, height = 500) => {
  return cld
    .image(publicId)
    .resize(fill().width(width).height(height))
    .delivery(format('auto'))
    .delivery(quality(auto()))
    .toURL()
}

export default cld
