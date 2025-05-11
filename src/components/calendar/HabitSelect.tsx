import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HabitCategory {
  id: string;
  name: string;
}

interface Habit {
  id: string;
  name: string;
  categoryId?: string;
}

interface HabitSelectProps {
  habits: Array<Habit>;
  categories?: Array<HabitCategory>;
  selectedHabit: string;
  onSelectHabit: (habitId: string) => void;
  showCategories?: boolean;
}

const HabitSelect: React.FC<HabitSelectProps> = ({
  habits,
  categories = [],
  selectedHabit,
  onSelectHabit,
  showCategories = false,
}) => {
  // Group habits by category if showCategories is true
  const habitsByCategory = React.useMemo(() => {
    if (!showCategories || !categories.length) return null;
    
    const grouped: Record<string, Habit[]> = {};
    
    // Initialize with empty arrays for each category
    categories.forEach(category => {
      grouped[category.id] = [];
    });
    
    // Group habits by their category
    habits.forEach(habit => {
      const categoryId = habit.categoryId || 'uncategorized';
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(habit);
    });
    
    return grouped;
  }, [habits, categories, showCategories]);

  return (
    <div className="space-y-2">
      <label htmlFor="habit-select" className="text-sm font-medium">
        Select Habit:
      </label>
      <Select value={selectedHabit} onValueChange={onSelectHabit}>
        <SelectTrigger className="w-[240px]" id="habit-select">
          <SelectValue placeholder="All Habits" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Habits</SelectItem>
          
          {/* If showing categories, render grouped habits */}
          {showCategories && habitsByCategory ? (
            Object.entries(habitsByCategory).map(([categoryId, categoryHabits]) => {
              // Skip empty categories
              if (categoryHabits.length === 0) return null;
              
              const category = categories.find(c => c.id === categoryId) || { 
                id: 'uncategorized', 
                name: 'Other' 
              };
              
              return (
                <SelectGroup key={categoryId}>
                  <SelectLabel>{category.name}</SelectLabel>
                  {categoryHabits.map(habit => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            })
          ) : (
            // Otherwise render flat list of habits
            habits.map((habit) => (
              <SelectItem key={habit.id} value={habit.id}>
                {habit.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HabitSelect;
