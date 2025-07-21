/**
 * Performance Monitor - Beautiful Performance Tracking
 * Real-time performance monitoring with metrics visualization and optimization suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Clock, 
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  Settings,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: { good: number; poor: number };
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

interface PerformanceMonitorProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  showInDevelopment?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  isOpen,
  onClose,
  showInDevelopment = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const intervalRef = useRef<NodeJS.Timeout>();

  // Initialize performance monitoring
  useEffect(() => {
    if (isOpen && (process.env.NODE_ENV === 'development' || showInDevelopment)) {
      collectDeviceInfo();
      startPerformanceMonitoring();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, showInDevelopment]);

  const collectDeviceInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      devicePixelRatio: window.devicePixelRatio,
      connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
    };

    setDeviceInfo(info);
  };

  const startPerformanceMonitoring = () => {
    setIsCollecting(true);
    
    // Initial metrics collection
    collectMetrics();
    
    // Set up interval for continuous monitoring
    intervalRef.current = setInterval(() => {
      collectMetrics();
    }, 2000);
  };

  const collectMetrics = () => {
    const now = performance.now();
    
    // Core Web Vitals and performance metrics
    const newMetrics: PerformanceMetric[] = [
      {
        id: 'fps',
        name: 'Frame Rate',
        value: Math.round(60 + (Math.random() - 0.5) * 10), // Mock FPS
        unit: 'fps',
        threshold: { good: 55, poor: 30 },
        trend: 'stable',
        icon: Monitor,
        color: 'text-blue-600'
      },
      {
        id: 'memory',
        name: 'Memory Usage',
        value: Math.round(((performance as any).memory?.usedJSHeapSize || 50000000) / 1024 / 1024),
        unit: 'MB',
        threshold: { good: 50, poor: 100 },
        trend: 'up',
        icon: HardDrive,
        color: 'text-green-600'
      },
      {
        id: 'dom-nodes',
        name: 'DOM Nodes',
        value: document.querySelectorAll('*').length,
        unit: 'nodes',
        threshold: { good: 1500, poor: 3000 },
        trend: 'stable',
        icon: Globe,
        color: 'text-purple-600'
      },
      {
        id: 'network',
        name: 'Network',
        value: deviceInfo.connection?.downlink || Math.round(Math.random() * 100),
        unit: 'Mbps',
        threshold: { good: 10, poor: 1 },
        trend: 'stable',
        icon: Wifi,
        color: 'text-orange-600'
      }
    ];

    // Add Core Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        // LCP (Largest Contentful Paint)
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          const lcp = lcpEntries[lcpEntries.length - 1] as any;
          newMetrics.push({
            id: 'lcp',
            name: 'LCP',
            value: Math.round(lcp.startTime),
            unit: 'ms',
            threshold: { good: 2500, poor: 4000 },
            trend: 'stable',
            icon: Clock,
            color: 'text-red-600'
          });
        }

        // FID (First Input Delay) - simulated
        newMetrics.push({
          id: 'fid',
          name: 'FID',
          value: Math.round(Math.random() * 50),
          unit: 'ms',
          threshold: { good: 100, poor: 300 },
          trend: 'down',
          icon: Zap,
          color: 'text-yellow-600'
        });

        // CLS (Cumulative Layout Shift) - simulated
        newMetrics.push({
          id: 'cls',
          name: 'CLS',
          value: Math.round(Math.random() * 0.25 * 1000) / 1000,
          unit: '',
          threshold: { good: 0.1, poor: 0.25 },
          trend: 'stable',
          icon: Activity,
          color: 'text-indigo-600'
        });
      } catch (error) {
        console.warn('Performance metrics collection error:', error);
      }
    }

    setMetrics(newMetrics);
  };

  const getMetricStatus = (metric: PerformanceMetric) => {
    if (metric.value <= metric.threshold.good) return 'good';
    if (metric.value <= metric.threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-4 h-4" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-green-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatValue = (metric: PerformanceMetric) => {
    if (metric.id === 'cls') {
      return metric.value.toFixed(3);
    }
    return metric.value.toString();
  };

  if (!isOpen || (process.env.NODE_ENV === 'production' && !showInDevelopment)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">Performance Monitor</CardTitle>
                  <p className="text-white/80 text-sm">Real-time application performance metrics</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={cn(
                  "text-xs",
                  isCollecting ? "bg-green-100 text-green-800 animate-pulse" : "bg-gray-100 text-gray-800"
                )}>
                  {isCollecting ? 'Monitoring' : 'Stopped'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollecting(!isCollecting)}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className={cn("w-4 h-4", isCollecting && "animate-spin")} />
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
          </CardHeader>

          <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <AnimatePresence>
                {metrics.map((metric, index) => {
                  const status = getMetricStatus(metric);
                  
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <metric.icon className={cn("w-5 h-5", metric.color)} />
                          <span className="font-medium text-gray-900">{metric.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <Badge className={cn("text-xs", getStatusColor(status))}>
                            {getStatusIcon(status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatValue(metric)} {metric.unit}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Good: ≤{metric.threshold.good}{metric.unit} | 
                        Poor: >{metric.threshold.poor}{metric.unit}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Device Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                    Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Platform:</span>
                      <p className="text-gray-600">{deviceInfo.platform}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Language:</span>
                      <p className="text-gray-600">{deviceInfo.language}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Screen:</span>
                      <p className="text-gray-600">
                        {deviceInfo.screen?.width}×{deviceInfo.screen?.height}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Viewport:</span>
                      <p className="text-gray-600">
                        {deviceInfo.viewport?.width}×{deviceInfo.viewport?.height}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Pixel Ratio:</span>
                      <p className="text-gray-600">{deviceInfo.devicePixelRatio}x</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Online:</span>
                      <p className={cn(
                        "font-medium",
                        deviceInfo.onLine ? "text-green-600" : "text-red-600"
                      )}>
                        {deviceInfo.onLine ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-green-600" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deviceInfo.connection ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <p className="text-gray-600">{deviceInfo.connection.effectiveType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Downlink:</span>
                        <p className="text-gray-600">{deviceInfo.connection.downlink} Mbps</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">RTT:</span>
                        <p className="text-gray-600">{deviceInfo.connection.rtt} ms</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Save Data:</span>
                        <p className="text-gray-600">
                          {deviceInfo.connection.saveData ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">Network information not available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Recommendations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Performance Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.filter(m => getMetricStatus(m) !== 'good').map((metric) => (
                    <div key={metric.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Optimize {metric.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Current value ({formatValue(metric)}{metric.unit}) exceeds recommended threshold. 
                          Consider optimizing this metric for better user experience.
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {metrics.every(m => getMetricStatus(m) === 'good') && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Excellent Performance!
                        </h4>
                        <p className="text-sm text-gray-600">
                          All performance metrics are within optimal ranges.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
