import React, { useState, useEffect } from 'react';
import HabitHeatmap from '@/components/calendar/HabitHeatmap';
import HabitSelect from '@/components/calendar/HabitSelect';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useHabits } from '@/contexts/HabitContext';
import { format, addMonths, subMonths } from 'date-fns';

const CalendarPage: React.FC = () => {
  const { habits, loading } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState('all');
  const [viewType, setViewType] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const { toast } = useToast();
  
  // Get current year for reference
  const currentYear = new Date().getFullYear();

  // Process completion data for the heatmap
  const completionData = React.useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        if (!data[date]) {
          data[date] = {};
        }
        data[date][habit.id] = 1;
      });
    });

    return data;
  }, [habits]);

  const handlePreviousPeriod = () => {
    setCurrentMonth(prev => {
      if (viewType === 'year') {
        // Go to previous year
        return subMonths(prev, 12);
      }
      return subMonths(prev, 1);
    });
  };

  const handleNextPeriod = () => {
    setCurrentMonth(prev => {
      if (viewType === 'year') {
        // Go to next year
        return addMonths(prev, 12);
      }
      return addMonths(prev, 1);
    });
  };

  const getMonthLabel = (date: Date) => {
    return format(date, 'MMMM yyyy');
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType('month')}
            className={viewType === 'month' ? 'bg-secondary/30' : ''}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType('year')}
            className={viewType === 'year' ? 'bg-secondary/30' : ''}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousPeriod}
          className="min-w-[80px]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {viewType === 'year' ? 'Prev Year' : 'Prev'}
        </Button>
        
        <h2 className="text-lg font-medium">
          {viewType === 'month' 
            ? getMonthLabel(currentMonth)
            : currentMonth.getFullYear()}
        </h2>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextPeriod}
          className="min-w-[80px]"
        >
          {viewType === 'year' ? 'Next Year' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Heatmap */}
      <HabitHeatmap
        month={currentMonth}
        viewType={viewType}
        selectedHabit={selectedHabit}
        completionData={completionData}
        habits={habits.map(h => ({ id: h.id, name: h.name }))}
        isLoading={loading || isLoading}
      />
    </div>
  );
};

export default CalendarPage;
