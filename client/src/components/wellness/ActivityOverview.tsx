import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ActivityOverviewProps {
  wellness?: any;
}

export function ActivityOverview({ wellness }: ActivityOverviewProps) {
  const queryClient = useQueryClient();

  const updateWellnessMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/wellness", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness"] });
    },
  });

  const today = new Date().toISOString().split('T')[0];
  
  const steps = wellness?.steps || 0;
  const waterIntake = wellness?.waterIntake || 0;
  const sleepHours = wellness?.sleepHours || 0;

  const stepsProgress = Math.min(100, (steps / 10000) * 100);
  const waterProgress = Math.min(100, (waterIntake / 3) * 100); // 3L daily goal
  const sleepProgress = Math.min(100, (sleepHours / 8) * 100); // 8h daily goal

  const updateSteps = () => {
    const newSteps = prompt("Enter your current step count:", steps.toString());
    if (newSteps && !isNaN(parseInt(newSteps))) {
      updateWellnessMutation.mutate({
        date: today,
        steps: parseInt(newSteps),
        waterIntake: waterIntake,
        sleepHours: sleepHours,
        sleepQuality: wellness?.sleepQuality || 3,
        exerciseMinutes: wellness?.exerciseMinutes || 0
      });
    }
  };

  const updateWater = () => {
    const newWater = prompt("Enter water intake in liters:", waterIntake.toString());
    if (newWater && !isNaN(parseFloat(newWater))) {
      updateWellnessMutation.mutate({
        date: today,
        steps: steps,
        waterIntake: parseFloat(newWater),
        sleepHours: sleepHours,
        sleepQuality: wellness?.sleepQuality || 3,
        exerciseMinutes: wellness?.exerciseMinutes || 0
      });
    }
  };

  const updateSleep = () => {
    const newSleep = prompt("Enter sleep hours:", sleepHours.toString());
    if (newSleep && !isNaN(parseFloat(newSleep))) {
      updateWellnessMutation.mutate({
        date: today,
        steps: steps,
        waterIntake: waterIntake,
        sleepHours: parseFloat(newSleep),
        sleepQuality: wellness?.sleepQuality || 3,
        exerciseMinutes: wellness?.exerciseMinutes || 0
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Today's Activity</h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center cursor-pointer" onClick={updateSteps}>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-full h-full progress-ring">
              <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700"/>
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                stroke="#10B981" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="220" 
                strokeDashoffset={220 - (220 * stepsProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(stepsProgress)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{steps.toLocaleString()}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Steps</div>
        </div>

        <div className="text-center cursor-pointer" onClick={updateWater}>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-full h-full progress-ring">
              <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700"/>
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                stroke="#3B82F6" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="220" 
                strokeDashoffset={220 - (220 * waterProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(waterProgress)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{waterIntake.toFixed(1)}L</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Water</div>
        </div>

        <div className="text-center cursor-pointer" onClick={updateSleep}>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-full h-full progress-ring">
              <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700"/>
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                stroke="#8B7ED8" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="220" 
                strokeDashoffset={220 - (220 * sleepProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(sleepProgress)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{sleepHours.toFixed(1)}h</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Sleep</div>
        </div>
      </div>
    </div>
  );
}
