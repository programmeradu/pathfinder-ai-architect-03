/**
 * Responsive Hooks - Beautiful Responsive Design Utilities
 * Advanced responsive design hooks with device detection and orientation handling
 */

import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device type detection
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  deviceType: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  pixelRatio: number;
}

// Main responsive hook
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        breakpoint: 'lg',
        deviceType: 'desktop',
        orientation: 'landscape',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        pixelRatio: 1,
      };
    }

    return getResponsiveState();
  });

  const updateState = useCallback(() => {
    setState(getResponsiveState());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', updateState);
    window.addEventListener('orientationchange', updateState);

    // Listen for pixel ratio changes (zoom)
    const mediaQuery = window.matchMedia('(resolution: 1dppx)');
    mediaQuery.addEventListener('change', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
      mediaQuery.removeEventListener('change', updateState);
    };
  }, [updateState]);

  return state;
}

// Helper function to get current responsive state
function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  // Determine breakpoint
  let breakpoint: Breakpoint = 'xs';
  for (const [bp, minWidth] of Object.entries(breakpoints).reverse()) {
    if (width >= minWidth) {
      breakpoint = bp as Breakpoint;
      break;
    }
  }

  // Determine device type
  let deviceType: DeviceType = 'desktop';
  if (width < breakpoints.md) {
    deviceType = 'mobile';
  } else if (width < breakpoints.lg) {
    deviceType = 'tablet';
  }

  // Determine orientation
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';

  // Touch detection
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return {
    width,
    height,
    breakpoint,
    deviceType,
    orientation,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouch,
    pixelRatio,
  };
}

// Hook for breakpoint-specific values
export function useBreakpointValue<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const { breakpoint } = useResponsive();

  // Find the appropriate value for current breakpoint
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

// Hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Hook for viewport dimensions
export function useViewport() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

// Hook for safe area insets (mobile notches, etc.)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}

// Hook for device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        hasTouch: false,
        hasHover: true,
        hasPointer: true,
        supportsVibration: false,
        supportsGeolocation: false,
        supportsNotifications: false,
        supportsServiceWorker: false,
        isOnline: true,
      };
    }

    return {
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasHover: window.matchMedia('(hover: hover)').matches,
      hasPointer: window.matchMedia('(pointer: fine)').matches,
      supportsVibration: 'vibrate' in navigator,
      supportsGeolocation: 'geolocation' in navigator,
      supportsNotifications: 'Notification' in window,
      supportsServiceWorker: 'serviceWorker' in navigator,
      isOnline: navigator.onLine,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
      setCapabilities(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return capabilities;
}

// Hook for container queries (element-based responsive design)
export function useContainerQuery(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return {
    width: size.width,
    height: size.height,
    isSmall: size.width < 400,
    isMedium: size.width >= 400 && size.width < 768,
    isLarge: size.width >= 768,
  };
}

// Hook for responsive font sizes
export function useResponsiveFontSize(baseSize: number = 16) {
  const { deviceType, width } = useResponsive();

  const fontSize = useCallback(() => {
    if (deviceType === 'mobile') {
      // Scale down for mobile
      return Math.max(baseSize * 0.875, 12);
    } else if (deviceType === 'tablet') {
      // Slightly smaller for tablet
      return baseSize * 0.9375;
    } else {
      // Desktop size with scaling for very large screens
      const scale = width > 1920 ? 1.125 : 1;
      return baseSize * scale;
    }
  }, [baseSize, deviceType, width]);

  return fontSize();
}

// Hook for responsive spacing
export function useResponsiveSpacing() {
  const { deviceType } = useResponsive();

  return {
    xs: deviceType === 'mobile' ? 4 : 8,
    sm: deviceType === 'mobile' ? 8 : 12,
    md: deviceType === 'mobile' ? 12 : 16,
    lg: deviceType === 'mobile' ? 16 : 24,
    xl: deviceType === 'mobile' ? 24 : 32,
    '2xl': deviceType === 'mobile' ? 32 : 48,
  };
}

// Utility function to check if current breakpoint matches
export function isBreakpoint(bp: Breakpoint, current: Breakpoint): boolean {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  return order.indexOf(current) >= order.indexOf(bp);
}

// Utility function for responsive classes
export function responsiveClass(
  classes: Partial<Record<Breakpoint, string>>,
  currentBreakpoint: Breakpoint
): string {
  const order: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = order.indexOf(currentBreakpoint);

  for (let i = currentIndex; i < order.length; i++) {
    const bp = order[i];
    if (classes[bp]) {
      return classes[bp]!;
    }
  }

  return '';
}
