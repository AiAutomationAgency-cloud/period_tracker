import { WellnessForm } from "@/components/wellness/WellnessForm";
import { WellnessChart } from "@/components/wellness/WellnessChart";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Heart, Smile, Apple } from "lucide-react";

export default function Wellness() {
  const { data: moods } = useQuery({
    queryKey: ["/api/moods"],
  });

  const { data: nutrition } = useQuery({
    queryKey: ["/api/nutrition"],
  });

  const today = new Date().toISOString().split('T')[0];
  const todayMoods = (moods as any[])?.filter((m: any) => m.date === today) || [];
  const todayNutrition = (nutrition as any[])?.filter((n: any) => n.date === today) || [];

  const moodEmojis: { [key: string]: string } = {
    happy: "😊",
    sad: "😢",
    anxious: "😰",
    excited: "🤗",
    calm: "😌",
    stressed: "😤",
    energetic: "⚡",
    tired: "😴"
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wellness & Lifestyle</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your daily wellness metrics and lifestyle habits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WellnessForm />
          <WellnessChart />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Mood */}
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Smile className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Today's Mood</h3>
            </div>
            
            {todayMoods.length > 0 ? (
              <div className="space-y-3">
                {todayMoods.map((mood: any) => (
                  <div key={mood.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-2xl">{moodEmojis[mood.mood] || "😊"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{mood.mood}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Energy: {mood.energyLevel}/10</p>
                      {mood.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{mood.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Smile className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No mood logged today</p>
              </div>
            )}
          </Card>

          {/* Nutrition Summary */}
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Apple className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Today's Nutrition</h3>
            </div>

            {todayNutrition.length > 0 ? (
              <div className="space-y-3">
                {todayNutrition.map((item: any) => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{item.mealType}</p>
                      {item.calories && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                          {item.calories} cal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    {item.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Calories</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {todayNutrition.reduce((sum: number, item: any) => sum + (item.calories || 0), 0)} cal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Apple className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No meals logged today</p>
              </div>
            )}
          </Card>

          {/* Health Tips */}
          <Card className="bg-gradient-to-r from-primary-50 to-sage-50 dark:from-primary-900/20 dark:to-sage-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Wellness Tip</h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Stay hydrated throughout the day! Aim for 8-10 glasses of water to support your overall health and energy levels.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-primary-600 dark:text-primary-400">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Target: 2.5L water daily</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-sage-600 dark:text-sage-400">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span>Goal: 10,000 steps</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Sleep: 7-9 hours</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}