import { Sparkles } from "lucide-react";

interface CurrentPhaseProps {
  currentCycle?: any;
}

export function CurrentPhase({ currentCycle }: CurrentPhaseProps) {
  // Mock data for demonstration
  const cycleDay = 14;
  const cycleLength = 28;
  
  const getPhaseInfo = (day: number) => {
    if (day <= 5) return { name: "Menstrual", icon: "🩸", color: "from-coral-500 to-red-400" };
    if (day <= 11) return { name: "Follicular", icon: "🌱", color: "from-sage-500 to-green-400" };
    if (day <= 16) return { name: "Fertile Window", icon: "⭐", color: "from-primary-500 to-yellow-400" };
    if (day <= 18) return { name: "Ovulation", icon: "🥚", color: "from-yellow-500 to-orange-400" };
    return { name: "Luteal", icon: "🌙", color: "from-sage-500 to-blue-400" };
  };

  const currentPhase = getPhaseInfo(cycleDay);
  const nextOvulation = new Date();
  nextOvulation.setDate(nextOvulation.getDate() + 1);
  const nextPeriod = new Date();
  nextPeriod.setDate(nextPeriod.getDate() + 14);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Phase</h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-r ${currentPhase.color} rounded-2xl flex items-center justify-center text-2xl`}>
          {currentPhase.icon}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{currentPhase.name}</h4>
          <p className="text-gray-600 dark:text-gray-400">Day {cycleDay} of {cycleLength}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Next ovulation</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {nextOvulation.toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Next period</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {nextPeriod.toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Cycle length</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{cycleLength} days</span>
        </div>
      </div>
    </div>
  );
}
