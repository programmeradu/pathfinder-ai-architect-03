/**
 * API Hooks - Beautiful API state management
 * Sophisticated hooks for API calls with caching, retries, and optimistic updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { logger } from '@/lib/logger';
import { useGlobalStore } from '@/store/globalStore';

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  reset: () => void;
}

interface APIOptions {
  enabled?: boolean;
  retry?: number;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
}

// Generic API hook with advanced features
export function useAPI<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  options: APIOptions = {}
): APIState<T> {
  const {
    enabled = true,
    retry = 3,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
  } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    enabled,
    retry,
    staleTime,
    gcTime: cacheTime,
    onSuccess: (data) => {
      if (showSuccessToast) {
        toast.success('Data loaded successfully');
      }
      onSuccess?.(data);
      logger.info('API call successful', {
        component: 'useAPI',
        action: 'fetch_success',
        metadata: { key, dataType: typeof data },
      });
    },
    onError: (err: Error) => {
      if (showErrorToast) {
        toast.error(err.message || 'Failed to load data');
      }
      onError?.(err);
      logger.error('API call failed', {
        component: 'useAPI',
        action: 'fetch_error',
        metadata: { key, error: err.message },
      });
    },
  });

  const reset = useCallback(() => {
    // Reset query data
    const queryClient = useQueryClient();
    queryClient.removeQueries({ queryKey: Array.isArray(key) ? key : [key] });
  }, [key]);

  return {
    data: data || null,
    loading: isLoading,
    error: error as Error | null,
    refetch,
    reset,
  };
}

// Mutation hook with optimistic updates
interface MutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onMutate?: (variables: V) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  optimisticUpdate?: (variables: V) => void;
  invalidateQueries?: string[];
}

export function useAPIMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions<T, V> = {}
) {
  const {
    onSuccess,
    onError,
    onMutate,
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = 'Operation completed successfully',
    optimisticUpdate,
    invalidateQueries = [],
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: (variables) => {
      optimisticUpdate?.(variables);
      onMutate?.(variables);
    },
    onSuccess: (data, variables) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      // Invalidate related queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
      
      onSuccess?.(data, variables);
      logger.info('Mutation successful', {
        component: 'useAPIMutation',
        action: 'mutation_success',
        metadata: { variables, dataType: typeof data },
      });
    },
    onError: (error: Error, variables) => {
      if (showErrorToast) {
        toast.error(error.message || 'Operation failed');
      }
      onError?.(error, variables);
      logger.error('Mutation failed', {
        component: 'useAPIMutation',
        action: 'mutation_error',
        metadata: { variables, error: error.message },
      });
    },
  });
}

// Debounced API hook for search and real-time updates
export function useDebouncedAPI<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  delay: number = 300,
  options: APIOptions = {}
): APIState<T> & { debouncedRefetch: (newParams?: any) => void } {
  const [debouncedParams, setDebouncedParams] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const apiState = useAPI(
    Array.isArray(key) ? [...key, debouncedParams] : [key, debouncedParams],
    fetcher,
    {
      ...options,
      enabled: options.enabled && debouncedParams !== null,
    }
  );

  const debouncedRefetch = useCallback((newParams?: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedParams(newParams || {});
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...apiState,
    debouncedRefetch,
  };
}

// Infinite query hook for pagination
export function useInfiniteAPI<T>(
  key: string | string[],
  fetcher: ({ pageParam }: { pageParam: number }) => Promise<{ data: T[]; nextPage?: number }>,
  options: APIOptions = {}
) {
  const {
    enabled = true,
    retry = 3,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
    onSuccess,
    onError,
    showErrorToast = true,
  } = options;

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    enabled,
    retry,
    staleTime,
    gcTime: cacheTime,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    onSuccess: (data) => {
      onSuccess?.(data);
      logger.info('Infinite API call successful', {
        component: 'useInfiniteAPI',
        action: 'fetch_success',
        metadata: { key, pages: data.pages.length },
      });
    },
    onError: (err: Error) => {
      if (showErrorToast) {
        toast.error(err.message || 'Failed to load data');
      }
      onError?.(err);
      logger.error('Infinite API call failed', {
        component: 'useInfiniteAPI',
        action: 'fetch_error',
        metadata: { key, error: err.message },
      });
    },
  });

  const allData = data?.pages.flatMap(page => page.data) || [];

  const reset = useCallback(() => {
    queryClient.removeQueries({ queryKey: Array.isArray(key) ? key : [key] });
  }, [key, queryClient]);

  return {
    data: allData,
    loading: isLoading,
    error: error as Error | null,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    refetch,
    reset,
  };
}

// Real-time API hook with WebSocket support
export function useRealTimeAPI<T>(
  key: string,
  initialFetcher: () => Promise<T>,
  websocketUrl?: string,
  options: APIOptions = {}
): APIState<T> & { isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeData, setRealtimeData] = useState<T | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { addError } = useGlobalStore();

  const apiState = useAPI(key, initialFetcher, options);

  useEffect(() => {
    if (!websocketUrl) return;

    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(websocketUrl);

        wsRef.current.onopen = () => {
          setIsConnected(true);
          logger.info('WebSocket connected', {
            component: 'useRealTimeAPI',
            action: 'websocket_connect',
            metadata: { url: websocketUrl },
          });
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setRealtimeData(data);
          } catch (error) {
            logger.error('Failed to parse WebSocket message', {
              component: 'useRealTimeAPI',
              action: 'websocket_parse_error',
              metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
            });
          }
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          setIsConnected(false);
          addError({
            code: 'WEBSOCKET_ERROR',
            message: 'WebSocket connection failed',
            severity: 'medium',
          });
        };
      } catch (error) {
        logger.error('Failed to create WebSocket connection', {
          component: 'useRealTimeAPI',
          action: 'websocket_create_error',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [websocketUrl, addError]);

  return {
    data: realtimeData || apiState.data,
    loading: apiState.loading,
    error: apiState.error,
    refetch: apiState.refetch,
    reset: apiState.reset,
    isConnected,
  };
}
