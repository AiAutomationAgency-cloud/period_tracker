import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CycleCalendar } from "@/components/cycle/CycleCalendar";
import { CurrentPhase } from "@/components/cycle/CurrentPhase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function CycleTracking() {
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: cycles } = useQuery({
    queryKey: ["/api/cycles"],
  });

  const { data: currentCycle } = useQuery({
    queryKey: ["/api/cycles/current"],
  });

  const { data: symptoms } = useQuery({
    queryKey: ["/api/symptoms", selectedDate],
  });

  const addSymptomMutation = useMutation({
    mutationFn: async (symptomData: any) => {
      return apiRequest("POST", "/api/symptoms", symptomData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/symptoms"] });
    },
  });

  const logPeriodMutation = useMutation({
    mutationFn: async (cycleData: any) => {
      return apiRequest("POST", "/api/cycles", cycleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
    },
  });

  const handleSymptomAdd = (type: string, severity: number) => {
    addSymptomMutation.mutate({
      date: selectedDate,
      type,
      severity,
      notes: "",
    });
  };

  const symptoms_list = (symptoms as any[])?.filter((s: any) => s.date === selectedDate) || [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cycle Tracking</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor your menstrual cycle and get AI-powered predictions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar View */}
        <CycleCalendar cycles={cycles} onDateSelect={setSelectedDate} selectedDate={selectedDate} />

        {/* Cycle Details */}
        <div className="space-y-6">
          <CurrentPhase currentCycle={currentCycle} />
          
          {/* Symptoms & Log */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Log" : "Log for " + selectedDate}
              </h3>
              <Button variant="ghost" className="text-primary-500 text-sm font-medium">
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => logPeriodMutation.mutate({ 
                        startDate: selectedDate, 
                        flowIntensity: intensity 
                      })}
                      className={`w-8 h-8 rounded-full ${
                        intensity <= 2 ? 'bg-gray-200 dark:bg-gray-600' :
                        intensity === 3 ? 'bg-coral-400' :
                        intensity === 4 ? 'bg-coral-500' : 'bg-coral-600'
                      } ${intensity === 3 ? 'ring-2 ring-coral-500 ring-offset-2 dark:ring-offset-gray-800' : ''}`}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {symptoms_list.map((symptom) => (
                    <span key={symptom.id} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      {symptom.type}
                    </span>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSymptomAdd("cramps", 3)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
