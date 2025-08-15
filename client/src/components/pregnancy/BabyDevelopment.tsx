import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Baby, Ruler, Heart, Brain } from "lucide-react";

export function BabyDevelopment() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  // Calculate pregnancy week
  const dueDate = user?.pregnancyDueDate ? new Date(user.pregnancyDueDate) : null;
  const today = new Date();
  const totalDays = 280; // 40 weeks
  
  let currentWeek = 0;
  if (dueDate) {
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, daysLeft);
    const daysPassed = totalDays - daysRemaining;
    currentWeek = Math.floor(daysPassed / 7);
  }

  // Baby development data by week
  const developmentData: { [key: number]: { size: string; weight: string; development: string; milestone: string } } = {
    4: { size: "Poppy seed", weight: "< 1g", development: "Neural tube forming", milestone: "Heart begins to beat" },
    8: { size: "Raspberry", weight: "1g", development: "All major organs forming", milestone: "Brain waves detectable" },
    12: { size: "Lime", weight: "14g", development: "Fingernails growing", milestone: "Can make fists" },
    16: { size: "Avocado", weight: "100g", development: "Facial features defined", milestone: "Can hear sounds" },
    20: { size: "Banana", weight: "300g", development: "Hair and eyebrows growing", milestone: "Halfway point!" },
    24: { size: "Ear of corn", weight: "600g", development: "Lungs developing rapidly", milestone: "Viable outside womb" },
    28: { size: "Eggplant", weight: "1kg", development: "Eyes can open and close", milestone: "Third trimester begins" },
    32: { size: "Squash", weight: "1.7kg", development: "Bones hardening", milestone: "Practicing breathing" },
    36: { size: "Papaya", weight: "2.6kg", development: "Immune system developing", milestone: "Considered full-term soon" },
    40: { size: "Watermelon", weight: "3.4kg", development: "Ready for birth", milestone: "Due date!" }
  };

  // Find the closest development milestone
  const milestones = Object.keys(developmentData).map(Number).sort((a, b) => a - b);
  const currentMilestone = milestones.find(week => week >= currentWeek) || milestones[milestones.length - 1];
  const development = developmentData[currentMilestone];

  if (!user?.isPregnant || !development) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="text-center py-8">
          <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Baby Development</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enable pregnancy tracking to see your baby's development milestones.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Baby className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Baby at Week {currentWeek}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Development milestone</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Size Comparison */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800">
          <div className="text-center">
            <div className="text-4xl mb-2">🍼</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Size of a {development.size}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approximately {development.weight}</p>
          </div>
        </div>

        {/* Development Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{development.size}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Size</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Heart className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900 dark:text-white">{development.weight}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Weight</p>
          </div>
        </div>

        {/* Current Development */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-primary-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">This Week's Development</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Physical Growth</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{development.development}</p>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Key Milestone</p>
              <p className="text-sm text-primary-600 dark:text-primary-400">{development.milestone}</p>
            </div>
          </div>
        </div>

        {/* Weekly Tips */}
        <div className="bg-sage-50 dark:bg-sage-900/30 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">This Week's Care Tips</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Take your prenatal vitamins daily</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Stay hydrated with 8-10 glasses of water</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Get adequate rest and manage stress</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Continue regular exercise as approved by your doctor</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}