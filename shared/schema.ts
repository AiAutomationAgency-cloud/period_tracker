import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth"),
  isPregnant: boolean("is_pregnant").default(false),
  pregnancyDueDate: text("pregnancy_due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cycles = pgTable("cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  length: integer("length"),
  flowIntensity: integer("flow_intensity"), // 1-5 scale
  ovulationDate: text("ovulation_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const symptoms = pgTable("symptoms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cycleId: varchar("cycle_id").references(() => cycles.id),
  date: text("date").notNull(),
  type: text("type").notNull(), // cramps, headache, bloating, etc.
  severity: integer("severity").notNull(), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  mood: text("mood").notNull(), // happy, sad, anxious, excited, etc.
  energyLevel: integer("energy_level").notNull(), // 1-10 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nutrition = pgTable("nutrition", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  description: text("description").notNull(),
  calories: integer("calories"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wellness = pgTable("wellness", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  steps: integer("steps"),
  waterIntake: real("water_intake"), // in liters
  sleepHours: real("sleep_hours"),
  sleepQuality: integer("sleep_quality"), // 1-5 scale
  exerciseMinutes: integer("exercise_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pregnancyMilestones = pgTable("pregnancy_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  week: integer("week").notNull(),
  weight: real("weight"),
  notes: text("notes"),
  appointments: jsonb("appointments"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // cycle_prediction, health_tip, symptom_analysis
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // medication, hydration, exercise
  title: text("title").notNull(),
  time: text("time").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCycleSchema = createInsertSchema(cycles).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomSchema = createInsertSchema(symptoms).omit({
  id: true,
  createdAt: true,
});

export const insertMoodSchema = createInsertSchema(moods).omit({
  id: true,
  createdAt: true,
});

export const insertNutritionSchema = createInsertSchema(nutrition).omit({
  id: true,
  createdAt: true,
});

export const insertWellnessSchema = createInsertSchema(wellness).omit({
  id: true,
  createdAt: true,
});

export const insertPregnancyMilestoneSchema = createInsertSchema(pregnancyMilestones).omit({
  id: true,
  createdAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;
export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Nutrition = typeof nutrition.$inferSelect;
export type InsertNutrition = z.infer<typeof insertNutritionSchema>;
export type Wellness = typeof wellness.$inferSelect;
export type InsertWellness = z.infer<typeof insertWellnessSchema>;
export type PregnancyMilestone = typeof pregnancyMilestones.$inferSelect;
export type InsertPregnancyMilestone = z.infer<typeof insertPregnancyMilestoneSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
