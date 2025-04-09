import type { MenuItem, MenuState } from '../types/common'
import { defineStore } from 'pinia'
import { firebaseService } from '../services/firebaseService'

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
        console.error('Error in getMenu:', error)
        this.isLoadingMenu = false
      }
    },

    async createMenuItem(menuItem: MenuItem): Promise<void> {
      try {
        const { name, ...menuData } = menuItem
        // Si el path está vacío pero hay un name, usar el name como path
        if (!menuData.path && name) {
          menuData.path = name
        }
        await firebaseService.createMenuItem(menuData as MenuItem)
        await this.getMenu() // Refresh menu and localStorage after creation
      } catch (error) {
        console.error('Error creating menu item:', error)
      }
    },

    async updateMenuItem(menuItem: MenuItem): Promise<void> {
      try {
        await firebaseService.updateMenuItem(menuItem)
        await this.getMenu() // Refresh menu and localStorage after update
      } catch (error) {
        console.error('Error updating menu item:', error)
      }
    },

    async deleteMenuItem(id: string): Promise<void> {
      try {
        await firebaseService.deleteMenuItem(id)
        await this.getMenu() // Refresh menu and localStorage after deletion
      } catch (error) {
        console.error('Error deleting menu item:', error)
      }
    },

    shouldUpdateMenu(): Promise<boolean> {
      return Promise.resolve(true) // Siempre actualizar desde Firebase
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
