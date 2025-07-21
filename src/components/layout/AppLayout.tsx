/**
 * App Layout - Beautiful Main Application Layout
 * Responsive layout with navigation, sidebar, and content areas
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileNavigation, useMobileNavigation } from '@/components/mobile/MobileNavigation';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { AccessibilityChecker } from '@/components/accessibility/AccessibilityChecker';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useGlobalStore } from '@/store/globalStore';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, notifications } = useGlobalStore();
  const { isMobile, isTablet } = useResponsive();
  const { isVisible: showMobileNav } = useMobileNavigation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showAccessibilityChecker, setShowAccessibilityChecker] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowSearch(false);
        setShowSettings(false);
        setShowPerformanceMonitor(false);
        setShowAccessibilityChecker(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  const contentMargin = sidebarCollapsed ? 'ml-16' : 'ml-64';

  return (
    <ErrorBoundary level="page">
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 64 : 256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900">Pathfinder AI</span>
                    </motion.div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1"
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Navigation items would go here */}
                <div className="p-2">
                  {/* Placeholder for navigation items */}
                  <div className="space-y-1">
                    {[
                      { label: 'Dashboard', active: location.pathname === '/dashboard' },
                      { label: 'Analysis', active: location.pathname === '/analysis' },
                      { label: 'Life Paths', active: location.pathname === '/life-paths' },
                      { label: 'Simulator', active: location.pathname === '/career-simulator' },
                      { label: 'Global Ops', active: location.pathname === '/global-opportunities' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                          item.active 
                            ? "bg-indigo-100 text-indigo-700" 
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <div className="w-5 h-5 bg-gray-300 rounded" />
                        {!sidebarCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Main Content Area */}
        <div className={cn("min-h-screen", !isMobile && contentMargin)}>
          {/* Top Navigation */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
                
                {!isMobile && (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {location.pathname === '/dashboard' && 'Dashboard'}
                      {location.pathname === '/analysis' && 'AI Analysis'}
                      {location.pathname === '/life-paths' && 'Life Paths'}
                      {location.pathname === '/career-simulator' && 'Career Simulator'}
                      {location.pathname === '/global-opportunities' && 'Global Opportunities'}
                    </h1>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="hidden sm:flex"
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span className="text-sm text-gray-500">Search...</span>
                  <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 rounded">⌘K</kbd>
                </Button>

                {/* Mobile Search */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                )}

                {/* Development Tools */}
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPerformanceMonitor(true)}
                      title="Performance Monitor"
                    >
                      <Activity className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAccessibilityChecker(true)}
                      title="Accessibility Checker"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>

                {/* Settings */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-5 h-5" />
                </Button>

                {/* User Avatar */}
                {!isMobile && (
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            <ErrorBoundary level="component">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[calc(100vh-4rem)]"
                >
                  {children || <Outlet />}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>

        {/* Mobile Navigation */}
        {isMobile && showMobileNav && (
          <MobileNavigation />
        )}

        {/* Modals and Overlays */}
        <AnimatePresence>
          {showNotifications && (
            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
          
          {showSearch && (
            <GlobalSearch
              isOpen={showSearch}
              onClose={() => setShowSearch(false)}
            />
          )}
          
          {showSettings && (
            <SettingsPanel
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
          
          {showPerformanceMonitor && (
            <PerformanceMonitor
              isOpen={showPerformanceMonitor}
              onClose={() => setShowPerformanceMonitor(false)}
            />
          )}
          
          {showAccessibilityChecker && (
            <AccessibilityChecker
              isOpen={showAccessibilityChecker}
              onClose={() => setShowAccessibilityChecker(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};
