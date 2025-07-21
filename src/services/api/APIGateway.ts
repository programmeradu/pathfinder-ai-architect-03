/**
 * API Gateway Service
 * Centralized API management with rate limiting, caching, and authentication
 */

import { logger } from '@/lib/logger';
import { appConfig } from '@/config/appConfig';

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: (request: APIRequest) => Promise<APIResponse>;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  cache?: {
    ttl: number; // Time to live in seconds
    key?: (request: APIRequest) => string;
  };
  auth?: {
    required: boolean;
    roles?: string[];
  };
  validation?: {
    body?: any;
    query?: any;
    params?: any;
  };
}

export interface APIRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, any>;
  params: Record<string, any>;
  body: any;
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  ip: string;
  timestamp: Date;
}

export interface APIResponse {
  status: number;
  data?: any;
  error?: string;
  headers?: Record<string, string>;
  cached?: boolean;
}

export interface RateLimitInfo {
  windowMs: number;
  maxRequests: number;
  currentRequests: number;
  resetTime: Date;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number;
}

// Rate Limiting Service
class RateLimiter {
  private windows: Map<string, Map<string, number>> = new Map();
  private windowResets: Map<string, Date> = new Map();

  checkRateLimit(clientId: string, endpoint: string, config: { windowMs: number; maxRequests: number }): RateLimitInfo {
    const key = `${clientId}:${endpoint}`;
    const now = new Date();
    
    // Get or create window for this endpoint
    if (!this.windows.has(endpoint)) {
      this.windows.set(endpoint, new Map());
    }
    
    const window = this.windows.get(endpoint)!;
    const resetTime = this.windowResets.get(key);
    
    // Reset window if expired
    if (!resetTime || now.getTime() > resetTime.getTime()) {
      window.set(clientId, 0);
      this.windowResets.set(key, new Date(now.getTime() + config.windowMs));
    }
    
    const currentRequests = window.get(clientId) || 0;
    
    return {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      currentRequests,
      resetTime: this.windowResets.get(key) || now,
    };
  }

  incrementCounter(clientId: string, endpoint: string): void {
    if (!this.windows.has(endpoint)) {
      this.windows.set(endpoint, new Map());
    }
    
    const window = this.windows.get(endpoint)!;
    const current = window.get(clientId) || 0;
    window.set(clientId, current + 1);
  }
}

// Caching Service
class APICache {
  private cache: Map<string, CacheEntry> = new Map();
  private cleanupInterval: number;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const now = new Date();
    const expiryTime = new Date(entry.timestamp.getTime() + entry.ttl * 1000);
    
    if (now > expiryTime) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: any, ttl: number): void {
    const entry: CacheEntry = {
      key,
      data,
      timestamp: new Date(),
      ttl,
    };
    
    this.cache.set(key, entry);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = new Date();
    
    for (const [key, entry] of this.cache.entries()) {
      const expiryTime = new Date(entry.timestamp.getTime() + entry.ttl * 1000);
      
      if (now > expiryTime) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    // Mock stats - in production, you'd track hits/misses
    return {
      size: this.cache.size,
      hitRate: 0.75, // 75% hit rate
    };
  }
}

// Authentication Service
class AuthenticationService {
  async validateToken(token: string): Promise<{ id: string; email: string; roles: string[] } | null> {
    try {
      // Mock token validation - in production, this would validate JWT
      if (!token || token === 'invalid') {
        return null;
      }
      
      // Mock user data
      return {
        id: 'user-123',
        email: 'user@example.com',
        roles: ['user'],
      };
    } catch (error) {
      logger.error('Token validation failed', {
        component: 'AuthenticationService',
        action: 'validate_token',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return null;
    }
  }

  hasPermission(userRoles: string[], requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }
    
    return requiredRoles.some(role => userRoles.includes(role));
  }
}

// Main API Gateway
export class APIGateway {
  private endpoints: Map<string, APIEndpoint> = new Map();
  private rateLimiter: RateLimiter;
  private cache: APICache;
  private auth: AuthenticationService;
  private requestCount = 0;
  private errorCount = 0;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.cache = new APICache();
    this.auth = new AuthenticationService();
    
    this.registerDefaultEndpoints();
    
    logger.info('API Gateway initialized', {
      component: 'APIGateway',
      action: 'initialize',
    });
  }

  private registerDefaultEndpoints(): void {
    // Health check endpoint
    this.registerEndpoint({
      path: '/api/health',
      method: 'GET',
      handler: async () => ({
        status: 200,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: appConfig.app.version,
        },
      }),
      cache: { ttl: 30 },
    });

    // User profile endpoints
    this.registerEndpoint({
      path: '/api/user/profile',
      method: 'GET',
      handler: async (request) => ({
        status: 200,
        data: {
          id: request.user?.id,
          email: request.user?.email,
          profile: 'Mock user profile data',
        },
      }),
      auth: { required: true },
      cache: { ttl: 300 },
    });

    // Career prediction endpoint
    this.registerEndpoint({
      path: '/api/career/predict',
      method: 'POST',
      handler: async (request) => ({
        status: 200,
        data: {
          prediction: 'Mock career prediction',
          confidence: 0.85,
          factors: ['Experience', 'Skills', 'Market trends'],
        },
      }),
      auth: { required: true },
      rateLimit: { windowMs: 60000, maxRequests: 10 },
    });

    // Skill demand forecast endpoint
    this.registerEndpoint({
      path: '/api/skills/forecast',
      method: 'GET',
      handler: async (request) => ({
        status: 200,
        data: {
          skill: request.query.skill,
          forecast: [85, 87, 90, 92, 95],
          timeframes: ['3 months', '6 months', '9 months', '12 months', '18 months'],
        },
      }),
      auth: { required: true },
      cache: { ttl: 3600 }, // 1 hour cache
      rateLimit: { windowMs: 60000, maxRequests: 20 },
    });
  }

  registerEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`;
    this.endpoints.set(key, endpoint);
    
    logger.debug('API endpoint registered', {
      component: 'APIGateway',
      action: 'register_endpoint',
      metadata: { method: endpoint.method, path: endpoint.path },
    });
  }

  async handleRequest(request: APIRequest): Promise<APIResponse> {
    const startTime = performance.now();
    this.requestCount++;
    
    try {
      logger.debug('Processing API request', {
        component: 'APIGateway',
        action: 'handle_request',
        metadata: { 
          method: request.method, 
          path: request.path,
          ip: request.ip,
        },
      });

      // Find matching endpoint
      const key = `${request.method}:${request.path}`;
      const endpoint = this.endpoints.get(key);
      
      if (!endpoint) {
        return {
          status: 404,
          error: 'Endpoint not found',
        };
      }

      // Authentication check
      if (endpoint.auth?.required) {
        const token = request.headers.authorization?.replace('Bearer ', '');
        const user = token ? await this.auth.validateToken(token) : null;
        
        if (!user) {
          return {
            status: 401,
            error: 'Authentication required',
          };
        }
        
        if (endpoint.auth.roles && !this.auth.hasPermission(user.roles, endpoint.auth.roles)) {
          return {
            status: 403,
            error: 'Insufficient permissions',
          };
        }
        
        request.user = user;
      }

      // Rate limiting check
      if (endpoint.rateLimit) {
        const clientId = request.user?.id || request.ip;
        const rateLimitInfo = this.rateLimiter.checkRateLimit(
          clientId,
          request.path,
          endpoint.rateLimit
        );
        
        if (rateLimitInfo.currentRequests >= rateLimitInfo.maxRequests) {
          return {
            status: 429,
            error: 'Rate limit exceeded',
            headers: {
              'X-RateLimit-Limit': rateLimitInfo.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitInfo.resetTime.toISOString(),
            },
          };
        }
        
        this.rateLimiter.incrementCounter(clientId, request.path);
      }

      // Cache check
      let cacheKey: string | null = null;
      if (endpoint.cache && request.method === 'GET') {
        cacheKey = endpoint.cache.key 
          ? endpoint.cache.key(request)
          : `${request.path}:${JSON.stringify(request.query)}`;
        
        const cachedResponse = this.cache.get(cacheKey);
        if (cachedResponse) {
          return {
            ...cachedResponse,
            cached: true,
          };
        }
      }

      // Execute endpoint handler
      const response = await endpoint.handler(request);
      
      // Cache response if applicable
      if (endpoint.cache && request.method === 'GET' && response.status === 200 && cacheKey) {
        this.cache.set(cacheKey, response, endpoint.cache.ttl);
      }

      const processingTime = performance.now() - startTime;
      
      logger.info('API request completed', {
        component: 'APIGateway',
        action: 'request_completed',
        metadata: { 
          method: request.method,
          path: request.path,
          status: response.status,
          processingTime,
          cached: response.cached || false,
        },
      });

      return response;
      
    } catch (error) {
      this.errorCount++;
      
      logger.error('API request failed', {
        component: 'APIGateway',
        action: 'request_failed',
        metadata: { 
          method: request.method,
          path: request.path,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      return {
        status: 500,
        error: 'Internal server error',
      };
    }
  }

  getStats(): {
    totalRequests: number;
    errorCount: number;
    errorRate: number;
    cacheStats: { size: number; hitRate: number };
    endpointCount: number;
  } {
    return {
      totalRequests: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      cacheStats: this.cache.getStats(),
      endpointCount: this.endpoints.size,
    };
  }

  clearCache(): void {
    this.cache.clear();
    logger.info('API cache cleared', {
      component: 'APIGateway',
      action: 'clear_cache',
    });
  }

  getEndpoints(): Array<{ method: string; path: string; auth: boolean; cached: boolean; rateLimit: boolean }> {
    return Array.from(this.endpoints.entries()).map(([key, endpoint]) => ({
      method: endpoint.method,
      path: endpoint.path,
      auth: endpoint.auth?.required || false,
      cached: !!endpoint.cache,
      rateLimit: !!endpoint.rateLimit,
    }));
  }
}

// Singleton instance
export const apiGateway = new APIGateway();

export default apiGateway;
