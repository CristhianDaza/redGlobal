import type { Advisor } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useAdvisorsStore } from '@/store/useAdvisorsStore'

export function useAdvisorsAdmin() {
  const advisorsStore = useAdvisorsStore()
  const isLoadingAdvisor = ref(false)
  const showAdvisorModal = ref(false)
  const editingAdvisor = ref<Advisor | undefined>(undefined)

  const advisors = computed(() => advisorsStore.advisors as unknown as Advisor[])

  const loadAdvisors = async () => {
    isLoadingAdvisor.value = true
    await advisorsStore.getAdvisors()
    isLoadingAdvisor.value = false
  }

  const handleAddAdvisor = () => {
    editingAdvisor.value = undefined
    showAdvisorModal.value = true
  }

  const handleEditAdvisor = (advisor: Advisor) => {
    editingAdvisor.value = advisor;
    showAdvisorModal.value = true;
  }

  const handleSaveAdvisor = async (advisorData: Advisor) => {
    try {
      isLoadingAdvisor.value = true;
      if (editingAdvisor.value) {
        await advisorsStore.updateAdvisor(editingAdvisor.value.id, advisorData);
      } else {
        await advisorsStore.createAdvisor(advisorData);
      }
      showAdvisorModal.value = false;
      editingAdvisor.value = undefined;
    } catch (error) {
      console.error('Error saving advisor:', error);
    } finally {
      isLoadingAdvisor.value = false;
    }
  }

  const deleteAdvisor = async (id: string) => {
    try {
      isLoadingAdvisor.value = true;
      await advisorsStore.deleteAdvisor(id);
      await loadAdvisors();
    } catch (error) {
      console.error('Error deleting advisor:', error);
    } finally {
      isLoadingAdvisor.value = false;
    }
  }

  return {
    isLoadingAdvisor,
    showAdvisorModal,
    editingAdvisor,
    advisors,
    loadAdvisors,
    handleAddAdvisor,
    handleEditAdvisor,
    handleSaveAdvisor,
    deleteAdvisor
  }
}
