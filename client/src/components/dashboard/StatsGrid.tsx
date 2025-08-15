import { useQuery } from "@tanstack/react-query";
import { Heart, Zap, Moon, Smile } from "lucide-react";

export function StatsGrid() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const statCards = [
    {
      icon: Heart,
      value: stats?.cycleDay || 14,
      label: "Cycle Day",
      subtitle: "28-day cycle",
      bgColor: "bg-coral-100 dark:bg-coral-900/30",
      iconColor: "text-coral-500",
    },
    {
      icon: Zap,
      value: `${(stats?.steps || 8234).toLocaleString()}`,
      label: "Steps Today",
      subtitle: "Goal: 10k",
      bgColor: "bg-sage-100 dark:bg-sage-900/30",
      iconColor: "text-sage-500",
    },
    {
      icon: Moon,
      value: `${stats?.sleepHours || 7.5}h`,
      label: "Sleep",
      subtitle: "Good quality",
      bgColor: "bg-primary-100 dark:bg-primary-900/30",
      iconColor: "text-primary-500",
    },
    {
      icon: Smile,
      value: "😊",
      label: "Mood",
      subtitle: stats?.mood === "happy" ? "Happy" : "Good",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
