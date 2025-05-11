
import { Habit } from '@/types/habit';
import { supabase } from '@/integrations/supabase/client';
import { calculateCurrentStreak } from './habitCalculations';

/**
 * Toggle a habit's completion status for a specific date
 */
export const toggleHabitCompletion = async (
  habits: Habit[],
  habitId: string,
  date: string
): Promise<Habit[]> => {
  // Find the habit and its index
  const habitIndex = habits.findIndex(h => h.id === habitId);
  if (habitIndex === -1) {
    throw new Error(`Habit with ID ${habitId} not found`);
  }
  
  const habit = habits[habitIndex];
  const isCompleted = habit.completedDates.includes(date);
  
  try {
    // Create a new array to avoid mutation
    const updatedHabits = habits.map((h, index) => {
      if (index !== habitIndex) return h;
      
      if (isCompleted) {
        // Remove the date from completedDates
        const newCompletedDates = habit.completedDates.filter(d => d !== date);
        
        // Calculate new streak
        const newStreak = calculateCurrentStreak(newCompletedDates, habit.targetDays);
        
        // Remove the completion from database
        supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completion_date', date)
          .then(null, error => console.error('Error deleting completion:', error));
        
        // Return updated habit
        return {
          id: habit.id,
          name: habit.name,
          targetDays: habit.targetDays,
          startDate: habit.startDate,
          completedDates: newCompletedDates,
          completionTimestamps: { ...habit.completionTimestamps },
          streak: newStreak,
          highestStreak: habit.highestStreak,
          created_at: habit.created_at,
          missedDates: habit.missedDates || []
        };
      } else {
        // Check if it was previously marked as missed
        const wasMissed = habit.missedDates?.includes(date) || false;
        const newMissedDates = wasMissed && habit.missedDates 
          ? habit.missedDates.filter(d => d !== date) 
          : (habit.missedDates || []);
        
        // Add to completedDates
        const newCompletedDates = [...habit.completedDates, date];
        
        // Add current timestamp
        const now = new Date().toISOString();
        const newTimestamps = { ...habit.completionTimestamps, [date]: now };
        
        // Calculate new streak values
        const newStreak = calculateCurrentStreak(newCompletedDates, habit.targetDays);
        const newHighestStreak = Math.max(habit.highestStreak, newStreak);
        
        // Add the completion to database
        supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            completion_date: date,
            completed_at: now
          })
          .then(null, error => console.error('Error inserting completion:', error));
        
        // If it was previously missed, remove from missed_habits table
        if (wasMissed) {
          supabase
            .from('missed_habits')
            .delete()
            .eq('habit_id', habitId)
            .eq('missed_date', date)
            .then(null, error => console.error('Error removing missed date:', error));
        }
        
        // Return updated habit
        return {
          id: habit.id,
          name: habit.name,
          targetDays: habit.targetDays,
          startDate: habit.startDate,
          completedDates: newCompletedDates,
          completionTimestamps: newTimestamps,
          streak: newStreak,
          highestStreak: newHighestStreak,
          created_at: habit.created_at,
          missedDates: newMissedDates
        };
      }
    });
    
    return updatedHabits;
  } catch (error) {
    console.error('Error toggling habit completion:', error);
    throw error;
  }
};

/**
 * Mark a habit as missed for a specific date
 */
export const markHabitMissed = async (
  habits: Habit[],
  habitId: string,
  date: string
): Promise<Habit[]> => {
  // Find the habit and its index
  const habitIndex = habits.findIndex(h => h.id === habitId);
  if (habitIndex === -1) {
    throw new Error(`Habit with ID ${habitId} not found`);
  }
  
  const habit = habits[habitIndex];
  const isMissed = habit.missedDates?.includes(date) || false;
  
  try {
    // Create a new array to avoid mutation
    const updatedHabits = habits.map((h, index) => {
      if (index !== habitIndex) return h;
      
      if (isMissed) {
        // Remove from missedDates
        const newMissedDates = habit.missedDates 
          ? habit.missedDates.filter(d => d !== date) 
          : [];
          
        // Remove from database
        supabase
          .from('missed_habits')
          .delete()
          .eq('habit_id', habitId)
          .eq('missed_date', date)
          .then(null, error => console.error('Error deleting missed date:', error));
          
        // Return updated habit
        return {
          id: habit.id,
          name: habit.name,
          targetDays: habit.targetDays,
          startDate: habit.startDate,
          completedDates: [...habit.completedDates],
          completionTimestamps: { ...habit.completionTimestamps },
          streak: habit.streak,
          highestStreak: habit.highestStreak,
          created_at: habit.created_at,
          missedDates: newMissedDates
        };
      } else {
        // Check if it was previously marked as completed
        const wasCompleted = habit.completedDates.includes(date);
        const newCompletedDates = wasCompleted 
          ? habit.completedDates.filter(d => d !== date) 
          : [...habit.completedDates];
          
        // Update completionTimestamps if needed
        const newTimestamps = { ...habit.completionTimestamps };
        if (wasCompleted && newTimestamps[date]) {
          delete newTimestamps[date];
        }
        
        // Add to missedDates
        const currentMissedDates = habit.missedDates || [];
        const newMissedDates = [...currentMissedDates, date];
        
        // Calculate new streak
        const newStreak = calculateCurrentStreak(newCompletedDates, habit.targetDays);
        
        // Add to database
        supabase
          .from('missed_habits')
          .insert({
            habit_id: habitId,
            missed_date: date
          })
          .then(null, error => console.error('Error inserting missed date:', error));
          
        // If it was previously completed, remove from habit_completions
        if (wasCompleted) {
          supabase
            .from('habit_completions')
            .delete()
            .eq('habit_id', habitId)
            .eq('completion_date', date)
            .then(null, error => console.error('Error removing completion:', error));
        }
        
        // Return updated habit
        return {
          id: habit.id,
          name: habit.name,
          targetDays: habit.targetDays,
          startDate: habit.startDate,
          completedDates: newCompletedDates,
          completionTimestamps: newTimestamps,
          streak: newStreak,
          highestStreak: habit.highestStreak,
          created_at: habit.created_at,
          missedDates: newMissedDates
        };
      }
    });
    
    return updatedHabits;
  } catch (error) {
    console.error('Error marking habit as missed:', error);
    throw error;
  }
};
