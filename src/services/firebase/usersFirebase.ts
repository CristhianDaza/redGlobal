import type { User, UserFormData } from '@/types/common.d'
import { UserRole } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { db, firebaseConfig } from '@/config'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth as getSecondaryAuth } from 'firebase/auth'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const usersFirebase = {
  async getUsers(includeHidden: boolean = false): Promise<User[]> {
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
        let users = snapshot.docs.map(doc => ({
          idDoc: doc.id, ...doc.data()
        })) as User[]

        // Filtrar usuarios ocultos si no se solicita incluirlos
        if (!includeHidden) {
          users = users.filter(user => !user.isHidden)
        }

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

      // Crear una instancia secundaria de Firebase para no afectar la sesión actual
      const secondaryApp = initializeApp(firebaseConfig, 'secondary')
      const secondaryAuth = getSecondaryAuth(secondaryApp)
      
      let userCredential
      try {
        userCredential = await createUserWithEmailAndPassword(secondaryAuth, user.email.toLowerCase(), user.password)
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
        
        // Cerrar sesión en la instancia secundaria para no afectar la sesión principal
        await signOut(secondaryAuth)
      } catch (error) {
        // Si hay error guardando en Firestore, eliminar el usuario de Auth
        await userCredential.user.delete()
        throw new Error('Error al guardar los datos del usuario')
      } finally {
        // Limpiar la instancia secundaria
        try {
          await deleteApp(secondaryApp)
        } catch (error) {
          logger.warn('Error deleting secondary app instance', 'usersFirebase', error);
        }
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

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const usersQuery = await getDocs(query(collection(db, 'users'), where('id', '==', userId)))
      if (!usersQuery.empty) {
        const userDoc = usersQuery.docs[0]
        await updateDoc(doc(db, 'users', userDoc.id), {
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        
        cacheService.delete('api:FIREBASE_USERS:');
        logger.info('User last login updated', 'usersFirebase');
      }
    } catch (error) {
      logger.error('Error updating user last login', 'usersFirebase', error);
    }
  },

  async migrateUsersLastLogin(): Promise<void> {
    try {
      logger.info('Starting users lastLogin migration', 'usersFirebase');
      
      const usersQuery = await getDocs(collection(db, 'users'))
      const batch = []
      
      for (const userDoc of usersQuery.docs) {
        const userData = userDoc.data()
        
        if (!userData.lastLogin) {
          batch.push(
            updateDoc(doc(db, 'users', userDoc.id), {
              lastLogin: userData.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          )
        }
      }
      
      if (batch.length > 0) {
        await Promise.all(batch)
        cacheService.delete('api:FIREBASE_USERS:');
        logger.info(`Migrated ${batch.length} users with lastLogin field`, 'usersFirebase');
      } else {
        logger.info('No users need lastLogin migration', 'usersFirebase');
      }
    } catch (error) {
      logger.error('Error migrating users lastLogin', 'usersFirebase', error);
    }
  },
}
