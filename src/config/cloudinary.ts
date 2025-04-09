import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';

// Interfaz para la respuesta de la API de Cloudinary
export interface UploadApiResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

// Configuración de Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

// Función para subir imágenes
export const uploadImage = async (file: File): Promise<UploadApiResponse> => {
  try {
    // Verificar las variables de entorno
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

    if (!uploadPreset) {
      throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET no está configurado')
    }

    if (!cloudName) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME no está configurado')
    }

    // Verificar el archivo
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

// Función para optimizar URLs de imágenes
export const getOptimizedImageUrl = (publicId: string) => {
  return cld
    .image(publicId)
    .delivery(format('auto'))
    .delivery(quality(auto()))
    .toURL()
}

// Función para transformar imágenes
export const getTransformedImageUrl = (publicId: string, width = 500, height = 500) => {
  return cld
    .image(publicId)
    .resize(fill().width(width).height(height))
    .delivery(format('auto'))
    .delivery(quality(auto()))
    .toURL()
}

export default cld
