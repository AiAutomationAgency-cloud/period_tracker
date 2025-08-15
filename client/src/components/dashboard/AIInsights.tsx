import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";

export function AIInsights() {
  const { data: insights } = useQuery({
    queryKey: ["/api/ai/insights"],
  });

  const latestInsights = (insights as any[])?.slice(0, 2) || [];

  return (
    <div className="bg-gradient-to-r from-primary-50 to-sage-50 dark:from-primary-900/20 dark:to-sage-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {latestInsights.length > 0 ? (
          latestInsights.map((insight: any) => (
            <div key={insight.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
                {insight.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{insight.content}</p>
            </div>
          ))
        ) : (
          <>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Based on your cycle patterns, your fertility window is optimal for the next 2 days.
            </p>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Personalized Tip</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Consider increasing your folic acid intake during this phase for optimal health.
              </p>
            </div>
          </>
        )}
        
        <Link href="/ai">
          <Button 
            variant="ghost" 
            className="w-full text-sm text-primary-600 dark:text-primary-400 font-medium py-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            Ask AI a Question →
          </Button>
        </Link>
      </div>
    </div>
  );
}
