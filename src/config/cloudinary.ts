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

const uploadPDFAsImage = async (file: File, uploadPreset: string, cloudName: string): Promise<UploadApiResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('public_id', `privacy-policy-${Date.now()}`)

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload PDF to Cloudinary')
  }

  return data
}

export const uploadPDF = async (file: File): Promise<UploadApiResponse> => {
  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PDF_UPLOAD_PRESET || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

    if (file.type !== 'application/pdf') {
      throw new Error('El archivo debe ser un PDF válido.')
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('El archivo no puede ser mayor a 10MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('public_id', `privacy-policy-${Date.now()}`) 

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary raw upload failed:', data)
      
      return await uploadPDFAsImage(file, uploadPreset, cloudName)
    }

    console.log('Cloudinary upload success:', {
      public_id: data.public_id,
      secure_url: data.secure_url,
      resource_type: data.resource_type,
      format: data.format
    })

    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error uploading PDF:', error.message)
      throw error
    } else {
      console.error('Unknown error uploading PDF:', error)
      throw new Error('Error desconocido al subir el PDF')
    }
  }
}

export const deletePDF = async (publicId: string): Promise<void> => {
  try {
    console.warn('PDF deletion should be handled from backend for security reasons')
  } catch (error) {
    console.error('Error deleting PDF:', error)
    throw error
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
