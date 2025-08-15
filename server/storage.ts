import { 
  type User, type InsertUser, type Cycle, type InsertCycle,
  type Symptom, type InsertSymptom, type Mood, type InsertMood,
  type Nutrition, type InsertNutrition, type Wellness, type InsertWellness,
  type PregnancyMilestone, type InsertPregnancyMilestone,
  type AiInsight, type InsertAiInsight, type Reminder, type InsertReminder
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Cycles
  getCyclesByUserId(userId: string): Promise<Cycle[]>;
  getCurrentCycle(userId: string): Promise<Cycle | undefined>;
  createCycle(cycle: InsertCycle): Promise<Cycle>;
  updateCycle(id: string, updates: Partial<Cycle>): Promise<Cycle | undefined>;

  // Symptoms
  getSymptomsByUserId(userId: string, date?: string): Promise<Symptom[]>;
  createSymptom(symptom: InsertSymptom): Promise<Symptom>;
  updateSymptom(id: string, updates: Partial<Symptom>): Promise<Symptom | undefined>;

  // Moods
  getMoodsByUserId(userId: string, dateRange?: { start: string; end: string }): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  updateMood(id: string, updates: Partial<Mood>): Promise<Mood | undefined>;

  // Nutrition
  getNutritionByUserId(userId: string, date?: string): Promise<Nutrition[]>;
  createNutrition(nutrition: InsertNutrition): Promise<Nutrition>;
  updateNutrition(id: string, updates: Partial<Nutrition>): Promise<Nutrition | undefined>;

  // Wellness
  getWellnessByUserId(userId: string, dateRange?: { start: string; end: string }): Promise<Wellness[]>;
  createWellness(wellness: InsertWellness): Promise<Wellness>;
  updateWellness(id: string, updates: Partial<Wellness>): Promise<Wellness | undefined>;

  // Pregnancy
  getPregnancyMilestonesByUserId(userId: string): Promise<PregnancyMilestone[]>;
  createPregnancyMilestone(milestone: InsertPregnancyMilestone): Promise<PregnancyMilestone>;
  updatePregnancyMilestone(id: string, updates: Partial<PregnancyMilestone>): Promise<PregnancyMilestone | undefined>;

  // AI Insights
  getAiInsightsByUserId(userId: string, type?: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;

  // Reminders
  getRemindersByUserId(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder | undefined>;
  deleteReminder(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private cycles: Map<string, Cycle> = new Map();
  private symptoms: Map<string, Symptom> = new Map();
  private moods: Map<string, Mood> = new Map();
  private nutrition: Map<string, Nutrition> = new Map();
  private wellness: Map<string, Wellness> = new Map();
  private pregnancyMilestones: Map<string, PregnancyMilestone> = new Map();
  private aiInsights: Map<string, AiInsight> = new Map();
  private reminders: Map<string, Reminder> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      dateOfBirth: insertUser.dateOfBirth ?? null,
      isPregnant: insertUser.isPregnant ?? false,
      pregnancyDueDate: insertUser.pregnancyDueDate ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Cycles
  async getCyclesByUserId(userId: string): Promise<Cycle[]> {
    return Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async getCurrentCycle(userId: string): Promise<Cycle | undefined> {
    const cycles = await this.getCyclesByUserId(userId);
    return cycles.find(cycle => !cycle.endDate) || cycles[0];
  }

  async createCycle(insertCycle: InsertCycle): Promise<Cycle> {
    const id = randomUUID();
    const cycle: Cycle = { 
      ...insertCycle, 
      id, 
      createdAt: new Date(),
      endDate: insertCycle.endDate ?? null,
      length: insertCycle.length ?? null,
      flowIntensity: insertCycle.flowIntensity ?? null,
      ovulationDate: insertCycle.ovulationDate ?? null
    };
    this.cycles.set(id, cycle);
    return cycle;
  }

  async updateCycle(id: string, updates: Partial<Cycle>): Promise<Cycle | undefined> {
    const cycle = this.cycles.get(id);
    if (!cycle) return undefined;
    const updated = { ...cycle, ...updates };
    this.cycles.set(id, updated);
    return updated;
  }

  // Symptoms
  async getSymptomsByUserId(userId: string, date?: string): Promise<Symptom[]> {
    return Array.from(this.symptoms.values())
      .filter(symptom => 
        symptom.userId === userId && 
        (!date || symptom.date === date)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createSymptom(insertSymptom: InsertSymptom): Promise<Symptom> {
    const id = randomUUID();
    const symptom: Symptom = { 
      ...insertSymptom, 
      id, 
      createdAt: new Date(),
      cycleId: insertSymptom.cycleId ?? null,
      notes: insertSymptom.notes ?? null
    };
    this.symptoms.set(id, symptom);
    return symptom;
  }

  async updateSymptom(id: string, updates: Partial<Symptom>): Promise<Symptom | undefined> {
    const symptom = this.symptoms.get(id);
    if (!symptom) return undefined;
    const updated = { ...symptom, ...updates };
    this.symptoms.set(id, updated);
    return updated;
  }

  // Moods
  async getMoodsByUserId(userId: string, dateRange?: { start: string; end: string }): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => {
        if (mood.userId !== userId) return false;
        if (!dateRange) return true;
        const moodDate = new Date(mood.date);
        return moodDate >= new Date(dateRange.start) && moodDate <= new Date(dateRange.end);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = randomUUID();
    const mood: Mood = { 
      ...insertMood, 
      id, 
      createdAt: new Date(),
      notes: insertMood.notes ?? null
    };
    this.moods.set(id, mood);
    return mood;
  }

  async updateMood(id: string, updates: Partial<Mood>): Promise<Mood | undefined> {
    const mood = this.moods.get(id);
    if (!mood) return undefined;
    const updated = { ...mood, ...updates };
    this.moods.set(id, updated);
    return updated;
  }

  // Nutrition
  async getNutritionByUserId(userId: string, date?: string): Promise<Nutrition[]> {
    return Array.from(this.nutrition.values())
      .filter(nutrition => 
        nutrition.userId === userId && 
        (!date || nutrition.date === date)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createNutrition(insertNutrition: InsertNutrition): Promise<Nutrition> {
    const id = randomUUID();
    const nutrition: Nutrition = { 
      ...insertNutrition, 
      id, 
      createdAt: new Date(),
      notes: insertNutrition.notes ?? null,
      calories: insertNutrition.calories ?? null
    };
    this.nutrition.set(id, nutrition);
    return nutrition;
  }

  async updateNutrition(id: string, updates: Partial<Nutrition>): Promise<Nutrition | undefined> {
    const nutrition = this.nutrition.get(id);
    if (!nutrition) return undefined;
    const updated = { ...nutrition, ...updates };
    this.nutrition.set(id, updated);
    return updated;
  }

  // Wellness
  async getWellnessByUserId(userId: string, dateRange?: { start: string; end: string }): Promise<Wellness[]> {
    return Array.from(this.wellness.values())
      .filter(wellness => {
        if (wellness.userId !== userId) return false;
        if (!dateRange) return true;
        const wellnessDate = new Date(wellness.date);
        return wellnessDate >= new Date(dateRange.start) && wellnessDate <= new Date(dateRange.end);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWellness(insertWellness: InsertWellness): Promise<Wellness> {
    const id = randomUUID();
    const wellness: Wellness = { 
      ...insertWellness, 
      id, 
      createdAt: new Date(),
      steps: insertWellness.steps ?? null,
      waterIntake: insertWellness.waterIntake ?? null,
      sleepHours: insertWellness.sleepHours ?? null,
      sleepQuality: insertWellness.sleepQuality ?? null,
      exerciseMinutes: insertWellness.exerciseMinutes ?? null
    };
    this.wellness.set(id, wellness);
    return wellness;
  }

  async updateWellness(id: string, updates: Partial<Wellness>): Promise<Wellness | undefined> {
    const wellness = this.wellness.get(id);
    if (!wellness) return undefined;
    const updated = { ...wellness, ...updates };
    this.wellness.set(id, updated);
    return updated;
  }

  // Pregnancy
  async getPregnancyMilestonesByUserId(userId: string): Promise<PregnancyMilestone[]> {
    return Array.from(this.pregnancyMilestones.values())
      .filter(milestone => milestone.userId === userId)
      .sort((a, b) => b.week - a.week);
  }

  async createPregnancyMilestone(insertMilestone: InsertPregnancyMilestone): Promise<PregnancyMilestone> {
    const id = randomUUID();
    const milestone: PregnancyMilestone = { 
      ...insertMilestone, 
      id, 
      createdAt: new Date(),
      notes: insertMilestone.notes ?? null,
      weight: insertMilestone.weight ?? null,
      appointments: insertMilestone.appointments ?? null
    };
    this.pregnancyMilestones.set(id, milestone);
    return milestone;
  }

  async updatePregnancyMilestone(id: string, updates: Partial<PregnancyMilestone>): Promise<PregnancyMilestone | undefined> {
    const milestone = this.pregnancyMilestones.get(id);
    if (!milestone) return undefined;
    const updated = { ...milestone, ...updates };
    this.pregnancyMilestones.set(id, updated);
    return updated;
  }

  // AI Insights
  async getAiInsightsByUserId(userId: string, type?: string): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values())
      .filter(insight => 
        insight.userId === userId && 
        (!type || insight.type === type)
      )
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = randomUUID();
    const insight: AiInsight = { 
      ...insertInsight, 
      id, 
      createdAt: new Date(),
      metadata: insertInsight.metadata ?? null
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  // Reminders
  async getRemindersByUserId(userId: string): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId && reminder.isActive)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = randomUUID();
    const reminder: Reminder = { 
      ...insertReminder, 
      id, 
      createdAt: new Date(),
      isActive: insertReminder.isActive ?? true
    };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    const updated = { ...reminder, ...updates };
    this.reminders.set(id, updated);
    return updated;
  }

  async deleteReminder(id: string): Promise<boolean> {
    return this.reminders.delete(id);
  }
}

export const storage = new MemStorage();
