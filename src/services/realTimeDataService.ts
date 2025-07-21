/**
 * Real-time Data Service
 * WebSocket connections and live data streaming for Pathfinder AI
 */

import { logger } from '@/lib/logger';
import { useGlobalStore } from '@/store/globalStore';
import type { RealTimeData, JobOpportunity, MarketTrend, SkillDemandData } from '@/types';

export interface WebSocketMessage {
  type: 'market_update' | 'job_opportunity' | 'skill_demand' | 'system_status' | 'user_notification';
  data: any;
  timestamp: string;
  id: string;
}

export interface ConnectionConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

class RealTimeDataService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private heartbeatInterval = 30000;
  private heartbeatTimer: number | null = null;
  private isConnecting = false;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private messageQueue: WebSocketMessage[] = [];

  constructor(private config: ConnectionConfig) {
    this.maxReconnectAttempts = config.maxReconnectAttempts;
    this.reconnectInterval = config.reconnectInterval;
    this.heartbeatInterval = config.heartbeatInterval;
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      logger.info('Connecting to real-time data service', {
        component: 'RealTimeDataService',
        action: 'connect',
        metadata: { url: this.config.url },
      });

      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();

      // Wait for connection to open
      await new Promise<void>((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('WebSocket not initialized'));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          resolve();
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      });

      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.processMessageQueue();

      logger.info('Connected to real-time data service', {
        component: 'RealTimeDataService',
        action: 'connected',
      });

    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to connect to real-time data service', {
        component: 'RealTimeDataService',
        action: 'connect_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });

      this.scheduleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        logger.error('Failed to parse WebSocket message', {
          component: 'RealTimeDataService',
          action: 'message_parse_error',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }
    };

    this.ws.onclose = (event) => {
      logger.warn('WebSocket connection closed', {
        component: 'RealTimeDataService',
        action: 'connection_closed',
        metadata: { code: event.code, reason: event.reason },
      });

      this.stopHeartbeat();
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      logger.error('WebSocket error', {
        component: 'RealTimeDataService',
        action: 'websocket_error',
        metadata: { error },
      });
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    logger.debug('Received real-time message', {
      component: 'RealTimeDataService',
      action: 'message_received',
      metadata: { type: message.type, id: message.id },
    });

    // Update global store based on message type
    const store = useGlobalStore.getState();

    switch (message.type) {
      case 'market_update':
        this.handleMarketUpdate(message.data);
        break;
      case 'job_opportunity':
        this.handleJobOpportunity(message.data);
        break;
      case 'skill_demand':
        this.handleSkillDemand(message.data);
        break;
      case 'system_status':
        this.handleSystemStatus(message.data);
        break;
      case 'user_notification':
        store.addNotification({
          type: message.data.type || 'info',
          title: message.data.title,
          message: message.data.message,
          read: false,
        });
        break;
    }

    // Notify subscribers
    const subscribers = this.subscribers.get(message.type);
    if (subscribers) {
      subscribers.forEach(callback => callback(message.data));
    }

    // Notify all subscribers
    const allSubscribers = this.subscribers.get('*');
    if (allSubscribers) {
      allSubscribers.forEach(callback => callback(message));
    }
  }

  private handleMarketUpdate(data: MarketTrend[]): void {
    const store = useGlobalStore.getState();
    store.updateRealTimeData({
      marketTrends: data,
      lastUpdated: new Date(),
    });
  }

  private handleJobOpportunity(data: JobOpportunity): void {
    const store = useGlobalStore.getState();
    const currentData = store.realTimeData;
    
    if (currentData) {
      const updatedOpportunities = [data, ...currentData.jobOpportunities.slice(0, 49)]; // Keep last 50
      store.updateRealTimeData({
        jobOpportunities: updatedOpportunities,
        lastUpdated: new Date(),
      });
    }
  }

  private handleSkillDemand(data: SkillDemandData[]): void {
    const store = useGlobalStore.getState();
    store.updateRealTimeData({
      skillDemand: data,
      lastUpdated: new Date(),
    });
  }

  private handleSystemStatus(data: any): void {
    const store = useGlobalStore.getState();
    
    if (data.modelStatus) {
      data.modelStatus.forEach((status: any) => {
        store.updateModelStatus(status);
      });
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: 'heartbeat',
          data: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
          id: `heartbeat-${Date.now()}`,
        });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached', {
        component: 'RealTimeDataService',
        action: 'max_reconnect_attempts',
        metadata: { attempts: this.reconnectAttempts },
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    logger.info(`Scheduling reconnection attempt ${this.reconnectAttempts}`, {
      component: 'RealTimeDataService',
      action: 'schedule_reconnect',
      metadata: { delay, attempt: this.reconnectAttempts },
    });

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      logger.debug('Sent WebSocket message', {
        component: 'RealTimeDataService',
        action: 'message_sent',
        metadata: { type: message.type, id: message.id },
      });
    } else {
      // Queue message for later
      this.messageQueue.push(message);
      logger.debug('Queued WebSocket message', {
        component: 'RealTimeDataService',
        action: 'message_queued',
        metadata: { type: message.type, id: message.id },
      });
    }
  }

  subscribe(messageType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(messageType)) {
      this.subscribers.set(messageType, new Set());
    }
    
    this.subscribers.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(messageType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(messageType);
        }
      }
    };
  }

  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscribers.clear();
    this.messageQueue = [];
    this.reconnectAttempts = 0;

    logger.info('Disconnected from real-time data service', {
      component: 'RealTimeDataService',
      action: 'disconnect',
    });
  }

  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (this.isConnecting) return 'connecting';
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.CLOSED:
      case WebSocket.CLOSING:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  // Simulate real-time data for development
  startSimulation(): void {
    if (process.env.NODE_ENV !== 'development') return;

    logger.info('Starting real-time data simulation', {
      component: 'RealTimeDataService',
      action: 'start_simulation',
    });

    // Simulate market updates
    setInterval(() => {
      this.simulateMarketUpdate();
    }, 10000);

    // Simulate job opportunities
    setInterval(() => {
      this.simulateJobOpportunity();
    }, 15000);

    // Simulate skill demand updates
    setInterval(() => {
      this.simulateSkillDemandUpdate();
    }, 20000);
  }

  private simulateMarketUpdate(): void {
    const mockTrends: MarketTrend[] = [
      {
        id: `trend-${Date.now()}`,
        industry: 'Technology',
        trend: 'growing',
        growthRate: Math.random() * 20 + 5,
        timeframe: '6 months',
        factors: ['AI adoption', 'Remote work'],
        confidence: Math.random() * 20 + 80,
      },
    ];

    this.handleMessage({
      type: 'market_update',
      data: mockTrends,
      timestamp: new Date().toISOString(),
      id: `market-${Date.now()}`,
    });
  }

  private simulateJobOpportunity(): void {
    const mockJob: JobOpportunity = {
      id: `job-${Date.now()}`,
      title: 'Senior AI Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: {
        min: 150000,
        max: 200000,
        currency: 'USD',
      },
      remote: Math.random() > 0.5,
      requiredSkills: ['Python', 'Machine Learning', 'TensorFlow'],
      matchScore: Math.random() * 30 + 70,
      postedDate: new Date(),
      url: 'https://example.com/job',
    };

    this.handleMessage({
      type: 'job_opportunity',
      data: mockJob,
      timestamp: new Date().toISOString(),
      id: `job-${Date.now()}`,
    });
  }

  private simulateSkillDemandUpdate(): void {
    const mockSkills: SkillDemandData[] = [
      {
        skill: 'React',
        demand: Math.random() * 30 + 70,
        growth: Math.random() * 20 + 5,
        averageSalary: 95000,
        jobCount: Math.floor(Math.random() * 1000 + 500),
        locations: ['San Francisco', 'New York', 'Seattle'],
        trending: Math.random() > 0.7,
      },
    ];

    this.handleMessage({
      type: 'skill_demand',
      data: mockSkills,
      timestamp: new Date().toISOString(),
      id: `skill-${Date.now()}`,
    });
  }
}

// Create service instance
const config: ConnectionConfig = {
  url: process.env.NODE_ENV === 'development' 
    ? 'ws://localhost:3001/ws' 
    : 'wss://api.pathfinder-ai.com/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
};

export const realTimeDataService = new RealTimeDataService(config);

// Auto-connect in development with simulation
if (process.env.NODE_ENV === 'development') {
  realTimeDataService.startSimulation();
}

export default realTimeDataService;
