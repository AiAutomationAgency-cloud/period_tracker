import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Activity, Droplets, Moon, Heart, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function WellnessForm() {
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [steps, setSteps] = React.useState([8000]);
  const [waterIntake, setWaterIntake] = React.useState([2.5]);
  const [sleepHours, setSleepHours] = React.useState([7.5]);
  const [sleepQuality, setSleepQuality] = React.useState([4]);
  const [exerciseMinutes, setExerciseMinutes] = React.useState([30]);

  const queryClient = useQueryClient();

  const addWellnessMutation = useMutation({
    mutationFn: async (wellnessData: any) => {
      return apiRequest("POST", "/api/wellness", wellnessData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWellnessMutation.mutate({
      date,
      steps: steps[0],
      waterIntake: waterIntake[0],
      sleepHours: sleepHours[0],
      sleepQuality: sleepQuality[0],
      exerciseMinutes: exerciseMinutes[0],
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-sage-500 to-primary-500 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Log Wellness Data</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1"
            data-testid="wellness-date-input"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-sage-500" />
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Steps: {steps[0].toLocaleString()}
              </Label>
            </div>
            <Slider
              value={steps}
              onValueChange={setSteps}
              max={20000}
              step={500}
              className="w-full"
              data-testid="steps-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>10k (goal)</span>
              <span>20k</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Water Intake: {waterIntake[0]}L
              </Label>
            </div>
            <Slider
              value={waterIntake}
              onValueChange={setWaterIntake}
              max={5}
              step={0.1}
              className="w-full"
              data-testid="water-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0L</span>
              <span>2.5L (goal)</span>
              <span>5L</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Moon className="w-4 h-4 text-primary-500" />
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sleep Hours: {sleepHours[0]}h
              </Label>
            </div>
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              max={12}
              step={0.5}
              className="w-full"
              data-testid="sleep-hours-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0h</span>
              <span>8h (goal)</span>
              <span>12h</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-coral-500" />
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sleep Quality: {sleepQuality[0]}/5
              </Label>
            </div>
            <Slider
              value={sleepQuality}
              onValueChange={setSleepQuality}
              max={5}
              step={1}
              className="w-full"
              data-testid="sleep-quality-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Poor</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Exercise: {exerciseMinutes[0]} minutes
              </Label>
            </div>
            <Slider
              value={exerciseMinutes}
              onValueChange={setExerciseMinutes}
              max={120}
              step={5}
              className="w-full"
              data-testid="exercise-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0min</span>
              <span>30min (goal)</span>
              <span>120min</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={addWellnessMutation.isPending}
          className="w-full bg-gradient-to-r from-sage-500 to-primary-500 text-white hover:from-sage-600 hover:to-primary-600"
          data-testid="submit-wellness-button"
        >
          {addWellnessMutation.isPending ? "Saving..." : "Log Wellness Data"}
        </Button>
      </form>
    </Card>
  );
}