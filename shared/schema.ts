import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Analytics schemas
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull(),
  pageTitle: text("page_title"),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
  device: text("device"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  duration: integer("duration"), // in seconds
  bounced: boolean("bounced"),
});

export const visitors = pgTable("visitors", {
  id: text("id").primaryKey(), // typically a generated UUID
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  visits: integer("visits").notNull().default(1),
});

export const analyticsSummary = pgTable("analytics_summary", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  totalPageViews: integer("total_page_views").notNull().default(0),
  avgSessionDuration: integer("avg_session_duration").notNull().default(0), // in seconds
  bounceRate: doublePrecision("bounce_rate").notNull().default(0), // as percentage
});

// Insert schemas
export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  visits: true,
});

export const insertAnalyticsSummarySchema = createInsertSchema(analyticsSummary).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;

export type InsertAnalyticsSummary = z.infer<typeof insertAnalyticsSummarySchema>;
export type AnalyticsSummary = typeof analyticsSummary.$inferSelect;
