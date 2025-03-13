import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { combineProducts } from '../utils'

import {
  // Promos API
  getProductsPromos,
  isLoadingProductsPromosComposable,
  
  // Marpico API
  getProductsMarpico,
  isLoadingProductsMarpicoComposable,
  
  // StockSur API
  getProductsStockSur,
  isLoadingProductsStockSurComposable,
  
  // CataProm API
  getProductsCataProm,
  isLoadingProductsCataPromComposable,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
    isLoadingSaveProducts: false,
    lastUpdateProducts: null,
  }),
  actions: {
    async getAllProducts(isAdminUser = false) {
      try {
        if (isAdminUser) {
          await this._callServices()
        } else {
          await this._callProductsDb()
        }
      } catch (error) {
        console.error('Error in getAllProducts:', error)
      }
    },
    
    async _callServices() {
      const isMustBeUpdated = await this._isMustBeUpdated()
      
      if (isMustBeUpdated) {
        await this._callProductsDb()
        return
      }

      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable
      
      const [
        productsPromos,
        productsMarpico,
        productsStockSur,
        productsCataProm
      ] = await Promise.all([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
        getProductsCataProm(),
      ])
      const allProducts = [
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
        ...productsCataProm
      ]
      const products = allProducts.sort((a, b) => a.name.localeCompare(b.name))
      
      this.isLoadingSaveProducts = false
      await this._saveProductsInDb(products)
    },
    
    async _saveProductsInDb(allProducts) {
      this.isLoadingSaveProducts = true
      await this._deleteProductsInDb()
      const batchSizes = 500
      
      for (let i = 0; i < allProducts.length; i += batchSizes) {
        const batch = allProducts.slice(i, i + batchSizes).map(product => {
          return JSON.parse(JSON.stringify(product, (key, value) =>
            value === undefined ? null : value
          ))
        })
        await addDoc(collection(db, 'productsRedGlobal'), { products: batch })
      }
      await this._updateDateInDb()
      await this._callProductsDb()
    },
    
    async _callProductsDb() {
      const docRef = await getDocs(collection(db, 'productsRedGlobal'))
      
      const docRefLastUpdated = await getDocs(collection(db, 'lastedUpdatedProducts'))
      const { lastUpdate } = docRefLastUpdated.docs[0].data()
      this.lastUpdateProducts = lastUpdate
      const allNormalizedProducts = combineProducts(docRef.docs)
      console.log('allNormalizedProducts:', allNormalizedProducts)
      this.products = allNormalizedProducts.sort((a, b) => a.name.localeCompare(b.name))
      this.isLoadingSaveProducts = false
    },
    
    async _updateDateInDb() {
      try {
        await addDoc(collection(db, 'lastedUpdatedProducts'), { lastUpdate: new Date().toISOString() })
      } catch (error) {
        console.log('Error in _updateDateInDb:', error)
      }
    },
    
    async _deleteProductsInDb() {
      try {
        const productsRef = await getDocs(collection(db, 'productsRedGlobal'))
        const lastUpdateRef = await getDocs(collection(db, 'lastedUpdatedProducts'))
        
        const deleteLastUpdate = lastUpdateRef.docs.map(document => deleteDoc(doc(db, 'lastedUpdatedProducts', document.id)))
        
        const deletePromises = productsRef.docs.map(document => deleteDoc(doc(db, 'productsRedGlobal', document.id)))
        
        if (deletePromises.length === 0 && deleteLastUpdate.length === 0) {
          return
        }
        await Promise.all([...deletePromises, ...deleteLastUpdate])
      } catch (error) {
        console.log('Error in _deleteProductsInDb:', error)
      }
    },
    
    async _isMustBeUpdated() {
      const docRef = await getDocs(collection(db, 'lastedUpdatedProducts'))
      if (!docRef.docs || docRef.docs.length === 0) {
        return false
      }
      const { lastUpdate } = docRef.docs[0].data()
      const lastUpdateDate = new Date(lastUpdate)
      const now = new Date()
      const lastUpdateDay = lastUpdateDate.getDate()
      const nowDay = now.getDate()
      this.lastUpdateProducts = lastUpdateDate
      return lastUpdateDay === nowDay
    },
  },
})
