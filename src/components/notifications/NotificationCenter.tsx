/**
 * Notification Center - Beautiful In-App Notifications
 * Comprehensive notification system with real-time alerts and messaging
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Clock,
  Star,
  Trash2,
  Settings,
  Filter,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGlobalStore } from '@/store/globalStore';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'primary' | 'destructive';
}

interface ExtendedNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'career' | 'market' | 'social' | 'achievement';
  avatar?: string;
  actions?: NotificationAction[];
  link?: string;
  persistent?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
  isOpen,
  onClose
}) => {
  const { notifications, markNotificationRead, clearNotifications } = useGlobalStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Enhanced notifications with additional properties
  const [enhancedNotifications, setEnhancedNotifications] = useState<ExtendedNotification[]>([]);

  useEffect(() => {
    // Convert basic notifications to enhanced format
    const enhanced = notifications.map(notification => ({
      ...notification,
      priority: notification.type === 'error' ? 'high' as const : 'medium' as const,
      category: 'system' as const,
      persistent: notification.type === 'error',
    }));

    // Add some mock enhanced notifications for demo
    const mockNotifications: ExtendedNotification[] = [
      {
        id: 'career-1',
        type: 'success',
        title: 'New Job Match Found!',
        message: 'We found 3 new positions that match your skills and preferences.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high',
        category: 'career',
        actions: [
          { label: 'View Jobs', action: () => {}, variant: 'primary' },
          { label: 'Dismiss', action: () => {}, variant: 'default' }
        ],
        link: '/jobs'
      },
      {
        id: 'market-1',
        type: 'info',
        title: 'Market Trend Alert',
        message: 'React developer demand increased by 15% in your area.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: 'medium',
        category: 'market'
      },
      {
        id: 'achievement-1',
        type: 'success',
        title: 'Skill Assessment Complete',
        message: 'Your TypeScript skills have been verified and added to your profile.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: 'medium',
        category: 'achievement',
        avatar: '/api/placeholder/32/32'
      },
      {
        id: 'social-1',
        type: 'info',
        title: 'Connection Request',
        message: 'Sarah Johnson wants to connect with you on Pathfinder.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        priority: 'low',
        category: 'social',
        avatar: '/api/placeholder/32/32',
        actions: [
          { label: 'Accept', action: () => {}, variant: 'primary' },
          { label: 'Decline', action: () => {}, variant: 'default' }
        ]
      }
    ];

    setEnhancedNotifications([...mockNotifications, ...enhanced]);
  }, [notifications]);

  const filteredNotifications = enhancedNotifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'important' && notification.priority === 'low') return false;
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;
    return true;
  });

  const unreadCount = enhancedNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: ExtendedNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: ExtendedNotification['category']) => {
    switch (category) {
      case 'career':
        return '💼';
      case 'market':
        return '📈';
      case 'achievement':
        return '🏆';
      case 'social':
        return '👥';
      default:
        return '🔔';
    }
  };

  const handleNotificationClick = (notification: ExtendedNotification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    
    if (notification.link) {
      // Navigate to link
      window.location.href = notification.link;
    }
  };

  const handleMarkAllRead = () => {
    enhancedNotifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  const categories = [
    { value: 'all', label: 'All', count: enhancedNotifications.length },
    { value: 'career', label: 'Career', count: enhancedNotifications.filter(n => n.category === 'career').length },
    { value: 'market', label: 'Market', count: enhancedNotifications.filter(n => n.category === 'market').length },
    { value: 'achievement', label: 'Achievements', count: enhancedNotifications.filter(n => n.category === 'achievement').length },
    { value: 'social', label: 'Social', count: enhancedNotifications.filter(n => n.category === 'social').length },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">Notifications</CardTitle>
                  <p className="text-white/80 text-sm">
                    {unreadCount} unread • {enhancedNotifications.length} total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-4">
              {['all', 'unread', 'important'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize",
                    filter === filterOption
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full overflow-hidden flex flex-col">
            {/* Category Filter */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                      selectedCategory === category.value
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <span>{getCategoryIcon(category.value as any)}</span>
                    <span>{category.label}</span>
                    {category.count > 0 && (
                      <Badge className="bg-gray-200 text-gray-700 text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {unreadCount} unread notifications
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 border-b cursor-pointer transition-colors hover:bg-gray-50",
                        !notification.read && "bg-blue-50/50 border-l-4 border-l-blue-500"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        {notification.avatar ? (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {notification.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn(
                              "font-semibold text-sm truncate",
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            )}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {notification.priority === 'high' && (
                                <Star className="w-3 h-3 text-yellow-500" />
                              )}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {notification.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            
                            {notification.link && (
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Actions */}
                          {notification.actions && (
                            <div className="flex space-x-2 mt-3">
                              {notification.actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  size="sm"
                                  variant={action.variant || 'outline'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  className="text-xs"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No notifications
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {filter === 'unread' 
                        ? "You're all caught up!" 
                        : "We'll notify you when something important happens."
                      }
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {enhancedNotifications.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="w-full text-gray-600 hover:text-gray-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
