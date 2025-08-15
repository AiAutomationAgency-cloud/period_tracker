import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Baby, Calendar, Heart, Scale } from "lucide-react";

export function PregnancyProgress() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: milestones } = useQuery({
    queryKey: ["/api/pregnancy/milestones"],
  });

  // Calculate pregnancy progress
  const dueDate = user?.pregnancyDueDate ? new Date(user.pregnancyDueDate) : null;
  const today = new Date();
  const totalDays = 280; // 40 weeks
  
  let currentWeek = 0;
  let daysRemaining = 0;
  let progressPercent = 0;
  
  if (dueDate) {
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, daysLeft);
    const daysPassed = totalDays - daysRemaining;
    currentWeek = Math.floor(daysPassed / 7);
    progressPercent = Math.min(100, (daysPassed / totalDays) * 100);
  }

  const trimester = currentWeek <= 12 ? 1 : currentWeek <= 26 ? 2 : 3;
  
  const trimesterInfo = {
    1: { name: "First Trimester", color: "from-pink-500 to-rose-400", emoji: "🌱" },
    2: { name: "Second Trimester", color: "from-primary-500 to-purple-400", emoji: "🌸" },
    3: { name: "Third Trimester", color: "from-coral-500 to-orange-400", emoji: "🌺" }
  };

  const currentTrimester = trimesterInfo[trimester as keyof typeof trimesterInfo];

  if (!user?.isPregnant) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="text-center py-8">
          <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Not Currently Pregnant</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enable pregnancy tracking in your profile to monitor your journey.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-r ${currentTrimester.color} rounded-2xl flex items-center justify-center text-2xl`}>
          {currentTrimester.emoji}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Week {currentWeek} - {currentTrimester.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {daysRemaining} days until due date
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pregnancy Progress</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{progressPercent.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Conception</span>
            <span>Due Date</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
            <Calendar className="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{currentWeek}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Weeks</p>
          </div>
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <Heart className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{trimester}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Trimester</p>
          </div>
        </div>

        {dueDate && (
          <div className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-primary-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <Baby className="w-6 h-6 text-primary-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Due Date</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dueDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {milestones && (milestones as any[]).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Milestones</h4>
          <div className="space-y-2">
            {(milestones as any[]).slice(0, 3).map((milestone: any) => (
              <div key={milestone.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Week {milestone.week} • {new Date(milestone.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}