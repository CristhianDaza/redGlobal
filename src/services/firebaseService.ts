import type { ProductsRedGlobal, MenuItem, User } from '../types/common'

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { db } from '../config/firebase'

export const firebaseService = {
  // Métodos para usuarios
  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]
      
      if (users.length === 0) {
        // Si no hay usuarios y hay un usuario autenticado, crearlo
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (currentUser) {
          // Generar una contraseña temporal única
          const tempPassword = `Admin${Date.now().toString(36)}`
          
          const newUser = {
            name: currentUser.displayName || 'Admin',
            email: currentUser.email || '',
            primaryColor: '#ff4444',
            secondaryColor: '#ff4444',
            priceIncrease: 0,
            password: tempPassword
          }
          await this.createUser(newUser)
          return await this.getUsers()
        }
      }
      
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<void> {
    try {
      // Crear usuario en Authentication
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)

      // Crear usuario en Firestore
      const usersRef = collection(db, 'users')
      const now = new Date().toISOString()
      const { password, ...userData } = user // Excluir la contraseña de los datos a guardar
      await addDoc(usersRef, {
        ...userData,
        createdAt: now,
        updatedAt: now,
        uid: userCredential.user.uid // Guardar el UID del usuario autenticado
      })
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', id)
      await updateDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', id)
      await deleteDoc(userRef)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },
  async saveProducts(allProducts: ProductsRedGlobal[]): Promise<void> {
    const batchSize = 500
    await this.deleteAllProducts()
    
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize).map(product => {
        return JSON.parse(JSON.stringify(product, (_key, value) =>
          value === undefined ? null : value
        ))
      })
      await addDoc(collection(db, 'productsRedGlobal'), { products: batch })
    }
    await this.updateLastUpdate()
  },

  async getAllProducts(): Promise<ProductsRedGlobal[]> {
    const docRef = await getDocs(collection(db, 'productsRedGlobal'))
    const allProducts = docRef.docs.flatMap(doc => {
      const data = doc.data()
      return data.products || []
    })
    return allProducts.sort((a, b) => a.name.localeCompare(b.name))
  },

  async getLastUpdate(): Promise<Date | null> {
    const stored = localStorage.getItem('lastUpdate')
    if (stored) {
      return new Date(stored)
    } else {
      const querySnapshot = await getDocs(collection(db, 'lastedUpdatedProducts'))
      if (querySnapshot.empty) return null
      const data = querySnapshot.docs[0].data()
      const lastUpdate = new Date(data.lastUpdate)
      localStorage.setItem('lastUpdate', lastUpdate.toISOString())
      return lastUpdate
    }
  },

  async updateLastUpdate(): Promise<void> {
    try {
      await addDoc(collection(db, 'lastedUpdatedProducts'), { 
        lastUpdate: new Date().toISOString() 
      })
    } catch (error) {
      console.error('Error updating last update:', error)
      throw error
    }
  },

  async deleteAllProducts(): Promise<void> {
    try {
      const productsRef = await getDocs(collection(db, 'productsRedGlobal'))
      const lastUpdateRef = await getDocs(collection(db, 'lastedUpdatedProducts'))
      
      const deleteLastUpdate = lastUpdateRef.docs.map(document => 
        deleteDoc(doc(db, 'lastedUpdatedProducts', document.id))
      )
      
      const deleteProducts = productsRef.docs.map(document => 
        deleteDoc(doc(db, 'productsRedGlobal', document.id))
      )
      
      if (deleteProducts.length === 0 && deleteLastUpdate.length === 0) return
      
      await Promise.all([...deleteProducts, ...deleteLastUpdate])
    } catch (error) {
      console.error('Error deleting products:', error)
      throw error
    }
  },

  async shouldUpdate(): Promise<boolean> {
    const lastUpdate = await this.getLastUpdate()
    if (!lastUpdate) return true
    
    const now = new Date()
    return lastUpdate.getDate() !== now.getDate()
  },

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
  }
}
