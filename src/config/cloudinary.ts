import type { UploadApiResponse } from '@/types/config.d'
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const uploadImage = async (file: File): Promise<UploadApiResponse> => {
  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

    if (!uploadPreset) {
      throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET no está configurado')
    }

    if (!cloudName) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME no está configurado')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
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
      throw new Error(
        data.error?.message ||
        `Error al subir la imagen: ${response.status} ${response.statusText}`
      )
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Error desconocido al subir la imagen')
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
