/**
 * Custom React Hooks
 * 
 * Reusable hooks implementing common patterns and business logic.
 * Following React best practices for hook composition and state management.
 * 
 * @module hooks/useApi
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AsyncState } from '../types';

/**
 * Options for useApi hook
 */
interface UseApiOptions<T> {
  initialData?: T | null;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Return type for useApi hook
 */
interface UseApiReturn<T, P extends any[]> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: P) => Promise<void>;
  reset: () => void;
}

/**
 * useApi Hook
 * 
 * A comprehensive hook for handling async API calls with proper state management,
 * error handling, and cleanup. Prevents memory leaks and race conditions.
 * 
 * Features:
 * - Automatic loading state management
 * - Error handling with callbacks
 * - Race condition prevention
 * - Memory leak prevention
 * - Retry capability
 * 
 * @template T - The type of data returned by the API
 * @template P - The parameter types for the API function
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error, execute } = useApi(
 *   async (userId: string) => {
 *     const response = await api.get(`/users/${userId}`);
 *     return response.data;
 *   },
 *   {
 *     immediate: false,
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error) => console.error('Error:', error),
 *   }
 * );
 * 
 * // Later in your component
 * const handleFetch = () => execute('user-123');
 * ```
 */
export function useApi<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const {
    initialData = null,
    immediate = false,
    onSuccess,
    onError,
  } = options;

  // State management
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: initialData,
    error: null,
  });

  // Refs for cleanup and race condition prevention
  const mountedRef = useRef(true);
  const executionIdRef = useRef(0);

  /**
   * Execute the API call
   */
  const execute = useCallback(
    async (...args: P): Promise<void> => {
      const currentExecutionId = ++executionIdRef.current;

      setState({ status: 'loading', data: null, error: null });

      try {
        const data = await apiFunction(...args);

        // Prevent state update if component unmounted or newer call exists
        if (!mountedRef.current || currentExecutionId !== executionIdRef.current) {
          return;
        }

        setState({ status: 'success', data, error: null });
        onSuccess?.(data);
      } catch (error) {
        // Prevent state update if component unmounted or newer call exists
        if (!mountedRef.current || currentExecutionId !== executionIdRef.current) {
          return;
        }

        const errorObj = error instanceof Error ? error : new Error('Unknown error');
        setState({ status: 'error', data: null, error: errorObj });
        onError?.(errorObj);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  /**
   * Reset state to idle
   */
  const reset = useCallback((): void => {
    setState({ status: 'idle', data: initialData, error: null });
  }, [initialData]);

  /**
   * Execute immediately if specified
   */
  useEffect(() => {
    if (immediate) {
      execute(...([] as any as P));
    }
  }, [immediate]); // Only run on mount

  /**
   * Cleanup: mark component as unmounted
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.status === 'loading',
    isIdle: state.status === 'idle',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    execute,
    reset,
  };
}

/**
 * useDebouncedValue Hook
 * 
 * Debounces a value, useful for search inputs and expensive operations.
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebouncedValue(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // This will only run 500ms after user stops typing
 *   if (debouncedSearch) {
 *     performSearch(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * usePrevious Hook
 * 
 * Returns the previous value of a variable.
 * 
 * @example
 * ```typescript
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 * 
 * console.log(`Current: ${count}, Previous: ${previousCount}`);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}




