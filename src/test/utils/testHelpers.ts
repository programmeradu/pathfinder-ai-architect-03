/**
 * Test Helpers and Utilities
 * Comprehensive testing utilities for Pathfinder AI
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useGlobalStore } from '@/store/globalStore';
import type { UserProfile } from '@/types';

// Mock data generators
export const mockUser: UserProfile = {
  id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  currentRole: 'Software Engineer',
  industry: 'Technology',
  experience: 5,
  location: 'San Francisco, CA',
  workStyle: 'hybrid',
  skills: [
    { id: 'skill-1', name: 'JavaScript', category: 'Programming', level: 'advanced', verified: true },
    { id: 'skill-2', name: 'React', category: 'Frontend', level: 'advanced', verified: true },
    { id: 'skill-3', name: 'Node.js', category: 'Backend', level: 'intermediate', verified: false },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Computer Science',
      field: 'Computer Science',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-06-01'),
      gpa: 3.8,
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      issueDate: new Date('2022-03-15'),
      expiryDate: new Date('2025-03-15'),
      credentialId: 'AWS-123456',
    },
  ],
  careerGoals: [
    'Become a Senior Software Engineer',
    'Learn Machine Learning',
    'Lead a development team',
  ],
  salaryRange: {
    min: 120000,
    max: 150000,
    currency: 'USD',
  },
  personality: {
    traits: ['analytical', 'creative', 'collaborative'],
    workValues: ['growth', 'innovation', 'work-life-balance'],
  },
  preferences: {
    industries: ['Technology', 'Healthcare', 'Finance'],
    locations: ['San Francisco', 'New York', 'Remote'],
    companySize: ['startup', 'medium'],
    workEnvironment: 'collaborative',
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date(),
};

export const mockJobOpportunity = {
  id: 'job-123',
  title: 'Senior React Developer',
  company: 'TechCorp Inc.',
  location: 'San Francisco, CA',
  description: 'We are looking for a senior React developer...',
  requirements: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
  salary: {
    min: 130000,
    max: 170000,
    currency: 'USD',
  },
  remote: true,
  matchScore: 92,
  postedDate: new Date(),
  url: 'https://example.com/job/123',
};

export const mockMarketTrend = {
  id: 'trend-123',
  industry: 'Technology',
  trend: 'growing' as const,
  growthRate: 15.5,
  timeframe: '6 months',
  factors: ['AI adoption', 'Remote work', 'Digital transformation'],
  confidence: 88,
};

export const mockSkillDemandData = {
  skill: 'React',
  demand: 85,
  growth: 12,
  averageSalary: 105000,
  jobCount: 1250,
  locations: ['San Francisco', 'New York', 'Seattle'],
  trending: true,
};

// Test wrapper components
interface TestProvidersProps {
  children: ReactNode;
  initialStoreState?: Partial<ReturnType<typeof useGlobalStore.getState>>;
}

export const TestProviders: React.FC<TestProvidersProps> = ({ 
  children, 
  initialStoreState = {} 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  // Set initial store state
  if (Object.keys(initialStoreState).length > 0) {
    useGlobalStore.setState(initialStoreState);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialStoreState?: Partial<ReturnType<typeof useGlobalStore.getState>>;
}

export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialStoreState, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders initialStoreState={initialStoreState}>
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock API responses
export const mockApiResponses = {
  userProfile: {
    status: 200,
    data: mockUser,
  },
  careerPrediction: {
    status: 200,
    data: {
      prediction: 'Senior Software Engineer',
      confidence: 0.87,
      timeframe: '2-3 years',
      factors: ['Strong technical skills', 'Leadership potential', 'Market demand'],
      alternatives: ['Tech Lead', 'Engineering Manager'],
    },
  },
  skillForecast: {
    status: 200,
    data: {
      skill: 'React',
      forecast: [85, 87, 90, 92, 95],
      timeframes: ['3 months', '6 months', '9 months', '12 months', '18 months'],
      confidence: 0.91,
    },
  },
  jobRecommendations: {
    status: 200,
    data: {
      jobs: [mockJobOpportunity],
      totalCount: 1,
      page: 1,
      limit: 10,
    },
  },
};

// Mock fetch function
export const createMockFetch = (responses: Record<string, any>) => {
  return jest.fn((url: string) => {
    const response = responses[url];
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`));
    }

    return Promise.resolve({
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
    });
  });
};

// Test data factories
export const createMockUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  ...mockUser,
  ...overrides,
  id: overrides.id || `user-${Math.random().toString(36).substr(2, 9)}`,
});

export const createMockJob = (overrides: Partial<typeof mockJobOpportunity> = {}) => ({
  ...mockJobOpportunity,
  ...overrides,
  id: overrides.id || `job-${Math.random().toString(36).substr(2, 9)}`,
});

export const createMockSkill = (overrides: Partial<UserProfile['skills'][0]> = {}) => ({
  id: `skill-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Skill',
  category: 'Technology',
  level: 'intermediate' as const,
  verified: false,
  ...overrides,
});

// Async test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const waitForNextTick = () => {
  return new Promise(resolve => process.nextTick(resolve));
};

// Store test helpers
export const resetGlobalStore = () => {
  useGlobalStore.setState({
    user: null,
    isAnalyzing: false,
    analysisProgress: 0,
    notifications: [],
    errors: [],
    theme: 'light',
    realTimeData: null,
    modelStatus: new Map(),
  });
};

export const setMockUser = (user: UserProfile = mockUser) => {
  useGlobalStore.setState({ user });
};

export const setAnalyzing = (isAnalyzing: boolean, progress = 0) => {
  useGlobalStore.setState({ isAnalyzing, analysisProgress: progress });
};

// Component test helpers
export const getByTestId = (container: HTMLElement, testId: string) => {
  const element = container.querySelector(`[data-testid="${testId}"]`);
  if (!element) {
    throw new Error(`Element with data-testid="${testId}" not found`);
  }
  return element;
};

export const queryByTestId = (container: HTMLElement, testId: string) => {
  return container.querySelector(`[data-testid="${testId}"]`);
};

// Event simulation helpers
export const simulateTyping = async (element: HTMLElement, text: string) => {
  const { fireEvent } = await import('@testing-library/react');
  
  for (let i = 0; i < text.length; i++) {
    fireEvent.change(element, { target: { value: text.slice(0, i + 1) } });
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};

export const simulateFileUpload = async (input: HTMLInputElement, file: File) => {
  const { fireEvent } = await import('@testing-library/react');
  
  Object.defineProperty(input, 'files', {
    value: [file],
    writable: false,
  });
  
  fireEvent.change(input);
};

// Performance test helpers
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now();
  renderFn();
  await waitForLoadingToFinish();
  const end = performance.now();
  return end - start;
};

export const measureMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
};

// Accessibility test helpers
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe } = await import('axe-core');
  const results = await axe.run(container);
  return results;
};

// Visual regression test helpers
export const takeScreenshot = async (element: HTMLElement): Promise<string> => {
  // Mock implementation - in real tests, you'd use a library like Puppeteer
  return `screenshot-${Date.now()}.png`;
};

// API test helpers
export const mockApiCall = (url: string, response: any, delay = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, delay);
  });
};

export const mockApiError = (url: string, error: Error, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(error);
    }, delay);
  });
};

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Reset global store
  resetGlobalStore();
};

// Cleanup helpers
export const cleanupTestEnvironment = () => {
  resetGlobalStore();
  jest.clearAllMocks();
  jest.restoreAllMocks();
};

// Export everything for easy importing
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender as render };
