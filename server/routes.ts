import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCycleSchema, insertSymptomSchema, 
  insertMoodSchema, insertNutritionSchema, insertWellnessSchema,
  insertPregnancyMilestoneSchema, insertReminderSchema
} from "@shared/schema";
import { generateHealthInsights, answerHealthQuestion } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for development (in production, use proper authentication)
  const MOCK_USER_ID = "user-1";

  // Create a mock user if it doesn't exist
  app.use(async (req, res, next) => {
    const existingUser = await storage.getUser(MOCK_USER_ID);
    if (!existingUser) {
      await storage.createUser({
        username: "anna",
        email: "anna@example.com",
        password: "password",
        name: "Anna",
        dateOfBirth: "1990-05-15",
        isPregnant: false,
        pregnancyDueDate: null
      });
    }
    next();
  });

  // Users
  app.get("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUser(MOCK_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  app.put("/api/user/profile", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(MOCK_USER_ID, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Cycles
  app.get("/api/cycles", async (req, res) => {
    try {
      const cycles = await storage.getCyclesByUserId(MOCK_USER_ID);
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cycles" });
    }
  });

  app.get("/api/cycles/current", async (req, res) => {
    try {
      const cycle = await storage.getCurrentCycle(MOCK_USER_ID);
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current cycle" });
    }
  });

  app.post("/api/cycles", async (req, res) => {
    try {
      const validatedData = insertCycleSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const cycle = await storage.createCycle(validatedData);
      res.json(cycle);
    } catch (error) {
      res.status(400).json({ message: "Invalid cycle data" });
    }
  });

  // Symptoms
  app.get("/api/symptoms", async (req, res) => {
    try {
      const { date } = req.query;
      const symptoms = await storage.getSymptomsByUserId(
        MOCK_USER_ID, 
        date as string
      );
      res.json(symptoms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get symptoms" });
    }
  });

  app.post("/api/symptoms", async (req, res) => {
    try {
      const validatedData = insertSymptomSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const symptom = await storage.createSymptom(validatedData);
      res.json(symptom);
    } catch (error) {
      res.status(400).json({ message: "Invalid symptom data" });
    }
  });

  // Moods
  app.get("/api/moods", async (req, res) => {
    try {
      const { start, end } = req.query;
      const dateRange = start && end ? { start: start as string, end: end as string } : undefined;
      const moods = await storage.getMoodsByUserId(MOCK_USER_ID, dateRange);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to get moods" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const validatedData = insertMoodSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const mood = await storage.createMood(validatedData);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood data" });
    }
  });

  // Nutrition
  app.get("/api/nutrition", async (req, res) => {
    try {
      const { date } = req.query;
      const nutrition = await storage.getNutritionByUserId(
        MOCK_USER_ID, 
        date as string
      );
      res.json(nutrition);
    } catch (error) {
      res.status(500).json({ message: "Failed to get nutrition data" });
    }
  });

  app.post("/api/nutrition", async (req, res) => {
    try {
      const validatedData = insertNutritionSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const nutrition = await storage.createNutrition(validatedData);
      res.json(nutrition);
    } catch (error) {
      res.status(400).json({ message: "Invalid nutrition data" });
    }
  });

  // Wellness
  app.get("/api/wellness", async (req, res) => {
    try {
      const { start, end } = req.query;
      const dateRange = start && end ? { start: start as string, end: end as string } : undefined;
      const wellness = await storage.getWellnessByUserId(MOCK_USER_ID, dateRange);
      res.json(wellness);
    } catch (error) {
      res.status(500).json({ message: "Failed to get wellness data" });
    }
  });

  app.post("/api/wellness", async (req, res) => {
    try {
      const validatedData = insertWellnessSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const wellness = await storage.createWellness(validatedData);
      res.json(wellness);
    } catch (error) {
      res.status(400).json({ message: "Invalid wellness data" });
    }
  });

  // Pregnancy
  app.get("/api/pregnancy/milestones", async (req, res) => {
    try {
      const milestones = await storage.getPregnancyMilestonesByUserId(MOCK_USER_ID);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pregnancy milestones" });
    }
  });

  app.post("/api/pregnancy/milestones", async (req, res) => {
    try {
      const validatedData = insertPregnancyMilestoneSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const milestone = await storage.createPregnancyMilestone(validatedData);
      res.json(milestone);
    } catch (error) {
      res.status(400).json({ message: "Invalid pregnancy milestone data" });
    }
  });

  // AI Insights
  app.get("/api/ai/insights", async (req, res) => {
    try {
      const { type } = req.query;
      const insights = await storage.getAiInsightsByUserId(
        MOCK_USER_ID, 
        type as string
      );
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI insights" });
    }
  });

  app.post("/api/ai/generate-insights", async (req, res) => {
    try {
      // Get user data for context
      const cycles = await storage.getCyclesByUserId(MOCK_USER_ID);
      const symptoms = await storage.getSymptomsByUserId(MOCK_USER_ID);
      const moods = await storage.getMoodsByUserId(MOCK_USER_ID);
      const wellness = await storage.getWellnessByUserId(MOCK_USER_ID);

      const insights = await generateHealthInsights({
        cycles,
        symptoms,
        moods,
        wellness
      });

      // Store insights
      for (const insight of insights) {
        await storage.createAiInsight({
          userId: MOCK_USER_ID,
          type: insight.type,
          content: insight.content,
          metadata: insight.metadata
        });
      }

      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get user data for context
      const user = await storage.getUser(MOCK_USER_ID);
      const cycles = await storage.getCyclesByUserId(MOCK_USER_ID);
      const symptoms = await storage.getSymptomsByUserId(MOCK_USER_ID);
      const moods = await storage.getMoodsByUserId(MOCK_USER_ID);

      const answer = await answerHealthQuestion(question, {
        user,
        cycles,
        symptoms,
        moods
      });

      res.json({ answer });
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Reminders
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getRemindersByUserId(MOCK_USER_ID);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reminders" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const validatedData = insertReminderSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const reminder = await storage.createReminder(validatedData);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ message: "Invalid reminder data" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [
        currentCycle,
        todayWellness,
        todaySymptoms,
        todayMood,
        weeklyWellness
      ] = await Promise.all([
        storage.getCurrentCycle(MOCK_USER_ID),
        storage.getWellnessByUserId(MOCK_USER_ID, { start: today, end: today }),
        storage.getSymptomsByUserId(MOCK_USER_ID, today),
        storage.getMoodsByUserId(MOCK_USER_ID, { start: today, end: today }),
        storage.getWellnessByUserId(MOCK_USER_ID, { start: weekAgo, end: today })
      ]);

      const stats = {
        cycleDay: currentCycle ? calculateCycleDay(currentCycle) : 0,
        steps: todayWellness[0]?.steps || 0,
        sleepHours: todayWellness[0]?.sleepHours || 0,
        mood: todayMood[0]?.mood || 'neutral',
        symptoms: todaySymptoms.map(s => s.type),
        weeklyProgress: {
          water: weeklyWellness.reduce((sum, w) => sum + (w.waterIntake || 0), 0),
          exercise: weeklyWellness.filter(w => (w.exerciseMinutes || 0) > 0).length,
          sleep: weeklyWellness.reduce((sum, w) => sum + (w.sleepHours || 0), 0)
        }
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateCycleDay(cycle: any): number {
  const today = new Date();
  const startDate = new Date(cycle.startDate);
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
