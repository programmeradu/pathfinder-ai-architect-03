/**
 * Dataset Processing Pipeline
 * ETL pipeline for processing raw data into ML-ready datasets with feature engineering
 */

import { logger } from '@/lib/logger';
import { databaseManager } from '@/services/database/DatabaseManager';

export interface DatasetConfig {
  name: string;
  version: string;
  description: string;
  sources: DataSource[];
  transformations: TransformationStep[];
  validation: ValidationRule[];
  outputFormat: 'csv' | 'parquet' | 'json' | 'tfrecord';
  schedule?: string; // Cron expression
}

export interface DataSource {
  id: string;
  type: 'database' | 'api' | 'file' | 'stream';
  connection: {
    url?: string;
    credentials?: Record<string, string>;
    query?: string;
    filePath?: string;
  };
  schema: DataSchema;
}

export interface DataSchema {
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
    required: boolean;
    description?: string;
  }>;
}

export interface TransformationStep {
  id: string;
  type: 'filter' | 'map' | 'aggregate' | 'join' | 'feature_engineering' | 'normalize';
  config: Record<string, any>;
  description: string;
}

export interface ValidationRule {
  field: string;
  rule: 'not_null' | 'range' | 'pattern' | 'unique' | 'custom';
  params?: Record<string, any>;
  severity: 'error' | 'warning';
}

export interface ProcessingJob {
  id: string;
  datasetName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  progress: number;
  recordsProcessed: number;
  recordsTotal: number;
  errors: string[];
  metrics: {
    processingTime: number;
    memoryUsage: number;
    cpuUsage: number;
    throughput: number;
  };
}

export interface FeatureEngineering {
  textFeatures: {
    tfidf: boolean;
    embeddings: boolean;
    sentiment: boolean;
    entities: boolean;
  };
  numericalFeatures: {
    scaling: 'standard' | 'minmax' | 'robust' | 'none';
    binning: boolean;
    polynomial: boolean;
    interactions: boolean;
  };
  categoricalFeatures: {
    encoding: 'onehot' | 'label' | 'target' | 'embedding';
    handleMissing: 'drop' | 'mode' | 'unknown';
  };
  temporalFeatures: {
    cyclical: boolean;
    lags: number[];
    rolling: number[];
    trends: boolean;
  };
}

// Data Validator
class DataValidator {
  validateRecord(record: any, schema: DataSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const field of schema.fields) {
      const value = record[field.name];

      // Check required fields
      if (field.required && (value === null || value === undefined)) {
        errors.push(`Required field '${field.name}' is missing`);
        continue;
      }

      // Type validation
      if (value !== null && value !== undefined) {
        if (!this.validateType(value, field.type)) {
          errors.push(`Field '${field.name}' has invalid type. Expected ${field.type}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value));
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  validateDataset(records: any[], rules: ValidationRule[]): { valid: boolean; violations: Array<{ rule: ValidationRule; records: number[] }> } {
    const violations: Array<{ rule: ValidationRule; records: number[] }> = [];

    for (const rule of rules) {
      const violatingRecords: number[] = [];

      records.forEach((record, index) => {
        if (!this.validateRule(record, rule)) {
          violatingRecords.push(index);
        }
      });

      if (violatingRecords.length > 0) {
        violations.push({ rule, records: violatingRecords });
      }
    }

    return {
      valid: violations.filter(v => v.rule.severity === 'error').length === 0,
      violations,
    };
  }

  private validateRule(record: any, rule: ValidationRule): boolean {
    const value = record[rule.field];

    switch (rule.rule) {
      case 'not_null':
        return value !== null && value !== undefined;
      
      case 'range':
        if (typeof value !== 'number') return false;
        const min = rule.params?.min ?? -Infinity;
        const max = rule.params?.max ?? Infinity;
        return value >= min && value <= max;
      
      case 'pattern':
        if (typeof value !== 'string') return false;
        const pattern = new RegExp(rule.params?.pattern || '.*');
        return pattern.test(value);
      
      case 'unique':
        // This would require checking against all other records
        return true; // Simplified for this implementation
      
      default:
        return true;
    }
  }
}

// Feature Engineering Engine
class FeatureEngineer {
  async engineerFeatures(data: any[], config: FeatureEngineering): Promise<any[]> {
    logger.info('Starting feature engineering', {
      component: 'FeatureEngineer',
      action: 'engineer_features',
      metadata: { recordCount: data.length },
    });

    let processedData = [...data];

    // Text feature engineering
    if (config.textFeatures.tfidf || config.textFeatures.embeddings) {
      processedData = await this.processTextFeatures(processedData, config.textFeatures);
    }

    // Numerical feature engineering
    if (config.numericalFeatures.scaling !== 'none') {
      processedData = this.processNumericalFeatures(processedData, config.numericalFeatures);
    }

    // Categorical feature engineering
    processedData = this.processCategoricalFeatures(processedData, config.categoricalFeatures);

    // Temporal feature engineering
    if (config.temporalFeatures.cyclical || config.temporalFeatures.lags.length > 0) {
      processedData = this.processTemporalFeatures(processedData, config.temporalFeatures);
    }

    return processedData;
  }

  private async processTextFeatures(data: any[], config: any): Promise<any[]> {
    // Mock text feature processing
    return data.map(record => {
      const textFields = Object.keys(record).filter(key => 
        typeof record[key] === 'string' && record[key].length > 10
      );

      for (const field of textFields) {
        const text = record[field];
        
        if (config.tfidf) {
          // Mock TF-IDF features
          record[`${field}_tfidf_score`] = Math.random();
        }
        
        if (config.embeddings) {
          // Mock text embeddings
          record[`${field}_embedding`] = Array.from({ length: 128 }, () => Math.random() * 2 - 1);
        }
        
        if (config.sentiment) {
          // Mock sentiment analysis
          record[`${field}_sentiment`] = Math.random() * 2 - 1; // -1 to 1
        }
        
        if (config.entities) {
          // Mock named entity recognition
          record[`${field}_entity_count`] = Math.floor(Math.random() * 5);
        }
      }

      return record;
    });
  }

  private processNumericalFeatures(data: any[], config: any): any[] {
    const numericalFields = this.getNumericalFields(data);
    
    // Calculate statistics for scaling
    const stats = this.calculateStatistics(data, numericalFields);

    return data.map(record => {
      for (const field of numericalFields) {
        const value = record[field];
        if (typeof value === 'number') {
          
          // Scaling
          switch (config.scaling) {
            case 'standard':
              record[`${field}_scaled`] = (value - stats[field].mean) / stats[field].std;
              break;
            case 'minmax':
              record[`${field}_scaled`] = (value - stats[field].min) / (stats[field].max - stats[field].min);
              break;
            case 'robust':
              record[`${field}_scaled`] = (value - stats[field].median) / stats[field].iqr;
              break;
          }

          // Binning
          if (config.binning) {
            const bins = 5;
            const binSize = (stats[field].max - stats[field].min) / bins;
            record[`${field}_bin`] = Math.floor((value - stats[field].min) / binSize);
          }

          // Polynomial features
          if (config.polynomial) {
            record[`${field}_squared`] = value * value;
            record[`${field}_cubed`] = value * value * value;
          }
        }
      }

      // Feature interactions
      if (config.interactions && numericalFields.length > 1) {
        for (let i = 0; i < numericalFields.length; i++) {
          for (let j = i + 1; j < numericalFields.length; j++) {
            const field1 = numericalFields[i];
            const field2 = numericalFields[j];
            const val1 = record[field1];
            const val2 = record[field2];
            
            if (typeof val1 === 'number' && typeof val2 === 'number') {
              record[`${field1}_x_${field2}`] = val1 * val2;
            }
          }
        }
      }

      return record;
    });
  }

  private processCategoricalFeatures(data: any[], config: any): any[] {
    const categoricalFields = this.getCategoricalFields(data);
    
    // Get unique values for each categorical field
    const uniqueValues: Record<string, string[]> = {};
    for (const field of categoricalFields) {
      uniqueValues[field] = [...new Set(data.map(record => record[field]).filter(Boolean))];
    }

    return data.map(record => {
      for (const field of categoricalFields) {
        const value = record[field];
        
        if (value !== null && value !== undefined) {
          switch (config.encoding) {
            case 'onehot':
              // One-hot encoding
              for (const uniqueVal of uniqueValues[field]) {
                record[`${field}_${uniqueVal}`] = value === uniqueVal ? 1 : 0;
              }
              break;
              
            case 'label':
              // Label encoding
              record[`${field}_encoded`] = uniqueValues[field].indexOf(value);
              break;
              
            case 'target':
              // Mock target encoding (would require target variable)
              record[`${field}_target_encoded`] = Math.random();
              break;
          }
        } else {
          // Handle missing values
          switch (config.handleMissing) {
            case 'mode':
              record[field] = this.getMode(data, field);
              break;
            case 'unknown':
              record[field] = 'UNKNOWN';
              break;
            // 'drop' would be handled at the record level
          }
        }
      }

      return record;
    });
  }

  private processTemporalFeatures(data: any[], config: any): any[] {
    const dateFields = this.getDateFields(data);

    return data.map((record, index) => {
      for (const field of dateFields) {
        const date = new Date(record[field]);
        
        if (!isNaN(date.getTime())) {
          // Cyclical features
          if (config.cyclical) {
            record[`${field}_hour_sin`] = Math.sin(2 * Math.PI * date.getHours() / 24);
            record[`${field}_hour_cos`] = Math.cos(2 * Math.PI * date.getHours() / 24);
            record[`${field}_day_sin`] = Math.sin(2 * Math.PI * date.getDay() / 7);
            record[`${field}_day_cos`] = Math.cos(2 * Math.PI * date.getDay() / 7);
            record[`${field}_month_sin`] = Math.sin(2 * Math.PI * date.getMonth() / 12);
            record[`${field}_month_cos`] = Math.cos(2 * Math.PI * date.getMonth() / 12);
          }

          // Lag features
          for (const lag of config.lags) {
            if (index >= lag) {
              const lagValue = data[index - lag][field];
              record[`${field}_lag_${lag}`] = lagValue;
            }
          }

          // Rolling features
          for (const window of config.rolling) {
            if (index >= window - 1) {
              const windowData = data.slice(index - window + 1, index + 1);
              const values = windowData.map(r => r[field]).filter(v => v !== null);
              
              if (values.length > 0) {
                record[`${field}_rolling_mean_${window}`] = values.reduce((a, b) => a + b, 0) / values.length;
                record[`${field}_rolling_std_${window}`] = this.calculateStd(values);
              }
            }
          }
        }
      }

      return record;
    });
  }

  private getNumericalFields(data: any[]): string[] {
    if (data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).filter(key => typeof sample[key] === 'number');
  }

  private getCategoricalFields(data: any[]): string[] {
    if (data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).filter(key => 
      typeof sample[key] === 'string' && 
      new Set(data.map(r => r[key])).size < data.length * 0.5 // Less than 50% unique values
    );
  }

  private getDateFields(data: any[]): string[] {
    if (data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).filter(key => {
      const value = sample[key];
      return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
    });
  }

  private calculateStatistics(data: any[], fields: string[]): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const field of fields) {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      
      if (values.length > 0) {
        values.sort((a, b) => a - b);
        
        stats[field] = {
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          median: values[Math.floor(values.length / 2)],
          min: values[0],
          max: values[values.length - 1],
          std: this.calculateStd(values),
          iqr: values[Math.floor(values.length * 0.75)] - values[Math.floor(values.length * 0.25)],
        };
      }
    }
    
    return stats;
  }

  private calculateStd(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private getMode(data: any[], field: string): any {
    const counts: Record<string, number> = {};
    
    for (const record of data) {
      const value = record[field];
      if (value !== null && value !== undefined) {
        counts[value] = (counts[value] || 0) + 1;
      }
    }
    
    let maxCount = 0;
    let mode = null;
    
    for (const [value, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        mode = value;
      }
    }
    
    return mode;
  }
}

// Main Dataset Processing Pipeline
export class DatasetProcessingPipeline {
  private validator: DataValidator;
  private featureEngineer: FeatureEngineer;
  private activeJobs: Map<string, ProcessingJob> = new Map();

  constructor() {
    this.validator = new DataValidator();
    this.featureEngineer = new FeatureEngineer();
  }

  async processDataset(config: DatasetConfig): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const job: ProcessingJob = {
      id: jobId,
      datasetName: config.name,
      status: 'pending',
      progress: 0,
      recordsProcessed: 0,
      recordsTotal: 0,
      errors: [],
      metrics: {
        processingTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        throughput: 0,
      },
    };

    this.activeJobs.set(jobId, job);

    // Start processing asynchronously
    this.runProcessingJob(job, config).catch(error => {
      job.status = 'failed';
      job.errors.push(error.message);
      job.endTime = new Date();
    });

    return jobId;
  }

  private async runProcessingJob(job: ProcessingJob, config: DatasetConfig): Promise<void> {
    try {
      job.status = 'running';
      job.startTime = new Date();

      logger.info('Starting dataset processing job', {
        component: 'DatasetProcessingPipeline',
        action: 'start_job',
        metadata: { jobId: job.id, datasetName: config.name },
      });

      // Step 1: Extract data from sources
      job.progress = 10;
      const rawData = await this.extractData(config.sources);
      job.recordsTotal = rawData.length;

      // Step 2: Validate data
      job.progress = 20;
      const validationResult = this.validateData(rawData, config);
      if (!validationResult.valid) {
        throw new Error(`Data validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Step 3: Apply transformations
      job.progress = 40;
      let transformedData = await this.applyTransformations(rawData, config.transformations, job);

      // Step 4: Feature engineering
      job.progress = 70;
      const featureConfig: FeatureEngineering = {
        textFeatures: { tfidf: true, embeddings: true, sentiment: true, entities: true },
        numericalFeatures: { scaling: 'standard', binning: true, polynomial: false, interactions: true },
        categoricalFeatures: { encoding: 'onehot', handleMissing: 'mode' },
        temporalFeatures: { cyclical: true, lags: [1, 7, 30], rolling: [7, 30], trends: true },
      };
      
      transformedData = await this.featureEngineer.engineerFeatures(transformedData, featureConfig);

      // Step 5: Final validation
      job.progress = 90;
      const finalValidation = this.validator.validateDataset(transformedData, config.validation);
      if (!finalValidation.valid) {
        job.errors.push(`Final validation warnings: ${finalValidation.violations.length} violations`);
      }

      // Step 6: Save processed dataset
      job.progress = 95;
      await this.saveDataset(transformedData, config);

      // Complete job
      job.status = 'completed';
      job.progress = 100;
      job.endTime = new Date();
      job.recordsProcessed = transformedData.length;

      if (job.startTime) {
        job.metrics.processingTime = job.endTime.getTime() - job.startTime.getTime();
        job.metrics.throughput = job.recordsProcessed / (job.metrics.processingTime / 1000);
      }

      logger.info('Dataset processing job completed', {
        component: 'DatasetProcessingPipeline',
        action: 'job_completed',
        metadata: { 
          jobId: job.id,
          recordsProcessed: job.recordsProcessed,
          processingTime: job.metrics.processingTime,
        },
      });

    } catch (error) {
      job.status = 'failed';
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      job.endTime = new Date();

      logger.error('Dataset processing job failed', {
        component: 'DatasetProcessingPipeline',
        action: 'job_failed',
        metadata: { jobId: job.id, error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  private async extractData(sources: DataSource[]): Promise<any[]> {
    const allData: any[] = [];

    for (const source of sources) {
      let sourceData: any[] = [];

      switch (source.type) {
        case 'database':
          sourceData = await this.extractFromDatabase(source);
          break;
        case 'api':
          sourceData = await this.extractFromAPI(source);
          break;
        case 'file':
          sourceData = await this.extractFromFile(source);
          break;
        case 'stream':
          sourceData = await this.extractFromStream(source);
          break;
      }

      allData.push(...sourceData);
    }

    return allData;
  }

  private async extractFromDatabase(source: DataSource): Promise<any[]> {
    // Mock database extraction
    return [
      { id: 1, name: 'John Doe', age: 30, salary: 75000, department: 'Engineering' },
      { id: 2, name: 'Jane Smith', age: 28, salary: 82000, department: 'Marketing' },
      { id: 3, name: 'Bob Johnson', age: 35, salary: 95000, department: 'Engineering' },
    ];
  }

  private async extractFromAPI(source: DataSource): Promise<any[]> {
    // Mock API extraction
    return [
      { skill: 'JavaScript', demand: 85, growth: 12 },
      { skill: 'Python', demand: 92, growth: 18 },
      { skill: 'React', demand: 78, growth: 15 },
    ];
  }

  private async extractFromFile(source: DataSource): Promise<any[]> {
    // Mock file extraction
    return [
      { company: 'TechCorp', industry: 'Technology', employees: 5000 },
      { company: 'DataInc', industry: 'Analytics', employees: 1200 },
    ];
  }

  private async extractFromStream(source: DataSource): Promise<any[]> {
    // Mock stream extraction
    return [
      { timestamp: new Date(), event: 'user_login', userId: 'user123' },
      { timestamp: new Date(), event: 'page_view', userId: 'user456' },
    ];
  }

  private validateData(data: any[], config: DatasetConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (data.length === 0) {
      errors.push('Dataset is empty');
    }

    // Schema validation for each source
    for (const source of config.sources) {
      const sourceRecords = data; // Simplified - would filter by source
      
      for (const record of sourceRecords.slice(0, 100)) { // Sample validation
        const validation = this.validator.validateRecord(record, source.schema);
        if (!validation.valid) {
          errors.push(...validation.errors);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.slice(0, 10), // Limit error messages
    };
  }

  private async applyTransformations(data: any[], transformations: TransformationStep[], job: ProcessingJob): Promise<any[]> {
    let result = [...data];

    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i];
      
      try {
        result = await this.applyTransformation(result, transformation);
        job.progress = 40 + (i / transformations.length) * 30; // 40-70% progress
      } catch (error) {
        job.errors.push(`Transformation ${transformation.id} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  }

  private async applyTransformation(data: any[], transformation: TransformationStep): Promise<any[]> {
    switch (transformation.type) {
      case 'filter':
        return data.filter(record => this.evaluateFilter(record, transformation.config));
      
      case 'map':
        return data.map(record => this.applyMapping(record, transformation.config));
      
      case 'aggregate':
        return this.applyAggregation(data, transformation.config);
      
      case 'normalize':
        return this.applyNormalization(data, transformation.config);
      
      default:
        return data;
    }
  }

  private evaluateFilter(record: any, config: any): boolean {
    // Mock filter evaluation
    return true;
  }

  private applyMapping(record: any, config: any): any {
    // Mock mapping application
    return record;
  }

  private applyAggregation(data: any[], config: any): any[] {
    // Mock aggregation
    return data;
  }

  private applyNormalization(data: any[], config: any): any[] {
    // Mock normalization
    return data;
  }

  private async saveDataset(data: any[], config: DatasetConfig): Promise<void> {
    try {
      // Save to database
      await databaseManager.storeUserProfile({
        type: 'processed_dataset',
        dataset_name: config.name,
        version: config.version,
        record_count: data.length,
        data: JSON.stringify(data.slice(0, 1000)), // Store sample
        created_at: new Date(),
      });

      logger.info('Dataset saved successfully', {
        component: 'DatasetProcessingPipeline',
        action: 'save_dataset',
        metadata: { name: config.name, recordCount: data.length },
      });
    } catch (error) {
      logger.error('Failed to save dataset', {
        component: 'DatasetProcessingPipeline',
        action: 'save_dataset_error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw error;
    }
  }

  // Public API methods
  getJob(jobId: string): ProcessingJob | undefined {
    return this.activeJobs.get(jobId);
  }

  getAllJobs(): ProcessingJob[] {
    return Array.from(this.activeJobs.values());
  }

  getActiveJobs(): ProcessingJob[] {
    return Array.from(this.activeJobs.values()).filter(job => 
      job.status === 'running' || job.status === 'pending'
    );
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && (job.status === 'running' || job.status === 'pending')) {
      job.status = 'failed';
      job.errors.push('Job cancelled by user');
      job.endTime = new Date();
    }
  }
}

// Singleton instance
export const datasetProcessingPipeline = new DatasetProcessingPipeline();

export default datasetProcessingPipeline;
