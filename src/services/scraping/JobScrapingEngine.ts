/**
 * Job Scraping Engine
 * Ethical web scraping system for job data collection with rate limiting and compliance
 */

import { logger } from '@/lib/logger';
import { databaseManager } from '@/services/database/DatabaseManager';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  benefits: string[];
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  skills: string[];
  postedDate: Date;
  applicationDeadline?: Date;
  url: string;
  source: string;
  metadata: {
    scrapedAt: Date;
    confidence: number;
    rawData?: any;
  };
}

export interface ScrapingTarget {
  id: string;
  name: string;
  baseUrl: string;
  searchEndpoint: string;
  selectors: {
    jobContainer: string;
    title: string;
    company: string;
    location: string;
    description: string;
    salary?: string;
    requirements?: string;
    skills?: string;
    postedDate?: string;
    url: string;
  };
  rateLimit: {
    requestsPerMinute: number;
    delayBetweenRequests: number;
  };
  headers: Record<string, string>;
  pagination: {
    type: 'page' | 'offset' | 'cursor';
    parameter: string;
    maxPages: number;
  };
  isActive: boolean;
}

export interface ScrapingJob {
  id: string;
  targetId: string;
  keywords: string[];
  location?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime?: Date;
  endTime?: Date;
  progress: {
    pagesScraped: number;
    totalPages: number;
    jobsFound: number;
    jobsProcessed: number;
  };
  errors: string[];
  settings: {
    maxJobs: number;
    respectRobotsTxt: boolean;
    useProxy: boolean;
    retryAttempts: number;
  };
}

export interface RateLimiter {
  targetId: string;
  requestCount: number;
  windowStart: Date;
  lastRequest: Date;
  isBlocked: boolean;
  blockUntil?: Date;
}

// Robots.txt Parser
class RobotsTxtParser {
  private cache: Map<string, { rules: any; timestamp: Date }> = new Map();
  private cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

  async canScrape(url: string, userAgent = '*'): Promise<boolean> {
    try {
      const domain = new URL(url).origin;
      const robotsUrl = `${domain}/robots.txt`;
      
      // Check cache first
      const cached = this.cache.get(domain);
      if (cached && Date.now() - cached.timestamp.getTime() < this.cacheTTL) {
        return this.checkRules(url, cached.rules, userAgent);
      }

      // Fetch robots.txt
      const response = await fetch(robotsUrl);
      if (!response.ok) {
        // If robots.txt doesn't exist, assume scraping is allowed
        return true;
      }

      const robotsTxt = await response.text();
      const rules = this.parseRobotsTxt(robotsTxt);
      
      // Cache the rules
      this.cache.set(domain, { rules, timestamp: new Date() });
      
      return this.checkRules(url, rules, userAgent);
    } catch (error) {
      logger.warn('Failed to check robots.txt', {
        component: 'RobotsTxtParser',
        action: 'can_scrape',
        metadata: { url, error: error instanceof Error ? error.message : 'Unknown error' },
      });
      
      // If we can't check robots.txt, err on the side of caution
      return false;
    }
  }

  private parseRobotsTxt(content: string): any {
    const rules: any = { '*': { allow: [], disallow: [] } };
    let currentUserAgent = '*';

    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || !trimmed) continue;

      const [directive, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();

      switch (directive.toLowerCase()) {
        case 'user-agent':
          currentUserAgent = value;
          if (!rules[currentUserAgent]) {
            rules[currentUserAgent] = { allow: [], disallow: [] };
          }
          break;
        
        case 'disallow':
          if (!rules[currentUserAgent]) {
            rules[currentUserAgent] = { allow: [], disallow: [] };
          }
          rules[currentUserAgent].disallow.push(value);
          break;
        
        case 'allow':
          if (!rules[currentUserAgent]) {
            rules[currentUserAgent] = { allow: [], disallow: [] };
          }
          rules[currentUserAgent].allow.push(value);
          break;
        
        case 'crawl-delay':
          if (!rules[currentUserAgent]) {
            rules[currentUserAgent] = { allow: [], disallow: [] };
          }
          rules[currentUserAgent].crawlDelay = parseInt(value);
          break;
      }
    }

    return rules;
  }

  private checkRules(url: string, rules: any, userAgent: string): boolean {
    const path = new URL(url).pathname;
    
    // Check specific user agent rules first
    const userAgentRules = rules[userAgent] || rules['*'];
    if (!userAgentRules) return true;

    // Check disallow rules
    for (const disallowPath of userAgentRules.disallow || []) {
      if (disallowPath === '' || path.startsWith(disallowPath)) {
        // Check if there's a more specific allow rule
        for (const allowPath of userAgentRules.allow || []) {
          if (path.startsWith(allowPath)) {
            return true;
          }
        }
        return false;
      }
    }

    return true;
  }
}

// Rate Limiting Manager
class RateLimitManager {
  private limiters: Map<string, RateLimiter> = new Map();

  async canMakeRequest(targetId: string, rateLimit: { requestsPerMinute: number }): Promise<boolean> {
    const now = new Date();
    let limiter = this.limiters.get(targetId);

    if (!limiter) {
      limiter = {
        targetId,
        requestCount: 0,
        windowStart: now,
        lastRequest: now,
        isBlocked: false,
      };
      this.limiters.set(targetId, limiter);
    }

    // Check if we're currently blocked
    if (limiter.isBlocked && limiter.blockUntil && now < limiter.blockUntil) {
      return false;
    }

    // Reset window if it's been more than a minute
    if (now.getTime() - limiter.windowStart.getTime() >= 60000) {
      limiter.requestCount = 0;
      limiter.windowStart = now;
      limiter.isBlocked = false;
      limiter.blockUntil = undefined;
    }

    // Check if we've exceeded the rate limit
    if (limiter.requestCount >= rateLimit.requestsPerMinute) {
      limiter.isBlocked = true;
      limiter.blockUntil = new Date(limiter.windowStart.getTime() + 60000);
      return false;
    }

    return true;
  }

  recordRequest(targetId: string): void {
    const limiter = this.limiters.get(targetId);
    if (limiter) {
      limiter.requestCount++;
      limiter.lastRequest = new Date();
    }
  }

  async waitForRateLimit(targetId: string, delayMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  getStatus(targetId: string): RateLimiter | null {
    return this.limiters.get(targetId) || null;
  }
}

// HTML Parser for Job Data
class JobDataParser {
  parseJobListing(html: string, selectors: any, source: string, url: string): JobListing | null {
    try {
      // Mock HTML parsing - in production, use a proper HTML parser like Cheerio
      const mockData = this.generateMockJobData(source, url);
      return mockData;
    } catch (error) {
      logger.error('Failed to parse job listing', {
        component: 'JobDataParser',
        action: 'parse_job_listing',
        metadata: { source, url, error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return null;
    }
  }

  private generateMockJobData(source: string, url: string): JobListing {
    const titles = [
      'Senior Software Engineer',
      'Frontend Developer',
      'Data Scientist',
      'Product Manager',
      'DevOps Engineer',
      'UX Designer',
      'Backend Developer',
      'Machine Learning Engineer',
    ];

    const companies = [
      'TechCorp Inc.',
      'DataFlow Systems',
      'InnovateLabs',
      'CloudFirst Solutions',
      'AI Dynamics',
      'WebScale Technologies',
      'NextGen Software',
      'Digital Pioneers',
    ];

    const locations = [
      'San Francisco, CA',
      'New York, NY',
      'Seattle, WA',
      'Austin, TX',
      'Boston, MA',
      'Remote',
      'Los Angeles, CA',
      'Chicago, IL',
    ];

    const skills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
      'Kubernetes', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Redis',
      'GraphQL', 'REST APIs', 'Microservices', 'CI/CD', 'Git',
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 5);

    return {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: randomTitle,
      company: randomCompany,
      location: randomLocation,
      description: `We are seeking a talented ${randomTitle} to join our growing team. You will work on cutting-edge projects and collaborate with a diverse group of professionals.`,
      requirements: [
        `3+ years of experience in ${randomSkills[0]}`,
        `Strong knowledge of ${randomSkills[1]} and ${randomSkills[2]}`,
        'Excellent problem-solving skills',
        'Strong communication abilities',
        'Bachelor\'s degree in Computer Science or related field',
      ],
      salary: {
        min: 80000 + Math.floor(Math.random() * 50000),
        max: 120000 + Math.floor(Math.random() * 80000),
        currency: 'USD',
        period: 'yearly',
      },
      benefits: [
        'Health insurance',
        'Dental and vision coverage',
        '401(k) matching',
        'Flexible PTO',
        'Remote work options',
      ],
      employmentType: 'full-time',
      remote: Math.random() > 0.5,
      experienceLevel: ['entry', 'mid', 'senior'][Math.floor(Math.random() * 3)] as any,
      skills: randomSkills,
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      applicationDeadline: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      url,
      source,
      metadata: {
        scrapedAt: new Date(),
        confidence: 0.8 + Math.random() * 0.2,
      },
    };
  }

  extractSkills(description: string, requirements: string[]): string[] {
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue',
      'node.js', 'express', 'django', 'flask', 'spring', 'aws',
      'azure', 'gcp', 'docker', 'kubernetes', 'postgresql', 'mysql',
      'mongodb', 'redis', 'elasticsearch', 'graphql', 'rest',
      'microservices', 'ci/cd', 'git', 'jenkins', 'terraform',
    ];

    const text = (description + ' ' + requirements.join(' ')).toLowerCase();
    const foundSkills: string[] = [];

    for (const skill of skillKeywords) {
      if (text.includes(skill)) {
        foundSkills.push(skill);
      }
    }

    return [...new Set(foundSkills)]; // Remove duplicates
  }

  normalizeSalary(salaryText: string): { min?: number; max?: number; currency: string; period: string } | undefined {
    // Mock salary parsing
    const match = salaryText.match(/\$(\d+(?:,\d+)*)\s*-?\s*\$?(\d+(?:,\d+)*)?/);
    if (match) {
      const min = parseInt(match[1].replace(/,/g, ''));
      const max = match[2] ? parseInt(match[2].replace(/,/g, '')) : undefined;
      
      return {
        min,
        max,
        currency: 'USD',
        period: salaryText.includes('hour') ? 'hourly' : 'yearly',
      };
    }
    
    return undefined;
  }
}

// Main Job Scraping Engine
export class JobScrapingEngine {
  private robotsParser: RobotsTxtParser;
  private rateLimitManager: RateLimitManager;
  private jobParser: JobDataParser;
  private targets: Map<string, ScrapingTarget> = new Map();
  private activeJobs: Map<string, ScrapingJob> = new Map();

  constructor() {
    this.robotsParser = new RobotsTxtParser();
    this.rateLimitManager = new RateLimitManager();
    this.jobParser = new JobDataParser();
    
    this.initializeTargets();
  }

  private initializeTargets(): void {
    // Indeed target
    this.targets.set('indeed', {
      id: 'indeed',
      name: 'Indeed',
      baseUrl: 'https://indeed.com',
      searchEndpoint: '/jobs',
      selectors: {
        jobContainer: '.jobsearch-SerpJobCard',
        title: '.jobTitle a',
        company: '.companyName',
        location: '.companyLocation',
        description: '.job-snippet',
        salary: '.salary-snippet',
        url: '.jobTitle a',
      },
      rateLimit: {
        requestsPerMinute: 30,
        delayBetweenRequests: 2000,
      },
      headers: {
        'User-Agent': 'PathfinderAI-JobBot/1.0 (Educational Purpose)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      pagination: {
        type: 'page',
        parameter: 'start',
        maxPages: 10,
      },
      isActive: true,
    });

    // LinkedIn target (Note: LinkedIn has strict anti-scraping measures)
    this.targets.set('linkedin', {
      id: 'linkedin',
      name: 'LinkedIn Jobs',
      baseUrl: 'https://linkedin.com',
      searchEndpoint: '/jobs/search',
      selectors: {
        jobContainer: '.job-search-card',
        title: '.job-search-card__title',
        company: '.job-search-card__subtitle',
        location: '.job-search-card__location',
        description: '.job-search-card__snippet',
        url: '.job-search-card__title a',
      },
      rateLimit: {
        requestsPerMinute: 10, // Very conservative
        delayBetweenRequests: 6000,
      },
      headers: {
        'User-Agent': 'PathfinderAI-JobBot/1.0 (Educational Purpose)',
      },
      pagination: {
        type: 'page',
        parameter: 'start',
        maxPages: 5,
      },
      isActive: false, // Disabled due to strict anti-scraping
    });

    // AngelList/Wellfound target
    this.targets.set('angellist', {
      id: 'angellist',
      name: 'AngelList',
      baseUrl: 'https://angel.co',
      searchEndpoint: '/jobs',
      selectors: {
        jobContainer: '.job-listing',
        title: '.job-title',
        company: '.company-name',
        location: '.location',
        description: '.job-description',
        url: '.job-title a',
      },
      rateLimit: {
        requestsPerMinute: 20,
        delayBetweenRequests: 3000,
      },
      headers: {
        'User-Agent': 'PathfinderAI-JobBot/1.0 (Educational Purpose)',
      },
      pagination: {
        type: 'page',
        parameter: 'page',
        maxPages: 8,
      },
      isActive: true,
    });
  }

  async startScrapingJob(
    targetId: string,
    keywords: string[],
    location?: string,
    settings?: Partial<ScrapingJob['settings']>
  ): Promise<string> {
    const target = this.targets.get(targetId);
    if (!target || !target.isActive) {
      throw new Error(`Target ${targetId} is not available or inactive`);
    }

    const jobId = `scraping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const scrapingJob: ScrapingJob = {
      id: jobId,
      targetId,
      keywords,
      location,
      status: 'pending',
      progress: {
        pagesScraped: 0,
        totalPages: target.pagination.maxPages,
        jobsFound: 0,
        jobsProcessed: 0,
      },
      errors: [],
      settings: {
        maxJobs: 1000,
        respectRobotsTxt: true,
        useProxy: false,
        retryAttempts: 3,
        ...settings,
      },
    };

    this.activeJobs.set(jobId, scrapingJob);

    // Start scraping asynchronously
    this.runScrapingJob(scrapingJob).catch(error => {
      scrapingJob.status = 'failed';
      scrapingJob.errors.push(error.message);
      scrapingJob.endTime = new Date();
    });

    return jobId;
  }

  private async runScrapingJob(job: ScrapingJob): Promise<void> {
    const target = this.targets.get(job.targetId)!;
    
    try {
      job.status = 'running';
      job.startTime = new Date();

      logger.info('Starting job scraping', {
        component: 'JobScrapingEngine',
        action: 'start_scraping',
        metadata: { 
          jobId: job.id,
          targetId: job.targetId,
          keywords: job.keywords,
          location: job.location,
        },
      });

      // Check robots.txt if required
      if (job.settings.respectRobotsTxt) {
        const canScrape = await this.robotsParser.canScrape(target.baseUrl);
        if (!canScrape) {
          throw new Error(`Robots.txt disallows scraping for ${target.baseUrl}`);
        }
      }

      const allJobs: JobListing[] = [];

      // Scrape each page
      for (let page = 0; page < target.pagination.maxPages; page++) {
        if (job.status !== 'running') break; // Job was paused or cancelled

        // Check rate limit
        const canMakeRequest = await this.rateLimitManager.canMakeRequest(
          job.targetId,
          target.rateLimit
        );

        if (!canMakeRequest) {
          await this.rateLimitManager.waitForRateLimit(job.targetId, target.rateLimit.delayBetweenRequests);
        }

        try {
          const pageJobs = await this.scrapePage(target, job.keywords, job.location, page);
          allJobs.push(...pageJobs);
          
          job.progress.pagesScraped = page + 1;
          job.progress.jobsFound = allJobs.length;

          this.rateLimitManager.recordRequest(job.targetId);

          // Respect delay between requests
          await this.rateLimitManager.waitForRateLimit(job.targetId, target.rateLimit.delayBetweenRequests);

          // Stop if we've reached the max jobs limit
          if (allJobs.length >= job.settings.maxJobs) {
            break;
          }

        } catch (error) {
          job.errors.push(`Page ${page} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          if (job.errors.length > job.settings.retryAttempts) {
            throw new Error('Too many page failures');
          }
        }
      }

      // Process and save jobs
      for (const jobListing of allJobs) {
        try {
          await this.processJobListing(jobListing);
          job.progress.jobsProcessed++;
        } catch (error) {
          job.errors.push(`Failed to process job ${jobListing.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      job.status = 'completed';
      job.endTime = new Date();

      logger.info('Job scraping completed', {
        component: 'JobScrapingEngine',
        action: 'scraping_completed',
        metadata: { 
          jobId: job.id,
          jobsFound: job.progress.jobsFound,
          jobsProcessed: job.progress.jobsProcessed,
          errors: job.errors.length,
        },
      });

    } catch (error) {
      job.status = 'failed';
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      job.endTime = new Date();

      logger.error('Job scraping failed', {
        component: 'JobScrapingEngine',
        action: 'scraping_failed',
        metadata: { 
          jobId: job.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  private async scrapePage(
    target: ScrapingTarget,
    keywords: string[],
    location?: string,
    page = 0
  ): Promise<JobListing[]> {
    // Mock page scraping - in production, this would make actual HTTP requests
    const jobs: JobListing[] = [];
    const jobsPerPage = 10;

    for (let i = 0; i < jobsPerPage; i++) {
      const mockUrl = `${target.baseUrl}/job/${page}-${i}`;
      const job = this.jobParser.parseJobListing('', target.selectors, target.name, mockUrl);
      
      if (job) {
        // Filter by keywords
        const titleMatch = keywords.some(keyword => 
          job.title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        const descriptionMatch = keywords.some(keyword =>
          job.description.toLowerCase().includes(keyword.toLowerCase())
        );

        if (titleMatch || descriptionMatch) {
          jobs.push(job);
        }
      }
    }

    return jobs;
  }

  private async processJobListing(job: JobListing): Promise<void> {
    try {
      // Enhance job data
      job.skills = this.jobParser.extractSkills(job.description, job.requirements);
      
      // Store in database
      await databaseManager.storeUserProfile({
        type: 'job_listing',
        job_id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: JSON.stringify(job.requirements),
        skills: JSON.stringify(job.skills),
        salary_min: job.salary?.min,
        salary_max: job.salary?.max,
        employment_type: job.employmentType,
        remote: job.remote,
        experience_level: job.experienceLevel,
        posted_date: job.postedDate,
        source: job.source,
        url: job.url,
        scraped_at: job.metadata.scrapedAt,
        confidence: job.metadata.confidence,
      });

    } catch (error) {
      logger.error('Failed to process job listing', {
        component: 'JobScrapingEngine',
        action: 'process_job_listing',
        metadata: { 
          jobId: job.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  // Public API methods
  getScrapingJob(jobId: string): ScrapingJob | undefined {
    return this.activeJobs.get(jobId);
  }

  getAllScrapingJobs(): ScrapingJob[] {
    return Array.from(this.activeJobs.values());
  }

  getActiveScrapingJobs(): ScrapingJob[] {
    return Array.from(this.activeJobs.values()).filter(job => 
      job.status === 'running' || job.status === 'pending'
    );
  }

  async pauseScrapingJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'running') {
      job.status = 'paused';
    }
  }

  async resumeScrapingJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'paused') {
      job.status = 'running';
      // Resume scraping logic would go here
    }
  }

  async cancelScrapingJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && (job.status === 'running' || job.status === 'pending' || job.status === 'paused')) {
      job.status = 'failed';
      job.errors.push('Job cancelled by user');
      job.endTime = new Date();
    }
  }

  getTargets(): ScrapingTarget[] {
    return Array.from(this.targets.values());
  }

  getActiveTargets(): ScrapingTarget[] {
    return Array.from(this.targets.values()).filter(target => target.isActive);
  }

  getRateLimitStatus(targetId: string): RateLimiter | null {
    return this.rateLimitManager.getStatus(targetId);
  }

  async testTarget(targetId: string): Promise<{ success: boolean; error?: string }> {
    const target = this.targets.get(targetId);
    if (!target) {
      return { success: false, error: 'Target not found' };
    }

    try {
      // Test robots.txt
      const canScrape = await this.robotsParser.canScrape(target.baseUrl);
      if (!canScrape) {
        return { success: false, error: 'Robots.txt disallows scraping' };
      }

      // Test rate limiting
      const canMakeRequest = await this.rateLimitManager.canMakeRequest(
        targetId,
        target.rateLimit
      );
      if (!canMakeRequest) {
        return { success: false, error: 'Rate limit exceeded' };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Singleton instance
export const jobScrapingEngine = new JobScrapingEngine();

export default jobScrapingEngine;
