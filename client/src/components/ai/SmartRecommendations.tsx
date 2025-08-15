import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Calendar, 
  Heart, 
  Droplets, 
  Moon, 
  Activity,
  Apple,
  Brain,
  CheckCircle 
} from "lucide-react";

interface SmartRecommendation {
  id: string;
  type: "cycle" | "nutrition" | "wellness" | "mood" | "general";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  completed?: boolean;
}

export function SmartRecommendations() {
  const { data: recommendations = [] } = useQuery<SmartRecommendation[]>({
    queryKey: ["/api/ai/recommendations"],
    placeholderData: [
      {
        id: "1",
        type: "cycle",
        title: "Track Ovulation Symptoms",
        description: "Your cycle shows signs of ovulation around day 14. Track cervical mucus and basal temperature for better prediction.",
        priority: "high",
        actionable: true,
        completed: false
      },
      {
        id: "2",
        type: "wellness",
        title: "Improve Sleep Schedule",
        description: "Your mood data correlates with sleep quality. Try going to bed 30 minutes earlier for better energy levels.",
        priority: "medium",
        actionable: true,
        completed: false
      },
      {
        id: "3",
        type: "nutrition",
        title: "Iron-Rich Foods",
        description: "During your menstrual phase, include iron-rich foods like spinach, lentils, and lean meat to combat fatigue.",
        priority: "medium",
        actionable: true,
        completed: false
      },
      {
        id: "4",
        type: "mood",
        title: "Stress Management",
        description: "Your mood patterns show stress spikes mid-cycle. Consider meditation or yoga during this time.",
        priority: "low",
        actionable: true,
        completed: true
      }
    ]
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cycle": return <Heart className="w-4 h-4 text-red-500" />;
      case "nutrition": return <Apple className="w-4 h-4 text-green-500" />;
      case "wellness": return <Activity className="w-4 h-4 text-blue-500" />;
      case "mood": return <Brain className="w-4 h-4 text-purple-500" />;
      default: return <Lightbulb className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const activeRecommendations = recommendations.filter(r => !r.completed);
  const completedRecommendations = recommendations.filter(r => r.completed);

  return (
    <div className="space-y-6">
      {/* Active Recommendations */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart Recommendations</h3>
          <Badge variant="secondary" className="ml-auto">
            {activeRecommendations.length} active
          </Badge>
        </div>

        <div className="space-y-4">
          {activeRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getTypeIcon(recommendation.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h4>
                    <Badge className={`${getPriorityColor(recommendation.priority)} text-xs`}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.description}
                  </p>
                  {recommendation.actionable && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Remind Later
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Completed Recommendations */}
      {completedRecommendations.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
            <Badge variant="secondary" className="ml-auto">
              {completedRecommendations.length} done
            </Badge>
          </div>

          <div className="space-y-3">
            {completedRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {recommendation.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}