import type { ProductsRedGlobal, MenuItem, User, UserFormData, Quote, CategoryCard } from '@/types/common.d'
import { Catalog, UserRole } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { db } from '@/config'

export const firebaseService = {
  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      const users = snapshot.docs.map(doc => ({
        idDoc: doc.id,
        ...doc.data()
      })) as User[]

      if (users.length === 0) {
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (currentUser) {
          try {
            const userQuery = await getDocs(
              query(collection(db, 'users'),
                where('email', '==', currentUser.email))
            )

            if (userQuery.empty) {
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
      if (!user.email || !user.password) {
        throw new Error('El email y la contraseña son requeridos')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(user.email)) {
        throw new Error('El formato del email no es válido')
      }

      if (user.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

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

      const usersRef = collection(db, 'users')
      const now = new Date().toISOString()
      const { password, logo, ...userData } = user

      try {
        await addDoc(usersRef, {
          ...userData,
          id: userCredential.user.uid,
          logo: user.logo || null,
          createdAt: now,
          updatedAt: now,
          role: userData.role || UserRole.CLIENT,
          active: true
        })
      } catch (error) {
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
      const usersQuery = await getDocs(query(collection(db, 'users')))
      const userDoc = usersQuery.docs.find(doc => doc.id === id)
      if (!userDoc) {
        throw new Error('Usuario no encontrado')
      }
      await deleteDoc(doc(db, 'users', id))
    } catch (error) {
      console.error('Error eliminando el usuario:', error)
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
    const querySnapshot = await getDocs(collection(db, 'lastedUpdatedProducts'))
    if (querySnapshot.empty) return null
    const data = querySnapshot.docs[0].data()
    const lastUpdate = new Date(data.lastUpdate)
    localStorage.setItem('lastUpdate', lastUpdate.toISOString())
    return lastUpdate
  },

  async updateLastUpdate(): Promise<void> {
    try {
      localStorage.removeItem('lastUpdate')
      await addDoc(collection(db, 'lastedUpdatedProducts'), {
        lastUpdate: new Date().toISOString()
      })
      localStorage.setItem('lastUpdate', new Date().toISOString())
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
      const cleanQuote = JSON.parse(JSON.stringify(quote, (_, value) => {
        return value === undefined ? null : value;
      }));

      await addDoc(collection(db, 'quotes'), cleanQuote);
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
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
  },

  async deleteQuote(id: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', id)
      await deleteDoc(quoteRef)
    } catch (error) {
      console.error('Error deleting quote:', error)
      throw error
    }
  },

  async getCategoryCards(): Promise<CategoryCard[]> {
    try {
      const cardsRef = collection(db, 'categoryCards')
      const snapshot = await getDocs(cardsRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          imageUrl: data.imageUrl,
          buttonText: data.buttonText,
          backgroundColor: data.backgroundColor,
          active: data.active ?? true,
          buttonColor: '',
          url: data.url,
          order: 0,
          textColor: data.textColor || '#333333'
        }
      })
    } catch (error) {
      console.error('Error getting category cards:', error)
      return []
    }
  },

  async createCategoryCard(card: Omit<CategoryCard, 'id' | 'buttonColor' | 'order'>): Promise<void> {
    try {
      const cardsRef = collection(db, 'categoryCards')
      await addDoc(cardsRef, {
        ...card,
        active: true
      })
    } catch (error) {
      console.error('Error creating category card:', error)
      throw error
    }
  },

  async updateCategoryCard(id: string, card: Partial<CategoryCard>): Promise<void> {
    try {
      if (card.active === false) {
        const cards = await this.getCategoryCards()
        const currentCard = cards.find(c => c.id === id)
        if (currentCard?.active) {
          const activeCards = cards.filter(c => c.active && c.id !== id)
          if (activeCards.length < 3) {
            throw new Error('Debe haber al menos 3 categorías activas')
          }
        }
      }

      const cardRef = doc(db, 'categoryCards', id)
      await updateDoc(cardRef, card)
    } catch (error) {
      console.error('Error updating category card:', error)
      throw error
    }
  },

  async deleteCategoryCard(id: string): Promise<void> {
    try {
      const cards = await this.getCategoryCards()
      const cardToDelete = cards.find(c => c.id === id)

      if (cardToDelete?.active) {
        const activeCards = cards.filter(c => c.active && c.id !== id)
        if (activeCards.length < 3) {
          throw new Error('No se puede eliminar una categoría activa cuando hay solo 3 activas')
        }
      }

      const cardRef = doc(db, 'categoryCards', id)
      await deleteDoc(cardRef)
    } catch (error) {
      console.error('Error deleting category card:', error)
      throw error
    }
  },

  async getCatalogs(): Promise<Catalog[]> {
    try {
      const cardsRef = collection(db, 'catalogs')
      const snapshot = await getDocs(cardsRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          imageUrl: data.imageUrl,
          toRoute: data.toRoute
        }
      })
    } catch (error) {
      console.error('Error getting catalogs:', error)
      return []
    }
  },

  async createCatalog(catalog: Catalog) {
    try {
      const cardsRef = collection(db, 'catalogs')
      await addDoc(cardsRef, {
        ...catalog
      })
    } catch (error) {
      console.error('Error creating catalog:', error)
      throw error
    }
  },

  async updateCatalog(id: string, catalog: Partial<Catalog>): Promise<void> {
    try {
      const cardRef = doc(db, 'catalogs', id)
      await updateDoc(cardRef, catalog)
    } catch (error) {
      console.error('Error updating catalog:', error)
      throw error
    }
  },

  async deleteCatalog(id: string): Promise<void> {
    try {
      const cardRef = doc(db, 'catalogs', id)
      await deleteDoc(cardRef)
    } catch (error) {
      console.error('Error deleting catalog: ', error)
      throw error
    }
  }
}
