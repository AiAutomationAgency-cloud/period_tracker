import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Activity, 
  AlertCircle, 
  CheckCircle,
  Loader2 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface HealthAssessment {
  overallScore: number;
  cycleHealth: number;
  wellnessScore: number;
  moodStability: number;
  recommendations: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    message: string;
  }>;
  trends: Array<{
    metric: string;
    direction: "improving" | "stable" | "concerning";
    change: string;
  }>;
}

export function AIHealthAssessment() {
  const { data: assessment, isLoading } = useQuery<HealthAssessment>({
    queryKey: ["/api/ai/health-assessment"],
  });

  const generateAssessmentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ai/generate-assessment", {});
    },
    onSuccess: () => {
      // Invalidate and refetch
      window.location.reload();
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "bg-red-50 dark:bg-red-900/20";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "improving": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "concerning": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Generating health assessment...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Health Assessment</h3>
        </div>
        <Button
          onClick={() => generateAssessmentMutation.mutate()}
          disabled={generateAssessmentMutation.isPending}
          variant="ghost"
          size="sm"
          className="text-primary-600 dark:text-primary-400"
        >
          {generateAssessmentMutation.isPending ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {assessment ? (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`p-4 rounded-lg ${getScoreBackground(assessment.overallScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Overall Health Score</span>
              <span className={`text-2xl font-bold ${getScoreColor(assessment.overallScore)}`}>
                {assessment.overallScore}%
              </span>
            </div>
            <Progress value={assessment.overallScore} className="h-2" />
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Cycle Health</div>
              <div className={`text-lg font-bold ${getScoreColor(assessment.cycleHealth)}`}>
                {assessment.cycleHealth}%
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Activity className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Wellness</div>
              <div className={`text-lg font-bold ${getScoreColor(assessment.wellnessScore)}`}>
                {assessment.wellnessScore}%
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Brain className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Mood Stability</div>
              <div className={`text-lg font-bold ${getScoreColor(assessment.moodStability)}`}>
                {assessment.moodStability}%
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                      {rec.priority}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {rec.category}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {rec.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends */}
          {assessment.trends.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Health Trends</h4>
              <div className="space-y-2">
                {assessment.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTrendIcon(trend.direction)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trend.metric}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {trend.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No health assessment available</p>
          <Button
            onClick={() => generateAssessmentMutation.mutate()}
            disabled={generateAssessmentMutation.isPending}
            className="bg-gradient-to-r from-primary-500 to-sage-500 text-white hover:from-primary-600 hover:to-sage-600"
          >
            {generateAssessmentMutation.isPending ? "Analyzing..." : "Generate Assessment"}
          </Button>
        </div>
      )}
    </Card>
  );
}