import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

interface CycleCalendarProps {
  cycles?: any[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export function CycleCalendar({ cycles, onDateSelect, selectedDate }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDayType = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    // Mock cycle data based on current date
    const today = new Date();
    const dayOfCycle = Math.abs(date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayOfCycle <= 5) return "period";
    if (dayOfCycle >= 12 && dayOfCycle <= 16) return "fertile";
    if (dayOfCycle === 14) return "ovulation";
    if (dateString === new Date().toISOString().split('T')[0]) return "today";
    return "normal";
  };

  const getDayClasses = (day: number) => {
    const type = getDayType(day);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const isSelected = dateString === selectedDate;
    
    let classes = "text-center p-2 rounded-lg font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ";
    
    switch (type) {
      case "period":
        classes += "bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400 ";
        break;
      case "fertile":
        classes += "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 ";
        break;
      case "ovulation":
        classes += "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 ";
        break;
      case "today":
        classes += "bg-primary-500 text-white ";
        break;
      default:
        classes += "text-gray-600 dark:text-gray-400 ";
    }
    
    if (isSelected) {
      classes += "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800 ";
    }
    
    return classes;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-xs font-medium text-gray-400 p-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          return (
            <div
              key={day}
              className={getDayClasses(day)}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-coral-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Period</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Fertile Window</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Ovulation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}
