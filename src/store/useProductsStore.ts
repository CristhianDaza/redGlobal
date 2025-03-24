import type { StateGlobal } from '../types/config'
import type { ProductsRedGlobal } from '../types/common'

import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { combineProducts } from '../utils'
import {
  useProductsCataProm,
  useProductsMarpico,
  useProductsPromos,
  useProductStockSur,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: (): StateGlobal => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
    isLoadingSaveProducts: false,
    lastUpdateProducts: null,
    productsToView: [],
  }),
  actions: {
    async getAllProducts(isAdminUser = false): Promise<void> {
      console.log('getAllProducts')
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
    
    async _callServices(): Promise<void> {
      const { getProductsPromos, isLoadingProductsPromosComposable } = useProductsPromos()
      const { getProductsMarpico, isLoadingProductsMarpicoComposable } = useProductsMarpico()
      const { getProductsStockSur, isLoadingProductsStockSurComposable } = useProductStockSur()
      const { getProductsCataProm, isLoadingProductsCataPromComposable } = useProductsCataProm()
      
      const isMustBeUpdated = await this._isMustBeUpdated()
      
      if (isMustBeUpdated) {
        await this._callProductsDb()
        return
      }

      this.isLoadingApiPromos = isLoadingProductsPromosComposable.value
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable.value
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable.value
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable.value

      const [
        productsPromos,
        productsMarpico,
        productsStockSur,
        // productsCataProm,
      ] = await Promise.all([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
        // getProductsCataProm(),
      ])

      const allProducts = [
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
        // ...productsCataProm
      ]

      const products = allProducts.sort((a, b) => a.name.localeCompare(b.name))
      this.isLoadingSaveProducts = false
      await this._saveProductsInDb(products)
    },

    async _saveProductsInDb(allProducts: ProductsRedGlobal[]): Promise<void> {
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

    async _callProductsDb(): Promise<void> {
      const docRef = await getDocs(collection(db, 'productsRedGlobal'))
      
      const docRefLastUpdated = await getDocs(collection(db, 'lastedUpdatedProducts'))
      const { lastUpdate } = docRefLastUpdated.docs[0].data()
      this.lastUpdateProducts = lastUpdate
      const allNormalizedProducts = combineProducts(docRef.docs)
      console.log('allNormalizedProducts:', allNormalizedProducts)
      this.products = allNormalizedProducts.sort((a, b) => a.name.localeCompare(b.name))
      this.isLoadingSaveProducts = false
      console.log('this.products', this.products)
    },

    async _updateDateInDb(): Promise<void> {
      try {
        await addDoc(collection(db, 'lastedUpdatedProducts'), { lastUpdate: new Date().toISOString() })
      } catch (error) {
        console.log('Error in _updateDateInDb:', error)
      }
    },

    async _deleteProductsInDb(): Promise<void> {
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

    async _isMustBeUpdated(): Promise<boolean> {
      const docRef = await getDocs(collection(db, 'lastedUpdatedProducts'))
      if (!Array.isArray(docRef.docs) || docRef.docs.length === 0) {
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

    setProductsToView(products: ProductsRedGlobal[]): void {
      this.productsToView = products
    }
  },
  getters: {
    getProductsToView(): ProductsRedGlobal[] {
      return this.productsToView
    }
  },
})
