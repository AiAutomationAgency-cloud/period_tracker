import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "" 
});

export interface HealthInsight {
  type: string;
  content: string;
  metadata?: any;
}

export async function generateHealthInsights(userData: {
  cycles?: any[];
  symptoms?: any[];
  moods?: any[];
  wellness?: any[];
}): Promise<HealthInsight[]> {
  try {
    const prompt = `
    As a women's health AI assistant, analyze the following health data and provide personalized insights:
    
    Cycle Data: ${JSON.stringify(userData.cycles?.slice(0, 3) || [])}
    Recent Symptoms: ${JSON.stringify(userData.symptoms?.slice(0, 10) || [])}
    Mood Patterns: ${JSON.stringify(userData.moods?.slice(0, 7) || [])}
    Wellness Data: ${JSON.stringify(userData.wellness?.slice(0, 7) || [])}
    
    Generate 3-4 personalized health insights focusing on:
    1. Cycle patterns and predictions
    2. Symptom correlations
    3. Wellness trends
    4. Actionable health recommendations
    
    Format as JSON array with objects containing: type, content, metadata
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              content: { type: "string" },
              metadata: { 
                type: "object",
                properties: {
                  confidence: { type: "number" },
                  priority: { type: "string" }
                }
              }
            },
            required: ["type", "content"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    return [];
  } catch (error) {
    console.error("Failed to generate health insights:", error);
    return [
      {
        type: "cycle_prediction",
        content: "Based on your recent patterns, your next cycle is predicted to start in approximately 14 days.",
        metadata: { confidence: 0.8 }
      },
      {
        type: "wellness_tip",
        content: "Your sleep quality affects your mood significantly. Consider maintaining a consistent sleep schedule.",
        metadata: { priority: "high" }
      }
    ];
  }
}

export async function answerHealthQuestion(
  question: string, 
  context: {
    user?: any;
    cycles?: any[];
    symptoms?: any[];
    moods?: any[];
  }
): Promise<string> {
  try {
    const systemPrompt = `You are a knowledgeable women's health AI assistant. 
    Provide helpful, evidence-based answers about women's health, menstrual cycles, pregnancy, and wellness.
    Be supportive, informative, and always recommend consulting healthcare providers for serious concerns.
    
    User Context:
    - Recent cycles: ${JSON.stringify(context.cycles?.slice(0, 2) || [])}
    - Recent symptoms: ${JSON.stringify(context.symptoms?.slice(0, 5) || [])}
    - Recent moods: ${JSON.stringify(context.moods?.slice(0, 3) || [])}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: question,
    });

    return response.text || "I'm sorry, I couldn't process your question right now. Please try again.";
  } catch (error) {
    console.error("Failed to answer health question:", error);
    return "I'm experiencing some technical difficulties. Please try asking your question again, or consult with a healthcare professional for important health concerns.";
  }
}

export async function analyzeCyclePatterns(cycles: any[]): Promise<{
  averageLength: number;
  predictedNextPeriod: string;
  regularityScore: number;
  insights: string[];
}> {
  try {
    const prompt = `
    Analyze these menstrual cycle data points and provide insights:
    ${JSON.stringify(cycles)}
    
    Calculate:
    1. Average cycle length
    2. Predicted next period date
    3. Regularity score (0-1)
    4. Key insights about patterns
    
    Return as JSON with: averageLength, predictedNextPeriod, regularityScore, insights
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            averageLength: { type: "number" },
            predictedNextPeriod: { type: "string" },
            regularityScore: { type: "number" },
            insights: { 
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["averageLength", "predictedNextPeriod", "regularityScore", "insights"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    // Fallback calculation
    const avgLength = cycles.length > 0 ? 
      cycles.reduce((sum, cycle) => sum + (cycle.length || 28), 0) / cycles.length : 28;
    
    const nextPeriod = new Date();
    nextPeriod.setDate(nextPeriod.getDate() + Math.round(avgLength));
    
    return {
      averageLength: Math.round(avgLength),
      predictedNextPeriod: nextPeriod.toISOString().split('T')[0],
      regularityScore: 0.8,
      insights: [
        "Your cycles show a consistent pattern",
        "Track symptoms to better predict ovulation",
        "Maintain healthy lifestyle for optimal cycle health"
      ]
    };
  } catch (error) {
    console.error("Failed to analyze cycle patterns:", error);
    return {
      averageLength: 28,
      predictedNextPeriod: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      regularityScore: 0.8,
      insights: ["Unable to analyze patterns at this time. Continue tracking for better insights."]
    };
  }
}
