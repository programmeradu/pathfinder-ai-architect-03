/**
 * Application Monitoring Service
 * Real-time monitoring and alerting for production applications
 */

import { logger } from '@/lib/logger';
import { useGlobalStore } from '@/store/globalStore';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  service: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private metrics: PerformanceMetric[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alerts: Alert[] = [];
  private isMonitoring = false;
  private monitoringInterval: number | null = null;

  constructor() {
    this.startMonitoring();
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    logger.info('Monitoring service started');

    // Start periodic health checks
    this.monitoringInterval = window.setInterval(() => {
      this.performHealthChecks();
      this.collectPerformanceMetrics();
      this.checkAlertConditions();
    }, 30000); // Every 30 seconds

    // Initial health check
    this.performHealthChecks();
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    logger.info('Monitoring service stopped');
  }

  private async performHealthChecks(): Promise<void> {
    const services = [
      { name: 'API', endpoint: '/api/health' },
      { name: 'ML Models', endpoint: '/api/models/health' },
      { name: 'Database', endpoint: '/api/db/health' },
      { name: 'External APIs', endpoint: '/api/external/health' },
    ];

    for (const service of services) {
      await this.checkServiceHealth(service.name, service.endpoint);
    }
  }

  private async checkServiceHealth(serviceName: string, endpoint: string): Promise<void> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      });

      const responseTime = performance.now() - startTime;
      const status = response.ok ? 'healthy' : 'degraded';

      const healthCheck: HealthCheck = {
        service: serviceName,
        status,
        responseTime,
        lastCheck: new Date(),
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };

      this.healthChecks.set(serviceName, healthCheck);

      if (!response.ok) {
        this.createAlert('warning', `Service ${serviceName} is degraded`, serviceName, {
          status: response.status,
          responseTime,
        });
      }

    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      const healthCheck: HealthCheck = {
        service: serviceName,
        status: 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.healthChecks.set(serviceName, healthCheck);

      this.createAlert('error', `Service ${serviceName} is unhealthy`, serviceName, {
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });

      logger.error(`Health check failed for ${serviceName}`, {
        component: 'Monitoring',
        action: 'health_check',
        metadata: { serviceName, error },
      });
    }
  }

  private collectPerformanceMetrics(): void {
    // Memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.addMetric('memory_used', memory.usedJSHeapSize / 1024 / 1024, 'MB');
      this.addMetric('memory_total', memory.totalJSHeapSize / 1024 / 1024, 'MB');
      this.addMetric('memory_limit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
    }

    // Connection information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.addMetric('network_downlink', connection.downlink, 'Mbps');
      this.addMetric('network_rtt', connection.rtt, 'ms');
    }

    // Page visibility
    this.addMetric('page_visible', document.visibilityState === 'visible' ? 1 : 0, 'boolean');

    // Store metrics count
    const store = useGlobalStore.getState();
    this.addMetric('store_notifications', store.notifications.length, 'count');
    this.addMetric('store_errors', store.errors.length, 'count');
  }

  private addMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      context,
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log significant metrics
    if (this.isSignificantMetric(name, value)) {
      logger.info(`Performance metric: ${name}`, {
        component: 'Monitoring',
        action: 'metric_collection',
        metadata: { name, value, unit },
      });
    }
  }

  private isSignificantMetric(name: string, value: number): boolean {
    switch (name) {
      case 'memory_used':
        return value > 100; // Log if memory usage > 100MB
      case 'network_rtt':
        return value > 1000; // Log if RTT > 1 second
      case 'page_load_time':
        return value > 3000; // Log if page load > 3 seconds
      default:
        return false;
    }
  }

  private checkAlertConditions(): void {
    // Check memory usage
    const memoryMetric = this.getLatestMetric('memory_used');
    if (memoryMetric && memoryMetric.value > 200) {
      this.createAlert('warning', 'High memory usage detected', 'Performance', {
        memoryUsage: memoryMetric.value,
      });
    }

    // Check error count
    const store = useGlobalStore.getState();
    if (store.errors.length > 10) {
      this.createAlert('error', 'High error count detected', 'Application', {
        errorCount: store.errors.length,
      });
    }

    // Check network conditions
    const rttMetric = this.getLatestMetric('network_rtt');
    if (rttMetric && rttMetric.value > 2000) {
      this.createAlert('warning', 'Poor network conditions detected', 'Network', {
        rtt: rttMetric.value,
      });
    }
  }

  private createAlert(level: Alert['level'], message: string, service: string, metadata?: Record<string, any>): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      service,
      timestamp: new Date(),
      resolved: false,
      metadata,
    };

    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log alert
    logger.warn(`Alert created: ${message}`, {
      component: 'Monitoring',
      action: 'alert_created',
      metadata: { level, service, ...metadata },
    });

    // Add to global store notifications for critical alerts
    if (level === 'critical' || level === 'error') {
      const addNotification = useGlobalStore.getState().addNotification;
      addNotification({
        type: level === 'critical' ? 'error' : 'warning',
        title: `${service} Alert`,
        message,
        read: false,
      });
    }
  }

  // Public methods
  getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  getMetrics(name?: string, limit = 100): PerformanceMetric[] {
    let filteredMetrics = name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;

    return filteredMetrics.slice(-limit);
  }

  getLatestMetric(name: string): PerformanceMetric | undefined {
    const metrics = this.metrics.filter(m => m.name === name);
    return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
  }

  getAlerts(resolved = false): Alert[] {
    return this.alerts.filter(alert => alert.resolved === resolved);
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      logger.info(`Alert resolved: ${alert.message}`, {
        component: 'Monitoring',
        action: 'alert_resolved',
        metadata: { alertId, service: alert.service },
      });
    }
  }

  // Manual metric recording
  recordMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    this.addMetric(name, value, unit, context);
  }

  // Performance timing helpers
  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.addMetric(`timer_${name}`, duration, 'ms');
    };
  }

  // Resource monitoring
  monitorResource(name: string, resource: Promise<any>): Promise<any> {
    const startTime = performance.now();
    
    return resource
      .then(result => {
        const duration = performance.now() - startTime;
        this.addMetric(`resource_${name}_success`, duration, 'ms');
        return result;
      })
      .catch(error => {
        const duration = performance.now() - startTime;
        this.addMetric(`resource_${name}_error`, duration, 'ms');
        this.createAlert('error', `Resource ${name} failed`, 'Resource', {
          error: error.message,
          duration,
        });
        throw error;
      });
  }

  // System status summary
  getSystemStatus(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: HealthCheck[];
    activeAlerts: number;
    criticalAlerts: number;
  } {
    const services = this.getHealthChecks();
    const activeAlerts = this.getAlerts(false);
    const criticalAlerts = activeAlerts.filter(a => a.level === 'critical');

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (services.some(s => s.status === 'unhealthy') || criticalAlerts.length > 0) {
      overall = 'unhealthy';
    } else if (services.some(s => s.status === 'degraded') || activeAlerts.length > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      services,
      activeAlerts: activeAlerts.length,
      criticalAlerts: criticalAlerts.length,
    };
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

export default monitoring;
