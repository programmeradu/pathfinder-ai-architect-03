/**
 * Global State Management with Zustand
 * Enterprise-grade state management for Pathfinder AI
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  UserProfile,
  AnalysisResults,
  RealTimeData,
  ModelStatus,
  VisualizationData,
  CareerDNAResult,
  Notification,
  AppError,
} from '@/types';

// State Interface
interface GlobalState {
  // App State
  isInitialized: boolean;

  // User State
  user: UserProfile | null;
  isAuthenticated: boolean;

  // Analysis State
  analysisResults: AnalysisResults | null;
  isAnalyzing: boolean;
  analysisProgress: number;

  // Real-time Data
  realTimeData: RealTimeData | null;
  dataLastUpdated: Date | null;

  // ML Models
  modelStatus: ModelStatus[];
  activeModels: string[];

  // Visualization
  visualizationData: VisualizationData | null;

  // UI State
  currentView: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Errors
  errors: AppError[];

  // Loading States
  loading: {
    dashboard: boolean;
    analysis: boolean;
    profile: boolean;
    data: boolean;
  };
}

// Actions Interface
interface GlobalActions {
  // App Actions
  initializeApp: () => Promise<void>;

  // User Actions
  setUser: (user: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setAuthenticated: (authenticated: boolean) => void;

  // Analysis Actions
  setAnalysisResults: (results: AnalysisResults) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  clearAnalysisResults: () => void;

  // Real-time Data Actions
  updateRealTimeData: (data: Partial<RealTimeData>) => void;
  setDataLastUpdated: (timestamp: Date) => void;

  // ML Model Actions
  updateModelStatus: (status: ModelStatus) => void;
  setActiveModels: (models: string[]) => void;

  // Visualization Actions
  setVisualizationData: (data: VisualizationData) => void;
  updateVisualizationData: (updates: Partial<VisualizationData>) => void;

  // UI Actions
  setCurrentView: (view: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Error Actions
  addError: (error: Omit<AppError, 'timestamp'>) => void;
  clearErrors: () => void;
  removeError: (code: string) => void;

  // Loading Actions
  setLoading: (key: keyof GlobalState['loading'], loading: boolean) => void;

  // Utility Actions
  reset: () => void;
  hydrate: () => void;
}

// Combined Store Type
type GlobalStore = GlobalState & GlobalActions;

// Initial State
const initialState: GlobalState = {
  // App State
  isInitialized: false,

  // User State
  user: null,
  isAuthenticated: false,

  // Analysis State
  analysisResults: null,
  isAnalyzing: false,
  analysisProgress: 0,

  // Real-time Data
  realTimeData: null,
  dataLastUpdated: null,

  // ML Models
  modelStatus: [],
  activeModels: [],

  // Visualization
  visualizationData: null,

  // UI State
  currentView: 'dashboard',
  sidebarOpen: true,
  theme: 'system',

  // Notifications
  notifications: [],
  unreadCount: 0,

  // Errors
  errors: [],

  // Loading States
  loading: {
    dashboard: false,
    analysis: false,
    profile: false,
    data: false,
  },
};

// Create the store with middleware
export const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,

          // App Actions
          initializeApp: async () => {
            try {
              set((state) => {
                state.loading.dashboard = true;
              });

              // Simulate initialization delay
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Initialize app state
              set((state) => {
                state.isInitialized = true;
                state.loading.dashboard = false;
              });
            } catch (error) {
              set((state) => {
                state.loading.dashboard = false;
                state.errors.push({
                  code: 'INIT_ERROR',
                  message: 'Failed to initialize application',
                  timestamp: new Date(),
                  severity: 'high',
                });
              });
            }
          },

          // User Actions
          setUser: (user) => set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),
          
          updateUserProfile: (updates) => set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
              state.user.updatedAt = new Date();
            }
          }),
          
          setAuthenticated: (authenticated) => set((state) => {
            state.isAuthenticated = authenticated;
          }),
          
          // Analysis Actions
          setAnalysisResults: (results) => set((state) => {
            state.analysisResults = results;
            state.isAnalyzing = false;
            state.analysisProgress = 100;
          }),
          
          setAnalyzing: (analyzing) => set((state) => {
            state.isAnalyzing = analyzing;
            if (analyzing) {
              state.analysisProgress = 0;
            }
          }),
          
          setAnalysisProgress: (progress) => set((state) => {
            state.analysisProgress = Math.max(0, Math.min(100, progress));
          }),
          
          clearAnalysisResults: () => set((state) => {
            state.analysisResults = null;
            state.isAnalyzing = false;
            state.analysisProgress = 0;
          }),
          
          // Real-time Data Actions
          updateRealTimeData: (data) => set((state) => {
            if (state.realTimeData) {
              Object.assign(state.realTimeData, data);
            } else {
              state.realTimeData = data as RealTimeData;
            }
            state.dataLastUpdated = new Date();
          }),
          
          setDataLastUpdated: (timestamp) => set((state) => {
            state.dataLastUpdated = timestamp;
          }),
          
          // ML Model Actions
          updateModelStatus: (status) => set((state) => {
            const existingIndex = state.modelStatus.findIndex(
              (s) => s.modelName === status.modelName
            );
            
            if (existingIndex >= 0) {
              state.modelStatus[existingIndex] = status;
            } else {
              state.modelStatus.push(status);
            }
          }),
          
          setActiveModels: (models) => set((state) => {
            state.activeModels = models;
          }),
          
          // Visualization Actions
          setVisualizationData: (data) => set((state) => {
            state.visualizationData = data;
          }),
          
          updateVisualizationData: (updates) => set((state) => {
            if (state.visualizationData) {
              Object.assign(state.visualizationData, updates);
            }
          }),
          
          // UI Actions
          setCurrentView: (view) => set((state) => {
            state.currentView = view;
          }),
          
          toggleSidebar: () => set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),
          
          setSidebarOpen: (open) => set((state) => {
            state.sidebarOpen = open;
          }),
          
          setTheme: (theme) => set((state) => {
            state.theme = theme;
          }),
          
          // Notification Actions
          addNotification: (notification) => set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: `notification-${Date.now()}-${Math.random()}`,
              timestamp: new Date(),
              read: false,
            };
            
            state.notifications.unshift(newNotification);
            state.unreadCount += 1;
            
            // Keep only last 50 notifications
            if (state.notifications.length > 50) {
              state.notifications = state.notifications.slice(0, 50);
            }
          }),
          
          markNotificationRead: (id) => set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification && !notification.read) {
              notification.read = true;
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }),
          
          clearNotifications: () => set((state) => {
            state.notifications = [];
            state.unreadCount = 0;
          }),
          
          // Error Actions
          addError: (error) => set((state) => {
            const newError: AppError = {
              ...error,
              timestamp: new Date(),
            };
            
            state.errors.push(newError);
            
            // Keep only last 20 errors
            if (state.errors.length > 20) {
              state.errors = state.errors.slice(-20);
            }
          }),
          
          clearErrors: () => set((state) => {
            state.errors = [];
          }),
          
          removeError: (code) => set((state) => {
            state.errors = state.errors.filter((error) => error.code !== code);
          }),
          
          // Loading Actions
          setLoading: (key, loading) => set((state) => {
            state.loading[key] = loading;
          }),
          
          // Utility Actions
          reset: () => set(() => ({ ...initialState })),
          
          hydrate: () => {
            // Hydration logic for persisted state
            const state = get();
            
            // Validate and clean up persisted data
            if (state.user && !state.user.id) {
              set((draft) => {
                draft.user = null;
                draft.isAuthenticated = false;
              });
            }
            
            // Clear old notifications (older than 7 days)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            set((draft) => {
              draft.notifications = draft.notifications.filter(
                (n) => new Date(n.timestamp) > weekAgo
              );
              draft.unreadCount = draft.notifications.filter((n) => !n.read).length;
            });
            
            // Clear old errors (older than 1 day)
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            set((draft) => {
              draft.errors = draft.errors.filter(
                (e) => new Date(e.timestamp) > dayAgo
              );
            });
          },
        }))
      ),
      {
        name: 'pathfinder-global-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          notifications: state.notifications,
          unreadCount: state.unreadCount,
        }),
        onRehydrateStorage: () => (state) => {
          state?.hydrate();
        },
      }
    ),
    {
      name: 'pathfinder-store',
    }
  )
);

// Selectors for optimized component subscriptions
export const useUser = () => useGlobalStore((state) => state.user);
export const useIsAuthenticated = () => useGlobalStore((state) => state.isAuthenticated);
export const useAnalysisResults = () => useGlobalStore((state) => state.analysisResults);
export const useIsAnalyzing = () => useGlobalStore((state) => state.isAnalyzing);
export const useRealTimeData = () => useGlobalStore((state) => state.realTimeData);
export const useModelStatus = () => useGlobalStore((state) => state.modelStatus);
export const useVisualizationData = () => useGlobalStore((state) => state.visualizationData);
export const useNotifications = () => useGlobalStore((state) => state.notifications);
export const useUnreadCount = () => useGlobalStore((state) => state.unreadCount);
export const useTheme = () => useGlobalStore((state) => state.theme);
export const useLoading = () => useGlobalStore((state) => state.loading);

// Action selectors
export const useGlobalActions = () => useGlobalStore((state) => ({
  initializeApp: state.initializeApp,
  setUser: state.setUser,
  updateUserProfile: state.updateUserProfile,
  setAnalysisResults: state.setAnalysisResults,
  setAnalyzing: state.setAnalyzing,
  setAnalysisProgress: state.setAnalysisProgress,
  updateRealTimeData: state.updateRealTimeData,
  updateModelStatus: state.updateModelStatus,
  setVisualizationData: state.setVisualizationData,
  addNotification: state.addNotification,
  markNotificationRead: state.markNotificationRead,
  clearNotifications: state.clearNotifications,
  addError: state.addError,
  clearErrors: state.clearErrors,
  removeError: state.removeError,
  setLoading: state.setLoading,
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setCurrentView: state.setCurrentView,
  reset: state.reset,
  hydrate: state.hydrate,
}));

// Store subscription helpers for performance optimization
export const subscribeToUser = (callback: (user: UserProfile | null) => void) => {
  return useGlobalStore.subscribe(
    (state) => state.user,
    callback
  );
};

export const subscribeToAnalysis = (callback: (isAnalyzing: boolean, progress: number) => void) => {
  return useGlobalStore.subscribe(
    (state) => ({ isAnalyzing: state.isAnalyzing, progress: state.analysisProgress }),
    ({ isAnalyzing, progress }) => callback(isAnalyzing, progress)
  );
};

export const subscribeToNotifications = (callback: (notifications: Notification[], unreadCount: number) => void) => {
  return useGlobalStore.subscribe(
    (state) => ({ notifications: state.notifications, unreadCount: state.unreadCount }),
    ({ notifications, unreadCount }) => callback(notifications, unreadCount)
  );
};

// Store utilities
export const getStoreSnapshot = () => useGlobalStore.getState();

export const resetStore = () => {
  useGlobalStore.getState().reset();
};

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.pathfinderStore = useGlobalStore;
  // @ts-ignore
  window.getStoreSnapshot = getStoreSnapshot;
  // @ts-ignore
  window.resetStore = resetStore;
}
