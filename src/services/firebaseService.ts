import type { ProductsRedGlobal, MenuItem, User, UserFormData, Quote } from '../types/common.d'
import { UserRole } from '../types/common.d'

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
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
          try {
            // Primero verificar si ya existe un documento para este usuario
            const userQuery = await getDocs(
              query(collection(db, 'users'), 
                where('email', '==', currentUser.email))
            )
            
            if (userQuery.empty) {
              // El usuario no existe en Firestore, crearlo
              const now = new Date().toISOString()
              await addDoc(collection(db, 'users'), {
                id: currentUser.uid,
                name: currentUser.displayName || 'Admin',
                email: currentUser.email,
                primaryColor: '#ff4444',
                secondaryColor: '#ff4444',
                priceIncrease: 0,
                active: true,
                role: UserRole.ADMIN,
                createdAt: now,
                updatedAt: now
              })
              
              // Obtener la lista actualizada
              return await this.getUsers()
            }
          } catch (error) {
            console.error('Error creating initial user:', error)
          }
        }
      }
      
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  },

  async createUser(user: UserFormData): Promise<void> {
    try {
      // Validar datos requeridos
      if (!user.email || !user.password) {
        throw new Error('El email y la contraseña son requeridos')
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(user.email)) {
        throw new Error('El formato del email no es válido')
      }

      // Validar longitud de contraseña
      if (user.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      // Crear usuario en Authentication
      const auth = getAuth()
      let userCredential
      try {
        userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('El email ya está registrado. Por favor, usa otro email.')
        }
        throw error
      }

      // Crear usuario en Firestore
      const usersRef = collection(db, 'users')
      const now = new Date().toISOString()
      const { password, logo, ...userData } = user // Excluir la contraseña y el logo (File) de los datos a guardar
      
      try {
        await addDoc(usersRef, {
          ...userData,
          id: userCredential.user.uid,
          logo: user.logo, // Asegurar que se guarde la URL del logo
          createdAt: now,
          updatedAt: now,
          role: userData.role || UserRole.CLIENT, // Si no se especifica rol, será cliente
          active: true // Asegurar que el usuario se crea activo
        })
      } catch (error) {
        // Si falla la creación en Firestore, eliminar el usuario de Auth
        await userCredential.user.delete()
        throw new Error('Error al guardar los datos del usuario')
      }
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
      // 1. Obtener todos los usuarios que coincidan con el ID
      const usersQuery = await getDocs(
        query(collection(db, 'users'))
      )
      
      const userDoc = usersQuery.docs.find(doc => doc.id === id)
      
      if (!userDoc) {
        throw new Error('Usuario no encontrado')
      }
      
      const userData = userDoc.data()
      
      // 2. Eliminar el usuario de Authentication si es posible
      try {
        const auth = getAuth()
        const currentUser = auth.currentUser
        
        // Solo intentar eliminar si no es el usuario actual
        if (currentUser && currentUser.uid !== userData.id) {
          try {
            // Intentar eliminar el usuario de Auth
            await deleteUser(currentUser)
          } catch (authError) {
            throw new Error('Error al eliminar el usuario de Auth')
          }
        } else {
          throw new Error('No se puede eliminar el usuario actual')
        }
      } catch (authError) {
        throw new Error('Error al acceder a Auth')
      }
      
      // 3. Eliminar el documento de Firestore
      await deleteDoc(doc(db, 'users', id))
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
  },

  // Métodos para cotizaciones
  async getQuotes(): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, 'quotes')
      const snapshot = await getDocs(quotesRef)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quote[]
    } catch (error) {
      console.error('Error getting quotes:', error)
      return []
    }
  },

  async createQuote(quote: Omit<Quote, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'quotes'), quote)
    } catch (error) {
      console.error('Error creating quote:', error)
      throw error
    }
  },

  async updateQuoteStatus(id: string, status: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', id)
      await updateDoc(quoteRef, {
        status,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating quote status:', error)
      throw error
    }
  }
}
