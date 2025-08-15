import { useQuery } from "@tanstack/react-query";
import { PregnancyProgress } from "@/components/pregnancy/PregnancyProgress";
import { BabyDevelopment } from "@/components/pregnancy/BabyDevelopment";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PregnancyTracking() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: milestones } = useQuery({
    queryKey: ["/api/pregnancy/milestones"],
  });

  // Mock pregnancy data
  const pregnancyWeek = 24;
  const weeksToGo = 40 - pregnancyWeek;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (weeksToGo * 7));

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pregnancy Journey</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your pregnancy milestones and fetal development</p>
      </div>

      <PregnancyProgress week={pregnancyWeek} dueDate={dueDate} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Baby Development */}
        <div className="lg:col-span-2">
          <BabyDevelopment week={pregnancyWeek} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* This Week's Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">This Week's Tips</h3>
            <div className="space-y-4">
              <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                <h4 className="font-medium text-sage-700 dark:text-sage-300 text-sm mb-1">Nutrition</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Focus on iron-rich foods like spinach and lean meats to support increased blood volume.
                </p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <h4 className="font-medium text-primary-700 dark:text-primary-300 text-sm mb-1">Exercise</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Continue gentle exercise like prenatal yoga or swimming to maintain strength.
                </p>
              </div>
              <div className="p-3 bg-coral-50 dark:bg-coral-900/20 rounded-lg">
                <h4 className="font-medium text-coral-700 dark:text-coral-300 text-sm mb-1">Sleep</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Use pregnancy pillows to support your growing belly for better sleep comfort.
                </p>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Appointments</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Glucose Screening</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dec 28, 2024 • 10:00 AM</p>
                </div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Regular Checkup</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Jan 15, 2025 • 2:30 PM</p>
                </div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary-500 text-sm font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
