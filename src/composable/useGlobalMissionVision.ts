import { ref, computed } from 'vue'
import type { MissionVisionImage } from '@/types/common.d'
import { missionVisionFirebase } from '@/services/firebase/missionVisionFirebase'

const missionImage = ref<MissionVisionImage | null>(null)
const visionImage = ref<MissionVisionImage | null>(null)
const isLoading = ref(false)

export const useGlobalMissionVision = () => {
  const loadMissionVisionImages = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const [mission, vision] = await Promise.all([
        missionVisionFirebase.getMissionVisionImageByType('mission'),
        missionVisionFirebase.getMissionVisionImageByType('vision')
      ])
      
      missionImage.value = mission
      visionImage.value = vision
    } catch (error) {
      console.error('Error loading mission vision images:', error)
    } finally {
      isLoading.value = false
    }
  }

  const notifyImageUpdated = async (type: 'mission' | 'vision') => {
    try {
      const updatedImage = await missionVisionFirebase.getMissionVisionImageByType(type)
      if (type === 'mission') {
        missionImage.value = updatedImage
      } else {
        visionImage.value = updatedImage
      }
    } catch (error) {
      console.error(`Error updating ${type} image:`, error)
    }
  }

  const notifyImageDeleted = (type: 'mission' | 'vision') => {
    if (type === 'mission') {
      missionImage.value = null
    } else {
      visionImage.value = null
    }
  }

  return {
    missionImage: computed(() => missionImage.value),
    visionImage: computed(() => visionImage.value),
    isLoading: computed(() => isLoading.value),
    hasMissionImage: computed(() => !!missionImage.value),
    hasVisionImage: computed(() => !!visionImage.value),
    loadMissionVisionImages,
    notifyImageUpdated,
    notifyImageDeleted
  }
}
