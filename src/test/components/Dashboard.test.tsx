/**
 * Dashboard Component Tests
 * Comprehensive test suite for the main dashboard
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { Dashboard } from '@/components/Dashboard';
import { 
  render, 
  mockUser, 
  mockApiResponses,
  createMockFetch,
  setupTestEnvironment,
  cleanupTestEnvironment,
  setMockUser,
  setAnalyzing,
} from '@/test/utils/testHelpers';

// Mock the API gateway
vi.mock('@/services/api/APIGateway', () => ({
  apiGateway: {
    handleRequest: vi.fn(),
    getStats: vi.fn(() => ({
      totalRequests: 100,
      errorCount: 2,
      errorRate: 0.02,
      cacheStats: { size: 50, hitRate: 0.85 },
      endpointCount: 10,
    })),
  },
}));

// Mock the real-time data service
vi.mock('@/services/realTimeDataService', () => ({
  realTimeDataService: {
    connect: vi.fn(),
    subscribe: vi.fn(),
    getConnectionStatus: vi.fn(() => 'connected'),
    startSimulation: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    setupTestEnvironment();
    
    // Mock fetch with default responses
    global.fetch = createMockFetch({
      '/api/user/profile': mockApiResponses.userProfile,
      '/api/career/predict': mockApiResponses.careerPrediction,
      '/api/skills/forecast': mockApiResponses.skillForecast,
    });
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('Initial Render', () => {
    it('renders dashboard with welcome message when user is logged in', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(mockUser.name.split(' ')[0])).toBeInTheDocument();
    });

    it('renders dashboard without user name when not logged in', () => {
      render(<Dashboard />);
      
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      expect(screen.queryByText(mockUser.name)).not.toBeInTheDocument();
    });

    it('displays all main dashboard sections', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/career intelligence/i)).toBeInTheDocument();
      expect(screen.getByText(/ai processing/i)).toBeInTheDocument();
      expect(screen.getByText(/market insights/i)).toBeInTheDocument();
      expect(screen.getByText(/skill analysis/i)).toBeInTheDocument();
    });
  });

  describe('AI Processing Section', () => {
    it('shows ready state when not analyzing', () => {
      setMockUser();
      setAnalyzing(false);
      
      render(<Dashboard />);
      
      expect(screen.getByText(/ready for analysis/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /begin analysis/i })).toBeInTheDocument();
    });

    it('shows progress when analyzing', () => {
      setMockUser();
      setAnalyzing(true, 45);
      
      render(<Dashboard />);
      
      expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('starts analysis when button is clicked', async () => {
      setMockUser();
      setAnalyzing(false);
      
      render(<Dashboard />);
      
      const analyzeButton = screen.getByRole('button', { name: /begin analysis/i });
      fireEvent.click(analyzeButton);
      
      await waitFor(() => {
        expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
      });
    });
  });

  describe('Career Intelligence Section', () => {
    it('displays career prediction when available', async () => {
      setMockUser();
      
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/career trajectory/i)).toBeInTheDocument();
      });
    });

    it('shows loading state while fetching predictions', () => {
      setMockUser();
      
      // Mock delayed response
      global.fetch = createMockFetch({
        '/api/career/predict': new Promise(resolve => 
          setTimeout(() => resolve(mockApiResponses.careerPrediction), 1000)
        ),
      });
      
      render(<Dashboard />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('handles prediction errors gracefully', async () => {
      setMockUser();
      
      // Mock error response
      global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));
      
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });
  });

  describe('Market Insights Section', () => {
    it('displays real-time market data', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/market trends/i)).toBeInTheDocument();
      expect(screen.getByText(/live/i)).toBeInTheDocument();
    });

    it('shows trending skills with growth indicators', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/hot skills/i)).toBeInTheDocument();
      expect(screen.getByText(/trending/i)).toBeInTheDocument();
    });

    it('displays job opportunities count', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/new opportunities/i)).toBeInTheDocument();
      expect(screen.getByText(/\d+ new/i)).toBeInTheDocument();
    });
  });

  describe('Skill Analysis Section', () => {
    it('shows user skills when available', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      mockUser.skills.forEach(skill => {
        expect(screen.getByText(skill.name)).toBeInTheDocument();
      });
    });

    it('displays skill levels correctly', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      expect(screen.getByText(/advanced/i)).toBeInTheDocument();
      expect(screen.getByText(/intermediate/i)).toBeInTheDocument();
    });

    it('shows skill verification status', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      // Should show verified badge for verified skills
      const verifiedSkills = mockUser.skills.filter(skill => skill.verified);
      expect(screen.getAllByText(/verified/i)).toHaveLength(verifiedSkills.length);
    });
  });

  describe('Interactive Features', () => {
    it('allows navigation to detailed views', async () => {
      setMockUser();
      
      render(<Dashboard />);
      
      const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
      fireEvent.click(viewDetailsButton);
      
      // Should navigate or show detailed view
      await waitFor(() => {
        expect(screen.getByText(/detailed analysis/i)).toBeInTheDocument();
      });
    });

    it('supports filtering and sorting options', () => {
      setMockUser();
      
      render(<Dashboard />);
      
      const filterButton = screen.getByRole('button', { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
      
      const sortButton = screen.getByRole('button', { name: /sort/i });
      expect(sortButton).toBeInTheDocument();
    });

    it('refreshes data when refresh button is clicked', async () => {
      setMockUser();
      
      const fetchSpy = vi.spyOn(global, 'fetch');
      
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith('/api/user/profile');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      setMockUser();
      render(<Dashboard />);
      
      // Should show mobile-optimized layout
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument();
    });

    it('shows desktop layout for larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      
      setMockUser();
      render(<Dashboard />);
      
      // Should show desktop layout
      expect(screen.getByTestId('desktop-dashboard')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders within acceptable time limits', async () => {
      setMockUser();
      
      const startTime = performance.now();
      render(<Dashboard />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
    });

    it('lazy loads non-critical components', async () => {
      setMockUser();
      
      render(<Dashboard />);
      
      // Critical components should be immediately available
      expect(screen.getByText(/career intelligence/i)).toBeInTheDocument();
      
      // Non-critical components should load asynchronously
      await waitFor(() => {
        expect(screen.getByText(/advanced analytics/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('handles large datasets efficiently', () => {
      // Create user with many skills
      const userWithManySkills = {
        ...mockUser,
        skills: Array.from({ length: 100 }, (_, i) => ({
          id: `skill-${i}`,
          name: `Skill ${i}`,
          category: 'Technology',
          level: 'intermediate' as const,
          verified: i % 2 === 0,
        })),
      };
      
      setMockUser(userWithManySkills);
      
      const startTime = performance.now();
      render(<Dashboard />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(200); // Should still render efficiently
    });
  });

  describe('Error Handling', () => {
    it('displays error boundary when component crashes', () => {
      // Mock a component that throws an error
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      const DashboardWithError = () => (
        <Dashboard>
          <ThrowError />
        </Dashboard>
      );
      
      render(<DashboardWithError />);
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('shows fallback UI when data loading fails', async () => {
      setMockUser();
      
      // Mock all API calls to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/unable to load data/i)).toBeInTheDocument();
      });
    });

    it('provides retry functionality for failed requests', async () => {
      setMockUser();
      
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponses.userProfile.data),
        });
      });
      
      render(<Dashboard />);
      
      // Should show error initially
      await waitFor(() => {
        expect(screen.getByText(/retry/i)).toBeInTheDocument();
      });
      
      // Click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      
      // Should succeed on retry
      await waitFor(() => {
        expect(screen.getByText(/career intelligence/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      setMockUser();
      render(<Dashboard />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText(/dashboard navigation/i)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      setMockUser();
      render(<Dashboard />);
      
      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();
      
      expect(document.activeElement).toBe(firstButton);
      
      // Test tab navigation
      fireEvent.keyDown(firstButton, { key: 'Tab' });
      expect(document.activeElement).not.toBe(firstButton);
    });

    it('has sufficient color contrast', async () => {
      setMockUser();
      const { container } = render(<Dashboard />);
      
      // This would typically use a tool like axe-core
      const results = await checkAccessibility(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
