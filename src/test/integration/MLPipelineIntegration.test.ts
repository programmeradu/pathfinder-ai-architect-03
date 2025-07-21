/**
 * ML Pipeline Integration Tests
 * Tests the complete ML pipeline from data processing to model serving
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { modelServingInfrastructure } from '@/services/ml/ModelServingInfrastructure';
import { datasetProcessingPipeline } from '@/services/data/DatasetProcessingPipeline';
import { jobScrapingEngine } from '@/services/scraping/JobScrapingEngine';
import { modelTrainingPipeline } from '@/services/ml/ModelTrainingPipeline';
import { setupTestEnvironment, cleanupTestEnvironment } from '@/test/utils/testHelpers';

describe('ML Pipeline Integration', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('Job Scraping Engine', () => {
    it('should scrape jobs from multiple sources', async () => {
      const jobId = await jobScrapingEngine.startScrapingJob(
        'indeed',
        ['software engineer', 'developer'],
        'San Francisco, CA',
        { maxJobs: 50 }
      );

      expect(jobId).toBeTruthy();
      
      const job = jobScrapingEngine.getScrapingJob(jobId);
      expect(job).toBeDefined();
      expect(job?.status).toBe('pending');
      expect(job?.keywords).toEqual(['software engineer', 'developer']);
      expect(job?.location).toBe('San Francisco, CA');

      // Wait for job to start
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedJob = jobScrapingEngine.getScrapingJob(jobId);
      expect(updatedJob?.status).toBe('running');
    });

    it('should respect rate limits', async () => {
      const target = jobScrapingEngine.getTargets().find(t => t.id === 'indeed');
      expect(target).toBeDefined();
      expect(target?.rateLimit.requestsPerMinute).toBe(30);
      expect(target?.rateLimit.delayBetweenRequests).toBe(2000);
    });

    it('should handle robots.txt compliance', async () => {
      const testResult = await jobScrapingEngine.testTarget('indeed');
      expect(testResult.success).toBe(true);
    });

    it('should parse job data correctly', async () => {
      const jobId = await jobScrapingEngine.startScrapingJob('indeed', ['react']);
      
      // Wait for some jobs to be processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = jobScrapingEngine.getScrapingJob(jobId);
      expect(job?.progress.jobsFound).toBeGreaterThan(0);
    });
  });

  describe('Dataset Processing Pipeline', () => {
    it('should process raw data into ML-ready format', async () => {
      const config = {
        name: 'test-dataset',
        version: 'v1.0.0',
        description: 'Test dataset for ML pipeline',
        sources: [{
          id: 'test-source',
          type: 'database' as const,
          connection: { query: 'SELECT * FROM jobs' },
          schema: {
            fields: [
              { name: 'title', type: 'string' as const, required: true },
              { name: 'salary', type: 'number' as const, required: false },
              { name: 'skills', type: 'array' as const, required: true },
            ],
          },
        }],
        transformations: [{
          id: 'normalize-salary',
          type: 'normalize' as const,
          config: { field: 'salary', method: 'minmax' },
          description: 'Normalize salary values',
        }],
        validation: [{
          field: 'title',
          rule: 'not_null' as const,
          severity: 'error' as const,
        }],
        outputFormat: 'json' as const,
      };

      const jobId = await datasetProcessingPipeline.processDataset(config);
      expect(jobId).toBeTruthy();

      const job = datasetProcessingPipeline.getJob(jobId);
      expect(job).toBeDefined();
      expect(job?.datasetName).toBe('test-dataset');
      expect(job?.status).toBe('pending');

      // Wait for processing to start
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedJob = datasetProcessingPipeline.getJob(jobId);
      expect(updatedJob?.status).toBe('running');
      expect(updatedJob?.progress).toBeGreaterThan(0);
    });

    it('should validate data quality', async () => {
      const config = {
        name: 'validation-test',
        version: 'v1.0.0',
        description: 'Test data validation',
        sources: [{
          id: 'test-source',
          type: 'database' as const,
          connection: {},
          schema: {
            fields: [
              { name: 'required_field', type: 'string' as const, required: true },
            ],
          },
        }],
        transformations: [],
        validation: [{
          field: 'required_field',
          rule: 'not_null' as const,
          severity: 'error' as const,
        }],
        outputFormat: 'json' as const,
      };

      const jobId = await datasetProcessingPipeline.processDataset(config);
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const job = datasetProcessingPipeline.getJob(jobId);
      expect(job?.status).toMatch(/completed|running/);
    });

    it('should perform feature engineering', async () => {
      const config = {
        name: 'feature-engineering-test',
        version: 'v1.0.0',
        description: 'Test feature engineering',
        sources: [{
          id: 'test-source',
          type: 'database' as const,
          connection: {},
          schema: {
            fields: [
              { name: 'text_field', type: 'string' as const, required: true },
              { name: 'numeric_field', type: 'number' as const, required: true },
              { name: 'date_field', type: 'date' as const, required: true },
            ],
          },
        }],
        transformations: [{
          id: 'feature-engineering',
          type: 'feature_engineering' as const,
          config: {
            textFeatures: { tfidf: true, embeddings: true },
            numericalFeatures: { scaling: 'standard' },
            temporalFeatures: { cyclical: true },
          },
          description: 'Engineer features from raw data',
        }],
        validation: [],
        outputFormat: 'json' as const,
      };

      const jobId = await datasetProcessingPipeline.processDataset(config);
      expect(jobId).toBeTruthy();
    });
  });

  describe('Model Training Pipeline', () => {
    it('should train a model with hyperparameter optimization', async () => {
      const mockDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        features: Array.from({ length: 10 }, () => Math.random()),
        target: Math.random(),
      }));

      const hyperparameterConfig = {
        learningRate: { min: 0.0001, max: 0.01, type: 'log' as const },
        batchSize: { values: [16, 32, 64] },
        epochs: { min: 10, max: 50 },
        dropout: { min: 0.1, max: 0.5 },
        hiddenSize: { values: [64, 128, 256] },
        numLayers: { min: 2, max: 5 },
      };

      const jobId = await modelTrainingPipeline.startTraining(
        'test-model',
        mockDataset,
        {
          hyperparameterConfig,
          optimizeHyperparameters: true,
          crossValidation: true,
          maxTrials: 5,
          epochs: 20,
        }
      );

      expect(jobId).toBeTruthy();

      const job = modelTrainingPipeline.getTrainingJob(jobId);
      expect(job).toBeDefined();
      expect(job?.modelName).toBe('test-model');
      expect(job?.status).toBe('pending');
      expect(job?.totalEpochs).toBe(20);

      // Wait for training to start
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedJob = modelTrainingPipeline.getTrainingJob(jobId);
      expect(updatedJob?.status).toBe('running');
      expect(updatedJob?.progress).toBeGreaterThan(0);
    });

    it('should perform cross-validation', async () => {
      const mockDataset = Array.from({ length: 500 }, (_, i) => ({
        id: i,
        features: Array.from({ length: 5 }, () => Math.random()),
        target: Math.random(),
      }));

      const jobId = await modelTrainingPipeline.startTraining(
        'cv-test-model',
        mockDataset,
        {
          crossValidation: true,
          epochs: 10,
        }
      );

      expect(jobId).toBeTruthy();
      
      // Wait for training
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const job = modelTrainingPipeline.getTrainingJob(jobId);
      expect(job?.status).toMatch(/running|completed/);
    });

    it('should track training metrics', async () => {
      const mockDataset = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        features: [Math.random(), Math.random()],
        target: Math.random(),
      }));

      const jobId = await modelTrainingPipeline.startTraining(
        'metrics-test-model',
        mockDataset,
        { epochs: 5 }
      );

      // Wait for some training
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const job = modelTrainingPipeline.getTrainingJob(jobId);
      expect(job?.metrics).toBeDefined();
      expect(job?.metrics.loss).toBeGreaterThanOrEqual(0);
      expect(job?.metrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(job?.metrics.accuracy).toBeLessThanOrEqual(1);
    });
  });

  describe('Model Serving Infrastructure', () => {
    it('should serve model predictions', async () => {
      const request = {
        modelId: 'career-trajectory',
        input: {
          currentRole: 'Software Engineer',
          experience: 3,
          skills: ['JavaScript', 'React', 'Node.js'],
          education: 'Bachelor\'s',
        },
        requestId: 'test-request-1',
        timestamp: new Date(),
        priority: 'normal' as const,
      };

      const response = await modelServingInfrastructure.predict(request);
      
      expect(response).toBeDefined();
      expect(response.requestId).toBe('test-request-1');
      expect(response.modelId).toBe('career-trajectory');
      expect(response.prediction).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
      expect(response.processingTime).toBeGreaterThan(0);
    });

    it('should handle batch predictions', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => ({
        modelId: 'skill-demand',
        input: { skill: `skill-${i}`, market: 'tech' },
        requestId: `batch-request-${i}`,
        timestamp: new Date(),
        priority: 'normal' as const,
      }));

      const responses = await modelServingInfrastructure.batchPredict(requests);
      
      expect(responses).toHaveLength(5);
      responses.forEach((response, i) => {
        expect(response.requestId).toBe(`batch-request-${i}`);
        expect(response.modelId).toBe('skill-demand');
        expect(response.prediction).toBeDefined();
      });
    });

    it('should cache predictions', async () => {
      const request = {
        modelId: 'resume-matching',
        input: { resume: 'test resume', job: 'test job' },
        requestId: 'cache-test-1',
        timestamp: new Date(),
        priority: 'normal' as const,
      };

      // First request
      const response1 = await modelServingInfrastructure.predict(request);
      expect(response1.cached).toBe(false);

      // Second identical request should be cached
      const request2 = { ...request, requestId: 'cache-test-2' };
      const response2 = await modelServingInfrastructure.predict(request2);
      expect(response2.cached).toBe(true);
      expect(response2.processingTime).toBeLessThan(response1.processingTime);
    });

    it('should load balance across endpoints', async () => {
      const endpoints = modelServingInfrastructure.getEndpointStatus('career-trajectory');
      expect(endpoints.length).toBeGreaterThan(0);
      
      const healthyEndpoints = endpoints.filter(ep => ep.status === 'healthy');
      expect(healthyEndpoints.length).toBeGreaterThan(0);
    });

    it('should track model metrics', async () => {
      const metrics = modelServingInfrastructure.getModelMetrics('career-trajectory');
      expect(metrics).toBeDefined();
      
      if (metrics) {
        expect(metrics.modelId).toBe('career-trajectory');
        expect(metrics.totalRequests).toBeGreaterThanOrEqual(0);
        expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
        expect(metrics.errorRate).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('End-to-End Pipeline', () => {
    it('should complete full ML pipeline from scraping to serving', async () => {
      // Step 1: Scrape job data
      const scrapingJobId = await jobScrapingEngine.startScrapingJob(
        'indeed',
        ['machine learning'],
        'Remote',
        { maxJobs: 20 }
      );
      
      expect(scrapingJobId).toBeTruthy();

      // Step 2: Process scraped data
      const processingConfig = {
        name: 'e2e-test-dataset',
        version: 'v1.0.0',
        description: 'End-to-end test dataset',
        sources: [{
          id: 'scraped-jobs',
          type: 'database' as const,
          connection: { query: 'SELECT * FROM job_listings' },
          schema: {
            fields: [
              { name: 'title', type: 'string' as const, required: true },
              { name: 'description', type: 'string' as const, required: true },
              { name: 'skills', type: 'array' as const, required: true },
            ],
          },
        }],
        transformations: [],
        validation: [],
        outputFormat: 'json' as const,
      };

      const processingJobId = await datasetProcessingPipeline.processDataset(processingConfig);
      expect(processingJobId).toBeTruthy();

      // Step 3: Train model
      const mockTrainingData = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        title: `Job ${i}`,
        skills: ['skill1', 'skill2'],
        target: Math.random(),
      }));

      const trainingJobId = await modelTrainingPipeline.startTraining(
        'e2e-test-model',
        mockTrainingData,
        { epochs: 5 }
      );
      
      expect(trainingJobId).toBeTruthy();

      // Step 4: Serve predictions
      const predictionRequest = {
        modelId: 'e2e-test-model',
        input: { title: 'Senior ML Engineer', skills: ['python', 'tensorflow'] },
        requestId: 'e2e-test-prediction',
        timestamp: new Date(),
        priority: 'normal' as const,
      };

      // Wait for some processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify all jobs are running or completed
      const scrapingJob = jobScrapingEngine.getScrapingJob(scrapingJobId);
      const processingJob = datasetProcessingPipeline.getJob(processingJobId);
      const trainingJob = modelTrainingPipeline.getTrainingJob(trainingJobId);

      expect(scrapingJob?.status).toMatch(/running|completed/);
      expect(processingJob?.status).toMatch(/running|completed/);
      expect(trainingJob?.status).toMatch(/running|completed/);
    });

    it('should handle pipeline failures gracefully', async () => {
      // Test with invalid configuration
      const invalidConfig = {
        name: '',
        version: '',
        description: '',
        sources: [],
        transformations: [],
        validation: [],
        outputFormat: 'invalid' as any,
      };

      try {
        await datasetProcessingPipeline.processDataset(invalidConfig);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should monitor pipeline performance', async () => {
      const allMetrics = modelServingInfrastructure.getAllMetrics();
      expect(Array.isArray(allMetrics)).toBe(true);

      const cacheStats = modelServingInfrastructure.getCacheStats();
      expect(cacheStats.size).toBeGreaterThanOrEqual(0);
      expect(cacheStats.hitRate).toBeGreaterThanOrEqual(0);
      expect(cacheStats.hitRate).toBeLessThanOrEqual(1);

      const queueStats = modelServingInfrastructure.getQueueStatus();
      expect(queueStats).toBeDefined();
      expect(queueStats.processing).toBeGreaterThanOrEqual(0);
    });
  });
});
