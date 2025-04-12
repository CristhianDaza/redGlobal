import type { MenuItem, MenuState } from '@/types/common.d'
import { defineStore } from 'pinia'
import { firebaseService } from '@/services'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menu: [] as MenuItem[],
    isLoadingMenu: false,
    lastUpdateMenu: null as string | null,
  }),

  actions: {
    async getMenu(): Promise<void> {
      try {
        this.isLoadingMenu = true
        const menu = await firebaseService.getMenu()
        this.saveMenuToLocalStorage(menu)
        this.menu = menu
        this.lastUpdateMenu = new Date().toISOString()
        this.isLoadingMenu = false
      } catch (error) {
        NotificationService.push({
          title: 'Error al cargar el menú',
          description: 'Hubo un error al cargar el menú. Por favor, intenta nuevamente.',
          type: 'error'
        })
        console.error('Error in getMenu:', error)
        this.isLoadingMenu = false
      }
    },

    async createMenuItem(menuItem: MenuItem): Promise<void> {
      try {
        const { name, ...menuData } = menuItem
        if (!menuData.path && name) {
          menuData.path = name
        }
        await firebaseService.createMenuItem(menuData as MenuItem)
        NotificationService.push({
          title: 'Menú creado',
          description: 'El menú ha sido creado exitosamente',
          type: 'success'
        })
        await this.getMenu()
      } catch (error) {
        console.error('Error creating menu item:', error)
        NotificationService.push({
          title: 'Error al crear el menú',
          description: 'Hubo un error al crear el menú. Por favor, intenta nuevamente.',
          type: 'error'
        })
      }
    },

    async updateMenuItem(menuItem: MenuItem): Promise<void> {
      try {
        await firebaseService.updateMenuItem(menuItem)
        NotificationService.push({
          title: 'Menú actualizado',
          description: 'El menú ha sido actualizado exitosamente',
          type: 'success'
        })
        await this.getMenu()
      } catch (error) {
        console.error('Error updating menu item:', error)
        NotificationService.push({
          title: 'Error al actualizar el menú',
          description: 'Hubo un error al actualizar el menú. Por favor, intenta nuevamente.',
          type: 'error'
        })
      }
    },

    async deleteMenuItem(id: string): Promise<void> {
      try {
        await firebaseService.deleteMenuItem(id)
        NotificationService.push({
          title: 'Menú eliminado',
          description: 'El menú ha sido eliminado exitosamente',
          type: 'success'
        })
        await this.getMenu()
      } catch (error) {
        console.error('Error deleting menu item:', error)
        NotificationService.push({
          title: 'Error al eliminar el menú',
          description: 'Hubo un error al eliminar el menú. Por favor, intenta nuevamente.',
          type: 'error'
        })
      }
    },

    shouldUpdateMenu(): Promise<boolean> {
      return Promise.resolve(true)
    },

    getMenuFromLocalStorage(): MenuItem[] {
      const menuData = localStorage.getItem('menuData')
      return menuData ? JSON.parse(menuData) : []
    },

    saveMenuToLocalStorage(menu: MenuItem[]): void {
      localStorage.setItem('menuData', JSON.stringify(menu))
      localStorage.setItem('lastMenuUpdate', new Date().toISOString())
    }
  },

  getters: {
    getMenuItems(): MenuItem[] {
      return this.menu
    },

    isLoading(): boolean {
      return this.isLoadingMenu
    }
  }
})
