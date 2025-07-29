import type { HeroImage } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useHeroStore } from '@/store'

export function useHeroAdmin() {
    const heroStore = useHeroStore()
    const isLoadingHero = ref(false)
    const showHeroModal = ref(false)
    const editingHero = ref<HeroImage | undefined>(undefined)

    const hero = computed(() => heroStore.hero as unknown as HeroImage[])

    const loadHero = async () => {
        isLoadingHero.value = true
        await heroStore.getHero()
        isLoadingHero.value = false
    }

    const handleAddHero = () => {
        editingHero.value = undefined
        showHeroModal.value = true
    }

    const handleEditHero = (hero: HeroImage) => {
        editingHero.value = hero;
        showHeroModal.value = true;
    }

    const handleSaveHero = async (heroData: HeroImage) => {
        try {
            isLoadingHero.value = true;
            if (editingHero.value) {
                await heroStore.updateHero(editingHero.value.id, heroData);
            } else {
                await heroStore.createHero(heroData);
            }
            showHeroModal.value = false;
            editingHero.value = undefined;
        } catch (error) {
            console.error('Error saving hero:', error);
        } finally {
            isLoadingHero.value = false;
        }
    }

    const deleteHero = async (id: string) => {
        try {
            isLoadingHero.value = true;
            await heroStore.deleteHero(id);
            await loadHero();
        } catch (error) {
            console.error('Error deleting hero:', error);
        } finally {
            isLoadingHero.value = false;
        }
    }


    return {
        isLoadingHero,
        showHeroModal,
        editingHero,
        hero,
        loadHero,
        handleAddHero,
        handleEditHero,
        handleSaveHero,
        deleteHero
    }
}
