/**
 * Touch Gestures Hook - Beautiful Mobile Interactions
 * Advanced touch gesture recognition with haptic feedback and smooth animations
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { PanInfo } from 'framer-motion';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  enableHaptics?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    longPressDelay = 500,
    enableHaptics = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [lastTap, setLastTap] = useState<TouchPoint | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const initialDistance = useRef<number>(0);
  const initialScale = useRef<number>(1);

  // Haptic feedback helper
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics || !navigator.vibrate) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    
    navigator.vibrate(patterns[type]);
  }, [enableHaptics]);

  // Calculate distance between two touch points
  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setIsPressed(true);
    
    if (e.touches.length === 2) {
      // Pinch gesture start
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1) {
      // Single touch - potential tap or long press
      const touch = e.touches[0];
      const touchPoint: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      // Check for double tap
      if (lastTap && Date.now() - lastTap.timestamp < 300) {
        const distance = Math.sqrt(
          Math.pow(touch.clientX - lastTap.x, 2) + 
          Math.pow(touch.clientY - lastTap.y, 2)
        );
        
        if (distance < 30) {
          onDoubleTap?.();
          triggerHaptic('medium');
          setLastTap(null);
          return;
        }
      }

      setLastTap(touchPoint);

      // Start long press timer
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          onLongPress();
          triggerHaptic('heavy');
        }, longPressDelay);
      }
    }
  }, [getDistance, lastTap, onDoubleTap, onLongPress, longPressDelay, triggerHaptic]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && onPinch) {
      // Pinch gesture
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance.current;
      
      if (Math.abs(scale - initialScale.current) > pinchThreshold) {
        onPinch(scale);
        initialScale.current = scale;
      }
    }

    // Clear long press timer on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = undefined;
    }
  }, [getDistance, onPinch, pinchThreshold]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = undefined;
    }

    // Reset pinch state
    if (e.touches.length === 0) {
      initialDistance.current = 0;
      initialScale.current = 1;
    }

    // Handle tap
    if (e.changedTouches.length === 1 && lastTap) {
      const touch = e.changedTouches[0];
      const distance = Math.sqrt(
        Math.pow(touch.clientX - lastTap.x, 2) + 
        Math.pow(touch.clientY - lastTap.y, 2)
      );
      
      if (distance < 30 && Date.now() - lastTap.timestamp < 200) {
        onTap?.();
        triggerHaptic('light');
      }
    }
  }, [lastTap, onTap, triggerHaptic]);

  // Framer Motion drag handlers
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const threshold = swipeThreshold;
    const velocityThreshold = 500;

    // Determine swipe direction based on offset and velocity
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold || velocity.x > velocityThreshold) {
        onSwipeRight?.();
        triggerHaptic('medium');
      } else if (offset.x < -threshold || velocity.x < -velocityThreshold) {
        onSwipeLeft?.();
        triggerHaptic('medium');
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold || velocity.y > velocityThreshold) {
        onSwipeDown?.();
        triggerHaptic('medium');
      } else if (offset.y < -threshold || velocity.y < -velocityThreshold) {
        onSwipeUp?.();
        triggerHaptic('medium');
      }
    }
  }, [swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHaptic]);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref: elementRef,
    isPressed,
    handleDragEnd,
    triggerHaptic,
  };
}

// Hook for swipeable cards/lists
export function useSwipeableCards<T>(
  items: T[],
  options: {
    onSwipeLeft?: (item: T, index: number) => void;
    onSwipeRight?: (item: T, index: number) => void;
    threshold?: number;
    enableLoop?: boolean;
  } = {}
) {
  const { onSwipeLeft, onSwipeRight, threshold = 100, enableLoop = false } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < items.length) {
      setCurrentIndex(nextIndex);
      setDirection('left');
    } else if (enableLoop) {
      setCurrentIndex(0);
      setDirection('left');
    }
  }, [currentIndex, items.length, enableLoop]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      setDirection('right');
    } else if (enableLoop) {
      setCurrentIndex(items.length - 1);
      setDirection('right');
    }
  }, [currentIndex, items.length, enableLoop]);

  const handleSwipe = useCallback((event: any, info: PanInfo) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > threshold) {
      if (offset.x > 0) {
        // Swipe right
        const currentItem = items[currentIndex];
        onSwipeRight?.(currentItem, currentIndex);
        goToPrevious();
      } else {
        // Swipe left
        const currentItem = items[currentIndex];
        onSwipeLeft?.(currentItem, currentIndex);
        goToNext();
      }
    }
  }, [threshold, items, currentIndex, onSwipeLeft, onSwipeRight, goToNext, goToPrevious]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setDirection(index > currentIndex ? 'left' : 'right');
      setCurrentIndex(index);
    }
  }, [currentIndex, items.length]);

  return {
    currentIndex,
    currentItem: items[currentIndex],
    direction,
    goToNext,
    goToPrevious,
    goToIndex,
    handleSwipe,
    canGoNext: currentIndex < items.length - 1 || enableLoop,
    canGoPrevious: currentIndex > 0 || enableLoop,
  };
}

// Hook for pull-to-refresh functionality
export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  options: {
    threshold?: number;
    resistance?: number;
    enabled?: boolean;
  } = {}
) {
  const { threshold = 80, resistance = 0.5, enabled = true } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (!enabled || isRefreshing) return;

    const { offset } = info;
    
    // Only allow pull down when at the top of the scroll
    if (elementRef.current && elementRef.current.scrollTop === 0 && offset.y > 0) {
      const distance = Math.min(offset.y * resistance, threshold * 1.5);
      setPullDistance(distance);
    }
  }, [enabled, isRefreshing, resistance, threshold]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    if (!enabled || isRefreshing) return;

    const { offset } = info;
    
    if (offset.y > threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [enabled, isRefreshing, threshold, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldRefresh = pullDistance >= threshold;

  return {
    ref: elementRef,
    isRefreshing,
    pullDistance,
    progress,
    shouldRefresh,
    handleDrag,
    handleDragEnd,
  };
}

// Hook for long press with visual feedback
export function useLongPress(
  onLongPress: () => void,
  options: {
    delay?: number;
    enableHaptics?: boolean;
    showVisualFeedback?: boolean;
  } = {}
) {
  const { delay = 500, enableHaptics = true, showVisualFeedback = true } = options;
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    setIsPressed(true);
    setProgress(0);

    if (showVisualFeedback) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => Math.min(prev + (100 / (delay / 50)), 100));
      }, 50);
    }

    timerRef.current = setTimeout(() => {
      onLongPress();
      if (enableHaptics && navigator.vibrate) {
        navigator.vibrate([30]);
      }
      reset();
    }, delay);
  }, [onLongPress, delay, enableHaptics, showVisualFeedback]);

  const reset = useCallback(() => {
    setIsPressed(false);
    setProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isPressed,
    progress,
    start,
    reset,
    handlers: {
      onMouseDown: start,
      onMouseUp: reset,
      onMouseLeave: reset,
      onTouchStart: start,
      onTouchEnd: reset,
    },
  };
}
