import { 
  users, type User, type InsertUser,
  pageViews, type PageView, type InsertPageView,
  visitors, type Visitor, type InsertVisitor,
  analyticsSummary, type AnalyticsSummary, type InsertAnalyticsSummary
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analytics methods
  recordPageView(pageView: InsertPageView): Promise<PageView>;
  getPageViews(startDate: Date, endDate: Date): Promise<PageView[]>;
  
  getUniqueVisitors(startDate: Date, endDate: Date): Promise<number>;
  getTotalPageViews(startDate: Date, endDate: Date): Promise<number>;
  getAvgSessionDuration(startDate: Date, endDate: Date): Promise<number>;
  getBounceRate(startDate: Date, endDate: Date): Promise<number>;
  
  getVisitorsByCountry(startDate: Date, endDate: Date): Promise<{ country: string, count: number }[]>;
  getTrafficSources(startDate: Date, endDate: Date): Promise<{ source: string, count: number }[]>;
  getPopularPages(startDate: Date, endDate: Date, limit?: number): Promise<{ pageUrl: string, pageTitle: string, views: number, avgTime: number, bounceRate: number }[]>;
  getDeviceBreakdown(startDate: Date, endDate: Date): Promise<{ device: string, count: number }[]>;
  
  // Summary
  getAnalyticsSummary(date: Date): Promise<AnalyticsSummary | undefined>;
  saveAnalyticsSummary(summary: InsertAnalyticsSummary): Promise<AnalyticsSummary>;
  
  // Visitor tracking
  getVisitor(id: string): Promise<Visitor | undefined>;
  saveVisitor(visitor: InsertVisitor): Promise<Visitor>;
  updateVisitor(id: string, lastSeen: Date): Promise<Visitor | undefined>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pageViewsData: PageView[];
  private visitorsData: Map<string, Visitor>;
  private analyticsSummaryData: AnalyticsSummary[];
  
  private currentUserId: number;
  private currentPageViewId: number;
  private currentSummaryId: number;

  constructor() {
    this.users = new Map();
    this.pageViewsData = [];
    this.visitorsData = new Map();
    this.analyticsSummaryData = [];
    
    this.currentUserId = 1;
    this.currentPageViewId = 1;
    this.currentSummaryId = 1;
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Analytics methods
  async recordPageView(insertPageView: InsertPageView): Promise<PageView> {
    const id = this.currentPageViewId++;
    const pageView: PageView = { ...insertPageView, id };
    this.pageViewsData.push(pageView);
    return pageView;
  }
  
  async getPageViews(startDate: Date, endDate: Date): Promise<PageView[]> {
    return this.pageViewsData.filter(pv => {
      const viewDate = new Date(pv.timestamp);
      return viewDate >= startDate && viewDate <= endDate;
    });
  }
  
  async getUniqueVisitors(startDate: Date, endDate: Date): Promise<number> {
    const views = await this.getPageViews(startDate, endDate);
    const uniqueVisitorIds = new Set(views.map(v => v.visitorId));
    return uniqueVisitorIds.size;
  }
  
  async getTotalPageViews(startDate: Date, endDate: Date): Promise<number> {
    const views = await this.getPageViews(startDate, endDate);
    return views.length;
  }
  
  async getAvgSessionDuration(startDate: Date, endDate: Date): Promise<number> {
    const views = await this.getPageViews(startDate, endDate);
    const durations = views.filter(v => v.duration !== null && v.duration !== undefined);
    
    if (durations.length === 0) return 0;
    
    return durations.reduce((sum, view) => sum + (view.duration || 0), 0) / durations.length;
  }
  
  async getBounceRate(startDate: Date, endDate: Date): Promise<number> {
    const views = await this.getPageViews(startDate, endDate);
    
    if (views.length === 0) return 0;
    
    const sessionMap = new Map<string, PageView[]>();
    
    // Group page views by session
    views.forEach(view => {
      if (!view.sessionId) return;
      
      if (!sessionMap.has(view.sessionId)) {
        sessionMap.set(view.sessionId, []);
      }
      
      sessionMap.get(view.sessionId)?.push(view);
    });
    
    // Count bounced sessions (sessions with only one page view)
    let bouncedSessions = 0;
    
    for (const [_, sessionViews] of sessionMap) {
      if (sessionViews.length === 1) {
        bouncedSessions++;
      }
    }
    
    return (bouncedSessions / sessionMap.size) * 100;
  }
  
  async getVisitorsByCountry(startDate: Date, endDate: Date): Promise<{ country: string, count: number }[]> {
    const views = await this.getPageViews(startDate, endDate);
    
    const countryCounts = new Map<string, number>();
    const uniqueVisitorCountry = new Map<string, string>();
    
    views.forEach(view => {
      if (!view.country || uniqueVisitorCountry.has(view.visitorId)) return;
      
      uniqueVisitorCountry.set(view.visitorId, view.country);
      
      const count = countryCounts.get(view.country) || 0;
      countryCounts.set(view.country, count + 1);
    });
    
    return Array.from(countryCounts.entries()).map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  async getTrafficSources(startDate: Date, endDate: Date): Promise<{ source: string, count: number }[]> {
    const views = await this.getPageViews(startDate, endDate);
    
    const sourceCounts = new Map<string, number>();
    
    views.forEach(view => {
      const source = view.referrer || 'Direct';
      const count = sourceCounts.get(source) || 0;
      sourceCounts.set(source, count + 1);
    });
    
    return Array.from(sourceCounts.entries()).map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  async getPopularPages(
    startDate: Date, 
    endDate: Date, 
    limit: number = 5
  ): Promise<{ pageUrl: string, pageTitle: string, views: number, avgTime: number, bounceRate: number }[]> {
    const views = await this.getPageViews(startDate, endDate);
    
    // Group by page URL
    const pageGroups = new Map<string, { url: string, title: string, views: PageView[] }>();
    
    views.forEach(view => {
      if (!pageGroups.has(view.pageUrl)) {
        pageGroups.set(view.pageUrl, { 
          url: view.pageUrl, 
          title: view.pageTitle || view.pageUrl,
          views: []
        });
      }
      
      pageGroups.get(view.pageUrl)?.views.push(view);
    });
    
    // Calculate metrics for each page
    const pageMetrics = Array.from(pageGroups.values()).map(page => {
      const durations = page.views.filter(v => v.duration !== null && v.duration !== undefined);
      const avgTime = durations.length === 0 ? 0 : 
        durations.reduce((sum, view) => sum + (view.duration || 0), 0) / durations.length;
      
      // Calculate bounce rate for this page specifically
      const sessions = new Map<string, PageView[]>();
      page.views.forEach(view => {
        if (!view.sessionId) return;
        if (!sessions.has(view.sessionId)) {
          sessions.set(view.sessionId, []);
        }
        sessions.get(view.sessionId)?.push(view);
      });
      
      let bouncedSessionsCount = 0;
      for (const [sessionId, sessionViews] of sessions.entries()) {
        const totalViewsInSession = views.filter(v => v.sessionId === sessionId).length;
        if (totalViewsInSession === 1) {
          bouncedSessionsCount++;
        }
      }
      
      const bounceRate = sessions.size === 0 ? 0 : (bouncedSessionsCount / sessions.size) * 100;
      
      return {
        pageUrl: page.url,
        pageTitle: page.title,
        views: page.views.length,
        avgTime,
        bounceRate
      };
    });
    
    // Sort by views and limit
    return pageMetrics.sort((a, b) => b.views - a.views).slice(0, limit);
  }
  
  async getDeviceBreakdown(startDate: Date, endDate: Date): Promise<{ device: string, count: number }[]> {
    const views = await this.getPageViews(startDate, endDate);
    
    const deviceCounts = new Map<string, number>();
    const uniqueVisitorDevice = new Map<string, string>();
    
    views.forEach(view => {
      if (!view.device || uniqueVisitorDevice.has(view.visitorId)) return;
      
      uniqueVisitorDevice.set(view.visitorId, view.device);
      
      const device = view.device || 'Unknown';
      const count = deviceCounts.get(device) || 0;
      deviceCounts.set(device, count + 1);
    });
    
    return Array.from(deviceCounts.entries()).map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  // Summary methods
  async getAnalyticsSummary(date: Date): Promise<AnalyticsSummary | undefined> {
    return this.analyticsSummaryData.find(summary => {
      const summaryDate = new Date(summary.date);
      return summaryDate.toDateString() === date.toDateString();
    });
  }
  
  async saveAnalyticsSummary(summary: InsertAnalyticsSummary): Promise<AnalyticsSummary> {
    const id = this.currentSummaryId++;
    const analyticsSummary: AnalyticsSummary = { ...summary, id };
    this.analyticsSummaryData.push(analyticsSummary);
    return analyticsSummary;
  }
  
  // Visitor methods
  async getVisitor(id: string): Promise<Visitor | undefined> {
    return this.visitorsData.get(id);
  }
  
  async saveVisitor(visitor: InsertVisitor): Promise<Visitor> {
    const visitorWithVisits: Visitor = { ...visitor, visits: 1 };
    this.visitorsData.set(visitor.id, visitorWithVisits);
    return visitorWithVisits;
  }
  
  async updateVisitor(id: string, lastSeen: Date): Promise<Visitor | undefined> {
    const visitor = this.visitorsData.get(id);
    
    if (!visitor) return undefined;
    
    const updatedVisitor: Visitor = {
      ...visitor,
      lastSeen,
      visits: visitor.visits + 1
    };
    
    this.visitorsData.set(id, updatedVisitor);
    return updatedVisitor;
  }
  
  // Helper method to initialize some default data for demonstration
  private initializeDefaultData() {
    // Generate data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    // Some sample page URLs
    const pages = [
      { url: '/', title: 'Home Page' },
      { url: '/anime/attack-on-titan', title: 'Attack on Titan' },
      { url: '/anime/demon-slayer', title: 'Demon Slayer' },
      { url: '/news', title: 'Anime News' },
      { url: '/reviews', title: 'Anime Reviews' }
    ];
    
    // Sample countries
    const countries = [
      'United States', 'Japan', 'United Kingdom', 'Canada', 'Germany',
      'France', 'Australia', 'Brazil', 'India', 'South Korea'
    ];
    
    // Sample referrers
    const referrers = [
      'Direct', 'Google', 'Twitter', 'Reddit', 'Facebook',
      'Instagram', 'YouTube', 'Bing', 'DuckDuckGo'
    ];
    
    // Sample devices
    const devices = ['Mobile', 'Desktop', 'Tablet'];
    
    // Generate 100 visitors
    for (let i = 1; i <= 100; i++) {
      const visitorId = `visitor-${i}`;
      this.visitorsData.set(visitorId, {
        id: visitorId,
        firstSeen: startDate,
        lastSeen: endDate,
        visits: Math.floor(Math.random() * 5) + 1
      });
      
      // Generate 3-10 page views for each visitor
      const pageViewCount = Math.floor(Math.random() * 8) + 3;
      const sessionId = `session-${i}`;
      
      for (let j = 1; j <= pageViewCount; j++) {
        const pageIndex = Math.floor(Math.random() * pages.length);
        const page = pages[pageIndex];
        
        const countryIndex = Math.floor(Math.random() * countries.length);
        const country = countries[countryIndex];
        
        const referrerIndex = Math.floor(Math.random() * referrers.length);
        const referrer = referrers[referrerIndex];
        
        const deviceIndex = Math.floor(Math.random() * devices.length);
        const device = devices[deviceIndex];
        
        // Random date between start and end
        const randomOffset = Math.random() * (endDate.getTime() - startDate.getTime());
        const timestamp = new Date(startDate.getTime() + randomOffset);
        
        // Duration between 30 seconds and a 5 minutes
        const duration = Math.floor(Math.random() * 270) + 30;
        
        // 10% chance of bouncing
        const bounced = Math.random() < 0.1;
        
        this.pageViewsData.push({
          id: this.currentPageViewId++,
          pageUrl: page.url,
          pageTitle: page.title,
          visitorId,
          sessionId,
          referrer,
          userAgent: 'Sample User Agent',
          country,
          device,
          timestamp,
          duration,
          bounced
        });
      }
    }
    
    // Generate summary data for each day
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      this.analyticsSummaryData.push({
        id: this.currentSummaryId++,
        date,
        uniqueVisitors: 80 + Math.floor(Math.random() * 40),
        totalPageViews: 300 + Math.floor(Math.random() * 200),
        avgSessionDuration: 120 + Math.floor(Math.random() * 120),
        bounceRate: 30 + Math.random() * 20
      });
    }
  }
}

export const storage = new MemStorage();
