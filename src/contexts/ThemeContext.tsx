/**
 * Theme Context and Provider
 * Advanced theme management with system preference detection
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { themes, type ThemeMode, type Theme } from '@/styles/designSystem';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  systemPreference: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  const globalTheme = useGlobalStore((state) => state.theme);
  const setGlobalTheme = useGlobalStore((state) => state.setTheme);
  
  const [systemPreference, setSystemPreference] = useState<ThemeMode>('light');
  const [currentMode, setCurrentMode] = useState<ThemeMode>(defaultMode);

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemPreference = () => {
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemPreference();
    mediaQuery.addEventListener('change', updateSystemPreference);

    return () => mediaQuery.removeEventListener('change', updateSystemPreference);
  }, []);

  // Sync with global store
  useEffect(() => {
    if (globalTheme === 'system') {
      setCurrentMode(systemPreference);
    } else {
      setCurrentMode(globalTheme as ThemeMode);
    }
  }, [globalTheme, systemPreference]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[currentMode];

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(currentMode);

    // Set CSS custom properties
    const setCSSVariable = (name: string, value: string) => {
      root.style.setProperty(`--${name}`, value);
    };

    // Apply color variables
    Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
      if (typeof colorValue === 'string') {
        setCSSVariable(colorName, colorValue);
      } else if (typeof colorValue === 'object') {
        Object.entries(colorValue).forEach(([shade, value]) => {
          setCSSVariable(`${colorName}-${shade}`, value);
        });
      }
    });

    // Apply typography variables
    setCSSVariable('font-family-sans', theme.typography.fontFamily.sans.join(', '));
    setCSSVariable('font-family-serif', theme.typography.fontFamily.serif.join(', '));
    setCSSVariable('font-family-mono', theme.typography.fontFamily.mono.join(', '));

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      setCSSVariable(`spacing-${key}`, value);
    });

    // Apply border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      setCSSVariable(`radius-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      setCSSVariable(`shadow-${key}`, value);
    });

    // Apply animation variables
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      setCSSVariable(`duration-${key}`, value);
    });

    Object.entries(theme.animations.easing).forEach(([key, value]) => {
      setCSSVariable(`easing-${key}`, value);
    });

    // Apply component-specific variables
    Object.entries(theme.components).forEach(([componentName, componentConfig]) => {
      Object.entries(componentConfig.variants).forEach(([variantName, variantConfig]) => {
        Object.entries(variantConfig).forEach(([property, value]) => {
          if (typeof value === 'string') {
            setCSSVariable(`${componentName}-${variantName}-${property}`, value);
          }
        });
      });
    });

  }, [currentMode]);

  const setMode = (mode: ThemeMode) => {
    setGlobalTheme(mode);
  };

  const toggleMode = () => {
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const value: ThemeContextType = {
    theme: themes[currentMode],
    mode: currentMode,
    setMode,
    toggleMode,
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme-aware component wrapper
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const ThemedComponent = (props: P) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} />;
  };

  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return ThemedComponent;
};

// Hook for theme-aware styles
export const useThemeStyles = () => {
  const { theme, mode } = useTheme();

  const getColorValue = (colorPath: string): string => {
    const parts = colorPath.split('.');
    let value: any = theme.colors;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return typeof value === 'string' ? value : '';
  };

  const getSpacingValue = (spacing: keyof typeof theme.spacing): string => {
    return theme.spacing[spacing];
  };

  const getShadowValue = (shadow: keyof typeof theme.shadows): string => {
    return theme.shadows[shadow];
  };

  const getAnimationValue = (
    type: 'duration' | 'easing',
    key: string
  ): string => {
    return theme.animations[type][key as keyof typeof theme.animations[typeof type]] || '';
  };

  const createGradient = (colors: string[], direction = '135deg'): string => {
    return `linear-gradient(${direction}, ${colors.join(', ')})`;
  };

  const createBoxShadow = (
    x: number,
    y: number,
    blur: number,
    spread: number,
    color: string,
    inset = false
  ): string => {
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  };

  return {
    theme,
    mode,
    getColorValue,
    getSpacingValue,
    getShadowValue,
    getAnimationValue,
    createGradient,
    createBoxShadow,
  };
};

// CSS-in-JS style generator
export const createStyles = (stylesFn: (theme: Theme) => Record<string, React.CSSProperties>) => {
  return () => {
    const { theme } = useTheme();
    return stylesFn(theme);
  };
};

// Responsive breakpoint hook
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('sm');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isBreakpoint = (bp: string) => {
    const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);
    const targetIndex = breakpoints.indexOf(bp);
    return currentIndex >= targetIndex;
  };

  return {
    breakpoint,
    isBreakpoint,
    isMobile: !isBreakpoint('md'),
    isTablet: isBreakpoint('md') && !isBreakpoint('lg'),
    isDesktop: isBreakpoint('lg'),
  };
};

export default ThemeProvider;
