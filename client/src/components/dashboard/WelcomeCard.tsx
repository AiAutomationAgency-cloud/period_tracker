import { useQuery } from "@tanstack/react-query";

export function WelcomeCard() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const cycleDay = (stats as any)?.cycleDay || 14;
  const isOvulating = cycleDay >= 12 && cycleDay <= 16;

  return (
    <div className="bg-gradient-to-r from-primary-500 to-sage-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Good morning, {(user as any)?.name || 'Anna'}!</h2>
        <p className="text-primary-100 mb-4">
          Today is day {cycleDay} of your cycle. 
          {isOvulating ? " You're in your fertile window." : " Track your symptoms today."}
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm">
              {isOvulating ? "Ovulation predicted tomorrow" : "Next period in 14 days"}
            </span>
          </div>
        </div>
      </div>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-48 h-full opacity-20 rounded-r-2xl bg-gradient-to-l from-white/20 to-transparent"></div>
    </div>
  );
}
