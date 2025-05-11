import React from 'react';
import { Check, X } from 'lucide-react';

interface DayCompletionPopoverProps {
  date: Date;
  habits: Array<{ id: string; name: string }>;
  completionData: Record<string, number> | undefined;
}

const DayCompletionPopover: React.FC<DayCompletionPopoverProps> = ({
  date,
  habits,
  completionData
}) => {
  // Format the date for display
  const dateLabel = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  // If no data is available for this date
  if (!completionData || Object.keys(completionData).length === 0) {
    return (
      <div className="p-3 space-y-2 min-w-[250px]">
        <h3 className="font-medium text-sm">{dateLabel}</h3>
        <p className="text-xs text-muted-foreground">No habits tracked on this day</p>
      </div>
    );
  }

  // Count completed habits
  const completedCount = Object.values(completionData).filter(v => v === 1).length;

  return (
    <div className="p-3 space-y-3 min-w-[250px]">
      <div>
        <h3 className="font-medium">{dateLabel}</h3>
        <p className="text-xs text-muted-foreground">
          {completedCount} of {habits.length} habits completed
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="text-xs font-medium text-muted-foreground mb-1.5">Habits:</div>
        {habits.map(habit => {
          const isCompleted = completionData[habit.id] === 1;
          
          return (
            <div 
              key={habit.id} 
              className="flex items-center justify-between text-sm py-1 px-2 rounded-md bg-muted/30"
            >
              <span className="truncate max-w-[180px]">{habit.name}</span>
              <span className="flex-shrink-0">
                {isCompleted ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCompletionPopover;
