interface JobData {
  job_id: string;
  employer_name: string;
  job_title: string;
  job_employment_type: string;
  job_salary?: string;
  job_city?: string;
  job_state?: string;
  job_country: string;
  job_is_remote: boolean;
  job_description: string;
  job_required_skills?: string[];
}

interface ProcessedJobData {
  totalJobs: number;
  averageSalary: number;
  topCompanies: string[];
  requiredSkills: string[];
  locations: string[];
  remotePercentage: number;
}

class MarketData {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = '00059d85f2msh95f9ef65a2f1ef9p1b96c9jsnc0493b152457';
    this.baseUrl = 'https://jsearch.p.rapidapi.com';
  }

  async getJobMarketData(query: string): Promise<ProcessedJobData> {
    try {
      const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us&date_posted=all`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.processJobData(data);
    } catch (error) {
      console.error('Job market data error:', error);
      throw new Error('API request failed');
    }
  }

  async getTrendingSkills(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?query=trending%20skills&page=1&num_pages=1&country=us&date_posted=all`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.extractRequiredSkills(data.data || []);
    } catch (error) {
      console.warn('GitHub trends error:', error);
      return ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'];
    }
  }

  // Private helper methods
  private processJobData(rawData: any): ProcessedJobData {
    return {
      totalJobs: rawData.data?.length || 0,
      averageSalary: this.calculateAverageSalary(rawData.data),
      topCompanies: this.extractTopCompanies(rawData.data),
      requiredSkills: this.extractRequiredSkills(rawData.data),
      locations: this.extractTopLocations(rawData.data),
      remotePercentage: this.calculateRemotePercentage(rawData.data)
    };
  }

  private calculateAverageSalary(jobs: JobData[] = []): number {
    if (!jobs || jobs.length === 0) return 75000;
    
    const salaries = jobs
      .filter(job => job.job_salary)
      .map(job => {
        const salary = job.job_salary || '';
        const match = salary.match(/\$?(\d+,?\d*)/);
        return match ? parseInt(match[1].replace(',', '')) : 0;
      })
      .filter(salary => salary > 0);

    return salaries.length > 0 
      ? Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length)
      : 75000;
  }

  private extractTopCompanies(jobs: JobData[] = []): string[] {
    if (!jobs || jobs.length === 0) return ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'];
    
    const companies = jobs
      .map(job => job.employer_name)
      .filter(Boolean)
      .slice(0, 5);

    return companies.length > 0 ? companies : ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'];
  }

  private extractRequiredSkills(jobs: JobData[] = []): string[] {
    if (!jobs || jobs.length === 0) return ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'];
    
    const skills = new Set<string>();
    jobs.forEach(job => {
      if (job.job_required_skills) {
        job.job_required_skills.forEach(skill => skills.add(skill));
      }
      
      // Extract skills from job description
      const description = job.job_description || '';
      const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS', 'Docker'];
      commonSkills.forEach(skill => {
        if (description.toLowerCase().includes(skill.toLowerCase())) {
          skills.add(skill);
        }
      });
    });

    return Array.from(skills).slice(0, 10);
  }

  private extractTopLocations(jobs: JobData[] = []): string[] {
    if (!jobs || jobs.length === 0) return ['San Francisco', 'New York', 'Seattle', 'Austin', 'Chicago'];
    
    const locations = jobs
      .map(job => job.job_city || job.job_state)
      .filter(Boolean)
      .slice(0, 5);

    return locations.length > 0 ? locations : ['San Francisco', 'New York', 'Seattle', 'Austin', 'Chicago'];
  }

  private calculateRemotePercentage(jobs: JobData[] = []): number {
    if (!jobs || jobs.length === 0) return 45;
    
    const remoteJobs = jobs.filter(job => job.job_is_remote).length;
    return Math.round((remoteJobs / jobs.length) * 100);
  }
}

// Export singleton instance
export const marketDataEngine = new MarketData();