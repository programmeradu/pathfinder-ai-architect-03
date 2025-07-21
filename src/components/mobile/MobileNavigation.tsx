/**
 * Mobile Navigation - Beautiful Bottom Tab Navigation
 * Touch-optimized navigation with haptic feedback and smooth animations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Compass, 
  Play, 
  Globe,
  User,
  Plus,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  color: string;
}

interface MobileNavigationProps {
  className?: string;
  variant?: 'bottom' | 'floating';
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    color: 'text-blue-600'
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: BarChart3,
    path: '/analysis',
    color: 'text-purple-600'
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: Compass,
    path: '/life-paths',
    color: 'text-green-600'
  },
  {
    id: 'simulator',
    label: 'Simulator',
    icon: Play,
    path: '/career-simulator',
    color: 'text-orange-600'
  },
  {
    id: 'global',
    label: 'Global',
    icon: Globe,
    path: '/global-opportunities',
    badge: 3,
    color: 'text-indigo-600'
  }
];

const quickActions = [
  { id: 'search', label: 'Search', icon: Search, color: 'bg-blue-500' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-purple-500', badge: 5 },
  { id: 'profile', label: 'Profile', icon: User, color: 'bg-green-500' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-orange-500' },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className,
  variant = 'bottom'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState(
    navigationItems.find(item => item.path === location.pathname)?.id || 'dashboard'
  );

  const { triggerHaptic } = useTouchGestures({
    enableHaptics: true
  });

  const handleTabPress = (item: NavigationItem) => {
    if (item.id === activeTab) {
      // Double tap on active tab - scroll to top or refresh
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerHaptic('light');
    } else {
      setActiveTab(item.id);
      navigate(item.path);
      triggerHaptic('medium');
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    triggerHaptic('light');
    // Handle quick action navigation
    switch (action.id) {
      case 'search':
        navigate('/search');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
    }
    setShowQuickActions(false);
  };

  const baseClasses = cn(
    "fixed bottom-0 left-0 right-0 z-50",
    variant === 'floating' && "p-4"
  );

  const containerClasses = cn(
    "bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl",
    variant === 'floating' && "rounded-2xl border border-gray-200/50 mx-4 mb-4"
  );

  return (
    <>
      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowQuickActions(false)}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-24 right-6 space-y-3"
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ scale: 0, x: 20 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                    {action.label}
                  </span>
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center shadow-lg relative`}>
                    <action.icon className="w-6 h-6 text-white" />
                    {action.badge && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <div className={baseClasses}>
        <div className={containerClasses}>
          <div className="flex items-center justify-between px-2 py-2">
            {navigationItems.map((item, index) => {
              const isActive = item.id === activeTab;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabPress(item)}
                  className="relative flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon container */}
                  <div className="relative mb-1">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        y: isActive ? -2 : 0
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                        isActive 
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
                          : "text-gray-500"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="w-5 h-5 p-0 bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <motion.span
                    animate={{
                      color: isActive ? '#6366f1' : '#6b7280',
                      fontWeight: isActive ? 600 : 400
                    }}
                    className="text-xs leading-none"
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Active dot */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute -top-6 right-6"
        >
          <Button
            onClick={() => setShowQuickActions(!showQuickActions)}
            size="lg"
            className={cn(
              "w-12 h-12 rounded-full shadow-lg transition-all duration-300",
              showQuickActions
                ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rotate-45"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            )}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </>
  );
};

// Hook for managing mobile navigation state
export function useMobileNavigation() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navigation when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide navigation on certain pages
  const shouldHideNavigation = ['/login', '/register', '/onboarding'].includes(location.pathname);

  return {
    isVisible: isVisible && !shouldHideNavigation,
    currentPath: location.pathname,
  };
}

export default MobileNavigation;
