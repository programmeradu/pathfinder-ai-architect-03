/**
 * Test Setup - Beautiful Testing Infrastructure
 * Comprehensive test setup with mocks, utilities, and custom matchers for Pathfinder AI
 */

import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { cleanup, configure } from '@testing-library/react';
import { server } from './mocks/server';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Setup MSW server for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Uncomment to suppress console logs during tests
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock navigator APIs
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Enhanced custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && received.ownerDocument && received.ownerDocument.body.contains(received);
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
    };
  },

  toBeVisible: (received) => {
    const pass = received &&
      received.style.display !== 'none' &&
      received.style.visibility !== 'hidden' &&
      received.style.opacity !== '0';
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be visible`,
      pass,
    };
  },

  toHaveLoadingState: (received) => {
    const hasLoadingClass = received.classList.contains('loading');
    const hasAriaLabel = received.getAttribute('aria-label')?.includes('loading');
    const hasLoadingText = received.textContent?.toLowerCase().includes('loading');
    const hasSpinner = received.querySelector('[data-testid="loading-spinner"]');

    const pass = hasLoadingClass || hasAriaLabel || hasLoadingText || hasSpinner;

    return {
      message: () => `expected element to ${pass ? 'not ' : ''}have loading state`,
      pass,
    };
  },

  toHaveErrorState: (received) => {
    const hasErrorClass = received.classList.contains('error');
    const hasAriaInvalid = received.getAttribute('aria-invalid') === 'true';
    const hasErrorRole = received.getAttribute('role') === 'alert';
    const hasErrorText = received.textContent?.toLowerCase().includes('error');

    const pass = hasErrorClass || hasAriaInvalid || hasErrorRole || hasErrorText;

    return {
      message: () => `expected element to ${pass ? 'not ' : ''}have error state`,
      pass,
    };
  },

  toBeAccessible: (received) => {
    const hasAriaLabel = received.getAttribute('aria-label') || received.getAttribute('aria-labelledby');
    const hasRole = received.getAttribute('role');
    const isInteractive = ['button', 'link', 'input', 'select', 'textarea'].includes(received.tagName.toLowerCase());
    const hasTabIndex = received.hasAttribute('tabindex');
    const hasAltText = received.tagName.toLowerCase() === 'img' ? received.hasAttribute('alt') : true;

    const pass = hasAriaLabel || hasRole || !isInteractive || hasTabIndex || hasAltText;

    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be accessible`,
      pass,
    };
  },

  toHaveAnimation: (received) => {
    const style = window.getComputedStyle(received);
    const hasTransition = style.transition !== 'none';
    const hasAnimation = style.animation !== 'none';
    const hasTransform = style.transform !== 'none';

    const pass = hasTransition || hasAnimation || hasTransform;

    return {
      message: () => `expected element to ${pass ? 'not ' : ''}have animation`,
      pass,
    };
  },
});

// Global test utilities
global.testUtils = {
  // Wait for animations to complete
  waitForAnimation: () => new Promise(resolve => setTimeout(resolve, 300)),

  // Simulate user interaction delay
  userDelay: () => new Promise(resolve => setTimeout(resolve, 100)),

  // Mock API response with realistic delay
  mockApiResponse: (data: any, delay = 100) =>
    new Promise(resolve => setTimeout(() => resolve(data), delay)),

  // Create mock user data
  createMockUser: (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    role: 'user',
    permissions: ['read'],
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  // Create mock analysis results
  createMockAnalysis: (overrides = {}) => ({
    id: '1',
    userId: '1',
    skills: ['React', 'TypeScript', 'Node.js'],
    recommendations: ['Learn Python', 'Improve communication skills'],
    score: 85,
    completedAt: new Date().toISOString(),
    ...overrides,
  }),

  // Create mock job data
  createMockJob: (overrides = {}) => ({
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: { min: 120000, max: 160000 },
    skills: ['React', 'TypeScript'],
    remote: true,
    postedAt: new Date().toISOString(),
    ...overrides,
  }),

  // Simulate touch events
  simulateTouch: (element: HTMLElement, type: 'start' | 'move' | 'end', coordinates = { x: 0, y: 0 }) => {
    const touch = new Touch({
      identifier: 1,
      target: element,
      clientX: coordinates.x,
      clientY: coordinates.y,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 10,
      force: 0.5,
    });

    const touchEvent = new TouchEvent(`touch${type}`, {
      cancelable: true,
      bubbles: true,
      touches: type === 'end' ? [] : [touch],
      targetTouches: type === 'end' ? [] : [touch],
      changedTouches: [touch],
    });

    element.dispatchEvent(touchEvent);
  },

  // Mock intersection observer
  mockIntersectionObserver: (isIntersecting = true) => {
    const mockObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn().mockImplementation((element) => {
        callback([{ target: element, isIntersecting }]);
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    global.IntersectionObserver = mockObserver;
    return mockObserver;
  },
};

// Type declarations for TypeScript
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeVisible(): T;
      toHaveLoadingState(): T;
      toHaveErrorState(): T;
      toBeAccessible(): T;
      toHaveAnimation(): T;
    }
  }

  interface Window {
    testUtils: {
      waitForAnimation: () => Promise<void>;
      userDelay: () => Promise<void>;
      mockApiResponse: (data: any, delay?: number) => Promise<any>;
      createMockUser: (overrides?: any) => any;
      createMockAnalysis: (overrides?: any) => any;
      createMockJob: (overrides?: any) => any;
      simulateTouch: (element: HTMLElement, type: 'start' | 'move' | 'end', coordinates?: { x: number; y: number }) => void;
      mockIntersectionObserver: (isIntersecting?: boolean) => any;
    };
  }
}

export {};
