import type { User, UserFormData } from '@/types/common.d'
import { UserRole } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { db } from '@/config'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const usersFirebase = {
  async getUsers(): Promise<User[]> {
    const cache = cacheService.cacheApiCall<User[]>(
      'FIREBASE_USERS',
      {},
      API_CACHE_CONFIG.FIREBASE_USERS.ttl
    );

    return await cache.getOrSet(async () => {
      try {
        logger.info('Fetching users from Firebase', 'usersFirebase');
        
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
              const userQuery = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email?.toLowerCase())))

              if (userQuery.empty) {
                const now = new Date().toISOString()
                await addDoc(collection(db, 'users'), {
                  id: currentUser.uid,
                  name: currentUser.displayName || 'Admin',
                  email: currentUser.email?.toLowerCase(),
                  primaryColor: '#ff4444',
                  secondaryColor: '#ff4444',
                  priceIncrease: 0,
                  active: true,
                  role: UserRole.ADMIN,
                  createdAt: now,
                  updatedAt: now
                })
                
                cacheService.delete('api:FIREBASE_USERS:');
                return await this.getUsers()
              }
            } catch (error) {
              logger.error('Error creating initial user', 'usersFirebase', error);
            }
          }
        }

        logger.info(`Successfully fetched ${users.length} users from Firebase`, 'usersFirebase');
        return users
      } catch (error) {
        logger.error('Error getting users from Firebase', 'usersFirebase', error);
        return []
      }
    });
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
        userCredential = await createUserWithEmailAndPassword(auth, user.email.toLowerCase(), user.password)
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
          email: user.email.toLowerCase(),
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
      logger.error('Error creating user', 'usersFirebase', error);
      throw error
    } finally {
      cacheService.delete('api:FIREBASE_USERS:');
    }
  },

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', id)
      const updateData = {
        ...user, 
        updatedAt: new Date().toISOString()
      }

      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase()
      }
      
      await updateDoc(userRef, updateData)
      
      cacheService.delete('api:FIREBASE_USERS:');
      logger.info('User updated and cache cleared', 'usersFirebase');
    } catch (error) {
      logger.error('Error updating user', 'usersFirebase', error);
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
      
      cacheService.delete('api:FIREBASE_USERS:');
      logger.info('User deleted and cache cleared', 'usersFirebase');
    } catch (error) {
      logger.error('Error deleting user', 'usersFirebase', error);
      throw error
    }
  },
}
