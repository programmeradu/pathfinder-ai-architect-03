/**
 * Data Collection Pipeline
 * Automated data collection from BLS, O*NET, job boards, and other sources
 */

import { logger } from '@/lib/logger';
import { databaseManager } from '@/services/database/DatabaseManager';
import { appConfig } from '@/config/appConfig';

// Data source interfaces
export interface DataSource {
  name: string;
  url: string;
  apiKey?: string;
  rateLimit: number; // requests per minute
  lastFetch?: Date;
  isActive: boolean;
}

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  remote: boolean;
  postedDate: Date;
  source: string;
  url: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  description: string;
  demand: number;
  growth: number;
  averageSalary: number;
  relatedSkills: string[];
  source: string;
}

export interface MarketData {
  id: string;
  industry: string;
  region: string;
  metric: string;
  value: number;
  timestamp: Date;
  source: string;
}

export interface CollectionJob {
  id: string;
  source: string;
  type: 'jobs' | 'skills' | 'market' | 'salary';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  recordsProcessed: number;
  errors: string[];
}

// Data collectors
class BLSDataCollector {
  private baseUrl = 'https://api.bls.gov/publicAPI/v2';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async collectEmploymentData(seriesIds: string[]): Promise<MarketData[]> {
    logger.info('Collecting BLS employment data', {
      component: 'BLSDataCollector',
      action: 'collect_employment_data',
      metadata: { seriesCount: seriesIds.length },
    });

    try {
      const response = await fetch(`${this.baseUrl}/timeseries/data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'X-API-KEY': this.apiKey }),
        },
        body: JSON.stringify({
          seriesid: seriesIds,
          startyear: new Date().getFullYear() - 2,
          endyear: new Date().getFullYear(),
        }),
      });

      if (!response.ok) {
        throw new Error(`BLS API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBLSData(data);
    } catch (error) {
      logger.error('Failed to collect BLS data', {
        component: 'BLSDataCollector',
        action: 'collect_employment_data',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return [];
    }
  }

  private transformBLSData(rawData: any): MarketData[] {
    const marketData: MarketData[] = [];
    
    if (rawData.Results?.series) {
      for (const series of rawData.Results.series) {
        for (const dataPoint of series.data || []) {
          marketData.push({
            id: `bls-${series.seriesID}-${dataPoint.year}-${dataPoint.period}`,
            industry: this.getIndustryFromSeriesId(series.seriesID),
            region: 'US',
            metric: 'employment',
            value: parseFloat(dataPoint.value),
            timestamp: new Date(`${dataPoint.year}-${dataPoint.period.replace('M', '')}-01`),
            source: 'BLS',
          });
        }
      }
    }

    return marketData;
  }

  private getIndustryFromSeriesId(seriesId: string): string {
    // Map BLS series IDs to industry names
    const industryMap: Record<string, string> = {
      'CES1000000001': 'Total Nonfarm',
      'CES5000000001': 'Information Technology',
      'CES6000000001': 'Professional Services',
      // Add more mappings as needed
    };
    
    return industryMap[seriesId] || 'Unknown';
  }
}

class ONETDataCollector {
  private baseUrl = 'https://services.onetcenter.org/ws';
  private username?: string;
  private password?: string;

  constructor(username?: string, password?: string) {
    this.username = username;
    this.password = password;
  }

  async collectSkillData(): Promise<SkillData[]> {
    logger.info('Collecting O*NET skill data', {
      component: 'ONETDataCollector',
      action: 'collect_skill_data',
    });

    try {
      // Mock O*NET data collection
      const mockSkills: SkillData[] = [
        {
          id: 'onet-skill-1',
          name: 'JavaScript',
          category: 'Programming Languages',
          description: 'A high-level programming language',
          demand: 85,
          growth: 12,
          averageSalary: 95000,
          relatedSkills: ['React', 'Node.js', 'TypeScript'],
          source: 'O*NET',
        },
        {
          id: 'onet-skill-2',
          name: 'Machine Learning',
          category: 'Data Science',
          description: 'Algorithms that learn from data',
          demand: 92,
          growth: 25,
          averageSalary: 125000,
          relatedSkills: ['Python', 'TensorFlow', 'Statistics'],
          source: 'O*NET',
        },
        {
          id: 'onet-skill-3',
          name: 'Cloud Computing',
          category: 'Infrastructure',
          description: 'Distributed computing services',
          demand: 88,
          growth: 18,
          averageSalary: 110000,
          relatedSkills: ['AWS', 'Azure', 'Docker'],
          source: 'O*NET',
        },
      ];

      return mockSkills;
    } catch (error) {
      logger.error('Failed to collect O*NET data', {
        component: 'ONETDataCollector',
        action: 'collect_skill_data',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return [];
    }
  }
}

class JobBoardScraper {
  private sources: DataSource[] = [
    {
      name: 'Indeed',
      url: 'https://indeed.com',
      rateLimit: 60,
      isActive: true,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      rateLimit: 30,
      isActive: true,
    },
    {
      name: 'Glassdoor',
      url: 'https://glassdoor.com',
      rateLimit: 20,
      isActive: true,
    },
  ];

  async scrapeJobs(keywords: string[], location?: string): Promise<JobData[]> {
    logger.info('Scraping job data', {
      component: 'JobBoardScraper',
      action: 'scrape_jobs',
      metadata: { keywords, location },
    });

    const allJobs: JobData[] = [];

    for (const source of this.sources) {
      if (!source.isActive) continue;

      try {
        const jobs = await this.scrapeFromSource(source, keywords, location);
        allJobs.push(...jobs);
        
        // Respect rate limits
        await this.delay(60000 / source.rateLimit);
      } catch (error) {
        logger.error(`Failed to scrape from ${source.name}`, {
          component: 'JobBoardScraper',
          action: 'scrape_from_source',
          metadata: { source: source.name, error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }
    }

    return allJobs;
  }

  private async scrapeFromSource(source: DataSource, keywords: string[], location?: string): Promise<JobData[]> {
    // Mock job scraping - in production, this would use proper web scraping
    const mockJobs: JobData[] = keywords.flatMap(keyword => [
      {
        id: `${source.name.toLowerCase()}-${keyword}-1`,
        title: `Senior ${keyword} Developer`,
        company: 'TechCorp Inc.',
        location: location || 'San Francisco, CA',
        description: `We are looking for a senior ${keyword} developer...`,
        requirements: [keyword, 'Experience', 'Problem Solving'],
        salary: {
          min: 120000,
          max: 180000,
          currency: 'USD',
        },
        remote: Math.random() > 0.5,
        postedDate: new Date(),
        source: source.name,
        url: `${source.url}/job/${keyword}-1`,
      },
      {
        id: `${source.name.toLowerCase()}-${keyword}-2`,
        title: `${keyword} Engineer`,
        company: 'StartupX',
        location: location || 'New York, NY',
        description: `Join our team as a ${keyword} engineer...`,
        requirements: [keyword, 'Teamwork', 'Innovation'],
        salary: {
          min: 90000,
          max: 140000,
          currency: 'USD',
        },
        remote: Math.random() > 0.5,
        postedDate: new Date(),
        source: source.name,
        url: `${source.url}/job/${keyword}-2`,
      },
    ]);

    return mockJobs;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main Data Collection Pipeline
export class DataCollectionPipeline {
  private blsCollector: BLSDataCollector;
  private onetCollector: ONETDataCollector;
  private jobScraper: JobBoardScraper;
  private isRunning = false;
  private jobs: Map<string, CollectionJob> = new Map();

  constructor() {
    this.blsCollector = new BLSDataCollector(process.env.VITE_BLS_API_KEY);
    this.onetCollector = new ONETDataCollector(
      process.env.VITE_ONET_USERNAME,
      process.env.VITE_ONET_PASSWORD
    );
    this.jobScraper = new JobBoardScraper();

    logger.info('Data collection pipeline initialized', {
      component: 'DataCollectionPipeline',
      action: 'initialize',
    });
  }

  async startCollection(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Data collection already running', {
        component: 'DataCollectionPipeline',
        action: 'start_collection',
      });
      return;
    }

    this.isRunning = true;
    logger.info('Starting data collection pipeline', {
      component: 'DataCollectionPipeline',
      action: 'start_collection',
    });

    try {
      // Collect market data
      await this.collectMarketData();
      
      // Collect skill data
      await this.collectSkillData();
      
      // Collect job data
      await this.collectJobData();
      
      logger.info('Data collection completed successfully', {
        component: 'DataCollectionPipeline',
        action: 'collection_completed',
      });
    } catch (error) {
      logger.error('Data collection failed', {
        component: 'DataCollectionPipeline',
        action: 'collection_failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      this.isRunning = false;
    }
  }

  private async collectMarketData(): Promise<void> {
    const job = this.createJob('BLS', 'market');
    
    try {
      const seriesIds = ['CES1000000001', 'CES5000000001', 'CES6000000001'];
      const marketData = await this.blsCollector.collectEmploymentData(seriesIds);
      
      // Store in time series database
      for (const data of marketData) {
        await databaseManager.recordMetric(
          `employment_${data.industry}`,
          data.value,
          { region: data.region, source: data.source }
        );
      }
      
      this.completeJob(job.id, marketData.length);
    } catch (error) {
      this.failJob(job.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async collectSkillData(): Promise<void> {
    const job = this.createJob('O*NET', 'skills');
    
    try {
      const skillData = await this.onetCollector.collectSkillData();
      
      // Store in graph database
      for (const skill of skillData) {
        const skillNodeId = await databaseManager.createCareerNode({
          type: 'skill',
          name: skill.name,
          category: skill.category,
          demand: skill.demand,
          growth: skill.growth,
          averageSalary: skill.averageSalary,
        });
        
        // Create relationships with related skills
        for (const relatedSkill of skill.relatedSkills) {
          const relatedNodeId = await databaseManager.createCareerNode({
            type: 'skill',
            name: relatedSkill,
          });
          
          await databaseManager.createSkillRelationship(skillNodeId, relatedNodeId, 0.8);
        }
      }
      
      this.completeJob(job.id, skillData.length);
    } catch (error) {
      this.failJob(job.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async collectJobData(): Promise<void> {
    const job = this.createJob('JobBoards', 'jobs');
    
    try {
      const keywords = ['JavaScript', 'Python', 'React', 'Machine Learning', 'Data Science'];
      const jobData = await this.jobScraper.scrapeJobs(keywords);
      
      // Store in relational database
      for (const jobInfo of jobData) {
        await databaseManager.storeUserProfile({
          type: 'job_posting',
          title: jobInfo.title,
          company: jobInfo.company,
          location: jobInfo.location,
          description: jobInfo.description,
          requirements: JSON.stringify(jobInfo.requirements),
          salary_min: jobInfo.salary?.min,
          salary_max: jobInfo.salary?.max,
          remote: jobInfo.remote,
          posted_date: jobInfo.postedDate,
          source: jobInfo.source,
          url: jobInfo.url,
        });
      }
      
      this.completeJob(job.id, jobData.length);
    } catch (error) {
      this.failJob(job.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private createJob(source: string, type: CollectionJob['type']): CollectionJob {
    const job: CollectionJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      type,
      status: 'running',
      startTime: new Date(),
      recordsProcessed: 0,
      errors: [],
    };
    
    this.jobs.set(job.id, job);
    return job;
  }

  private completeJob(jobId: string, recordsProcessed: number): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'completed';
      job.endTime = new Date();
      job.recordsProcessed = recordsProcessed;
    }
  }

  private failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.endTime = new Date();
      job.errors.push(error);
    }
  }

  getJobStatus(jobId: string): CollectionJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): CollectionJob[] {
    return Array.from(this.jobs.values());
  }

  isCollectionRunning(): boolean {
    return this.isRunning;
  }

  async scheduleCollection(intervalHours = 24): Promise<void> {
    logger.info('Scheduling data collection', {
      component: 'DataCollectionPipeline',
      action: 'schedule_collection',
      metadata: { intervalHours },
    });

    setInterval(() => {
      if (!this.isRunning) {
        this.startCollection();
      }
    }, intervalHours * 60 * 60 * 1000);
  }
}

// Singleton instance
export const dataCollectionPipeline = new DataCollectionPipeline();

export default dataCollectionPipeline;
