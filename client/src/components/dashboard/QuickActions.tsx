import { Button } from "@/components/ui/button";
import { Heart, Smile, Plus } from "lucide-react";
import { Link } from "wouter";

export function QuickActions() {
  const actions = [
    {
      icon: Heart,
      label: "Log Period",
      bgColor: "bg-coral-50 dark:bg-coral-900/20 hover:bg-coral-100 dark:hover:bg-coral-900/30",
      iconBg: "bg-coral-500",
      href: "/cycle",
    },
    {
      icon: Smile,
      label: "Track Mood",
      bgColor: "bg-sage-50 dark:bg-sage-900/20 hover:bg-sage-100 dark:hover:bg-sage-900/30",
      iconBg: "bg-sage-500",
      href: "/wellness",
    },
    {
      icon: Plus,
      label: "Add Symptom",
      bgColor: "bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30",
      iconBg: "bg-primary-500",
      href: "/cycle",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button
              variant="ghost"
              className={`w-full flex items-center space-x-3 p-3 ${action.bgColor} transition-colors`}
            >
              <div className={`w-8 h-8 ${action.iconBg} rounded-lg flex items-center justify-center`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
