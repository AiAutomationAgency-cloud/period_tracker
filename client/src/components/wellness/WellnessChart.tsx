import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Activity, Droplets, Moon } from "lucide-react";

export function WellnessChart() {
  const { data: wellness } = useQuery({
    queryKey: ["/api/wellness"],
  });

  // Process data for charts
  const wellnessData = (wellness as any[])?.slice(-7).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: item.steps || 0,
    water: item.waterIntake || 0,
    sleep: item.sleepHours || 0,
    exercise: item.exerciseMinutes || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-sage-500 to-primary-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Activity</h3>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wellnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Steps"
              />
              <Line
                type="monotone"
                dataKey="water"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Water (L)"
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                name="Sleep (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Exercise Chart */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercise Minutes</h3>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wellnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="exercise"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name="Exercise Minutes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-sage-50 to-green-50 dark:from-sage-900/20 dark:to-green-900/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {wellnessData.reduce((sum, day) => sum + day.steps, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Steps (7 days)</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {wellnessData.reduce((sum, day) => sum + day.water, 0).toFixed(1)}L
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Water (7 days)</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(wellnessData.reduce((sum, day) => sum + day.sleep, 0) / wellnessData.length || 0).toFixed(1)}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Sleep (7 days)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}