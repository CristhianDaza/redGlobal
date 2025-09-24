import { ref, computed } from 'vue'
import { missionVisionFirebase } from '@/services/firebase/missionVisionFirebase'
import { uploadImage } from '@/config/cloudinary'
import { useUserStore } from '@/store'
import { NotificationService } from '@/components/Notification/NotificationService'
import { useGlobalMissionVision } from '@/composable/useGlobalMissionVision'

const isLoading = ref(false)
const isUploading = ref(false)

export const useMissionVisionAdmin = () => {
  const userStore = useUserStore()
  const { 
    missionImage, 
    visionImage, 
    hasMissionImage, 
    hasVisionImage, 
    loadMissionVisionImages: globalLoad,
    notifyImageUpdated,
    notifyImageDeleted
  } = useGlobalMissionVision()

  const getCurrentUserName = () => {
    return userStore.users.find(u => u.email === userStore.users[0]?.email)?.name || 'Admin'
  }

  const loadMissionVisionImages = async () => {
    isLoading.value = true
    try {
      await globalLoad()
    } catch (error) {
      console.error('Error loading mission vision images:', error)
      NotificationService.push({
        title: 'Error',
        description: 'Error al cargar las imágenes de misión y visión',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const uploadMissionVisionImage = async (file: File, type: 'mission' | 'vision') => {
    if (!file.type.startsWith('image/')) {
      NotificationService.push({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        type: 'error'
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      NotificationService.push({
        title: 'Error',
        description: 'El archivo no puede ser mayor a 10MB',
        type: 'error'
      })
      return
    }

    isUploading.value = true
    try {
      const uploadResult = await uploadImage(file)
      const imageUrl = typeof uploadResult === 'string' ? uploadResult : uploadResult.secure_url
      const userName = getCurrentUserName()
      
      await missionVisionFirebase.setMissionVisionImage(type, imageUrl, userName)
      await notifyImageUpdated(type)

      NotificationService.push({
        title: 'Éxito',
        description: `Imagen de ${type === 'mission' ? 'misión' : 'visión'} actualizada correctamente`,
        type: 'success'
      })
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error)
      NotificationService.push({
        title: 'Error',
        description: `Error al subir la imagen de ${type === 'mission' ? 'misión' : 'visión'}`,
        type: 'error'
      })
    } finally {
      isUploading.value = false
    }
  }

  const deleteMissionVisionImage = async (type: 'mission' | 'vision') => {
    isLoading.value = true
    try {
      await missionVisionFirebase.deleteMissionVisionImage(type)
      notifyImageDeleted(type)

      NotificationService.push({
        title: 'Éxito',
        description: `Imagen de ${type === 'mission' ? 'misión' : 'visión'} eliminada correctamente`,
        type: 'success'
      })
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error)
      NotificationService.push({
        title: 'Error',
        description: `Error al eliminar la imagen de ${type === 'mission' ? 'misión' : 'visión'}`,
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    missionImage,
    visionImage,
    isLoading: computed(() => isLoading.value),
    isUploading: computed(() => isUploading.value),
    hasMissionImage,
    hasVisionImage,
    loadMissionVisionImages,
    uploadMissionVisionImage,
    deleteMissionVisionImage
  }
}
