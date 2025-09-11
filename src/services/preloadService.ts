import { logger } from './loggerService';
import { cacheService } from './cacheService';

class PreloadService {

  /**
   * Precargar imágenes críticas del carousel y categorías
   */
  async preloadCriticalImages(carouselImages: string[], categoryImages: string[]): Promise<void> {
    const criticalImages = [...carouselImages.slice(0, 3), ...categoryImages.slice(0, 6)];
    
    logger.info(`Preloading ${criticalImages.length} critical images`, 'PreloadService');
    
    await this.preloadImageBatch(criticalImages, 'high', 2);
  }

  /**
   * Precargar imágenes de productos populares
   */
  async preloadProductImages(productImages: string[]): Promise<void> {
    if (productImages.length === 0) return;
    
    logger.info(`Preloading ${productImages.length} product images`, 'PreloadService');
    
    // Precargar las primeras 8 imágenes de productos
    const priorityImages = productImages.slice(0, 8);
    await this.preloadImageBatch(priorityImages, 'low', 4);
  }

  /**
   * Precargar imágenes en lotes
   */
  private async preloadImageBatch(
    images: string[], 
    priority: 'high' | 'low', 
    concurrent: number
  ): Promise<void> {
    const chunks: string[][] = [];
    for (let i = 0; i < images.length; i += concurrent) {
      chunks.push(images.slice(i, i + concurrent));
    }

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(src => this.preloadSingleImage(src, priority))
      );
    }
  }

  /**
   * Precargar una imagen individual
   */
  private preloadSingleImage(src: string, priority: 'high' | 'low'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si ya está en cache
      const cacheKey = `preload:${src}`;
      if (cacheService.has(cacheKey)) {
        resolve();
        return;
      }

      const img = new Image();
      
      // Configurar prioridad si es soportada
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority;
      }

      const timeout = setTimeout(() => {
        logger.warn(`Image preload timeout: ${src}`, 'PreloadService');
        reject(new Error(`Timeout loading ${src}`));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        cacheService.set(cacheKey, true, 30 * 60 * 1000); // Cache por 30 minutos
        logger.debug(`Image preloaded: ${src}`, 'PreloadService');
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        logger.warn(`Failed to preload image: ${src}`, 'PreloadService');
        reject(new Error(`Failed to load ${src}`));
      };

      img.src = src;
    });
  }

  /**
   * Precargar imágenes de forma inteligente basada en el viewport
   */
  async intelligentPreload(images: string[]): Promise<void> {
    // Detectar conexión lenta
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.saveData
    );

    if (isSlowConnection) {
      logger.info('Slow connection detected, reducing preload', 'PreloadService');
      // Solo precargar imágenes críticas
      await this.preloadImageBatch(images.slice(0, 3), 'low', 1);
    } else {
      // Conexión normal, precargar más imágenes
      await this.preloadImageBatch(images.slice(0, 8), 'low', 3);
    }
  }

  /**
   * Limpiar cache de preload
   */
  clearPreloadCache(): void {
    // Limpiar entradas de preload del cache
    const stats = cacheService.getStats();
    logger.info(`Clearing preload cache. Current entries: ${stats.totalEntries}`, 'PreloadService');
    
    // El cache service se encarga de la limpieza automática
  }
}

export const preloadService = new PreloadService();
