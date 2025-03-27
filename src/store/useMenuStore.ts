import type { MenuItem, MenuState } from '../types/common'
import { defineStore } from 'pinia'
import { firebaseService } from '../services/firebaseService'

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menu: null,
    isLoadingMenu: false,
    lastUpdateMenu: null,
  }),

  actions: {
    async getMenu(): Promise<void> {
      try {
        const shouldUpdate = await this.shouldUpdateMenu()
        if (!shouldUpdate) {
          this.menu = this.getMenuFromLocalStorage()
          return
        }
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
        await firebaseService.createMenuItem(menuItem)
        await this.getMenu() // Refresh menu after creation
      } catch (error) {
        console.error('Error creating menu item:', error)
      }
    },

    async updateMenuItem(menuItem: MenuItem): Promise<void> {
      try {
        await firebaseService.updateMenuItem(menuItem)
        await this.getMenu() // Refresh menu after update
      } catch (error) {
        console.error('Error updating menu item:', error)
      }
    },

    shouldUpdateMenu(): Promise<boolean> {
      const lastUpdate = localStorage.getItem('lastMenuUpdate')
      if (!lastUpdate) return Promise.resolve(true)

      const lastUpdateDate = new Date(lastUpdate)
      const currentDate = new Date()
      const diffInHours = (currentDate.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60)

      return Promise.resolve(diffInHours >= 24)
    },

    getMenuFromLocalStorage(): MenuItem[] | null {
      const menuData = localStorage.getItem('menuData')
      return menuData ? JSON.parse(menuData) : null
    },

    saveMenuToLocalStorage(menu: MenuItem[]): void {
      localStorage.setItem('menuData', JSON.stringify(menu))
      localStorage.setItem('lastMenuUpdate', new Date().toISOString())
    }
  },

  getters: {
    getMenuItems(): MenuItem[] {
      return this.menu || []
    },

    isLoading(): boolean {
      return this.isLoadingMenu
    }
  }
})
