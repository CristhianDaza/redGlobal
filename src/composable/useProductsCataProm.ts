import type { CataPromProduct, CataPromCategory, CataPromStock, CataPromProductDetails } from '@/types/cataprom.d';
import type { ProductsRedGlobal, ImagesRedGlobal, TableEntry } from '@/types/common.d';
import { ref } from 'vue';
import { constructCategoryCataProm, constructDescriptionCataProm, formatText, calculateTotalQuantity } from '@/utils';
import {
  getCategoriesCataProm,
  getProductsByCategoryCataProm,
  getStockByProductCataProm,
  getProductByIdCataProm
} from '@/api';
import noImage from '@/assets/images/no-image.jpg';

export function useProductsCataProm() {
  const isLoadingProductsCataPromComposable = ref<boolean>(true);
  const isSuccessProductsCataPromComposable = ref<boolean>(false);

  const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  const mapProductDetailsToImages = (details: CataPromProductDetails, stocks: CataPromStock[]): ImagesRedGlobal[] => {
    return details.imagenes.map((img, index) => {
      const stockForImage = stocks[index];
      return {
        urlImage: [`https:${img}`],
        color: stockForImage ? stockForImage.color : '',
        id: index
      };
    });
  }

  const mapStockToTableEntries = (stocks: CataPromStock[], price: number): TableEntry[] => {
    return stocks.map((stock) => ({
      color: stock.color,
      colorName: stock.color,
      quantity: stock.totalDisponible,
      statusTracking: stock.estadoOrden,
      dataTracking: stock.llegadaBodegaLocal,
      idColorTracking: stock.id,
      price: price,
    }));
  }

  const _normalizeProducts = (product: CataPromProduct, categories: CataPromCategory[]): ProductsRedGlobal => {
    return {
      api: 'cataProm',
      category: constructCategoryCataProm(product, categories),
      description: constructDescriptionCataProm(product?.descripcionProducto),
      id: product?.referencia || '',
      mainImage: product?.imageUrl === ''
        ? noImage
        : `https://catalogospromocionales.com${product?.imageUrl}`,
      name: formatText(product?.nombre),
    };
  };

  const getProductsCataProm = async (): Promise<ProductsRedGlobal[]> => {
    try {
      const excludedCategoryIds = [1];
      const categories = await getCategoriesCataProm();
      const filteredCategories = categories.filter(
        (category) => !excludedCategoryIds.includes(category.id)
      );

      const productsResults = await Promise.allSettled(
        filteredCategories.map((category) =>
        getProductsByCategoryCataProm(String(category.id))
      ));

      const productsArrays = productsResults
        .filter(result => result.status === 'fulfilled')
        .map((result: PromiseFulfilledResult<CataPromProduct[]>) => result.value);

      const allProducts = productsArrays.flat();

      const uniqueProducts = Array.from(
        new Map(allProducts.map(product => [product.id, product])).values()
      );

      const normalizedProducts: ProductsRedGlobal[] = uniqueProducts.map(product =>
        _normalizeProducts(product, categories)
      );

      const CHUNK_SIZE = 100;
      const productChunks = chunkArray(normalizedProducts, CHUNK_SIZE);
      const finalProducts: ProductsRedGlobal[] = [];

      for (const chunk of productChunks) {
        const updatedProducts = await Promise.all(
            chunk.map(async (product) => {
              try {
                const [details, stocks] = await Promise.all([
                  getProductByIdCataProm(product.id),
                  getStockByProductCataProm(product.id)
                ]);
                const mappedStock = mapStockToTableEntries(stocks, details.precio1);
                const totalProducts = calculateTotalQuantity(mappedStock);
                return {
                  ...product,
                  images: mapProductDetailsToImages(details, stocks),
                  tableQuantity: mappedStock,
                  totalProducts,
                } as ProductsRedGlobal;
              } catch (error) {
                console.error(`Error procesando producto ${product.id}:`, error);
                return product;
              }
            })
        );
        finalProducts.push(...updatedProducts);
      }

      isSuccessProductsCataPromComposable.value = true;
      return finalProducts;
    } catch (error) {
      isSuccessProductsCataPromComposable.value = false;
      console.error('Error in getProductsCataProm:', error);
      throw error;
    } finally {
      isLoadingProductsCataPromComposable.value = false;
    }
  };

  return {
    isLoadingProductsCataPromComposable,
    isSuccessProductsCataPromComposable,
    getProductsCataProm
  };
}
