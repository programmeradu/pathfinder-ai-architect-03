import { GoogleGenerativeAI } from '@google/generative-ai';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs-node';

const genAI = new GoogleGenerativeAI('AIzaSyCrpYzIeAj5jmekAsn5qgpcOWrBDY77vHw');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface MultiModalData {
  text?: string;
  images?: string[];
  audio?: string;
  video?: string;
  documents?: string[];
  metadata?: any;
}

interface ScrapingResult {
  url: string;
  title: string;
  content: string;
  metadata: any;
  images: string[];
  links: string[];
  structured_data: any;
  sentiment: number;
  entities: any[];
  topics: string[];
  lastUpdated: Date;
}

interface IntelligenceReport {
  query: string;
  sources: ScrapingResult[];
  synthesis: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
  market_analysis?: any;
  competitive_landscape?: any;
  trend_analysis?: any;
}

class KillerAPI {
  private browser: any;
  private nlp: any;
  private model: any;

  constructor() {
    this.initializeNLP();
    this.initializeBrowser();
  }

  private async initializeNLP() {
    // Initialize natural language processing
    this.nlp = {
      tokenizer: new natural.WordTokenizer(),
      stemmer: natural.PorterStemmer,
      sentiment: new natural.SentimentAnalyzer('English', 
        natural.PorterStemmer, 'afinn'),
      classifier: new natural.BayesClassifier()
    };
  }

  private async initializeBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-web-security'
        ]
      });
    } catch (error) {
      console.warn('Browser initialization failed, using fallback scraping methods:', error);
      this.browser = null;
    }
  }

  // Advanced Multi-Modal Intelligence Scraper
  async intelligentScrape(query: string, domains: string[] = [], depth: number = 2): Promise<IntelligenceReport> {
    const searchResults = await this.performIntelligentSearch(query, domains);
    const scrapedData = await this.deepScrapeResults(searchResults, depth);
    const analyzedData = await this.performDeepAnalysis(scrapedData);
    
    return await this.synthesizeIntelligence(query, analyzedData);
  }

  private async performIntelligentSearch(query: string, domains: string[]): Promise<string[]> {
    const searchPrompt = `
    Generate 15 highly specific search queries for comprehensive intelligence gathering about: "${query}"
    
    Include:
    1. Market analysis queries
    2. Competitive landscape queries  
    3. Technical depth queries
    4. Trend analysis queries
    5. Expert opinion queries
    6. Statistical data queries
    7. Case study queries
    8. Future prediction queries
    
    Focus on actionable business intelligence and deep technical insights.
    Return as JSON array of search queries.
    `;

    try {
      const result = await model.generateContent(searchPrompt);
      const response = await result.response;
      const queries = JSON.parse(response.text());
      
      // Convert search queries to actual URLs using multiple search engines
      const urls = [];
      for (const searchQuery of queries.queries || []) {
        urls.push(
          `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
          `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
          `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`
        );
      }
      
      return urls.slice(0, 20); // Limit to 20 URLs for practical scraping
    } catch (error) {
      console.error('Search query generation error:', error);
      return [
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        `https://www.bing.com/search?q=${encodeURIComponent(query + ' market analysis')}`,
        `https://duckduckgo.com/?q=${encodeURIComponent(query + ' trends 2024')}`
      ];
    }
  }

  private async deepScrapeResults(urls: string[], depth: number): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // If browser is not available, use fallback HTTP scraping
    if (!this.browser) {
      return this.fallbackHttpScraping(urls, depth);
    }
    
    const page = await this.browser.newPage();
    
    // Configure page for optimal scraping
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract comprehensive data
        const scrapedData = await page.evaluate(() => {
          const getText = (selector: string) => {
            const element = document.querySelector(selector);
            return element ? element.textContent?.trim() : '';
          };
          
          const getAllText = (selector: string) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).map(el => el.textContent?.trim()).filter(Boolean);
          };
          
          const getAttributes = (selector: string, attr: string) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).map(el => el.getAttribute(attr)).filter(Boolean);
          };
          
          return {
            title: getText('title') || getText('h1'),
            content: getText('body'),
            headings: getAllText('h1, h2, h3'),
            paragraphs: getAllText('p'),
            images: getAttributes('img', 'src'),
            links: getAttributes('a', 'href'),
            metadata: {
              description: getText('meta[name="description"]'),
              keywords: getText('meta[name="keywords"]'),
              author: getText('meta[name="author"]'),
              publishedTime: getText('meta[property="article:published_time"]')
            }
          };
        });
        
        // Process and analyze the scraped data
        const processed = await this.processScrapedData(url, scrapedData);
        results.push(processed);
        
        // Scrape linked pages for depth
        if (depth > 1) {
          const linkedPages = scrapedData.links
            .filter(link => link && link.startsWith('http'))
            .slice(0, 3); // Limit linked pages
          
          for (const linkedUrl of linkedPages) {
            const linkedResult = await this.deepScrapeResults([linkedUrl], depth - 1);
            results.push(...linkedResult);
          }
        }
        
        // Respectful rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Scraping error for ${url}:`, error);
        continue;
      }
    }
    
    await page.close();
    return results;
  }

  private async processScrapedData(url: string, data: any): Promise<ScrapingResult> {
    // Sentiment analysis
    const tokens = this.nlp.tokenizer.tokenize(data.content);
    const sentiment = this.nlp.sentiment.getSentiment(tokens);
    
    // Entity extraction using NLP
    const entities = await this.extractEntities(data.content);
    
    // Topic modeling
    const topics = await this.extractTopics(data.content);
    
    // Structured data extraction
    const structuredData = await this.extractStructuredData(data.content);
    
    return {
      url,
      title: data.title,
      content: data.content,
      metadata: data.metadata,
      images: data.images,
      links: data.links,
      structured_data: structuredData,
      sentiment,
      entities,
      topics,
      lastUpdated: new Date()
    };
  }

  private async extractEntities(text: string): Promise<any[]> {
    const entityPrompt = `
    Extract and categorize all entities from this text:
    
    "${text.substring(0, 2000)}"
    
    Categories:
    - PERSON: Names of people
    - ORGANIZATION: Companies, institutions
    - LOCATION: Cities, countries, addresses
    - TECHNOLOGY: Software, frameworks, tools
    - SKILL: Technical skills, competencies
    - SALARY: Compensation information
    - DATE: Time references
    - METRIC: Numbers, statistics, KPIs
    
    Format as JSON array with entity, category, and confidence.
    `;

    try {
      const result = await model.generateContent(entityPrompt);
      const response = await result.response;
      return JSON.parse(response.text()).entities || [];
    } catch (error) {
      console.error('Entity extraction error:', error);
      return [];
    }
  }

  private async extractTopics(text: string): Promise<string[]> {
    const topicPrompt = `
    Identify the main topics and themes in this text:
    
    "${text.substring(0, 2000)}"
    
    Extract:
    - Primary topics (3-5 main themes)
    - Secondary topics (5-10 supporting themes)
    - Emerging trends mentioned
    - Key concepts and terminologies
    
    Return as JSON array of topic strings.
    `;

    try {
      const result = await model.generateContent(topicPrompt);
      const response = await result.response;
      return JSON.parse(response.text()).topics || [];
    } catch (error) {
      console.error('Topic extraction error:', error);
      return [];
    }
  }

  private async extractStructuredData(text: string): Promise<any> {
    const structuredPrompt = `
    Extract structured data from this text:
    
    "${text.substring(0, 2000)}"
    
    Look for:
    - Job postings (title, company, salary, requirements)
    - Company information (size, industry, location)
    - Educational programs (name, duration, cost, outcomes)
    - Market data (growth rates, market size, trends)
    - Statistical information (percentages, numbers, comparisons)
    - Skill requirements and certifications
    - Salary ranges and compensation data
    
    Format as JSON with clearly labeled sections.
    `;

    try {
      const result = await model.generateContent(structuredPrompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Structured data extraction error:', error);
      return {};
    }
  }

  private async performDeepAnalysis(results: ScrapingResult[]): Promise<any> {
    const analysisPrompt = `
    Perform deep analysis on this scraped intelligence data:
    
    Data Summary:
    - Total sources: ${results.length}
    - Content volume: ${results.reduce((sum, r) => sum + r.content.length, 0)} characters
    - Average sentiment: ${results.reduce((sum, r) => sum + r.sentiment, 0) / results.length}
    
    Source Data:
    ${results.map(r => `
    URL: ${r.url}
    Title: ${r.title}
    Topics: ${r.topics.join(', ')}
    Key Entities: ${r.entities.map(e => e.entity).join(', ')}
    Sentiment: ${r.sentiment}
    `).join('\n')}
    
    Provide:
    1. Market Analysis: Size, growth, key players, opportunities
    2. Competitive Landscape: Major competitors, market share, positioning
    3. Trend Analysis: Emerging trends, future predictions, disruptions
    4. Skill Gap Analysis: In-demand skills, skill shortages, training opportunities
    5. Salary Intelligence: Compensation ranges, growth projections, geographic variations
    6. Risk Assessment: Market risks, technology risks, regulatory risks
    7. Strategic Recommendations: Actionable insights and next steps
    
    Format as comprehensive JSON report.
    `;

    try {
      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Deep analysis error:', error);
      return {
        market_analysis: { size: 'Unknown', growth: 'Unknown', players: [] },
        competitive_landscape: { competitors: [], market_share: {} },
        trend_analysis: { trends: [], predictions: [] },
        recommendations: ['Continue monitoring market conditions']
      };
    }
  }

  private async synthesizeIntelligence(query: string, analysis: any): Promise<IntelligenceReport> {
    const synthesisPrompt = `
    Create a comprehensive intelligence report for: "${query}"
    
    Based on the analysis data:
    ${JSON.stringify(analysis, null, 2)}
    
    Generate:
    1. Executive Summary (2-3 paragraphs)
    2. Key Insights (5-8 bullet points)
    3. Strategic Recommendations (3-5 actionable items)
    4. Confidence Assessment (0-100%)
    5. Next Steps and Monitoring Plan
    
    Make it actionable and strategic, not just informational.
    Format as JSON with clear sections.
    `;

    try {
      const result = await model.generateContent(synthesisPrompt);
      const response = await result.response;
      const synthesis = JSON.parse(response.text());
      
      return {
        query,
        sources: [], // References to scraped sources
        synthesis: synthesis.executive_summary || '',
        insights: synthesis.key_insights || [],
        recommendations: synthesis.strategic_recommendations || [],
        confidence: synthesis.confidence || 75,
        market_analysis: analysis.market_analysis,
        competitive_landscape: analysis.competitive_landscape,
        trend_analysis: analysis.trend_analysis
      };
    } catch (error) {
      console.error('Intelligence synthesis error:', error);
      return {
        query,
        sources: [],
        synthesis: 'Intelligence synthesis failed. Manual review required.',
        insights: ['Data collection completed', 'Analysis pending'],
        recommendations: ['Review scraped data manually', 'Retry analysis'],
        confidence: 30
      };
    }
  }

  // Multi-Modal Content Analysis
  async analyzeMultiModalContent(data: MultiModalData): Promise<any> {
    const analysisPrompt = `
    Analyze this multi-modal content for comprehensive insights:
    
    Text Content: ${data.text || 'None'}
    Images: ${data.images?.length || 0} images provided
    Audio: ${data.audio ? 'Audio file provided' : 'No audio'}
    Video: ${data.video ? 'Video file provided' : 'No video'}
    Documents: ${data.documents?.length || 0} documents provided
    
    Provide:
    1. Content Analysis: Main themes, topics, sentiment
    2. Visual Analysis: Image content, charts, diagrams (if images provided)
    3. Audio Analysis: Speech-to-text, sentiment, topics (if audio provided)
    4. Cross-Modal Insights: Connections between different content types
    5. Actionable Intelligence: What actions should be taken based on this content
    
    Format as comprehensive JSON analysis.
    `;

    try {
      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Multi-modal analysis error:', error);
      return {
        content_analysis: 'Analysis failed',
        insights: ['Multi-modal analysis encountered an error'],
        recommendations: ['Retry with different content format']
      };
    }
  }

  // Real-time Market Intelligence
  async getMarketIntelligence(industry: string, region: string = 'global'): Promise<any> {
    const marketQueries = [
      `${industry} market size ${region} 2024`,
      `${industry} growth trends ${region}`,
      `${industry} key players competitors ${region}`,
      `${industry} jobs salary trends ${region}`,
      `${industry} emerging technologies ${region}`,
      `${industry} investment funding ${region}`,
      `${industry} regulatory changes ${region}`,
      `${industry} skill requirements ${region}`
    ];

    const results = await this.deepScrapeResults(
      marketQueries.map(q => `https://www.google.com/search?q=${encodeURIComponent(q)}`),
      1
    );

    const analysis = await this.performDeepAnalysis(results);
    
    return {
      industry,
      region,
      market_size: analysis.market_analysis?.size || 'Unknown',
      growth_rate: analysis.market_analysis?.growth || 'Unknown',
      key_players: analysis.competitive_landscape?.competitors || [],
      salary_trends: analysis.market_analysis?.salary_trends || {},
      emerging_tech: analysis.trend_analysis?.trends || [],
      investment_activity: analysis.market_analysis?.investment || {},
      regulatory_landscape: analysis.market_analysis?.regulatory || {},
      skill_demand: analysis.market_analysis?.skills || [],
      last_updated: new Date()
    };
  }

  // Advanced Company Intelligence
  async getCompanyIntelligence(companyName: string): Promise<any> {
    const companyQueries = [
      `${companyName} company overview financials`,
      `${companyName} jobs careers hiring`,
      `${companyName} technology stack engineering`,
      `${companyName} culture employee reviews`,
      `${companyName} leadership team executives`,
      `${companyName} funding investment news`,
      `${companyName} competitors market position`,
      `${companyName} products services offerings`
    ];

    const results = await this.deepScrapeResults(
      companyQueries.map(q => `https://www.google.com/search?q=${encodeURIComponent(q)}`),
      2
    );

    const analysis = await this.performDeepAnalysis(results);
    
    return {
      company_name: companyName,
      overview: analysis.company_analysis?.overview || 'Unknown',
      size: analysis.company_analysis?.employee_count || 'Unknown',
      industry: analysis.company_analysis?.industry || 'Unknown',
      headquarters: analysis.company_analysis?.headquarters || 'Unknown',
      founding_year: analysis.company_analysis?.founded || 'Unknown',
      leadership: analysis.company_analysis?.leadership || [],
      technology_stack: analysis.company_analysis?.technology || [],
      culture_insights: analysis.company_analysis?.culture || {},
      hiring_trends: analysis.company_analysis?.hiring || {},
      financial_health: analysis.company_analysis?.financials || {},
      competitors: analysis.competitive_landscape?.competitors || [],
      market_position: analysis.competitive_landscape?.position || 'Unknown',
      last_updated: new Date()
    };
  }

  // Fallback HTTP scraping method for when Puppeteer is not available
  private async fallbackHttpScraping(urls: string[], depth: number): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 30000
        });
        
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        
        const scrapedData = {
          title: document.querySelector('title')?.textContent || document.querySelector('h1')?.textContent || '',
          content: document.body?.textContent || '',
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent || ''),
          paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.textContent || ''),
          images: Array.from(document.querySelectorAll('img')).map(img => img.src).filter(Boolean),
          links: Array.from(document.querySelectorAll('a')).map(a => a.href).filter(Boolean),
          metadata: {
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
            author: document.querySelector('meta[name="author"]')?.getAttribute('content') || '',
            publishedTime: document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || ''
          }
        };
        
        const processed = await this.processScrapedData(url, scrapedData);
        results.push(processed);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Fallback scraping error for ${url}:`, error);
        // Create a basic result even on error
        results.push({
          url,
          title: 'Scraping failed',
          content: 'Unable to scrape content',
          metadata: {},
          images: [],
          links: [],
          structured_data: {},
          sentiment: 0,
          entities: [],
          topics: [],
          lastUpdated: new Date()
        });
      }
    }
    
    return results;
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export const killerAPI = new KillerAPI();