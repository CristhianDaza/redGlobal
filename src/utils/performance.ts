import { logger } from '@/services';

/**
 * Utility para medir el rendimiento de funciones
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        logger.debug(`${name} took ${(end - start).toFixed(2)}ms`, 'Performance');
      });
    } else {
      const end = performance.now();
      logger.debug(`${name} took ${(end - start).toFixed(2)}ms`, 'Performance');
      return result;
    }
  }) as T;
}

/**
 * Decorator para medir el rendimiento de métodos de clase
 */
export function performanceMonitor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        logger.debug(`${target.constructor.name}.${propertyKey} took ${(end - start).toFixed(2)}ms`, 'Performance');
      });
    } else {
      const end = performance.now();
      logger.debug(`${target.constructor.name}.${propertyKey} took ${(end - start).toFixed(2)}ms`, 'Performance');
      return result;
    }
  };
  
  return descriptor;
}

/**
 * Utility para crear un throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Utility para crear batches de operaciones
 */
export class BatchProcessor<T> {
  private batch: T[] = [];
  private timeoutId: number | null = null;
  
  constructor(
    private processBatch: (items: T[]) => void | Promise<void>,
    private batchSize: number = 10,
    private delay: number = 100
  ) {}
  
  add(item: T): void {
    this.batch.push(item);
    
    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (this.timeoutId === null) {
      this.timeoutId = window.setTimeout(() => this.flush(), this.delay);
    }
  }
  
  flush(): void {
    if (this.batch.length === 0) return;
    
    const currentBatch = [...this.batch];
    this.batch = [];
    
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    this.processBatch(currentBatch);
  }
  
  destroy(): void {
    this.flush();
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

/**
 * Utility para crear un pool de objetos reutilizables
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  
  constructor(
    private createFn: () => T,
    private resetFn: (obj: T) => void,
    initialSize: number = 5
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }
  
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
  
  clear(): void {
    this.pool = [];
  }
}

/**
 * Utility para medir el uso de memoria
 */
export function measureMemoryUsage(label: string): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    logger.debug(`Memory usage for ${label}:`, 'Performance', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }
}
