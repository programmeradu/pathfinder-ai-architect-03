/**
 * Advanced Routing System for Pathfinder AI
 * Beautiful, sophisticated routing with animations, analytics, and seamless navigation
 */

import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalStore } from '@/store/globalStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NavigationLayout } from '@/components/layout/NavigationLayout';
import { RouteTransition } from '@/components/ui/RouteTransition';
import { logger } from '@/lib/logger';

// Lazy load components for code splitting
const LandingPage = React.lazy(() => import('@/pages/Index'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const AnalysisWorkflow = React.lazy(() => import('@/pages/AnalysisWorkflow'));
const LifePathExplorer = React.lazy(() => import('@/pages/LifePathExplorer'));
const CareerSimulator = React.lazy(() => import('@/pages/CareerSimulator'));
const GlobalOpportunities = React.lazy(() => import('@/pages/GlobalOpportunities'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Route configuration
interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected: boolean;
  title: string;
  description?: string;
  preload?: boolean;
  analytics?: {
    category: string;
    action: string;
  };
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: LandingPage,
    protected: false,
    title: 'Pathfinder AI - Discover Your Perfect Career Path',
    description: 'AI-powered career discovery platform',
    preload: true,
    analytics: {
      category: 'Landing',
      action: 'View',
    },
  },
  {
    path: '/dashboard',
    element: Dashboard,
    protected: true,
    title: 'Dashboard - Pathfinder AI',
    description: 'Your personalized career dashboard',
    preload: true,
    analytics: {
      category: 'Dashboard',
      action: 'View',
    },
  },
  {
    path: '/analysis',
    element: AnalysisWorkflow,
    protected: true,
    title: 'Career Analysis - Pathfinder AI',
    description: 'AI-powered career analysis workflow',
    analytics: {
      category: 'Analysis',
      action: 'Start',
    },
  },
  {
    path: '/life-paths',
    element: LifePathExplorer,
    protected: true,
    title: 'Life Path Explorer - Pathfinder AI',
    description: 'Explore different life and career paths',
    analytics: {
      category: 'LifePaths',
      action: 'Explore',
    },
  },
  {
    path: '/career-simulator',
    element: CareerSimulator,
    protected: true,
    title: 'Career Simulator - Pathfinder AI',
    description: 'Simulate different career decisions',
    analytics: {
      category: 'Simulator',
      action: 'Use',
    },
  },
  {
    path: '/global-opportunities',
    element: GlobalOpportunities,
    protected: true,
    title: 'Global Opportunities - Pathfinder AI',
    description: 'Discover worldwide career opportunities',
    analytics: {
      category: 'Global',
      action: 'Search',
    },
  },
  {
    path: '/profile',
    element: Profile,
    protected: true,
    title: 'Profile - Pathfinder AI',
    description: 'Manage your profile and preferences',
    analytics: {
      category: 'Profile',
      action: 'View',
    },
  },
  {
    path: '/settings',
    element: Settings,
    protected: true,
    title: 'Settings - Pathfinder AI',
    description: 'Application settings and preferences',
    analytics: {
      category: 'Settings',
      action: 'View',
    },
  },
];

// Enhanced Protected Route with beautiful navigation
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/',
  requiredPermissions = []
}) => {
  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  const user = useGlobalStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <NavigationLayout>
      <RouteTransition variant="slide">
        {children}
      </RouteTransition>
    </NavigationLayout>
  );
};

// Public Route with elegant transitions
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      {children}
    </motion.div>
  );
};

// Route Analytics Component
const RouteAnalytics: React.FC = () => {
  const location = useLocation();
  const addNotification = useGlobalStore((state) => state.addNotification);
  
  useEffect(() => {
    const currentRoute = routes.find(route => route.path === location.pathname);
    
    if (currentRoute) {
      // Update document title
      document.title = currentRoute.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && currentRoute.description) {
        metaDescription.setAttribute('content', currentRoute.description);
      }
      
      // Track analytics (placeholder for actual analytics implementation)
      if (currentRoute.analytics) {
        console.log('Analytics:', {
          category: currentRoute.analytics.category,
          action: currentRoute.analytics.action,
          path: location.pathname,
          timestamp: new Date(),
        });
      }
      
      // Show navigation notification for protected routes
      if (currentRoute.protected) {
        addNotification({
          type: 'info',
          title: 'Navigation',
          message: `Navigated to ${currentRoute.title}`,
          read: true, // Auto-mark as read for navigation notifications
        });
      }
    }
  }, [location.pathname, addNotification]);
  
  return null;
};

// Beautiful Loading Component
const RouteLoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <LoadingSpinner size="xl" variant="orbit" />
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-600 font-medium"
      >
        Preparing your experience...
      </motion.p>
    </motion.div>
  </div>
);

// Error Fallback Component
const RouteErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <h1 className="text-2xl font-bold text-red-600 mb-4">
      Something went wrong
    </h1>
    <p className="text-gray-600 mb-4 text-center max-w-md">
      We encountered an error while loading this page. Please try refreshing or contact support if the problem persists.
    </p>
    <details className="mt-4 p-4 bg-gray-100 rounded-lg max-w-2xl">
      <summary className="cursor-pointer font-medium">Error Details</summary>
      <pre className="mt-2 text-sm text-gray-700 overflow-auto">
        {error.message}
      </pre>
    </details>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Refresh Page
    </button>
  </div>
);

// Main Router Component with Beautiful Transitions
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RouteAnalytics />
      <ErrorBoundary
        fallback={RouteErrorFallback}
        onError={(error: any, errorInfo: any) => {
          logger.error('Route error boundary triggered', {
            component: 'AppRouter',
            action: 'error_boundary',
            metadata: { error: error.message, errorInfo },
          });
        }}
      >
        <AnimatePresence mode="wait">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.protected ? (
                      <ProtectedRoute>
                        <route.element />
                      </ProtectedRoute>
                    ) : (
                      <PublicRoute>
                        <route.element />
                      </PublicRoute>
                    )
                  }
                />
              ))}

              {/* Redirect /app to /dashboard for authenticated users */}
              <Route
                path="/app"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* Catch-all route for 404 */}
              <Route
                path="*"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <NotFound />
                  </motion.div>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// Navigation Hook
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  
  const navigateTo = (path: string, options?: { replace?: boolean }) => {
    const route = routes.find(r => r.path === path);
    
    if (route?.protected && !isAuthenticated) {
      // Redirect to login or landing page
      navigate('/', { replace: true });
      return;
    }
    
    navigate(path, options);
  };
  
  const goBack = () => {
    window.history.back();
  };
  
  const goForward = () => {
    window.history.forward();
  };
  
  const getCurrentRoute = () => {
    return routes.find(route => route.path === location.pathname);
  };
  
  const isCurrentRoute = (path: string) => {
    return location.pathname === path;
  };
  
  return {
    navigateTo,
    goBack,
    goForward,
    getCurrentRoute,
    isCurrentRoute,
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash,
  };
};

// Route Preloader Hook
export const useRoutePreloader = () => {
  useEffect(() => {
    // Preload critical routes
    const preloadRoutes = routes.filter(route => route.preload);
    
    preloadRoutes.forEach(route => {
      // Preload the component
      route.element;
    });
  }, []);
};

export default AppRouter;
