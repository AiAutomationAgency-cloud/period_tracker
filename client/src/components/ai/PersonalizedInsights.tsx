import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Heart, Zap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Insight {
  id: string;
  type: string;
  content: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface PersonalizedInsightsProps {
  insights?: Insight[];
}

export function PersonalizedInsights({ insights }: PersonalizedInsightsProps) {
  const queryClient = useQueryClient();

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ai/generate-insights", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/insights"] });
    },
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "cycle_prediction":
        return <Heart className="w-4 h-4" />;
      case "wellness_tip":
        return <Zap className="w-4 h-4" />;
      case "mood_analysis":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-coral-500 bg-coral-50 dark:bg-coral-900/20";
      case "medium":
        return "border-primary-500 bg-primary-50 dark:bg-primary-900/20";
      default:
        return "border-sage-500 bg-sage-50 dark:bg-sage-900/20";
    }
  };

  const formatInsightType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const latestInsights = (insights as Insight[])?.slice(0, 3) || [];

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Insights</h3>
        </div>
        <Button
          onClick={() => generateInsightsMutation.mutate()}
          disabled={generateInsightsMutation.isPending}
          variant="ghost"
          size="sm"
          className="text-primary-600 dark:text-primary-400"
          data-testid="generate-insights-button"
        >
          {generateInsightsMutation.isPending ? "Generating..." : "Refresh"}
        </Button>
      </div>

      <div className="space-y-4">
        {latestInsights.length > 0 ? (
          latestInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
                    {formatInsightType(insight.type)}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {insight.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No insights yet</p>
            <Button
              onClick={() => generateInsightsMutation.mutate()}
              disabled={generateInsightsMutation.isPending}
              className="bg-gradient-to-r from-primary-500 to-sage-500 text-white hover:from-primary-600 hover:to-sage-600"
              data-testid="generate-first-insights-button"
            >
              {generateInsightsMutation.isPending ? "Generating..." : "Generate First Insights"}
            </Button>
          </div>
        )}
      </div>

      {latestInsights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Insights are updated based on your health data and patterns
          </p>
        </div>
      )}
    </Card>
  );
}