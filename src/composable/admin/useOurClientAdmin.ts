import type { OurClients } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useOurClientsStore } from '@/store'

export function useOurClientAdmin() {
  const ourClientStore = useOurClientsStore()
  const isLoadingOurClients = ref(false)
  const showOurClientsModal = ref(false)
  const editingOurClient = ref<OurClients | undefined>(undefined)

  const ourClients = computed(() => ourClientStore.ourClients as unknown as OurClients[])

  const loadOurClients = async () => {
    isLoadingOurClients.value = true
    await ourClientStore.getOurClients()
    isLoadingOurClients.value = false
  }

  const handleAddOurClient = () => {
    editingOurClient.value = undefined
    showOurClientsModal.value = true
  }

  const handleEditOurClient = (ourClient: OurClients) => {
    editingOurClient.value = ourClient;
    showOurClientsModal.value = true;
  }

  const handleSaveOurClient = async (ourClientData: OurClients) => {
    try {
      isLoadingOurClients.value = true;
      if (editingOurClient.value) {
        await ourClientStore.updateOurClient(editingOurClient.value.id, ourClientData);
      } else {
        await ourClientStore.createOurClient(ourClientData);
      }
      showOurClientsModal.value = false;
      editingOurClient.value = undefined;
    } catch (error) {
      console.error('Error saving our client:', error);
    } finally {
      isLoadingOurClients.value = false;
    }
  }

  const deleteOurClient = async (id: string) => {
    try {
      isLoadingOurClients.value = true;
      await ourClientStore.deleteOurClient(id);
      await loadOurClients();
    } catch (error) {
      console.error('Error deleting our client:', error);
    } finally {
      isLoadingOurClients.value = false;
    }
  }


  return {
    isLoadingOurClients,
    showOurClientsModal,
    editingOurClient,
    ourClients,
    loadOurClients,
    handleAddOurClient,
    handleEditOurClient,
    handleSaveOurClient,
    deleteOurClient
  }
}
