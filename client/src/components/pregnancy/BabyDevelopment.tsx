import { Heart, Brain, Eye } from "lucide-react";

interface BabyDevelopmentProps {
  week: number;
}

export function BabyDevelopment({ week }: BabyDevelopmentProps) {
  const getDevelopmentInfo = (week: number) => {
    if (week >= 20 && week <= 28) {
      return {
        size: "12 inches long, 1.3 pounds",
        comparison: "cantaloupe",
        developments: [
          {
            icon: Heart,
            title: "Size & Weight",
            description: "Your baby is approximately 12 inches long and weighs about 1.3 pounds - roughly the size of a cantaloupe.",
            color: "sage",
          },
          {
            icon: Brain,
            title: "Brain Development",
            description: "Brain tissue is developing rapidly. Your baby can now hear sounds from outside the womb more clearly.",
            color: "primary",
          },
          {
            icon: Eye,
            title: "Sensory Development",
            description: "Eyes are developing and may respond to light. Taste buds are forming and can detect sweet and bitter flavors.",
            color: "coral",
          },
        ]
      };
    }
    
    // Default fallback
    return {
      size: "Growing steadily",
      comparison: "developing beautifully",
      developments: [
        {
          icon: Heart,
          title: "Size & Weight",
          description: "Your baby is growing at a healthy rate for this stage of development.",
          color: "sage",
        },
        {
          icon: Brain,
          title: "Brain Development",
          description: "Neural connections are forming rapidly as your baby's brain develops.",
          color: "primary",
        },
        {
          icon: Eye,
          title: "Sensory Development",
          description: "Your baby's senses are developing and becoming more sophisticated.",
          color: "coral",
        },
      ]
    };
  };

  const developmentInfo = getDevelopmentInfo(week);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "sage":
        return "bg-sage-100 dark:bg-sage-900/30 text-sage-500";
      case "primary":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-500";
      case "coral":
        return "bg-coral-100 dark:bg-coral-900/30 text-coral-500";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-500";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Baby Development - Week {week}
      </h3>
      
      <div className="space-y-6">
        {developmentInfo.developments.map((development, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getColorClasses(development.color)} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <development.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{development.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{development.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
