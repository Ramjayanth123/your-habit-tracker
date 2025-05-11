
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import AddHabitForm from '@/components/habits/AddHabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Skeleton } from '@/components/ui/skeleton';

const HabitList = () => {
  const { habits, loading } = useHabits();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="w-full h-[200px]" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-card border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No habits yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first habit to start building better routines
        </p>
        <div className="max-w-xs mx-auto">
          <AddHabitForm />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
};

const HabitTrackerPage: React.FC = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
      <p className="text-muted-foreground mb-8">Track your daily habits and build consistency</p>
      
      <div className="mb-6">
        <AddHabitForm />
      </div>
      
      <HabitList />
    </div>
  );
};

export default HabitTrackerPage;
