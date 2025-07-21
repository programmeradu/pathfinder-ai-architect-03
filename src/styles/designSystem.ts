/**
 * Comprehensive Design System for Pathfinder AI
 * Advanced design tokens, themes, and component variants
 */

export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: ColorPalette['primary'];
  accent: ColorPalette['primary'];
  neutral: ColorPalette['primary'];
  success: ColorPalette['primary'];
  warning: ColorPalette['primary'];
  error: ColorPalette['primary'];
  info: ColorPalette['primary'];
}

export interface Typography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, { lineHeight: string; letterSpacing: string }];
    sm: [string, { lineHeight: string; letterSpacing: string }];
    base: [string, { lineHeight: string; letterSpacing: string }];
    lg: [string, { lineHeight: string; letterSpacing: string }];
    xl: [string, { lineHeight: string; letterSpacing: string }];
    '2xl': [string, { lineHeight: string; letterSpacing: string }];
    '3xl': [string, { lineHeight: string; letterSpacing: string }];
    '4xl': [string, { lineHeight: string; letterSpacing: string }];
    '5xl': [string, { lineHeight: string; letterSpacing: string }];
    '6xl': [string, { lineHeight: string; letterSpacing: string }];
  };
  fontWeight: {
    thin: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
}

export interface Spacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface Animations {
  duration: {
    75: string;
    100: string;
    150: string;
    200: string;
    300: string;
    500: string;
    700: string;
    1000: string;
  };
  easing: {
    linear: string;
    in: string;
    out: string;
    'in-out': string;
    'bounce-in': string;
    'bounce-out': string;
    'elastic-in': string;
    'elastic-out': string;
  };
  keyframes: {
    fadeIn: string;
    fadeOut: string;
    slideInUp: string;
    slideInDown: string;
    slideInLeft: string;
    slideInRight: string;
    scaleIn: string;
    scaleOut: string;
    pulse: string;
    bounce: string;
    spin: string;
    ping: string;
    aiProcessing: string;
    dataFlow: string;
    modelActivity: string;
  };
}

export interface Shadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
  glow: string;
  'ai-active': string;
  'data-flow': string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

// Design System Implementation
export const designSystem = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    // AI-specific colors
    ai: {
      active: '#3b82f6',
      processing: '#8b5cf6',
      dataFlow: '#06b6d4',
      modelActive: '#10b981',
      confidence: '#f59e0b',
      prediction: '#ec4899',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
      '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },

  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  animations: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      'elastic-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      'elastic-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    },
    keyframes: {
      fadeIn: `
        from { opacity: 0; }
        to { opacity: 1; }
      `,
      fadeOut: `
        from { opacity: 1; }
        to { opacity: 0; }
      `,
      slideInUp: `
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      `,
      slideInDown: `
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      `,
      slideInLeft: `
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      `,
      slideInRight: `
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      `,
      scaleIn: `
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      `,
      scaleOut: `
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.9); opacity: 0; }
      `,
      pulse: `
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      `,
      bounce: `
        0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
        50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
      `,
      spin: `
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `,
      ping: `
        75%, 100% { transform: scale(2); opacity: 0; }
      `,
      aiProcessing: `
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      `,
      dataFlow: `
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100vw); }
      `,
      modelActivity: `
        0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      `,
    },
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    glow: '0 0 20px rgb(59 130 246 / 0.3)',
    'ai-active': '0 0 30px rgb(139 92 246 / 0.4)',
    'data-flow': '0 0 25px rgb(6 182 212 / 0.3)',
  },

  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Component-specific design tokens
  components: {
    button: {
      variants: {
        primary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: '#ffffff',
          shadow: 'md',
          hover: {
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            shadow: 'lg',
          },
        },
        secondary: {
          background: '#f1f5f9',
          color: '#334155',
          border: '1px solid #e2e8f0',
          hover: {
            background: '#e2e8f0',
          },
        },
        ai: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: '#ffffff',
          shadow: 'ai-active',
          animation: 'aiProcessing 3s ease-in-out infinite',
        },
      },
    },
    card: {
      variants: {
        default: {
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'lg',
          shadow: 'base',
        },
        elevated: {
          background: '#ffffff',
          borderRadius: 'xl',
          shadow: 'xl',
        },
        ai: {
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: 'xl',
          shadow: 'glow',
        },
      },
    },
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    modal: '1000',
    popover: '1010',
    tooltip: '1020',
    notification: '1030',
  },
} as const;

// Theme variants
export const themes = {
  light: {
    ...designSystem,
    colors: {
      ...designSystem.colors,
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f8fafc',
      'muted-foreground': '#64748b',
      border: '#e2e8f0',
      input: '#ffffff',
      ring: '#3b82f6',
    },
  },
  dark: {
    ...designSystem,
    colors: {
      ...designSystem.colors,
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      'muted-foreground': '#94a3b8',
      border: '#334155',
      input: '#1e293b',
      ring: '#3b82f6',
    },
  },
} as const;

export type Theme = typeof themes.light;
export type ThemeMode = keyof typeof themes;

export default designSystem;
