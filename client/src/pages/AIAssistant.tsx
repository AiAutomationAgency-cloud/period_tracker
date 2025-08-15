import { AIChat } from "@/components/ai/AIChat";
import { PersonalizedInsights } from "@/components/ai/PersonalizedInsights";
import { AIHealthAssessmentSimple } from "@/components/ai/AIHealthAssessmentSimple";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, TrendingUp, MessageCircle, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AIAssistant() {
  const queryClient = useQueryClient();

  const { data: insights } = useQuery({
    queryKey: ["/api/ai/insights"],
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ai/generate-insights", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/insights"] });
    },
  });

  const quickQuestions = [
    "Is it normal to have mood swings during my cycle?",
    "What foods help with cramps?",
    "How can I improve my sleep quality?",
    "What exercises are safe during pregnancy?",
    "How much water should I drink daily?",
    "What are early pregnancy symptoms?"
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Health Assistant</h2>
        <p className="text-gray-600 dark:text-gray-400">Get personalized insights and ask questions about your health</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Health Assessment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Chat */}
            <div className="lg:col-span-2">
              <AIChat />
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
              <PersonalizedInsights insights={insights as any} />

              {/* Quick Questions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Questions</h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm text-gray-900 dark:text-white h-auto"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Generate new personalized insights based on your latest health data.
                </p>
                <Button
                  onClick={() => generateInsightsMutation.mutate()}
                  disabled={generateInsightsMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary-500 to-sage-500 text-white hover:from-primary-600 hover:to-sage-600 transition-colors"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {generateInsightsMutation.isPending ? "Analyzing..." : "Generate Insights"}
                </Button>
              </div>

              {/* Health Reminders */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Hydration</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Your water intake is below the recommended daily amount. Aim for 8-10 glasses per day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Sleep Pattern</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Your sleep quality correlates with your mood. Consider a consistent bedtime routine.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assessment">
          <AIHealthAssessmentSimple />
        </TabsContent>
      </Tabs>
    </div>
  );
}