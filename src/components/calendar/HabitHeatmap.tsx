import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FC } from 'react';
import DayCompletionPopover from './DayCompletionPopover';

interface HabitHeatmapProps {
  month: Date;
  viewType: 'month' | 'year';
  selectedHabit: string;
  completionData: Record<string, Record<string, number>>;
  habits: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

const getCellColor = (value: number): string => {
  if (value === 0) return 'bg-muted hover:bg-muted/80';
  if (value < 0.5) return 'bg-accent/30 hover:bg-accent/40';
  if (value < 0.8) return 'bg-accent/50 hover:bg-accent/60';
  return 'bg-accent/80 hover:bg-accent/90';
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const getAllMonths = (year: number): Date[] => {
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
};

const getTooltipContent = (
  date: Date,
  completionData: Record<string, number> | undefined,
  selectedHabit: string
) => {
  const dateLabel = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  if (!completionData) {
    return (
      <div className="text-center">
        <p className="font-medium">{dateLabel}</p>
        <p className="text-xs text-muted-foreground">No data available</p>
      </div>
    );
  }

  const completedCount = Object.values(completionData).filter(v => v === 1).length;
  const totalCount = Object.keys(completionData).length;

  return (
    <div className="text-center">
      <p className="font-medium">{dateLabel}</p>
      <p className="text-xs">
        {completedCount} of {totalCount} habits completed
      </p>
      {selectedHabit !== 'all' && (
        <p className="text-xs mt-1 font-medium">
          {completionData[selectedHabit] ? '✓ Completed' : '✗ Not completed'}
        </p>
      )}
    </div>
  );
};

const getCompletionValue = (dateString: string, habitId: string, data: Record<string, Record<string, number>>): number => {
  if (!data[dateString]) return 0;
  
  if (habitId === 'all') {
    const values = Object.values(data[dateString]);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  return data[dateString][habitId] || 0;
};

const HabitHeatmap: FC<HabitHeatmapProps> = ({
  month,
  viewType,
  selectedHabit,
  completionData,
  habits,
  isLoading = false,
}) => {
  const yearValue = month.getFullYear();
  const monthIndex = month.getMonth();
  
  // Render loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-1">
        {Array(35).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-sm" />
        ))}
      </div>
    );
  }

  // Render year view
  if (viewType === 'year') {
    const year = month.getFullYear();
    const months = getAllMonths(year);

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map((monthDate, monthIndex) => {
            const monthYear = monthDate.getFullYear();
            const monthMonth = monthDate.getMonth();
            const daysInMonth = getDaysInMonth(monthYear, monthMonth);
            const firstDayOfMonth = getFirstDayOfMonth(monthYear, monthMonth);
            const monthName = monthDate.toLocaleString('default', { month: 'long' });
            
            const monthDayElements: JSX.Element[] = [];
            
            // Add empty cells for days before the first of the month
            for (let i = 0; i < firstDayOfMonth; i++) {
              monthDayElements.push(
                <div key={`empty-${monthIndex}-${i}`} className="h-6 w-6" />
              );
            }
            
            // Add cells for each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(monthYear, monthMonth, day);
              const dateString = date.toISOString().split('T')[0];
              const isToday = new Date().toDateString() === date.toDateString();
              const completionValue = getCompletionValue(dateString, selectedHabit, completionData);
              
              monthDayElements.push(
                <TooltipProvider key={dateString}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'h-6 w-6 rounded-sm cursor-pointer transition-colors text-[10px] flex items-center justify-center relative',
                          getCellColor(completionValue),
                          isToday && 'ring-1 ring-primary'
                        )}
                      >
                        <span className={cn(
                          'absolute inset-0 flex items-center justify-center',
                          completionValue > 0.5 ? 'text-white' : 'text-foreground/70'
                        )}>
                          {day}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" className="p-0 border-none">
                      <DayCompletionPopover 
                        date={date} 
                        habits={habits}
                        completionData={completionData[dateString]} 
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            
            // Add empty cells to complete the last week
            const remainingCells = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;
            for (let i = 0; i < remainingCells; i++) {
              monthDayElements.push(
                <div key={`empty-end-${monthIndex}-${i}`} className="h-6 w-6" />
              );
            }
            
            return (
              <div key={monthIndex} className="bg-card rounded-lg p-4 shadow-sm border">
                <h3 className="text-sm font-medium mb-3 text-center">
                  {monthName} {monthYear}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-xs text-center font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  {monthDayElements}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end items-center gap-2">
          <div className="text-xs text-muted-foreground">Less</div>
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-accent/30" />
          <div className="h-3 w-3 rounded-sm bg-accent/50" />
          <div className="h-3 w-3 rounded-sm bg-accent/80" />
          <div className="text-xs text-muted-foreground">More</div>
        </div>
      </div>
    );
  }
  
  // Render month view
  const daysInMonth = getDaysInMonth(yearValue, monthIndex);
  const firstDayOfMonth = getFirstDayOfMonth(yearValue, monthIndex);
  
  // Day headers
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayElements = dayNames.map((day, i) => (
    <div 
      key={`day-${i}`} 
      className="text-xs font-medium text-muted-foreground text-center h-7 flex items-center justify-center"
    >
      {day}
    </div>
  ));
  
  // Empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    dayElements.push(<div key={`empty-${i}`} className="h-8" />);
  }
  
  // Cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(yearValue, monthIndex, day);
    const dateString = date.toISOString().split('T')[0];
    const isToday = new Date().toDateString() === date.toDateString();
    const completionValue = getCompletionValue(dateString, selectedHabit, completionData);
    
    dayElements.push(
      <TooltipProvider key={dateString}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'h-8 w-8 rounded-md mx-auto',
                'flex items-center justify-center',
                'transition-colors cursor-pointer',
                getCellColor(completionValue),
                isToday && 'ring-2 ring-primary',
                'hover:opacity-90'
              )}
            >
              <span className={cn(
                'text-sm',
                completionValue > 0.5 ? 'text-white' : 'text-foreground/90',
                isToday && 'font-bold'
              )}>
                {day}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="p-0 border-none">
            <DayCompletionPopover 
              date={date} 
              habits={habits}
              completionData={completionData[dateString]} 
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="grid grid-cols-7 gap-y-1 w-full">
      {dayElements}
    </div>
  );
};

export default HabitHeatmap;
