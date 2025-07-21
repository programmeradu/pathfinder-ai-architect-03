/**
 * Error Boundary System - Beautiful Error Handling
 * Comprehensive error boundaries with fallback UI and error reporting
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Mail,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error with context
    logger.error('Error boundary caught error', {
      component: 'ErrorBoundary',
      action: 'error_caught',
      metadata: {
        errorId: this.state.errorId,
        level,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler
    onError?.(error, errorInfo);

    // Report to error tracking service (e.g., Sentry)
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      console.error('Error reported to monitoring service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  };

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private copyErrorDetails = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorDetails = `
Error ID: ${errorId}
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      // Show success feedback (you could use a toast here)
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private sendErrorReport = () => {
    const { error, errorId } = this.state;
    const subject = `Error Report - ${errorId}`;
    const body = `I encountered an error in Pathfinder AI:

Error ID: ${errorId}
Error: ${error?.message}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]
    `;

    const mailtoUrl = `mailto:support@pathfinder-ai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  render() {
    const { hasError, error, errorInfo, errorId, showDetails } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const isPageLevel = level === 'page';
      const isCritical = level === 'critical';

      return (
        <div className={`flex items-center justify-center p-8 ${isPageLevel ? 'min-h-screen bg-gray-50' : 'min-h-96'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isCritical 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  <AlertTriangle className="w-8 h-8" />
                </motion.div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {isCritical ? 'Critical Error' : 'Something went wrong'}
                </CardTitle>
                
                <p className="text-gray-600 mb-4">
                  {isCritical 
                    ? 'A critical error has occurred that requires immediate attention.'
                    : 'We encountered an unexpected error. Don\'t worry, we\'re on it!'
                  }
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Error ID: {errorId}
                  </Badge>
                  <Badge 
                    variant={isCritical ? 'destructive' : 'secondary'} 
                    className="text-xs"
                  >
                    {level.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={this.handleRetry}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  {isPageLevel && (
                    <Button
                      variant="outline"
                      onClick={this.handleReload}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reload Page
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                {/* Error Details Toggle */}
                <div className="border-t pt-6">
                  <Button
                    variant="ghost"
                    onClick={this.toggleDetails}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center">
                      <Bug className="w-4 h-4 mr-2" />
                      Technical Details
                    </span>
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>

                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Error Message:</h4>
                        <code className="text-sm text-red-600 break-all">
                          {error?.message}
                        </code>
                      </div>

                      {process.env.NODE_ENV === 'development' && (
                        <>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Stack Trace:</h4>
                            <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                              {error?.stack}
                            </pre>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Component Stack:</h4>
                            <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                              {errorInfo?.componentStack}
                            </pre>
                          </div>
                        </>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={this.copyErrorDetails}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Details
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={this.sendErrorReport}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Report Issue
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Help Text */}
                <div className="text-center text-sm text-gray-500 border-t pt-6">
                  <p>
                    If this problem persists, please{' '}
                    <button
                      onClick={this.sendErrorReport}
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      contact support
                    </button>
                    {' '}with the error ID above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    logger.error('Manual error report', {
      component: 'useErrorHandler',
      action: 'manual_error',
      metadata: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
      },
    });

    // Report to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }, []);
}
