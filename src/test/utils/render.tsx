/**
 * Test Render Utilities - Beautiful Testing Helpers
 * Custom render functions with providers and realistic test environments
 */

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useGlobalStore } from '@/store/globalStore';
import type { UserProfile } from '@/types';

// Mock providers wrapper
interface TestProvidersProps {
  children: React.ReactNode;
  initialRoute?: string;
  user?: UserProfile | null;
  queryClient?: QueryClient;
}

const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  initialRoute = '/',
  user = null,
  queryClient,
}) => {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const client = queryClient || defaultQueryClient;

  // Set initial user state
  React.useEffect(() => {
    if (user) {
      useGlobalStore.getState().setUser(user);
    }
  }, [user]);

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <div data-testid="test-app">
          {children}
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  user?: UserProfile | null;
  queryClient?: QueryClient;
  withProviders?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    initialRoute = '/',
    user = null,
    queryClient,
    withProviders = true,
    ...renderOptions
  } = options;

  if (!withProviders) {
    return render(ui, renderOptions);
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders
      initialRoute={initialRoute}
      user={user}
      queryClient={queryClient}
    >
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Render with authenticated user
export function renderWithAuth(
  ui: React.ReactElement,
  userOverrides: Partial<UserProfile> = {},
  options: CustomRenderOptions = {}
): RenderResult {
  const defaultUser = window.testUtils.createMockUser(userOverrides);
  
  return renderWithProviders(ui, {
    ...options,
    user: defaultUser,
  });
}

// Render with loading state
export function renderWithLoading(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: Infinity, // Keep queries in loading state
      },
    },
  });

  return renderWithProviders(ui, {
    ...options,
    queryClient,
  });
}

// Render with error state
export function renderWithError(
  ui: React.ReactElement,
  error: Error = new Error('Test error'),
  options: CustomRenderOptions = {}
): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        queryFn: () => Promise.reject(error),
      },
    },
  });

  return renderWithProviders(ui, {
    ...options,
    queryClient,
  });
}

// Render with mobile viewport
export function renderMobile(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  // Mock mobile viewport
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  });

  // Mock touch support
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    configurable: true,
    value: {},
  });

  // Trigger resize event
  window.dispatchEvent(new Event('resize'));

  return renderWithProviders(ui, options);
}

// Render with tablet viewport
export function renderTablet(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  window.dispatchEvent(new Event('resize'));

  return renderWithProviders(ui, options);
}

// Render with desktop viewport
export function renderDesktop(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1080,
  });

  window.dispatchEvent(new Event('resize'));

  return renderWithProviders(ui, options);
}

// Render with dark theme
export function renderWithDarkTheme(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  // Mock dark theme preference
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  return renderWithProviders(ui, options);
}

// Render with reduced motion
export function renderWithReducedMotion(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  return renderWithProviders(ui, options);
}

// Render with offline state
export function renderOffline(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false,
  });

  return renderWithProviders(ui, options);
}

// Helper to wait for component to be ready
export async function waitForComponentToBeReady(container: HTMLElement): Promise<void> {
  // Wait for any loading states to resolve
  await window.testUtils.waitForAnimation();
  
  // Wait for any async operations
  await new Promise(resolve => setTimeout(resolve, 0));
}

// Helper to simulate user interactions with realistic delays
export const userInteractions = {
  async click(element: HTMLElement): Promise<void> {
    await window.testUtils.userDelay();
    element.click();
    await window.testUtils.userDelay();
  },

  async type(element: HTMLInputElement, text: string): Promise<void> {
    element.focus();
    await window.testUtils.userDelay();
    
    for (const char of text) {
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 50)); // Realistic typing speed
    }
    
    await window.testUtils.userDelay();
  },

  async swipe(element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down'): Promise<void> {
    const coordinates = {
      left: { start: { x: 100, y: 50 }, end: { x: 0, y: 50 } },
      right: { start: { x: 0, y: 50 }, end: { x: 100, y: 50 } },
      up: { start: { x: 50, y: 100 }, end: { x: 50, y: 0 } },
      down: { start: { x: 50, y: 0 }, end: { x: 50, y: 100 } },
    };

    const { start, end } = coordinates[direction];

    window.testUtils.simulateTouch(element, 'start', start);
    await new Promise(resolve => setTimeout(resolve, 100));
    window.testUtils.simulateTouch(element, 'move', end);
    await new Promise(resolve => setTimeout(resolve, 100));
    window.testUtils.simulateTouch(element, 'end', end);
    
    await window.testUtils.userDelay();
  },
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
