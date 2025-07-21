/**
 * Beautiful Error Fallback Component
 * Elegant error handling with recovery options
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // In a real app, you'd send this to your error reporting service
    console.error('Error Report:', errorReport);
    
    // For now, copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </CardTitle>
            
            <p className="text-gray-600 max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified 
              and we're working to fix this issue.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  Error Details
                </h3>
                <Badge variant="destructive" className="text-xs">
                  {error.name || 'Error'}
                </Badge>
              </div>
              
              <div className="bg-white rounded border p-3">
                <code className="text-sm text-red-600 break-all">
                  {error.message}
                </code>
              </div>
              
              {process.env.NODE_ENV === 'development' && error.stack && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Stack Trace (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={resetErrorBoundary}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={handleReload}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </motion.div>

            {/* Report Error */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-3">
                Help us improve by reporting this error
              </p>
              
              <Button
                onClick={handleReportError}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Mail className="w-4 h-4 mr-2" />
                Copy Error Report
              </Button>
            </motion.div>

            {/* Helpful Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-blue-50 rounded-lg p-4"
            >
              <h4 className="font-semibold text-blue-900 mb-2">
                Quick Fixes to Try:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Refresh the page</li>
                <li>• Clear your browser cache</li>
                <li>• Check your internet connection</li>
                <li>• Try again in a few minutes</li>
              </ul>
            </motion.div>
          </CardContent>
        </Card>

        {/* Floating particles for visual appeal */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorFallback;
