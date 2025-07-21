/**
 * Pathfinder AI - Main Application
 * Beautiful, sophisticated UI/UX with world-class design standards
 */

import React, { useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// Core imports
import { AppRouter } from '@/router/AppRouter';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useGlobalStore } from '@/store/globalStore';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { logger } from '@/lib/logger';

// Performance monitoring
import { performanceOptimizer } from '@/services/performance/PerformanceOptimizer';

// Create React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Beautiful loading screen component
const AppLoadingScreen: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50"
  >
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="relative">
          {/* Animated logo placeholder */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 bg-white rounded-full"
            />
          </motion.div>

          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-indigo-300"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-purple-300"
          />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
      >
        Pathfinder AI
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-gray-600 font-medium"
      >
        Discovering your perfect path...
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8"
      >
        <LoadingSpinner size="lg" />
      </motion.div>
    </div>
  </motion.div>
);

// App initialization component
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeApp, isInitialized } = useGlobalStore();

  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing Pathfinder AI application', {
          component: 'App',
          action: 'initialize',
        });

        // Initialize performance monitoring
        performanceOptimizer.recordMetric('app_start', performance.now(), 'ms', 'loading');

        // Initialize global store
        await initializeApp();

        // Record initialization complete
        performanceOptimizer.recordMetric('app_initialized', performance.now(), 'ms', 'loading');

        logger.info('Application initialized successfully', {
          component: 'App',
          action: 'initialize_complete',
        });
      } catch (error) {
        logger.error('Application initialization failed', {
          component: 'App',
          action: 'initialize_error',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }
    };

    initApp();
  }, [initializeApp]);

  if (!isInitialized) {
    return <AppLoadingScreen />;
  }

  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
  useEffect(() => {
    // Set up global error handlers
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', {
        component: 'App',
        action: 'unhandled_rejection',
        metadata: { reason: event.reason },
      });
    };

    const handleError = (event: ErrorEvent) => {
      logger.error('Global error handler', {
        component: 'App',
        action: 'global_error',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            performanceOptimizer.recordMetric('page_load', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms', 'loading');
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        logger.error('App error boundary triggered', {
          component: 'App',
          action: 'error_boundary',
          metadata: { error: error.message, errorInfo },
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppInitializer>
            <AnimatePresence mode="wait">
              <Suspense fallback={<AppLoadingScreen />}>
                <AppRouter />
              </Suspense>
            </AnimatePresence>
          </AppInitializer>

          {/* Beautiful toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />

          {/* Development tools */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom-right"
            />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
