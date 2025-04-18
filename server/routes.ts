import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for analytics
  const apiBase = '/api';
  
  // Middleware to parse dates from query params
  const parseDateRange = (req: any, res: any, next: any) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        const endDateObj = new Date();
        const startDateObj = new Date();
        startDateObj.setDate(startDateObj.getDate() - 7); // Default to last 7 days
        
        req.startDate = startDateObj;
        req.endDate = endDateObj;
      } else {
        req.startDate = new Date(startDate);
        req.endDate = new Date(endDate);
      }
      
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid date format" });
    }
  };
  
  // Get overview metrics
  app.get(`${apiBase}/analytics/overview`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      
      const [uniqueVisitors, totalPageViews, avgSessionDuration, bounceRate] = await Promise.all([
        storage.getUniqueVisitors(startDate, endDate),
        storage.getTotalPageViews(startDate, endDate),
        storage.getAvgSessionDuration(startDate, endDate),
        storage.getBounceRate(startDate, endDate)
      ]);
      
      // Get previous period for comparison
      const periodLength = endDate.getTime() - startDate.getTime();
      const previousEndDate = new Date(startDate);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setTime(previousStartDate.getTime() - periodLength);
      
      const [prevUniqueVisitors, prevTotalPageViews, prevAvgSessionDuration, prevBounceRate] = await Promise.all([
        storage.getUniqueVisitors(previousStartDate, previousEndDate),
        storage.getTotalPageViews(previousStartDate, previousEndDate),
        storage.getAvgSessionDuration(previousStartDate, previousEndDate),
        storage.getBounceRate(previousStartDate, previousEndDate)
      ]);
      
      // Calculate changes
      const calcChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };
      
      res.json({
        uniqueVisitors: {
          value: uniqueVisitors,
          change: calcChange(uniqueVisitors, prevUniqueVisitors)
        },
        pageViews: {
          value: totalPageViews,
          change: calcChange(totalPageViews, prevTotalPageViews)
        },
        avgSessionDuration: {
          value: avgSessionDuration,
          change: calcChange(avgSessionDuration, prevAvgSessionDuration)
        },
        bounceRate: {
          value: bounceRate,
          change: calcChange(bounceRate, prevBounceRate)
        }
      });
    } catch (error) {
      console.error("Error fetching overview metrics:", error);
      res.status(500).json({ message: "Failed to fetch overview metrics" });
    }
  });
  
  // Get visitors over time data
  app.get(`${apiBase}/analytics/visitors-over-time`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      const { interval = 'day' } = req.query; // day, week, month
      
      // Get all page views for the period
      const pageViews = await storage.getPageViews(startDate, endDate);
      
      // Group by date based on interval
      const visitorsByDate = new Map<string, Set<string>>();
      const pageViewsByDate = new Map<string, number>();
      
      pageViews.forEach(view => {
        const date = new Date(view.timestamp);
        let dateKey: string;
        
        if (interval === 'day') {
          dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (interval === 'week') {
          // Get the start of the week (Sunday)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          dateKey = weekStart.toISOString().split('T')[0];
        } else if (interval === 'month') {
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
          dateKey = date.toISOString().split('T')[0];
        }
        
        // Track unique visitors
        if (!visitorsByDate.has(dateKey)) {
          visitorsByDate.set(dateKey, new Set());
        }
        visitorsByDate.get(dateKey)?.add(view.visitorId);
        
        // Track page views
        pageViewsByDate.set(dateKey, (pageViewsByDate.get(dateKey) || 0) + 1);
      });
      
      // Generate all dates in the range based on interval
      const dates: string[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        let dateKey: string;
        
        if (interval === 'day') {
          dateKey = currentDate.toISOString().split('T')[0];
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (interval === 'week') {
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          dateKey = weekStart.toISOString().split('T')[0];
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (interval === 'month') {
          dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
          dateKey = currentDate.toISOString().split('T')[0];
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (!dates.includes(dateKey)) {
          dates.push(dateKey);
        }
      }
      
      // Format the response data
      const data = dates.map(date => {
        const visitors = visitorsByDate.has(date) ? visitorsByDate.get(date)!.size : 0;
        const views = pageViewsByDate.get(date) || 0;
        
        return {
          date,
          visitors,
          pageViews: views
        };
      });
      
      res.json({
        interval,
        data
      });
    } catch (error) {
      console.error("Error fetching visitors over time:", error);
      res.status(500).json({ message: "Failed to fetch visitor data" });
    }
  });
  
  // Get visitor geography data
  app.get(`${apiBase}/analytics/geography`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      
      const countries = await storage.getVisitorsByCountry(startDate, endDate);
      
      // Calculate total for percentages
      const total = countries.reduce((sum, country) => sum + country.count, 0);
      
      const countryData = countries.map(country => ({
        name: country.country,
        visitors: country.count,
        percentage: total > 0 ? Math.round((country.count / total) * 100) : 0
      }));
      
      res.json(countryData);
    } catch (error) {
      console.error("Error fetching geography data:", error);
      res.status(500).json({ message: "Failed to fetch geography data" });
    }
  });
  
  // Get traffic sources data
  app.get(`${apiBase}/analytics/traffic-sources`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      
      const sources = await storage.getTrafficSources(startDate, endDate);
      
      // Process the sources to categorize and group them
      const processedSources = sources.map(source => {
        let icon = 'globe';
        let name = source.source;
        
        // Define source name and icon based on referrer
        if (name.includes('google')) {
          name = 'Google';
          icon = 'search';
        } else if (name.includes('bing')) {
          name = 'Bing';
          icon = 'search';
        } else if (name.includes('duckduckgo')) {
          name = 'DuckDuckGo';
          icon = 'search';
        } else if (name.includes('twitter') || name.includes('x.com')) {
          name = 'Twitter';
          icon = 'twitter';
        } else if (name.includes('facebook')) {
          name = 'Facebook';
          icon = 'facebook';
        } else if (name.includes('instagram')) {
          name = 'Instagram';
          icon = 'instagram';
        } else if (name.includes('reddit')) {
          name = 'Reddit';
          icon = 'reddit';
        } else if (name.includes('youtube')) {
          name = 'YouTube';
          icon = 'youtube';
        } else if (name === 'Direct') {
          icon = 'globe';
        }
        
        return {
          name,
          visitors: source.count,
          icon,
          // Mock conversion rates and changes for demonstration
          conversion: (Math.random() * 5 + 1).toFixed(1) + '%',
          change: (Math.random() * 20 - 5).toFixed(1)
        };
      });
      
      res.json(processedSources);
    } catch (error) {
      console.error("Error fetching traffic sources:", error);
      res.status(500).json({ message: "Failed to fetch traffic sources" });
    }
  });
  
  // Get popular pages data
  app.get(`${apiBase}/analytics/popular-pages`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      const { limit = 5 } = req.query;
      
      const popularPages = await storage.getPopularPages(startDate, endDate, Number(limit));
      
      // Format durations and add any additional data
      const formattedPages = popularPages.map(page => {
        // Format avg time as minutes and seconds
        const minutes = Math.floor(page.avgTime / 60);
        const seconds = Math.floor(page.avgTime % 60);
        const avgTime = `${minutes}m ${seconds}s`;
        
        return {
          ...page,
          avgTime
        };
      });
      
      res.json(formattedPages);
    } catch (error) {
      console.error("Error fetching popular pages:", error);
      res.status(500).json({ message: "Failed to fetch popular pages" });
    }
  });
  
  // Get device breakdown data
  app.get(`${apiBase}/analytics/devices`, parseDateRange, async (req: any, res) => {
    try {
      const { startDate, endDate } = req;
      
      const devices = await storage.getDeviceBreakdown(startDate, endDate);
      
      // Calculate total for percentages
      const total = devices.reduce((sum, device) => sum + device.count, 0);
      
      const deviceData = devices.map(device => ({
        name: device.device,
        count: device.count,
        percentage: total > 0 ? Math.round((device.count / total) * 100) : 0
      }));
      
      res.json(deviceData);
    } catch (error) {
      console.error("Error fetching device breakdown:", error);
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });
  
  // Track a page view (would be called by client)
  app.post(`${apiBase}/analytics/track`, async (req, res) => {
    try {
      const { 
        pageUrl, 
        pageTitle, 
        visitorId, 
        sessionId, 
        referrer, 
        userAgent, 
        country, 
        device 
      } = req.body;
      
      if (!pageUrl || !visitorId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Record the page view
      await storage.recordPageView({
        pageUrl,
        pageTitle,
        visitorId,
        sessionId,
        referrer,
        userAgent,
        country,
        device,
        timestamp: new Date(),
        duration: null, // This would be updated later
        bounced: null   // This would be updated later
      });
      
      // Check if this visitor exists, if not create them
      const existingVisitor = await storage.getVisitor(visitorId);
      
      if (!existingVisitor) {
        await storage.saveVisitor({
          id: visitorId,
          firstSeen: new Date(),
          lastSeen: new Date()
        });
      } else {
        await storage.updateVisitor(visitorId, new Date());
      }
      
      res.status(201).json({ message: "Page view recorded" });
    } catch (error) {
      console.error("Error tracking page view:", error);
      res.status(500).json({ message: "Failed to record page view" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
