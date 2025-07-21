/**
 * Performance Optimization Service
 * Advanced performance monitoring, optimization, and caching strategies
 */

import { logger } from '@/lib/logger';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'loading' | 'runtime' | 'memory' | 'network' | 'user';
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  category: 'caching' | 'bundling' | 'lazy-loading' | 'compression' | 'prefetching';
  impact: 'low' | 'medium' | 'high';
  implementation: () => Promise<void>;
  isActive: boolean;
}

export interface CacheStrategy {
  name: string;
  type: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB' | 'serviceWorker';
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  evictionPolicy: 'lru' | 'fifo' | 'lfu';
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
  duplicates: Array<{
    module: string;
    occurrences: number;
    totalSize: number;
  }>;
  recommendations: string[];
}

// Memory Cache with LRU eviction
class MemoryCache {
  private cache: Map<string, { value: any; timestamp: Date; accessCount: number }> = new Map();
  private accessOrder: string[] = [];
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp.getTime() > this.ttl) {
      this.delete(key);
      return null;
    }

    // Update access order for LRU
    entry.accessCount++;
    this.updateAccessOrder(key);

    return entry.value;
  }

  set(key: string, value: any): void {
    // Remove oldest entries if at capacity
    while (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder.shift()!;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: new Date(),
      accessCount: 1,
    });

    this.updateAccessOrder(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  getStats(): { size: number; hitRate: number; memoryUsage: number } {
    const totalAccesses = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.accessCount, 0);
    const hits = Array.from(this.cache.values()).filter(entry => entry.accessCount > 1).length;
    
    return {
      size: this.cache.size,
      hitRate: totalAccesses > 0 ? hits / totalAccesses : 0,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.value).length * 2;
      size += 64; // Overhead for object structure
    }
    return size;
  }
}

// Resource Preloader
class ResourcePreloader {
  private preloadedResources: Set<string> = new Set();
  private preloadQueue: Array<{ url: string; type: 'script' | 'style' | 'image' | 'fetch'; priority: number }> = [];

  preloadResource(url: string, type: 'script' | 'style' | 'image' | 'fetch', priority = 1): void {
    if (this.preloadedResources.has(url)) {
      return;
    }

    this.preloadQueue.push({ url, type, priority });
    this.preloadQueue.sort((a, b) => b.priority - a.priority);

    this.processPreloadQueue();
  }

  private async processPreloadQueue(): Promise<void> {
    while (this.preloadQueue.length > 0) {
      const resource = this.preloadQueue.shift()!;
      
      try {
        await this.loadResource(resource);
        this.preloadedResources.add(resource.url);
      } catch (error) {
        logger.error('Resource preload failed', {
          component: 'ResourcePreloader',
          action: 'preload_resource',
          metadata: { url: resource.url, type: resource.type, error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }
    }
  }

  private loadResource(resource: { url: string; type: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      switch (resource.type) {
        case 'script':
          const script = document.createElement('script');
          script.src = resource.url;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
          break;

        case 'style':
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = resource.url;
          link.onload = () => resolve();
          link.onerror = reject;
          document.head.appendChild(link);
          break;

        case 'image':
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = resource.url;
          break;

        case 'fetch':
          fetch(resource.url)
            .then(() => resolve())
            .catch(reject);
          break;

        default:
          reject(new Error(`Unsupported resource type: ${resource.type}`));
      }
    });
  }

  getPreloadedResources(): string[] {
    return Array.from(this.preloadedResources);
  }
}

// Performance Monitor
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.initializeObservers();
    this.startCoreWebVitalsMonitoring();
  }

  private initializeObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms', 'loading');
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'ms', 'loading');
            this.recordMetric('first_byte', navEntry.responseStart - navEntry.requestStart, 'ms', 'network');
          }
        }
      });

      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navObserver);
    }

    // Resource timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric(`resource_load_${this.getResourceType(resourceEntry.name)}`, resourceEntry.duration, 'ms', 'network');
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  private startCoreWebVitalsMonitoring(): void {
    // Monitor Core Web Vitals
    this.monitorLCP();
    this.monitorFID();
    this.monitorCLS();
  }

  private monitorLCP(): void {
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('largest_contentful_paint', lastEntry.startTime, 'ms', 'loading', {
          warning: 2500,
          critical: 4000,
        });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    }
  }

  private monitorFID(): void {
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('first_input_delay', entry.processingStart - entry.startTime, 'ms', 'user', {
            warning: 100,
            critical: 300,
          });
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    }
  }

  private monitorCLS(): void {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          }
        }

        this.recordMetric('cumulative_layout_shift', clsValue, 'score', 'user', {
          warning: 0.1,
          critical: 0.25,
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    }
  }

  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric['category'], threshold?: { warning: number; critical: number }): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      threshold,
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log critical metrics
    if (threshold && value > threshold.critical) {
      logger.warn(`Critical performance threshold exceeded: ${name}`, {
        component: 'PerformanceMonitor',
        action: 'threshold_exceeded',
        metadata: { metric: name, value, threshold: threshold.critical, unit },
      });
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  getMetrics(category?: PerformanceMetric['category'], limit = 100): PerformanceMetric[] {
    let filteredMetrics = category 
      ? this.metrics.filter(m => m.category === category)
      : this.metrics;

    return filteredMetrics.slice(-limit);
  }

  getAverageMetric(name: string, timeWindow = 5 * 60 * 1000): number | null {
    const cutoff = new Date(Date.now() - timeWindow);
    const relevantMetrics = this.metrics.filter(m => 
      m.name === name && m.timestamp > cutoff
    );

    if (relevantMetrics.length === 0) {
      return null;
    }

    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / relevantMetrics.length;
  }
}

// Main Performance Optimizer
export class PerformanceOptimizer {
  private cache: MemoryCache;
  private preloader: ResourcePreloader;
  private monitor: PerformanceMonitor;
  private strategies: Map<string, OptimizationStrategy> = new Map();

  constructor() {
    this.cache = new MemoryCache();
    this.preloader = new ResourcePreloader();
    this.monitor = new PerformanceMonitor();
    
    this.initializeOptimizationStrategies();
    this.startPerformanceOptimization();
  }

  private initializeOptimizationStrategies(): void {
    const strategies: OptimizationStrategy[] = [
      {
        id: 'lazy-load-images',
        name: 'Lazy Load Images',
        description: 'Load images only when they enter the viewport',
        category: 'lazy-loading',
        impact: 'high',
        implementation: this.implementLazyImageLoading.bind(this),
        isActive: false,
      },
      {
        id: 'preload-critical-resources',
        name: 'Preload Critical Resources',
        description: 'Preload essential resources for faster page loads',
        category: 'prefetching',
        impact: 'medium',
        implementation: this.implementCriticalResourcePreloading.bind(this),
        isActive: false,
      },
      {
        id: 'compress-api-responses',
        name: 'Compress API Responses',
        description: 'Enable gzip compression for API responses',
        category: 'compression',
        impact: 'medium',
        implementation: this.implementAPICompression.bind(this),
        isActive: false,
      },
      {
        id: 'cache-api-responses',
        name: 'Cache API Responses',
        description: 'Cache frequently accessed API responses',
        category: 'caching',
        impact: 'high',
        implementation: this.implementAPIResponseCaching.bind(this),
        isActive: false,
      },
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  private async startPerformanceOptimization(): Promise<void> {
    logger.info('Starting performance optimization', {
      component: 'PerformanceOptimizer',
      action: 'start_optimization',
    });

    // Auto-enable high-impact strategies
    for (const [id, strategy] of this.strategies.entries()) {
      if (strategy.impact === 'high') {
        await this.enableStrategy(id);
      }
    }
  }

  async enableStrategy(strategyId: string): Promise<void> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy || strategy.isActive) {
      return;
    }

    try {
      await strategy.implementation();
      strategy.isActive = true;
      
      logger.info('Performance optimization strategy enabled', {
        component: 'PerformanceOptimizer',
        action: 'enable_strategy',
        metadata: { strategyId, name: strategy.name },
      });
    } catch (error) {
      logger.error('Failed to enable performance strategy', {
        component: 'PerformanceOptimizer',
        action: 'enable_strategy_failed',
        metadata: { 
          strategyId, 
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  private async implementLazyImageLoading(): Promise<void> {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  private async implementCriticalResourcePreloading(): Promise<void> {
    // Preload critical resources
    const criticalResources = [
      { url: '/api/user/profile', type: 'fetch' as const, priority: 3 },
      { url: '/fonts/inter.woff2', type: 'style' as const, priority: 2 },
      { url: '/images/logo.svg', type: 'image' as const, priority: 1 },
    ];

    criticalResources.forEach(resource => {
      this.preloader.preloadResource(resource.url, resource.type, resource.priority);
    });
  }

  private async implementAPICompression(): Promise<void> {
    // This would typically be handled by the server, but we can request compressed responses
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set('Accept-Encoding', 'gzip, deflate, br');
      
      return originalFetch(input, { ...init, headers });
    };
  }

  private async implementAPIResponseCaching(): Promise<void> {
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init.method || 'GET';
      
      // Only cache GET requests
      if (method.toUpperCase() === 'GET') {
        const cacheKey = `api_${url}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
          return new Response(JSON.stringify(cached), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        const response = await originalFetch(input, init);
        
        if (response.ok) {
          const data = await response.clone().json();
          this.cache.set(cacheKey, data);
        }
        
        return response;
      }
      
      return originalFetch(input, init);
    };
  }

  // Public methods
  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric['category']): void {
    this.monitor.recordMetric(name, value, unit, category);
  }

  getPerformanceMetrics(category?: PerformanceMetric['category']): PerformanceMetric[] {
    return this.monitor.getMetrics(category);
  }

  getCacheStats(): { size: number; hitRate: number; memoryUsage: number } {
    return this.cache.getStats();
  }

  preloadResource(url: string, type: 'script' | 'style' | 'image' | 'fetch', priority = 1): void {
    this.preloader.preloadResource(url, type, priority);
  }

  getOptimizationStrategies(): OptimizationStrategy[] {
    return Array.from(this.strategies.values());
  }

  getPerformanceSummary(): {
    coreWebVitals: { lcp?: number; fid?: number; cls?: number };
    loadingMetrics: { pageLoad?: number; domContentLoaded?: number; firstByte?: number };
    cachePerformance: { size: number; hitRate: number; memoryUsage: number };
    activeStrategies: number;
  } {
    const metrics = this.monitor.getMetrics();
    
    const lcp = metrics.find(m => m.name === 'largest_contentful_paint')?.value;
    const fid = metrics.find(m => m.name === 'first_input_delay')?.value;
    const cls = metrics.find(m => m.name === 'cumulative_layout_shift')?.value;
    
    const pageLoad = metrics.find(m => m.name === 'page_load_time')?.value;
    const domContentLoaded = metrics.find(m => m.name === 'dom_content_loaded')?.value;
    const firstByte = metrics.find(m => m.name === 'first_byte')?.value;
    
    const activeStrategies = Array.from(this.strategies.values()).filter(s => s.isActive).length;

    return {
      coreWebVitals: { lcp, fid, cls },
      loadingMetrics: { pageLoad, domContentLoaded, firstByte },
      cachePerformance: this.cache.getStats(),
      activeStrategies,
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

export default performanceOptimizer;
