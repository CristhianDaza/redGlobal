import type { MenuItem } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const menusFirebase = {
  async getMenu(): Promise<MenuItem[]> {
    const docRef = await getDocs(collection(db, 'menu'))
    const menu = docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as MenuItem[]
    return menu.sort((a, b) => a.order - b.order)
  },

  async createMenuItem(menuItem: MenuItem): Promise<void> {
    const { id, ...menuData } = menuItem
    await addDoc(collection(db, 'menu'), menuData)
  },

  async updateMenuItem(menuItem: MenuItem): Promise<void> {
    const { id, ...menuData } = menuItem
    const menuRef = doc(db, 'menu', id)
    await updateDoc(menuRef, menuData)
  },

  async deleteMenuItem(id: string): Promise<void> {
    const menuRef = doc(db, 'menu', id)
    await deleteDoc(menuRef)
  },
}
