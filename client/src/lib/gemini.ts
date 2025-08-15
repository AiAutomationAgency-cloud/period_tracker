// Client-side Gemini utilities and types
export interface HealthInsight {
  type: string;
  content: string;
  metadata?: any;
}

export interface CycleAnalysis {
  averageLength: number;
  predictedNextPeriod: string;
  regularityScore: number;
  insights: string[];
}

export const GEMINI_MODEL = "gemini-2.5-flash";

// Health question categories for better UX
export const HEALTH_CATEGORIES = {
  CYCLE: "Menstrual Cycle",
  PREGNANCY: "Pregnancy",
  NUTRITION: "Nutrition",
  WELLNESS: "General Wellness",
  SYMPTOMS: "Symptoms",
  MOOD: "Mental Health"
};

// Common health questions for quick access
export const QUICK_QUESTIONS = [
  {
    category: HEALTH_CATEGORIES.CYCLE,
    questions: [
      "Is it normal to have irregular periods?",
      "What are signs of ovulation?",
      "How long should a menstrual cycle be?",
      "What causes period cramps?"
    ]
  },
  {
    category: HEALTH_CATEGORIES.PREGNANCY,
    questions: [
      "What are early pregnancy symptoms?",
      "What foods should I avoid during pregnancy?",
      "Is exercise safe during pregnancy?",
      "What vitamins should I take while pregnant?"
    ]
  },
  {
    category: HEALTH_CATEGORIES.WELLNESS,
    questions: [
      "How much water should I drink daily?",
      "What's a healthy amount of sleep?",
      "How can I improve my energy levels?",
      "What are good stress management techniques?"
    ]
  }
];

// Utility function to format AI responses
export function formatAIResponse(response: string): string {
  // Clean up common AI response artifacts
  return response
    .replace(/^\*\*|\*\*$/g, '') // Remove bold markers
    .replace(/^- |^\* /gm, '• ') // Convert to bullet points
    .trim();
}

// Utility function to extract key insights from AI response
export function extractKeyInsights(response: string): string[] {
  const lines = response.split('\n').filter(line => line.trim());
  return lines
    .filter(line => line.includes('•') || line.match(/^\d+\./))
    .map(line => line.replace(/^[•\d\.\-\s]+/, '').trim())
    .slice(0, 5); // Limit to 5 key insights
}
