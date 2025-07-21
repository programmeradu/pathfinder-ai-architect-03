/**
 * Advanced Logging System for Pathfinder AI
 * Comprehensive logging with different levels, contexts, and production monitoring
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  timestamp: Date;
  id: string;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private minLevel: LogLevel;
  private sessionId: string;

  constructor() {
    this.minLevel = this.getMinLogLevel();
    this.sessionId = this.generateSessionId();
    
    // Initialize error tracking
    this.setupGlobalErrorHandling();
    
    // Initialize performance monitoring
    this.setupPerformanceMonitoring();
  }

  private getMinLogLevel(): LogLevel {
    const env = import.meta.env.MODE;
    switch (env) {
      case 'development':
        return LogLevel.DEBUG;
      case 'staging':
        return LogLevel.INFO;
      case 'production':
        return LogLevel.WARN;
      default:
        return LogLevel.INFO;
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandling(): void {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        component: 'Global',
        action: 'unhandledrejection',
        metadata: {
          reason: event.reason,
          promise: event.promise,
        },
      });
    });

    // Catch global errors
    window.addEventListener('error', (event) => {
      this.error('Global Error', {
        component: 'Global',
        action: 'error',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        },
      });
    });
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (perfData) {
            this.info('Page Load Performance', {
              component: 'Performance',
              action: 'page_load',
              metadata: {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint(),
              },
            });
          }
        }, 0);
      });
    }
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }

  private createLogEntry(level: LogLevel, message: string, context: LogContext = {}): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date(),
      context: {
        ...context,
        sessionId: this.sessionId,
        timestamp: context.timestamp || new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    };

    // Add stack trace for errors
    if (level >= LogLevel.ERROR) {
      entry.stack = new Error().stack;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (import.meta.env.MODE === 'development') {
      this.outputToConsole(entry);
    }

    // Send to external service in production
    if (import.meta.env.MODE === 'production' && entry.level >= LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, entry.message, entry.context);
        if (entry.stack) {
          console.error('Stack trace:', entry.stack);
        }
        break;
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // Replace with actual logging service (e.g., Sentry, LogRocket, DataDog)
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
      this.addLog(entry);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, context);
      this.addLog(entry);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, context);
      this.addLog(entry);
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, context);
      this.addLog(entry);
    }
  }

  critical(message: string, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context);
    this.addLog(entry);
  }

  // Utility methods
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string, context?: LogContext): void {
    console.timeEnd(label);
    this.info(`Timer: ${label}`, {
      ...context,
      component: 'Performance',
      action: 'timer',
    });
  }

  // User action tracking
  trackUserAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      component: 'UserTracking',
      action: 'user_action',
    });
  }

  // API call logging
  trackAPICall(endpoint: string, method: string, duration: number, status: number, context?: LogContext): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API Call: ${method} ${endpoint} - ${status} (${duration}ms)`;
    
    if (level === LogLevel.ERROR) {
      this.error(message, {
        ...context,
        component: 'API',
        action: 'api_call',
        metadata: {
          endpoint,
          method,
          duration,
          status,
        },
      });
    } else {
      this.info(message, {
        ...context,
        component: 'API',
        action: 'api_call',
        metadata: {
          endpoint,
          method,
          duration,
          status,
        },
      });
    }
  }

  // ML model logging
  trackMLModelExecution(modelName: string, duration: number, accuracy?: number, context?: LogContext): void {
    this.info(`ML Model Execution: ${modelName}`, {
      ...context,
      component: 'MLModel',
      action: 'model_execution',
      metadata: {
        modelName,
        duration,
        accuracy,
      },
    });
  }

  // Feature usage tracking
  trackFeatureUsage(feature: string, context?: LogContext): void {
    this.info(`Feature Usage: ${feature}`, {
      ...context,
      component: 'FeatureTracking',
      action: 'feature_usage',
      metadata: {
        feature,
      },
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, context?: LogContext) => logger.error(message, context),
  critical: (message: string, context?: LogContext) => logger.critical(message, context),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string, context?: LogContext) => logger.timeEnd(label, context),
  trackUserAction: (action: string, context?: LogContext) => logger.trackUserAction(action, context),
  trackAPICall: (endpoint: string, method: string, duration: number, status: number, context?: LogContext) => 
    logger.trackAPICall(endpoint, method, duration, status, context),
  trackMLModel: (modelName: string, duration: number, accuracy?: number, context?: LogContext) => 
    logger.trackMLModelExecution(modelName, duration, accuracy, context),
  trackFeature: (feature: string, context?: LogContext) => logger.trackFeatureUsage(feature, context),
};

export default logger;
