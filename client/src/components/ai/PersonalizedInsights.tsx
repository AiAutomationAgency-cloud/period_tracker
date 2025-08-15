import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Heart, Target } from "lucide-react";

interface PersonalizedInsightsProps {
  insights: Array<{
    id: string;
    type: string;
    content: string;
    createdAt: Date;
  }>;
}

export function PersonalizedInsights({ insights }: PersonalizedInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cycle':
        return <Heart className="h-4 w-4" />;
      case 'wellness':
        return <TrendingUp className="h-4 w-4" />;
      case 'prediction':
        return <Target className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'cycle':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'wellness':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'prediction':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No personalized insights available yet. Keep tracking your health data to receive AI-powered insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Personalized Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={getInsightColor(insight.type)}>
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{insight.content}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}