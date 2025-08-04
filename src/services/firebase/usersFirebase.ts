import type { User, UserFormData } from '@/types/common.d'
import { UserRole } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { db } from '@/config'

export const usersFirebase = {
  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      const users = snapshot.docs.map(doc => ({
        idDoc: doc.id, ...doc.data()
      })) as User[]

      if (users.length === 0) {
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (currentUser) {
          try {
            const userQuery = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)))

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
      const {password, logo, ...userData} = user

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
        ...user, updatedAt: new Date().toISOString()
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
}
