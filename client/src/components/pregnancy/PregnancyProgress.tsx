interface PregnancyProgressProps {
  week: number;
  dueDate: Date;
}

export function PregnancyProgress({ week, dueDate }: PregnancyProgressProps) {
  const totalWeeks = 40;
  const weeksToGo = totalWeeks - week;
  const progress = (week / totalWeeks) * 100;
  
  const trimester = week <= 12 ? "First" : week <= 27 ? "Second" : "Third";
  
  return (
    <div className="bg-gradient-to-r from-sage-500 to-primary-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Week {week}</h3>
            <p className="text-primary-100">{trimester} Trimester • Due: {dueDate.toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{weeksToGo}</div>
            <div className="text-sm text-primary-100">weeks to go</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm">Your baby is about the size of a cantaloupe!</p>
      </div>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-48 h-full opacity-20 rounded-r-2xl bg-gradient-to-l from-white/20 to-transparent"></div>
    </div>
  );
}
