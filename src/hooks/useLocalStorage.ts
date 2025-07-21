/**
 * Local Storage Hooks - Beautiful persistent state management
 * Type-safe local storage with serialization, validation, and sync
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

type SerializableValue = string | number | boolean | object | null;

interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  validator?: (value: any) => value is T;
  syncAcrossTabs?: boolean;
  onError?: (error: Error) => void;
}

// Main local storage hook with advanced features
export function useLocalStorage<T extends SerializableValue>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void, () => void] {
  const {
    defaultValue,
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
    validator,
    syncAcrossTabs = true,
    onError,
  } = options;

  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      const parsed = serializer.parse(item);
      
      // Validate the parsed value if validator is provided
      if (validator && !validator(parsed)) {
        logger.warn('Invalid value in localStorage, using default', {
          component: 'useLocalStorage',
          action: 'validation_failed',
          metadata: { key, value: parsed },
        });
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      logger.error('Failed to parse localStorage value', {
        component: 'useLocalStorage',
        action: 'parse_error',
        metadata: { key, error: error instanceof Error ? error.message : 'Unknown error' },
      });
      onError?.(error instanceof Error ? error : new Error('Parse error'));
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T | undefined) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Validate the value if validator is provided
        if (validator && !validator(valueToStore)) {
          throw new Error('Value failed validation');
        }

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, serializer.stringify(valueToStore));
          }
        }

        logger.debug('localStorage value updated', {
          component: 'useLocalStorage',
          action: 'value_updated',
          metadata: { key, valueType: typeof valueToStore },
        });
      } catch (error) {
        logger.error('Failed to set localStorage value', {
          component: 'useLocalStorage',
          action: 'set_error',
          metadata: { key, error: error instanceof Error ? error.message : 'Unknown error' },
        });
        onError?.(error instanceof Error ? error : new Error('Set error'));
      }
    },
    [key, serializer, validator, storedValue, onError]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      logger.debug('localStorage value removed', {
        component: 'useLocalStorage',
        action: 'value_removed',
        metadata: { key },
      });
    } catch (error) {
      logger.error('Failed to remove localStorage value', {
        component: 'useLocalStorage',
        action: 'remove_error',
        metadata: { key, error: error instanceof Error ? error.message : 'Unknown error' },
      });
      onError?.(error instanceof Error ? error : new Error('Remove error'));
    }
  }, [key, onError]);

  // Sync across tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = serializer.parse(e.newValue);
          if (!validator || validator(parsed)) {
            setStoredValue(parsed);
          }
        } catch (error) {
          logger.error('Failed to sync localStorage across tabs', {
            component: 'useLocalStorage',
            action: 'sync_error',
            metadata: { key, error: error instanceof Error ? error.message : 'Unknown error' },
          });
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(undefined);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, validator, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
}

// Simplified hook for common use cases
export function useLocalStorageState<T extends SerializableValue>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useLocalStorage(key, { defaultValue });
  return [value ?? defaultValue, setValue as (value: T | ((prev: T) => T)) => void];
}

// Hook for storing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorageState('user-preferences', {
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    dashboard: {
      layout: 'grid' as 'grid' | 'list',
      density: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
    },
    privacy: {
      analytics: true,
      marketing: false,
    },
  });

  const updatePreference = useCallback(
    <K extends keyof typeof preferences>(
      key: K,
      value: typeof preferences[K] | ((prev: typeof preferences[K]) => typeof preferences[K])
    ) => {
      setPreferences(prev => ({
        ...prev,
        [key]: value instanceof Function ? value(prev[key]) : value,
      }));
    },
    [setPreferences]
  );

  return {
    preferences,
    updatePreference,
    setPreferences,
  };
}

// Hook for storing form data temporarily
export function useFormPersistence<T extends Record<string, any>>(
  formId: string,
  initialData: T
) {
  const [formData, setFormData] = useLocalStorageState(`form-${formId}`, initialData);

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [setFormData, initialData]);

  const clearForm = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`form-${formId}`);
    }
    setFormData(initialData);
  }, [formId, initialData, setFormData]);

  return {
    formData,
    updateField,
    setFormData,
    resetForm,
    clearForm,
  };
}

// Hook for storing recent searches
export function useRecentSearches(maxItems: number = 10) {
  const [searches, setSearches] = useLocalStorageState<string[]>('recent-searches', []);

  const addSearch = useCallback(
    (search: string) => {
      if (!search.trim()) return;

      setSearches(prev => {
        const filtered = prev.filter(s => s !== search);
        return [search, ...filtered].slice(0, maxItems);
      });
    },
    [setSearches, maxItems]
  );

  const removeSearch = useCallback(
    (search: string) => {
      setSearches(prev => prev.filter(s => s !== search));
    },
    [setSearches]
  );

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

// Hook for storing app state snapshots
export function useStateSnapshot<T>(
  key: string,
  getSnapshot: () => T,
  restoreSnapshot: (snapshot: T) => void
) {
  const [, setSnapshot] = useLocalStorage<T>(key);

  const saveSnapshot = useCallback(() => {
    const snapshot = getSnapshot();
    setSnapshot(snapshot);
    logger.info('State snapshot saved', {
      component: 'useStateSnapshot',
      action: 'snapshot_saved',
      metadata: { key },
    });
  }, [key, getSnapshot, setSnapshot]);

  const loadSnapshot = useCallback(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item) {
        const snapshot = JSON.parse(item);
        restoreSnapshot(snapshot);
        logger.info('State snapshot restored', {
          component: 'useStateSnapshot',
          action: 'snapshot_restored',
          metadata: { key },
        });
        return true;
      }
    } catch (error) {
      logger.error('Failed to restore state snapshot', {
        component: 'useStateSnapshot',
        action: 'restore_error',
        metadata: { key, error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
    return false;
  }, [key, restoreSnapshot]);

  return {
    saveSnapshot,
    loadSnapshot,
  };
}
