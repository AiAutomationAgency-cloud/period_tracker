import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { CycleProgress } from "@/components/dashboard/CycleProgress";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: reminders } = useQuery({
    queryKey: ["/api/reminders"],
  });

  const { data: symptoms } = useQuery({
    queryKey: ["/api/symptoms"],
    refetchInterval: 30000,
  });

  const todaySymptoms = (symptoms as any[])?.filter((s: any) => {
    const today = new Date().toISOString().split('T')[0];
    return s.date === today;
  }) || [];

  return (
    <div>
      <WelcomeCard />
      <StatsGrid />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <CycleProgress />
          
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Activities</h3>
            <div className="space-y-4">
              {todaySymptoms.length > 0 ? (
                todaySymptoms.map((symptom: any) => (
                  <div key={symptom.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-sage-100 dark:bg-sage-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-sage-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Logged Symptom</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{symptom.type} - Severity: {symptom.severity}/5</p>
                    </div>
                    <span className="text-sm text-gray-400">Today</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">No activities logged yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start tracking your health today</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <AIInsights />
          <QuickActions />
          
          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reminders</h3>
            <div className="space-y-3">
              {(reminders as any[])?.slice(0, 3).map((reminder: any) => (
                <div key={reminder.id} className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{reminder.title}</span>
                  <span className="text-xs text-gray-400 ml-auto">{reminder.time}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Take prenatal vitamin</span>
                    <span className="text-xs text-gray-400 ml-auto">9:00 AM</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Drink water</span>
                    <span className="text-xs text-gray-400 ml-auto">Every 2h</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Evening walk</span>
                    <span className="text-xs text-gray-400 ml-auto">6:00 PM</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
