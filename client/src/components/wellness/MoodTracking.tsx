import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export function MoodTracking() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const queryClient = useQueryClient();

  const { data: todayMood } = useQuery({
    queryKey: ["/api/moods", { date: new Date().toISOString().split('T')[0] }],
  });

  const createMoodMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/moods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
    },
  });

  const moods = [
    { emoji: "😢", label: "Sad", value: "sad" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😊", label: "Happy", value: "happy" },
    { emoji: "😄", label: "Excited", value: "excited" },
    { emoji: "😍", label: "Great", value: "great" },
  ];

  const today = new Date().toISOString().split('T')[0];
  const currentMood = (todayMood as any[])?.find((m: any) => m.date === today);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    createMoodMutation.mutate({
      date: today,
      mood,
      energyLevel,
      notes: ""
    });
  };

  const handleEnergyChange = (level: number) => {
    setEnergyLevel(level);
    if (selectedMood || currentMood) {
      createMoodMutation.mutate({
        date: today,
        mood: selectedMood || currentMood?.mood || "neutral",
        energyLevel: level,
        notes: ""
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mood Tracking</h3>
        <Button variant="ghost" className="text-primary-500 text-sm font-medium">
          View History
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            How are you feeling today?
          </label>
          <div className="flex justify-between">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  (selectedMood === mood.value || currentMood?.mood === mood.value)
                    ? "bg-primary-50 dark:bg-primary-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className={`text-xs ${
                  (selectedMood === mood.value || currentMood?.mood === mood.value)
                    ? "text-primary-600 dark:text-primary-400 font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Energy Level: {energyLevel}/10
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={energyLevel}
            onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
