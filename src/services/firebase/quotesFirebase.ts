import type { Quote, QuoteStatus, QuoteComment, QuoteStatusHistory } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, writeBatch, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/config'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const quotesFirebase = {
  async getQuotes(): Promise<Quote[]> {
    const cache = cacheService.cacheApiCall<Quote[]>(
      'FIREBASE_QUOTES',
      {},
      API_CACHE_CONFIG.FIREBASE_USERS.ttl // Reutilizamos la configuración existente
    );

    return await cache.getOrSet(async () => {
      try {
        logger.info('Fetching quotes from Firebase', 'quotesFirebase');
        
        const quotesRef = collection(db, 'quotes')
        const snapshot = await getDocs(quotesRef)
        const quotes = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const quoteData = {
              ...docSnap.data(),
              idDoc: docSnap.id,
            } as Quote

            // Cargar comentarios para cada cotización
            try {
              const commentsRef = collection(db, 'quotes', docSnap.id, 'comments')
              const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'))
              const commentsSnapshot = await getDocs(commentsQuery)
              
              quoteData.comments = commentsSnapshot.docs.map(commentDoc => ({
                id: commentDoc.id,
                ...commentDoc.data()
              })) as QuoteComment[]
            } catch (error) {
              logger.warn(`Error loading comments for quote ${docSnap.id}`, 'quotesFirebase', error);
              quoteData.comments = []
            }

            // Cargar historial de estados para cada cotización
            try {
              const historyRef = collection(db, 'quotes', docSnap.id, 'statusHistory')
              const historyQuery = query(historyRef, orderBy('changedAt', 'desc'))
              const historySnapshot = await getDocs(historyQuery)
              
              quoteData.statusHistory = historySnapshot.docs.map(historyDoc => ({
                ...historyDoc.data()
              })) as QuoteStatusHistory[]
            } catch (error) {
              logger.warn(`Error loading status history for quote ${docSnap.id}`, 'quotesFirebase', error);
              quoteData.statusHistory = []
            }

            return quoteData
          })
        )

        logger.info(`Fetched ${quotes.length} quotes with comments and history`, 'quotesFirebase');
        return quotes
      } catch (error) {
        logger.error('Error getting quotes', 'quotesFirebase', error);
        return []
      }
    });
  },

  async getQuotesByStatus(status: QuoteStatus): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, 'quotes')
      const q = query(quotesRef, where('status', '==', status))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        idDoc: doc.id,
      })) as Quote[]
    } catch (error) {
      logger.error('Error getting quotes by status', 'quotesFirebase', error);
      return []
    }
  },

  async getQuotesByUser(userId: string): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, 'quotes')
      const q = query(quotesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        idDoc: doc.id,
      })) as Quote[]
    } catch (error) {
      logger.error('Error getting quotes by user', 'quotesFirebase', error);
      return []
    }
  },

  async getRecentQuotes(limitCount: number = 10): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, 'quotes')
      const q = query(quotesRef, orderBy('createdAt', 'desc'), limit(limitCount))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        idDoc: doc.id,
      })) as Quote[]
    } catch (error) {
      logger.error('Error getting recent quotes', 'quotesFirebase', error);
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

  async updateQuoteStatus(quoteId: string, status: QuoteStatus, notes?: string, changedBy?: string, changedByName?: string, changedByRole?: string): Promise<void> {
    try {
      // Buscar la cotización por ID para obtener el idDoc
      const quotes = await this.getQuotes()
      const quote = quotes.find(q => q.id === quoteId)
      
      if (!quote || !quote.idDoc) {
        throw new Error(`Quote with ID ${quoteId} not found`)
      }

      const quoteRef = doc(db, 'quotes', quote.idDoc)
      const now = new Date().toISOString()
      
      // Crear entrada de historial
      const historyEntry: QuoteStatusHistory = {
        status,
        changedBy: changedBy || 'System',
        changedByName: changedByName || 'Sistema',
        changedByRole: changedByRole || 'system',
        changedAt: now,
        notes
      }

      // Actualizar el documento principal
      await updateDoc(quoteRef, {
        status,
        updatedAt: now
      })

      // Agregar entrada al historial como subcolección
      const historyRef = collection(db, 'quotes', quote.idDoc, 'statusHistory')
      await addDoc(historyRef, historyEntry)

      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Quote ${quoteId} status updated to ${status}`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error updating quote status', 'quotesFirebase', error);
      throw error
    }
  },

  async updateQuoteField(idDoc: string, field: string, value: any, updatedBy?: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', idDoc)
      const updateData: any = {
        [field]: value,
        updatedAt: new Date().toISOString()
      }

      if (updatedBy) {
        updateData.lastUpdatedBy = updatedBy
      }

      await updateDoc(quoteRef, updateData)
      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Quote ${idDoc} field ${field} updated`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error updating quote field', 'quotesFirebase', error);
      throw error
    }
  },

  async updateQuoteMultipleFields(id: string, updates: Partial<Quote>, updatedBy?: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', id)
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        ...(updatedBy && { lastUpdatedBy: updatedBy })
      }

      await updateDoc(quoteRef, updateData)
      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Quote ${id} multiple fields updated`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error updating quote multiple fields', 'quotesFirebase', error);
      throw error
    }
  },

  async getQuoteStatusHistory(idDoc: string): Promise<QuoteStatusHistory[]> {
    try {
      const historyRef = collection(db, 'quotes', idDoc, 'statusHistory')
      const historyQuery = query(historyRef, orderBy('changedAt', 'desc'))
      const snapshot = await getDocs(historyQuery)
      return snapshot.docs.map(doc => doc.data()) as QuoteStatusHistory[]
    } catch (error) {
      logger.error('Error getting quote status history', 'quotesFirebase', error);
      return []
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

  async deleteMultipleQuotes(ids: string[]): Promise<void> {
    const batch = writeBatch(db);
    try {
      ids.forEach(id => {
        const docRef = doc(db, 'quotes', id);
        batch.delete(docRef);
      });
      await batch.commit();
      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Deleted ${ids.length} quotes`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error deleting multiple quotes', 'quotesFirebase', error);
      throw error;
    }
  },

  // Sistema de comentarios
  async addQuoteComment(quoteId: string, comment: Omit<QuoteComment, 'id' | 'createdAt'>): Promise<void> {
    try {
      // Buscar la cotización por ID para obtener el idDoc
      const quotes = await this.getQuotes()
      const quote = quotes.find(q => q.id === quoteId)
      
      if (!quote || !quote.idDoc) {
        throw new Error(`Quote with ID ${quoteId} not found`)
      }

      const commentData = {
        ...comment,
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'quotes', quote.idDoc, 'comments'), commentData)
      
      // Limpiar caché para que se recarguen los datos
      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Comment added to quote ${quoteId}`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error adding quote comment', 'quotesFirebase', error);
      throw error
    }
  },

  async getQuoteComments(quoteId: string): Promise<QuoteComment[]> {
    try {
      // Buscar la cotización por ID para obtener el idDoc
      const quotes = await this.getQuotes()
      const quote = quotes.find(q => q.id === quoteId)
      
      if (!quote || !quote.idDoc) {
        logger.warn(`Quote with ID ${quoteId} not found for comments`, 'quotesFirebase');
        return []
      }

      const commentsRef = collection(db, 'quotes', quote.idDoc, 'comments')
      const q = query(commentsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuoteComment[]
    } catch (error) {
      logger.error('Error getting quote comments', 'quotesFirebase', error);
      return []
    }
  },

  async deleteQuoteComment(quoteId: string, commentId: string): Promise<void> {
    try {
      // Buscar la cotización por ID para obtener el idDoc
      const quotes = await this.getQuotes()
      const quote = quotes.find(q => q.id === quoteId)
      
      if (!quote || !quote.idDoc) {
        throw new Error(`Quote with ID ${quoteId} not found`)
      }

      const commentRef = doc(db, 'quotes', quote.idDoc, 'comments', commentId)
      await deleteDoc(commentRef)
      
      // Limpiar caché para que se recarguen los datos
      cacheService.delete('api:FIREBASE_QUOTES:');
      logger.info(`Comment ${commentId} deleted from quote ${quoteId}`, 'quotesFirebase');
    } catch (error) {
      logger.error('Error deleting quote comment', 'quotesFirebase', error);
      throw error
    }
  },

  // Estadísticas y análisis
  async getQuoteStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    avgValue: number;
    conversionRate: number;
  }> {
    try {
      const quotes = await this.getQuotes()
      
      const byStatus = quotes.reduce((acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const byPriority = quotes.reduce((acc, quote) => {
        const priority = quote.priority || 'medium'
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const totalValue = quotes.reduce((sum, quote) => sum + (quote.estimatedValue || 0), 0)
      const avgValue = quotes.length > 0 ? totalValue / quotes.length : 0
      
      const completedQuotes = quotes.filter(q => q.status === 'completed').length
      const conversionRate = quotes.length > 0 ? (completedQuotes / quotes.length) * 100 : 0

      return {
        total: quotes.length,
        byStatus,
        byPriority,
        avgValue,
        conversionRate
      }
    } catch (error) {
      logger.error('Error getting quote stats', 'quotesFirebase', error);
      return {
        total: 0,
        byStatus: {},
        byPriority: {},
        avgValue: 0,
        conversionRate: 0
      }
    }
  },

  // Búsqueda avanzada
  async searchQuotes(searchTerm: string): Promise<Quote[]> {
    try {
      const quotes = await this.getQuotes()
      const term = searchTerm.toLowerCase()
      
      return quotes.filter(quote => 
        quote.userName.toLowerCase().includes(term) ||
        quote.userEmail.toLowerCase().includes(term) ||
        quote.id.toLowerCase().includes(term) ||
        quote.items.some(item => item.productName.toLowerCase().includes(term)) ||
        (quote.tags && quote.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    } catch (error) {
      logger.error('Error searching quotes', 'quotesFirebase', error);
      return []
    }
  },

  // Exportación de datos
  async exportQuotes(filters?: {
    status?: QuoteStatus;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Quote[]> {
    try {
      let quotes = await this.getQuotes()

      if (filters) {
        if (filters.status) {
          quotes = quotes.filter(q => q.status === filters.status)
        }
        if (filters.priority) {
          quotes = quotes.filter(q => q.priority === filters.priority)
        }
        if (filters.dateFrom) {
          quotes = quotes.filter(q => new Date(q.createdAt) >= new Date(filters.dateFrom!))
        }
        if (filters.dateTo) {
          quotes = quotes.filter(q => new Date(q.createdAt) <= new Date(filters.dateTo!))
        }
      }

      logger.info(`Exported ${quotes.length} quotes with filters`, 'quotesFirebase');
      return quotes
    } catch (error) {
      logger.error('Error exporting quotes', 'quotesFirebase', error);
      return []
    }
  }
}
