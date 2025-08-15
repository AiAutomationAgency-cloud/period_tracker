import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function CycleProgress() {
  const { data: currentCycle } = useQuery({
    queryKey: ["/api/cycles/current"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const cycleDay = stats?.cycleDay || 14;
  const cycleLength = 28;
  const progress = (cycleDay / cycleLength) * 100;
  const strokeDasharray = 553; // 2 * π * 88
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  const getPhase = (day: number) => {
    if (day <= 5) return { name: "Period", color: "text-coral-500" };
    if (day <= 11) return { name: "Follicular", color: "text-sage-500" };
    if (day <= 16) return { name: "Fertile Window", color: "text-primary-500" };
    if (day <= 18) return { name: "Ovulation", color: "text-yellow-500" };
    return { name: "Luteal", color: "text-sage-500" };
  };

  const currentPhase = getPhase(cycleDay);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cycle Progress</h3>
        <Button variant="ghost" className="text-primary-500 text-sm font-medium">
          View Details
        </Button>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full progress-ring">
            <circle 
              cx="96" 
              cy="96" 
              r="88" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none" 
              className="text-gray-200 dark:text-gray-700"
            />
            <circle 
              cx="96" 
              cy="96" 
              r="88" 
              stroke="#8B7ED8" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{cycleDay}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
            <span className={`text-xs font-medium ${currentPhase.color}`}>
              {currentPhase.name}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="w-3 h-3 bg-coral-400 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Period</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-primary-400 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Fertile</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Ovulation</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-sage-400 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Luteal</span>
        </div>
      </div>
    </div>
  );
}
