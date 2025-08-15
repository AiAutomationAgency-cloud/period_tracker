import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ActivityOverview } from "@/components/wellness/ActivityOverview";
import { MoodTracking } from "@/components/wellness/MoodTracking";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Target, Smartphone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Wellness() {
  const queryClient = useQueryClient();

  const { data: wellness } = useQuery({
    queryKey: ["/api/wellness"],
  });

  const { data: moods } = useQuery({
    queryKey: ["/api/moods"],
  });

  const { data: nutrition } = useQuery({
    queryKey: ["/api/nutrition"],
  });

  const createWellnessMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/wellness", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness"] });
    },
  });

  const createNutritionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/nutrition", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const todayWellness = wellness?.find((w: any) => w.date === today);
  const todayNutrition = (nutrition as any[])?.filter((n: any) => n.date === today) || [];

  const weeklyWellness = (wellness as any[])?.filter((w: any) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return w.date >= weekAgo;
  }) || [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wellness Tracking</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor your overall health and daily habits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Wellness Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityOverview wellness={todayWellness} />
          <MoodTracking />

          {/* Nutrition Log */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nutrition Log</h3>
              <Button 
                className="text-primary-500 text-sm font-medium"
                onClick={() => {
                  const description = prompt("Enter meal description:");
                  const calories = prompt("Enter calories (optional):");
                  if (description) {
                    createNutritionMutation.mutate({
                      date: today,
                      mealType: "meal",
                      description,
                      calories: calories ? parseInt(calories) : null,
                      notes: ""
                    });
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </div>
            <div className="space-y-4">
              {todayNutrition.length > 0 ? (
                todayNutrition.map((meal: any) => (
                  <div key={meal.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{meal.mealType}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {meal.description} {meal.calories && `• ${meal.calories} cal`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(meal.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No meals logged today</p>
                  <p className="text-sm">Start tracking your nutrition for better health insights</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wellness Sidebar */}
        <div className="space-y-6">
          {/* Health Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Goals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Water Intake</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(weeklyWellness.reduce((sum: number, w: any) => sum + (w.waterIntake || 0), 0)).toFixed(1)}L / 14L
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, (weeklyWellness.reduce((sum: number, w: any) => sum + (w.waterIntake || 0), 0) / 14) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exercise</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {weeklyWellness.filter((w: any) => (w.exerciseMinutes || 0) > 0).length} / 5 days
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, (weeklyWellness.filter((w: any) => (w.exerciseMinutes || 0) > 0).length / 5) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sleep</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(weeklyWellness.reduce((sum: number, w: any) => sum + (w.sleepHours || 0), 0)).toFixed(1)}h / 56h
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, (weeklyWellness.reduce((sum: number, w: any) => sum + (w.sleepHours || 0), 0) / 56) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Sync */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connected Devices</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Health App</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Syncing steps and activity</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary-500 text-sm font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Connect Device
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
